import React, { useEffect, useRef } from 'react';
import './home-page.scss';

import useConference from '../../../entities/conference';

type VideoPlayerProps = {
  stream: MediaStream;
  id: string;
};
const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, id }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
  const { micOn, camOn, localVideoRef, remoteStreams, toggleTrack } =
    useConference({ roomId: '1', socketUrl: 'http://localhost:3001' });

  console.log(remoteStreams);

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {remoteStreams.map((remote) => (
          <VideoPlayer
            key={remote.id}
            stream={remote.stream}
            id={remote.id}
          />
        ))}
      </div>
      <div>
        <button onClick={() => toggleTrack('mic')}>
          {micOn ? 'Mute' : 'Unmute'}
        </button>
        <button onClick={() => toggleTrack('cam')}>
          {camOn ? 'Stop Video' : 'Start Video'}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
