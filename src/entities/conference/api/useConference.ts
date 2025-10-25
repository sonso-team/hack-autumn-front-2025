// src/entities/conference/api/index.ts
import { useEffect, useRef, useState } from 'react';
import { socketService } from '../../../shared/api/socket';
import Endpoints from '../../../shared/api/endpoints';

interface ConferenceProps {
  roomId: string;
}

// ✅ Данные участника
interface ParticipantInfo {
  sessionId: string;
  userId: string | null;
  nickname: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

type PeerConnectionMap = Record<string, RTCPeerConnection>;

// ✅ Обновлённый RemoteStream с данными
interface RemoteStream {
  id: string;
  stream: MediaStream;
  nickname: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

const useConference = ({ roomId }: ConferenceProps) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peers = useRef<PeerConnectionMap>({});
  const pendingIceCandidates = useRef<Record<string, RTCIceCandidate[]>>({});

  // ✅ Храним данные участников
  const participantsData = useRef<Record<string, ParticipantInfo>>({});

  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const initializeConference = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Подключаемся к серверу
      await socketService.connect(Endpoints.WS_URL);

      // Присоединяемся к комнате
      socketService.joinRoom(roomId);

      // ✅ Обработка списка участников (с данными)
      socketService.on(
        'participants',
        async (participants: ParticipantInfo[]) => {
          console.log('👥 Participants updated:', participants);

          const mySocketId = socketService.id;

          // Сохраняем данные участников
          participants.forEach((p) => {
            participantsData.current[p.sessionId] = p;
          });

          // Создаём peer connections с каждым участником (кроме себя)
          participants.forEach((participant) => {
            if (
              participant.sessionId !== mySocketId &&
              !peers.current[participant.sessionId]
            ) {
              console.log(
                `🔗 Инициируем соединение с ${participant.nickname} (${participant.sessionId})`,
              );
              createPeerConnection(participant.sessionId, true, participant);
            }
          });
        },
      );

      // ✅ Обработка user-joined (с данными)
      socketService.on('user-joined', async (participant: ParticipantInfo) => {
        console.log('👤 User joined:', participant.nickname);

        // Сохраняем данные участника
        participantsData.current[participant.sessionId] = participant;

        console.log(`⏳ Waiting for offer from ${participant.nickname}`);
      });

      // Получили Offer
      socketService.on(
        'offer',
        async ({
          offer,
          from,
        }: {
          offer: RTCSessionDescriptionInit;
          from: string;
        }) => {
          console.log('📩 Received offer from:', from);

          const participant = participantsData.current[from];

          // Создаём peer connection если ещё нет
          if (!peers.current[from]) {
            createPeerConnection(from, false, participant);
          }

          const pc = peers.current[from];
          if (!pc) return;

          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            // Обрабатываем отложенные ICE candidates
            const pending = pendingIceCandidates.current[from] || [];
            for (const candidate of pending) {
              await pc.addIceCandidate(candidate);
            }
            delete pendingIceCandidates.current[from];

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketService.emit('answer', { answer, target: from });
          } catch (error) {
            console.error('❌ Error handling offer:', error);
          }
        },
      );

      // Получили Answer
      socketService.on(
        'answer',
        async ({
          answer,
          from,
        }: {
          answer: RTCSessionDescriptionInit;
          from: string;
        }) => {
          console.log('📩 Received answer from:', from);

          const pc = peers.current[from];
          if (!pc) return;

          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));

            // Обрабатываем отложенные ICE candidates
            const pending = pendingIceCandidates.current[from] || [];
            for (const candidate of pending) {
              await pc.addIceCandidate(candidate);
            }
            delete pendingIceCandidates.current[from];
          } catch (error) {
            console.error('❌ Error handling answer:', error);
          }
        },
      );

      // Обработка ICE Candidate с очередью
      socketService.on(
        'ice-candidate',
        async ({
          candidate,
          from,
        }: {
          candidate: RTCIceCandidateInit;
          from: string;
        }) => {
          console.log('📩 Получен ICE candidate от:', from);

          const pc = peers.current[from];

          if (!pc) {
            console.log(
              `⏳ Peer connection not ready for ${from}, queuing candidate`,
            );
            if (!pendingIceCandidates.current[from]) {
              pendingIceCandidates.current[from] = [];
            }
            pendingIceCandidates.current[from].push(
              new RTCIceCandidate(candidate),
            );
            return;
          }

          if (!pc.remoteDescription) {
            console.log(
              `⏳ Remote description not set for ${from}, queuing candidate`,
            );
            if (!pendingIceCandidates.current[from]) {
              pendingIceCandidates.current[from] = [];
            }
            pendingIceCandidates.current[from].push(
              new RTCIceCandidate(candidate),
            );
            return;
          }

          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log(`✅ Added ICE candidate from ${from}`);
          } catch (error) {
            console.error(`❌ Error adding ICE candidate from ${from}:`, error);
          }
        },
      );

      // Участник вышел
      socketService.on('user-left', ({ socketId }: { socketId: string }) => {
        console.log('👋 User left:', socketId);

        setRemoteStreams((prev) =>
          prev.filter((remote) => remote.id !== socketId),
        );

        if (peers.current[socketId]) {
          peers.current[socketId].close();
          delete peers.current[socketId];
        }

        delete pendingIceCandidates.current[socketId];
        delete participantsData.current[socketId]; // ✅ Удаляем данные
      });
    };

    // ✅ Обновлённая функция с поддержкой ParticipantInfo
    function createPeerConnection(
      socketId: string,
      isInitiator: boolean,
      participant?: ParticipantInfo,
    ): RTCPeerConnection {
      console.log(
        `🔗 Creating peer connection with ${socketId} (initiator: ${isInitiator})`,
      );

      if (peers.current[socketId]) {
        console.log(`⚠️ Peer connection already exists for ${socketId}`);
        return peers.current[socketId];
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`🧊 Sending ICE candidate to ${socketId}`);
          socketService.emit('ice-candidate', {
            candidate: event.candidate,
            target: socketId,
          });
        }
      };

      // ✅ Получение удалённого трека - добавляем данные участника
      pc.ontrack = (event) => {
        console.log(`📹 Received remote track from ${socketId}`);
        const remoteStream = event.streams[0];
        const participantInfo =
          participantsData.current[socketId] || participant;

        if (!participantInfo) {
          console.warn(`⚠️ No participant data for ${socketId}`);
          return;
        }

        setRemoteStreams((prev) => {
          const existing = prev.find((s) => s.id === socketId);
          if (!existing) {
            return [
              ...prev,
              {
                id: socketId,
                stream: remoteStream,
                nickname: participantInfo.nickname,
                avatarUrl: participantInfo.avatarUrl,
                isGuest: participantInfo.isGuest,
              },
            ];
          }
          return prev;
        });
      };

      pc.onconnectionstatechange = () => {
        console.log(
          `🔌 Connection state with ${socketId}: ${pc.connectionState}`,
        );

        if (
          pc.connectionState === 'disconnected' ||
          pc.connectionState === 'failed' ||
          pc.connectionState === 'closed'
        ) {
          console.log(`⚠️ Connection with ${socketId} closed`);
          setRemoteStreams((prev) =>
            prev.filter((remote) => remote.id !== socketId),
          );
          delete peers.current[socketId];
        }
      };

      peers.current[socketId] = pc;

      if (isInitiator) {
        createOffer(socketId);
      }

      return pc;
    }

    async function createOffer(socketId: string): Promise<void> {
      const pc = peers.current[socketId];
      if (!pc) return;

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        console.log(`📤 Sending offer to ${socketId}`);
        socketService.emit('offer', {
          offer: pc.localDescription,
          target: socketId,
        });
      } catch (error) {
        console.error(`❌ Error creating offer for ${socketId}:`, error);
      }
    }

    initializeConference();

    return () => {
      socketService.off();
      Object.values(peers.current).forEach((peer) => peer.close());
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      socketService.disconnect();
    };
  }, [roomId]);

  const toggleTrack = (type: 'mic' | 'cam') => {
    let track;

    switch (type) {
      case 'mic':
        track = localStreamRef.current?.getAudioTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setMicOn(track.enabled);
        break;

      case 'cam':
        track = localStreamRef.current?.getVideoTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setCamOn(track.enabled);
        break;
    }
  };

  return {
    localVideoRef,
    micOn,
    camOn,
    toggleTrack,
    remoteStreams, // ✅ Теперь содержит nickname, avatarUrl, isGuest
  };
};

export default useConference;
