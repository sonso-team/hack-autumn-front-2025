import './conferencePage.scss';
import { useLocation } from 'react-router-dom';
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

  console.log(getRoomId());
  console.log(localVideoRef);
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
            <h2 className="ConferencePage__inviteTitle">
              Пригласите других участников,
              <br />
              отправив им ссылку на встречу
            </h2>
            <div className="ConferencePage__inviteButtons">
              <button className="ConferencePage__button">
                🔗 Копировать ссылку
              </button>
              <button className="ConferencePage__button">
                # Копировать код
              </button>
            </div>
          </div>
        )}
      </section>
      <ConferenceFooter />
    </main>
  );
};

export default ConferencePage;
