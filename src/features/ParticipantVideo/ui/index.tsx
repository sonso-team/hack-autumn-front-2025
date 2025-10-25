import React, { useEffect, useRef } from 'react';
import '../style/participantVideo.scss';

interface ParticipantVideoProps {
  stream: MediaStream;
  nickname: string;
  avatarUrl?: string;
  isGuest?: boolean;
}

const ParticipantVideo: React.FC<ParticipantVideoProps> = ({
  stream,
  nickname,
  avatarUrl,
  isGuest,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="ParticipantVideo">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="ParticipantVideo__player"
      />
      <div className="ParticipantVideo__info">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={nickname}
            className="ParticipantVideo__avatar"
          />
        )}
        <span className="ParticipantVideo__name">
          {nickname} {isGuest && '(Гость)'}
        </span>
      </div>
    </div>
  );
};

export default ParticipantVideo;
