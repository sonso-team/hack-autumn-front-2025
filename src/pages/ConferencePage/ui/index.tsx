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
import ChatWidget from '@/widgets/ChatWidget';

const ConferencePage: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.authReducer);
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
    screenOn,
    toggleScreen,
    myScreenStream,
  } = useConference({ roomId: getRoomId() });

  const [chatOpen, setChatOpen] = useState(false);

  const hasRemoteParticipants = remoteStreams.length > 0;
  const totalCount = 1 + remoteStreams.length;

  const chatCloseHandler = () => {
    setChatOpen(false);
  };

  const [open, setOpen] = useState(false);
  const cameraStreams = remoteStreams.filter((s) => !s.isScreen);
  const screenStreams = remoteStreams.filter((s) => s.isScreen);

  return (
    <main className="ConferencePage">
      <div className="ConferencePage__wrapper">
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

          {screenOn && myScreenStream && (
            <ParticipantVideo
              key={myScreenStream.id}
              stream={myScreenStream}
              nickname={`Работает Ваш экран`}
              avatarUrl={user?.avatarPath}
              isMuted // чтобы не ловить системный звук себя же
            />
          )}

          {/* Видео других участников */}

          {screenStreams.map(({ id, stream, nickname, isGuest, avatarUrl }) => (
            <ParticipantVideo
              key={stream.id} // ключ по stream.id, он уникальный на поток
              stream={stream}
              nickname={nickname}
              isGuest={isGuest}
              avatarUrl={avatarUrl}
            />
          ))}

          {cameraStreams.map(({ id, stream, nickname, isGuest, avatarUrl }) => (
            <ParticipantVideo
              key={stream.id}
              stream={stream}
              nickname={nickname}
              isGuest={isGuest}
              avatarUrl={avatarUrl}
            />
          ))}

          {!hasRemoteParticipants && (
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

        {chatOpen && (
          <ChatWidget
            roomId={getRoomId()}
            closeHandler={chatCloseHandler}
          />
        )}
      </div>

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        >
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
        screenOn={screenOn}
        toggleScreen={toggleScreen}
        onToggleChat={() => setChatOpen((prev) => !prev)}
      />
    </main>
  );
};

export default ConferencePage;
