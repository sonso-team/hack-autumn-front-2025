// src/pages/HomePage/ui/index.tsx
import React, { useEffect, useRef } from 'react';
import './home-page.scss';
import useConference from '../../../entities/conference';
import Endpoints from '../../../shared/api/endpoints';

type VideoPlayerProps = {
  stream: MediaStream;
  id: string;
  nickname: string; // ✅ Добавлено
  avatarUrl: string | null; // ✅ Добавлено
  isGuest: boolean; // ✅ Добавлено
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
                                                   stream,
                                                   id,
                                                   nickname,
                                                   avatarUrl,
                                                   isGuest
                                                 }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
      <video
        ref={videoRef}
        id={id}
        autoPlay
        playsInline
        muted={false}
        style={{
          width: 200,
          height: 150,
          backgroundColor: 'black',
          borderRadius: '8px'
        }}
      />

      {/* ✅ Имя и аватарка участника */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '4px 8px',
          borderRadius: '16px',
        }}
      >
        {/* Аватарка */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nickname}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: isGuest ? '#FF9800' : '#4CAF50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            {nickname.charAt(0).toUpperCase()}
          </div>
        )}

        {/* ✅ Имя участника */}
        <span
          style={{
            color: 'white',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          {nickname}
          {isGuest && (
            <span style={{ opacity: 0.7, marginLeft: '3px' }}>
              (Гость)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { micOn, camOn, localVideoRef, remoteStreams, toggleTrack } = useConference({
    roomId: '1',
    socketUrl: Endpoints.WS_URL,
  });

  console.log('Remote streams:', remoteStreams);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Room: 1</h1>

      {/* Ваше видео */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Ваше видео</h3>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '300px',
              borderRadius: '8px',
              backgroundColor: 'black'
            }}
          />

          {/* ✅ Ваше имя */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Вы
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => toggleTrack('mic')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              background: micOn ? '#4CAF50' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {micOn ? '🎤 Микрофон вкл' : '🎤 Микрофон выкл'}
          </button>
          <button
            onClick={() => toggleTrack('cam')}
            style={{
              padding: '8px 16px',
              background: camOn ? '#4CAF50' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {camOn ? '📹 Камера вкл' : '📹 Камера выкл'}
          </button>
        </div>
      </div>

      {/* Участники */}
      <div>
        <h3>Участники ({remoteStreams.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {remoteStreams.map((remote) => (
            <VideoPlayer
              key={remote.id}
              stream={remote.stream}
              id={remote.id}
              nickname={remote.nickname} // ✅ Передаём nickname
              avatarUrl={remote.avatarUrl} // ✅ Передаём avatarUrl
              isGuest={remote.isGuest} // ✅ Передаём isGuest
            />
          ))}
        </div>

        {remoteStreams.length === 0 && (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            Пока нет других участников
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
