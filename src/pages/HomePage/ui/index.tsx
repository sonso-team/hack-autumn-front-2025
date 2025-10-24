import React, { useEffect, useRef, useState } from 'react';
import './home-page.scss';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

const HomePage: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const startCall = async () => {
      // 1️⃣ Получаем локальный поток
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // 2️⃣ Создаём RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcRef.current = pc;

      // 3️⃣ Добавляем локальные треки
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      // 4️⃣ Приём удалённого потока
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // 5️⃣ ICE кандидаты
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            candidate: event.candidate,
          });
        }
      };

      // 6️⃣ Подключаемся к серверу
      const socket = io('http://localhost:3001'); // твой сервер
      socketRef.current = socket;

      socket.emit('join-room', { roomId: 1 });

      // 7️⃣ Получаем сигнал от другого участника
      socket.on('offer', async ({ offer }) => {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { answer });
      });

      socket.on('answer', async ({ answer }) => {
        await pc.setRemoteDescription(answer);
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      // 8️⃣ Если первый в комнате, создаём offer
      socket.on('ready', async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { offer });
      });
    };

    startCall();

    return () => {
      pcRef.current?.close();
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Микрофон
  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) {
      return;
    }
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  // Камера
  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) {
      return;
    }
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  return (
    <div>
      <h2>Room: 1</h2>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '200px' }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: '200px' }}
      />
      <div>
        <button onClick={toggleMic}>{micOn ? 'Mute' : 'Unmute'}</button>
        <button onClick={toggleCam}>
          {camOn ? 'Stop Video' : 'Start Video'}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
