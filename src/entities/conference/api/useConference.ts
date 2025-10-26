// src/entities/conference/api/index.ts
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Endpoints from '../../../shared/api/endpoints';
import { socketService } from '../../../shared/api/socket';
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
  isScreen?: boolean;
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

  const screenStreamRef = useRef<MediaStream | null>(null);
  const [screenOn, setScreenOn] = useState(false);

// на каждого пира нужен список отправителей экранных треков — чтобы потом удалить
  const screenSenders = useRef<Record<string, RTCRtpSender[]>>({});

  const startScreenShare = async (withSystemAudio = false) => {
  if (screenOn) {return;}
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },   // можешь поднять/опустить
      audio: withSystemAudio,     // true — если хочешь шарить системный звук (браузер/ОС могут ограничить)
    });

    screenStreamRef.current = displayStream;

    // Вешаем все треки экрана на все активные peer connections
    Object.entries(peers.current).forEach(([peerId, pc]) => {
      const senders: RTCRtpSender[] = [];
      displayStream.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, displayStream);
        senders.push(sender);
      });
      screenSenders.current[peerId] = senders;
    });

    // автозавершение, когда пользователь нажал «Stop sharing» в UI браузера
    displayStream.getVideoTracks().forEach((t) => {
      t.addEventListener('ended', () => stopScreenShare());
    });

    setScreenOn(true);
  } catch (e) {
    console.error('getDisplayMedia error', e);
  }
};

const stopScreenShare = () => {
  if (!screenStreamRef.current) {return;}

  // 1) Удаляем экранные треки из каждого PC
  Object.entries(peers.current).forEach(([peerId, pc]) => {
    const senders = screenSenders.current[peerId] || [];
    senders.forEach((sender) => {
      try {
        pc.removeTrack(sender);
      } catch { /* empty */ }
    });
    delete screenSenders.current[peerId];
  });

  // 2) Гасим локальные треки экрана
  screenStreamRef.current.getTracks().forEach((t) => t.stop());
  screenStreamRef.current = null;

  setScreenOn(false);
};

const toggleScreen = async () => {
  if (screenOn) {stopScreenShare();}
  else {await startScreenShare(false);} // или true — если хочешь тащить системный звук
};


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
            return;
          }

          try {
            if (offerCollision) {
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
          } catch (err) {
            console.error(`❌ Error adding ICE candidate from ${from}:`, err);
          }
        },
      );

      // ===== User left =====
      socketService.on('user-left', ({ socketId }: { socketId: string }) => {
        setRemoteStreams((prev) => prev.filter((r) => !r.id.startsWith(`${socketId}:`)));

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
          isPolite(myId, remoteId);
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

          const maybeScreen = remoteStream.getVideoTracks().some((vt) => {
    const lbl = (vt.label || '').toLowerCase();
    return lbl.includes('screen') || lbl.includes('window') || lbl.includes('display');
  });

        setRemoteStreams((prev) => {
    // уникальность — по stream.id, а не по участнику
    const exists = prev.some((s) => s.stream.id === remoteStream.id);
    if (exists) {return prev;}

    return [
      ...prev,
      {
        id: `${remoteId}:${remoteStream.id}`, // уникальный идентификатор элемента списка
        stream: remoteStream,
        nickname: info.nickname,
        avatarUrl: info.avatarUrl,
        isGuest: info.isGuest,
        isScreen: maybeScreen,
      },
    ];
  });
      };

      pc.onconnectionstatechange = () => {
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
      // экраны тоже выключим
  if (screenStreamRef.current) {
    screenStreamRef.current.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
  }
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
    screenOn,
    startScreenShare,
    stopScreenShare,
    toggleScreen,
  };
};

export default useConference;
