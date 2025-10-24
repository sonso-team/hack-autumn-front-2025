import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
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
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peers = useRef<PeerConnectionMap>({});
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    socketService.connect(socketUrl);
    socketRef.current = socketService.getSocket();

    const joinRoom = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socketRef.current.emit('join-room', { roomId });
    };

    // Когда кто-то подключился
    socketRef.current.on('user-joined', async ({ socketId }) => {
      const pc = createPeerConnection(socketId);
      localStreamRef.current
        ?.getTracks()
        .forEach((track) => pc.addTrack(track, localStreamRef.current!));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit('offer', { offer, target: socketId });
    });

    socketRef.current.on('offer', async ({ offer, from }) => {
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      localStreamRef.current
        ?.getTracks()
        .forEach((track) => pc.addTrack(track, localStreamRef.current!));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit('answer', { answer, target: from });
    });

    socketRef.current.on('answer', async ({ answer, from }) => {
      const pc = peers.current?.[from];
      if (!pc) {
        return;
      }
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on('ice-candidate', async ({ candidate, from }) => {
      const pc = peers.current?.[from];
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on('user-left', ({ socketId }) => {
      const userIndex = remoteStreams.findIndex(
        (remote) => remote.id === socketId,
      );
      setRemoteStreams((prev) => prev.filter((remote, i) => i !== userIndex));
      delete peers.current[socketId];
    });

    function createPeerConnection(socketId: string) {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            target: socketId,
          });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteStreams((prev) => {
          const existing = prev.find((s) => s.id === socketId);
          if (!existing) {
            return [...prev, { id: socketId, stream: remoteStream }];
          } else {
            return prev;
          }
        });
      };

      peers.current = { ...peers.current, [socketId]: pc };
      return pc;
    }

    joinRoom();

    return () => {
      socketRef.current.off();
      Object.values(peers.current).forEach((peer) => peer.close());
    };
  }, [roomId]);

  const toggleTrack = (type: 'mic' | 'cam') => {
    let track;
    switch (type) {
      case 'mic':
        track = localStreamRef.current?.getAudioTracks()[0];
        if (!track) {
          return;
        }
        track.enabled = !track.enabled;
        setMicOn(track.enabled);
        break;
      case 'cam':
        track = localStreamRef.current?.getVideoTracks()[0];
        if (!track) {
          return;
        }
        track.enabled = !track.enabled;
        setCamOn(track.enabled);
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
