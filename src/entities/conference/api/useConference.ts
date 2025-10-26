// src/entities/conference/api/index.ts
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { socketService } from '../../../shared/api/socket';
import Endpoints from '../../../shared/api/endpoints';
import { useAppSelector } from '../../../shared/lib/hooks/useAppSelector';

interface ConferenceProps {
  roomId: string;
}

interface ParticipantInfo {
  sessionId: string;
  userId: string | null;
  nickname: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

type PeerConnectionMap = Record<string, RTCPeerConnection>;

interface RemoteStream {
  id: string;
  stream: MediaStream;
  nickname: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

type PendingMap = Record<string, RTCIceCandidate[]>;

const useConference = ({ roomId }: ConferenceProps) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const { user } = useAppSelector((state) => state.authReducer);
  const { name: username } = useAppSelector((state) => state.conferenceReducer);

  const peers = useRef<PeerConnectionMap>({});
  const pendingIce: React.MutableRefObject<PendingMap> = useRef({});
  const participantsData = useRef<Record<string, ParticipantInfo>>({});

  // perfect negotiation flags per-peer
  const makingOffer = useRef<Record<string, boolean>>({});
  const ignoreOffer = useRef<Record<string, boolean>>({});
  const isSettingRemoteAnswerPending = useRef<Record<string, boolean>>({});

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

      await socketService.connect(Endpoints.WS_URL, username || user?.nickname);

      // Присоединяемся к комнате (roomId обязан быть не пустым)
      socketService.joinRoom(roomId || '');

      // ===== Participants list =====
      socketService.on(
        'participants',
        async (participants: ParticipantInfo[]) => {
          console.log('👥 Participants updated:', participants);

          const myId = socketService.id;
          participants.forEach((p) => {
            participantsData.current[p.sessionId] = p;
          });

          // Инициируем соединения только к тем, у кого ещё нет PC
          for (const p of participants) {
            if (!myId || p.sessionId === myId) {
              continue;
            }
            if (!peers.current[p.sessionId]) {
              createPeerConnection(p.sessionId, myId, p);
            }
          }
        },
      );

      // ===== User joined =====
      socketService.on('user-joined', async (participant: ParticipantInfo) => {
        console.log('👤 User joined:', participant.nickname);
        participantsData.current[participant.sessionId] = participant;

        const myId = socketService.id;
        if (!myId) {
          return;
        }
        if (!peers.current[participant.sessionId]) {
          createPeerConnection(participant.sessionId, myId, participant);
        }
      });

      // ===== Offer =====
      socketService.on(
        'offer',
        async ({
          offer,
          from,
        }: {
          // eslint-disable-next-line no-undef
          offer: RTCSessionDescriptionInit;
          from: string;
        }) => {
          console.log('📩 Received offer from:', from);
          const pc = peers.current[from];
          if (!pc) {
            return;
          } // защитимся — PC создаётся на participants/user-joined

          const polite = isPolite(socketService.id, from);

          const readyForOffer =
            !makingOffer.current[from] &&
            (pc.signalingState === 'stable' ||
              isSettingRemoteAnswerPending.current[from]);

          const offerCollision = !readyForOffer;

          ignoreOffer.current[from] = !polite && offerCollision;
          if (ignoreOffer.current[from]) {
            console.log('⚔️ Glare: impolite side ignoring offer from', from);
            return;
          }

          try {
            if (offerCollision) {
              console.log(
                '↩️ Glare: polite side rolling back before applying remote offer from',
                from,
              );
              await Promise.all([
                pc.setLocalDescription({ type: 'rollback' }),
                isSettingRemoteAnswerPending.current[from]
                  ? Promise.resolve()
                  : Promise.resolve(),
              ]);
            }

            isSettingRemoteAnswerPending.current[from] = true;
            await pc.setRemoteDescription(offer);
            isSettingRemoteAnswerPending.current[from] = false;

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketService.emit('answer', {
              answer: pc.localDescription,
              target: from,
            });
          } catch (err) {
            isSettingRemoteAnswerPending.current[from] = false;
            console.error('❌ Error handling offer:', err);
          }
        },
      );

      // ===== Answer =====
      socketService.on(
        'answer',
        async ({
          answer,
          from,
        }: {
          // eslint-disable-next-line no-undef
          answer: RTCSessionDescriptionInit;
          from: string;
        }) => {
          console.log('📩 Received answer from:', from);
          const pc = peers.current[from];
          if (!pc) {
            return;
          }

          try {
            isSettingRemoteAnswerPending.current[from] = true;
            await pc.setRemoteDescription(answer);
            isSettingRemoteAnswerPending.current[from] = false;

            // применяем отложенные кандидаты
            const queue = pendingIce.current[from] || [];
            for (const c of queue) {
              await pc.addIceCandidate(c);
            }
            delete pendingIce.current[from];
          } catch (err) {
            isSettingRemoteAnswerPending.current[from] = false;
            console.error('❌ Error handling answer:', err);
          }
        },
      );

      // ===== ICE candidates =====
      socketService.on(
        'ice-candidate',
        async ({
          candidate,
          from,
        }: {
          // eslint-disable-next-line no-undef
          candidate: RTCIceCandidateInit;
          from: string;
        }) => {
          console.log('📩 Получен ICE candidate от:', from);
          const pc = peers.current[from];
          const ice = new RTCIceCandidate(candidate);

          if (!pc || !pc.remoteDescription) {
            if (!pendingIce.current[from]) {
              pendingIce.current[from] = [];
            }
            pendingIce.current[from].push(ice);
            return;
          }

          try {
            await pc.addIceCandidate(ice);
            console.log(`✅ Added ICE candidate from ${from}`);
          } catch (err) {
            console.error(`❌ Error adding ICE candidate from ${from}:`, err);
          }
        },
      );

      // ===== User left =====
      socketService.on('user-left', ({ socketId }: { socketId: string }) => {
        console.log('👋 User left:', socketId);

        setRemoteStreams((prev) => prev.filter((r) => r.id !== socketId));

        if (peers.current[socketId]) {
          peers.current[socketId].ontrack = null;
          peers.current[socketId].onicecandidate = null;
          peers.current[socketId].onconnectionstatechange = null;
          peers.current[socketId].close();
          delete peers.current[socketId];
        }

        delete pendingIce.current[socketId];
        delete participantsData.current[socketId];
        delete makingOffer.current[socketId];
        delete ignoreOffer.current[socketId];
        delete isSettingRemoteAnswerPending.current[socketId];
      });
    };

    const createPeerConnection = (
      remoteId: string,
      myId: string,
      participant?: ParticipantInfo,
    ): RTCPeerConnection => {
      if (peers.current[remoteId]) {
        return peers.current[remoteId];
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: [
              'turn:kinoko.su:3478?transport=udp',
              'turn:kinoko.su:3478?transport=tcp',
              'turns:kinoko.su:5349?transport=tcp',
            ],
            username: 'kinrtc',
            credential: 'kinkinpaspas09098080',
          },
        ],
      });

      // локальные треки
      localStreamRef.current
        ?.getTracks()
        .forEach((t) => pc.addTrack(t, localStreamRef.current!));

      // perfect negotiation — инициируем offer только через negotiationneeded
      pc.onnegotiationneeded = async () => {
        try {
          makingOffer.current[remoteId] = true;
          const polite = isPolite(myId, remoteId);
          // impolite не должен сам инициировать, если уже идёт процесс
          // но negotiationneeded триггерится честно — делаем offer, а в случае glare откатим
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketService.emit('offer', {
            offer: pc.localDescription,
            target: remoteId,
          });
        } catch (err) {
          console.error(
            `❌ Error during negotiationneeded (to ${remoteId}):`,
            err,
          );
        } finally {
          makingOffer.current[remoteId] = false;
        }
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socketService.emit('ice-candidate', {
            candidate: e.candidate,
            target: remoteId,
          });
        }
      };

      pc.ontrack = (e) => {
        const remoteStream = e.streams[0];
        const info = participantsData.current[remoteId] || participant;
        if (!info) {
          console.warn(`⚠️ No participant data for ${remoteId}`);
          return;
        }

        setRemoteStreams((prev) => {
          const exists = prev.find((s) => s.id === remoteId);
          if (exists) {
            return prev;
          }
          return [
            ...prev,
            {
              id: remoteId,
              stream: remoteStream,
              nickname: info.nickname,
              avatarUrl: info.avatarUrl,
              isGuest: info.isGuest,
            },
          ];
        });
      };

      pc.onconnectionstatechange = () => {
        console.log(
          `🔌 Connection state with ${remoteId}: ${pc.connectionState}`,
        );
        if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
          setRemoteStreams((prev) => prev.filter((r) => r.id !== remoteId));
          pc.close();
          delete peers.current[remoteId];
        }
      };

      peers.current[remoteId] = pc;
      return pc;
    };

    const isPolite = (myId?: string, remoteId?: string): boolean => {
      if (!myId || !remoteId) {
        return true;
      } // по умолчанию делаем себя polite
      // детерминированное правило: "бОльший" id — polite
      // строковое сравнение стабильное для uuid/socket id
      return myId > remoteId;
    };

    initializeConference();

    return () => {
      socketService.off();
      Object.values(peers.current).forEach((pc) => pc.close());
      peers.current = {};
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      socketService.disconnect();
    };
  }, [roomId]);

  const toggleTrack = (type: 'mic' | 'cam') => {
    let track: MediaStreamTrack | undefined;

    if (type === 'mic') {
      track = localStreamRef.current?.getAudioTracks()[0];
      if (!track) {
        return;
      }
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    } else {
      track = localStreamRef.current?.getVideoTracks()[0];
      if (!track) {
        return;
      }
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  const disconnect = () => {
    Object.values(peers.current).forEach((pc) => pc.close());
    peers.current = {};
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    socketService.disconnect();
  };

  return {
    localVideoRef,
    micOn,
    camOn,
    toggleTrack,
    remoteStreams,
    disconnect,
  };
};

export default useConference;
