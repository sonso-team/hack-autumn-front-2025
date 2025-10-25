import React, { useEffect, useRef, useState } from 'react';
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
  const [status, setStatus] = useState<string>('⏳ Инициализация...');

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return;
    }

    // Подключаем поток
    videoEl.srcObject = stream;

    // Для участников включаем звук
    videoEl.muted = false;
    videoEl.volume = 1;

    const tryPlay = async () => {
      try {
        await videoEl.play();
        setStatus('✅ Видео воспроизводится с аудио');
      } catch (err) {
        setStatus('⚠️ Не удалось автозапустить (возможно, нужен клик)');
        console.warn('Autoplay blocked:', err);
      }
    };

    tryPlay();

    // Диагностика: проверяем активность потока
    if (!stream.active) {
      setStatus('❌ Поток неактивен');
    }

    const tracks = stream.getTracks();
    if (tracks.length === 0) {
      setStatus('❌ В потоке нет треков');
    } else {
      const info = tracks.map(
        (t) => `${t.kind}: ${t.readyState} ${t.enabled ? '🟢' : '🔴'}`,
      );
      console.log(`🎧 Tracks for ${nickname}:`, info);
    }

    // Обработчики событий потока
    const onInactive = () => setStatus('❌ Поток остановлен');
    const onAddTrack = (e: any) => {
      console.log('🎬 Добавлен трек:', e.track.kind);
      setStatus('🎬 Поток обновлён');
      tryPlay();
    };

    stream.addEventListener?.('inactive', onInactive);
    stream.addEventListener?.('addtrack', onAddTrack);

    return () => {
      stream.removeEventListener?.('inactive', onInactive);
      stream.removeEventListener?.('addtrack', onAddTrack);
    };
  }, [stream, nickname]);

  // Проверка воспроизведения видео
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return;
    }

    const onPlaying = () => {
      console.log(`✅ Видео ${nickname} реально играет`);
      setStatus('✅ Видео реально играет');
    };
    const onError = (e: any) => {
      console.error('❌ Ошибка в видео:', e);
      setStatus('❌ Ошибка при воспроизведении');
    };

    videoEl.addEventListener('playing', onPlaying);
    videoEl.addEventListener('error', onError);

    return () => {
      videoEl.removeEventListener('playing', onPlaying);
      videoEl.removeEventListener('error', onError);
    };
  }, [nickname]);

  return (
    <div className="ParticipantVideo">
      <video
        key={stream.id} // при смене потока React создаст новый элемент
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
        <div className="ParticipantVideo__status">{status}</div>
      </div>
    </div>
  );
};

export default ParticipantVideo;
