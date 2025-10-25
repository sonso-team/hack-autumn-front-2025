// src/entities/conference/api/index.ts
import { useEffect, useRef, useState } from 'react';
import { socketService } from '../../../shared/api/socket';

interface ConferenceProps {
  roomId: string;
  socketUrl: string;
}

type PeerConnectionMap = Record<string, RTCPeerConnection>;

interface RemoteStream {
  id: string;
  stream: MediaStream;
}

const useConference = ({ roomId, socketUrl }: ConferenceProps) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peers = useRef<PeerConnectionMap>({});
  const pendingIceCandidates = useRef<Record<string, RTCIceCandidate[]>>({});
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const initializeConference = async () => {
      // Подключаемся к серверу
      await socketService.connect(socketUrl);

      // Получаем локальное видео
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Присоединяемся к комнате
      socketService.joinRoom(roomId);

      // ✅ НОВОЕ: Обработка списка участников
      socketService.on('participants', async (participants: string[]) => {
        console.log('👥 Participants updated:', participants);

        const mySocketId = socketService.id;

        // Создаём peer connections с каждым СУЩЕСТВУЮЩИМ участником (кроме себя)
        participants.forEach((participantId) => {
          if (participantId !== mySocketId && !peers.current[participantId]) {
            console.log(`🔗 Инициируем соединение с ${participantId}`);
            createPeerConnection(participantId, true); // МЫ инициаторы
          }
        });
      });

      // ✅ ИЗМЕНЕНО: Обработка user-joined (НЕ создаём peer connection!)
      socketService.on('user-joined', async ({ socketId }: { socketId: string }) => {
        console.log('👤 User joined:', socketId);
        console.log(`⏳ Waiting for offer from ${socketId}`);
        // Новый участник САМ создаст peer connection с нами
      });

      // Получили Offer
      socketService.on('offer', async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
        console.log('📩 Received offer from:', from);

        // Создаём peer connection если ещё нет
        if (!peers.current[from]) {
          createPeerConnection(from, false); // НЕ инициатор
        }

        const pc = peers.current[from];
        if (!pc) return;

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));

          // ✅ Обрабатываем отложенные ICE candidates
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
      });

      // Получили Answer
      socketService.on('answer', async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
        console.log('📩 Received answer from:', from);

        const pc = peers.current[from];
        if (!pc) return;

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // ✅ Обрабатываем отложенные ICE candidates
          const pending = pendingIceCandidates.current[from] || [];
          for (const candidate of pending) {
            await pc.addIceCandidate(candidate);
          }
          delete pendingIceCandidates.current[from];
        } catch (error) {
          console.error('❌ Error handling answer:', error);
        }
      });

      // ✅ ИЗМЕНЕНО: Обработка ICE Candidate с очередью
      socketService.on('ice-candidate', async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
        console.log('📩 Получен ICE candidate от:', from);

        const pc = peers.current[from];

        // Если peer connection не существует - добавляем в очередь
        if (!pc) {
          console.log(`⏳ Peer connection not ready for ${from}, queuing candidate`);
          if (!pendingIceCandidates.current[from]) {
            pendingIceCandidates.current[from] = [];
          }
          pendingIceCandidates.current[from].push(new RTCIceCandidate(candidate));
          return;
        }

        // Если remoteDescription не установлен - добавляем в очередь
        if (!pc.remoteDescription) {
          console.log(`⏳ Remote description not set for ${from}, queuing candidate`);
          if (!pendingIceCandidates.current[from]) {
            pendingIceCandidates.current[from] = [];
          }
          pendingIceCandidates.current[from].push(new RTCIceCandidate(candidate));
          return;
        }

        // Добавляем ICE candidate
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`✅ Added ICE candidate from ${from}`);
        } catch (error) {
          console.error(`❌ Error adding ICE candidate from ${from}:`, error);
        }
      });

      // Участник вышел
      socketService.on('user-left', ({ socketId }: { socketId: string }) => {
        console.log('👋 User left:', socketId);

        setRemoteStreams((prev) => prev.filter((remote) => remote.id !== socketId));

        if (peers.current[socketId]) {
          peers.current[socketId].close();
          delete peers.current[socketId];
        }

        // Удаляем очередь ICE candidates
        delete pendingIceCandidates.current[socketId];
      });
    };

    function createPeerConnection(socketId: string, isInitiator: boolean): RTCPeerConnection {
      console.log(`🔗 Creating peer connection with ${socketId} (initiator: ${isInitiator})`);

      // Если уже существует - возвращаем
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

      // Добавляем локальные треки
      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      // Обработка ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`🧊 Sending ICE candidate to ${socketId}`);
          socketService.emit('ice-candidate', {
            candidate: event.candidate,
            target: socketId,
          });
        }
      };

      // Получение удалённого трека
      pc.ontrack = (event) => {
        console.log(`📹 Received remote track from ${socketId}`);
        const remoteStream = event.streams[0];

        setRemoteStreams((prev) => {
          const existing = prev.find((s) => s.id === socketId);
          if (!existing) {
            return [...prev, { id: socketId, stream: remoteStream }];
          }
          return prev;
        });
      };

      // Обработка изменений connection state
      pc.onconnectionstatechange = () => {
        console.log(`🔌 Connection state with ${socketId}: ${pc.connectionState}`);

        if (pc.connectionState === 'disconnected' ||
          pc.connectionState === 'failed' ||
          pc.connectionState === 'closed') {
          console.log(`⚠️ Connection with ${socketId} closed`);
          setRemoteStreams((prev) => prev.filter((remote) => remote.id !== socketId));
          delete peers.current[socketId];
        }
      };

      peers.current[socketId] = pc;

      // ✅ Если мы инициаторы, создаём offer
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

    // Cleanup
    return () => {
      socketService.off();
      Object.values(peers.current).forEach((peer) => peer.close());
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      socketService.disconnect();
    };
  }, [roomId, socketUrl]);

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
    remoteStreams,
  };
};

export default useConference;
