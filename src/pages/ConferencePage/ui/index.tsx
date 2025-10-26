import { useConference } from '@/entities/conference';
import ParticipantVideo from '@/features/ParticipantVideo';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import ConferenceFooter from '@/widgets/ConferenceFooter';
import ParticipantsPanel from '@/widgets/ParticipantsPanel/ui';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import copyCurrentUrl from '../../../shared/lib/copyCurrentPath';
import { Button } from '../../../shared/ui/Button';
import { Paragraph } from '../../../shared/ui/Paragraph';
import './conferencePage.scss';

const ConferencePage: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.authReducer);
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

  const [open, setOpen] = useState(false);
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
            {username || user?.nickname || 'Гость'} (Вы)
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

{open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          {/* стопаем клик внутри панели, чтобы не закрывалась */}
          <div onClick={(e) => e.stopPropagation()}>
            <ParticipantsPanel
              roomId={roomId}
              adminId={''}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      <ConferenceFooter
        onEndCall={disconnect} // отключаем конференцию
        camToggle={() => toggleTrack('cam')}
        micToggle={() => toggleTrack('mic')}
        camOn={camOn}
        micOn={micOn}
        onParticipantsOpen={() => setOpen(true)}
      />
    </main>
  );
};

export default ConferencePage;
