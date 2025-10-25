import './conferencePage.scss';
import { useLocation } from 'react-router-dom';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Button } from '../../../shared/ui/Button';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { useConference } from '@/entities/conference';
import ConferenceFooter from '@/widgets/ConferenceFooter';

const ConferencePage = () => {
  const { pathname } = useLocation();
  const { roomId } = useAppSelector((state) => state.conferenceReducer);
  const getRoomId = () => {
    if (roomId) {
      return roomId;
    }
    const paths = pathname.split('/');
    return paths[paths.length - 1];
  };
  const { localVideoRef, toggleTrack, micOn, remoteStreams, camOn } =
    useConference({ roomId: getRoomId() });

  return (
    <main className="ConferencePage">
      <section className="ConferencePage__streamsContainer">
        <div className="ConferencePage__videoWrapper">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="ConferencePage__videoPlayer"
          />
        </div>
        {!remoteStreams.length && (
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
                onClick={() => 1}
                className="ConferencePage__button"
              >
                🔗 Копировать ссылку
              </Button>
              <Button
                onClick={() => 1}
                className="ConferencePage__button"
              >
                # Копировать код
              </Button>
            </div>
          </div>
        )}
      </section>
      <ConferenceFooter
        camToggle={() => toggleTrack('cam')}
        micToggle={() => toggleTrack('mic')}
        camOn={camOn}
        micOn={micOn}
      />
    </main>
  );
};

export default ConferencePage;
