import './conferencePage.scss';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Button } from '../../../shared/ui/Button';
import copyCurrentUrl from '../../../shared/lib/copyCurrentPath';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { useConference } from '@/entities/conference';
import ConferenceFooter from '@/widgets/ConferenceFooter';
import ParticipantVideo from '@/features/ParticipantVideo';

const ConferencePage: React.FC = () => {
  const { pathname } = useLocation();

  // ✅ Селектор имени и roomId вынесен в начало
  const { name: username, roomId } = useAppSelector(
    (state) => state.conferenceReducer,
  );

  const getRoomId = () => {
    if (roomId) {
      return roomId;
    }
    const paths = pathname.split('/');
    return paths[paths.length - 1];
  };

  const {
    localVideoRef,
    toggleTrack,
    disconnect,
    micOn,
    remoteStreams,
    camOn,
  } = useConference({ roomId: getRoomId() });

  const hasRemoteParticipants = remoteStreams.length > 0;

  const totalCount = 1 + remoteStreams.length;

  return (
    <main className="ConferencePage">
      <section
        className={`ConferencePage__streamsContainer ${
          hasRemoteParticipants ? 'ConferencePage__grid' : ''
        }`}
        data-count={totalCount}
      >
        <div className="ConferencePage__videoWrapper ConferencePage__videoWrapper--self">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="ConferencePage__videoPlayer"
          />
          {/* Ник на локальном видео */}
          <div className="ConferencePage__nicknameOverlay">
            {username || 'Гость'} (Вы)
          </div>
        </div>

        {/* Видео других участников */}
        {hasRemoteParticipants ? (
          remoteStreams.map(({ id, stream, nickname, isGuest, avatarUrl }) => (
            <ParticipantVideo
              key={id}
              stream={stream}
              nickname={nickname}
              isGuest={isGuest}
              avatarUrl={avatarUrl}
            />
          ))
        ) : (
          // Заглушка, если участников нет
          <div className="ConferencePage__inviteBlock">
            <Paragraph
              level={2}
              mode="white"
              className="ConferencePage__inviteTitle"
            >
              Пригласите других участников,
              <br />
              отправив им ссылку на встречу
            </Paragraph>
            <div className="ConferencePage__inviteButtons">
              <Button
                onClick={() => copyCurrentUrl(getRoomId())}
                className="ConferencePage__button"
              >
                🔗 Копировать ссылку
              </Button>
            </div>
          </div>
        )}
      </section>

      <ConferenceFooter
        onEndCall={disconnect} // отключаем конференцию
        camToggle={() => toggleTrack('cam')}
        micToggle={() => toggleTrack('mic')}
        camOn={camOn}
        micOn={micOn}
      />
    </main>
  );
};

export default ConferencePage;
