import './conferencePage.scss';
import { useLocation } from 'react-router-dom';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Button } from '../../../shared/ui/Button';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { useConference } from '@/entities/conference';
import ConferenceFooter from '@/widgets/ConferenceFooter';
import ParticipantVideo from '@/features/ParticipantVideo';
import copyCurrentUrl from '../../../shared/lib/copyCurrentPath';

const ConferencePage = () => {
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

  return (
    <main className="ConferencePage">
      <section
        className={`ConferencePage__streamsContainer ${
          hasRemoteParticipants ? 'ConferencePage__grid' : ''
        }`}
      >
        {/* Локальное видео */}
        <div className="ConferencePage__videoWrapper">
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
