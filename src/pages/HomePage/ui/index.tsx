// src/pages/HomePage/ui/index.tsx
import React, { useEffect, useRef } from 'react';
import './home-page.scss';
import useConference from '../../../entities/conference';
import Endpoints from '../../../shared/api/endpoints'; // Добавьте импорт

type VideoPlayerProps = {
  stream: MediaStream;
  id: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, id }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      id={id}
      autoPlay
      playsInline
      muted={false}
      style={{ width: 200, height: 150, backgroundColor: 'black' }}
    />
  );
};

const HomePage: React.FC = () => {
  // Используем правильный URL из конфигурации
  const { micOn, camOn, localVideoRef, remoteStreams, toggleTrack } = useConference({
    roomId: '1',
    socketUrl: Endpoints.WS_URL, // Изменено: используем WS_URL из конфигурации
  });

  console.log(remoteStreams);

  return (
    <div>
      <h1>Room: 1</h1>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '200px' }}
      />

      <div>
        {remoteStreams.map((remote) => (
          <VideoPlayer key={remote.id} stream={remote.stream} id={remote.id} />
        ))}
      </div>

      <button onClick={() => toggleTrack('mic')}>
        {micOn ? '🎤 Микрофон вкл' : '🎤 Микрофон выкл'}
      </button>
      <button onClick={() => toggleTrack('cam')}>
        {camOn ? '📹 Камера вкл' : '📹 Камера выкл'}
      </button>
    </div>
  );
};

export default HomePage;
