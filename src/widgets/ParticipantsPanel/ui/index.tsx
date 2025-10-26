

import { useConference } from '@/entities/conference/api'; // твой хук из useConference.ts
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import React, { useMemo, useState } from 'react';
import styles from './ParticipantsPanel.module.css';

type Props = {
  roomId: string;
  /** socketId админа комнаты (если знаешь его на клиенте) */
  adminId?: string;
  /** закрыть сайдбар (по иконке X) */
  onClose?: () => void;
};

type Participant = {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  isGuest: boolean;
  isLocal?: boolean;
};

const initialLetter = (s: string) =>
  (s || '').trim().charAt(0).toUpperCase() || 'H';

const Kebab: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 4a6 6 0 1 1 0 12A6 6 0 0 1 10 4zm10.7 15.3-3.6-3.6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ParticipantsPanel: React.FC<Props> = ({ roomId, adminId, onClose }) => {
  const { user } = useAppSelector((s) => s.authReducer);
  const username = useAppSelector((s) => s.conferenceReducer.name) || user?.nickname || 'Я';
  const { remoteStreams } = useConference({ roomId });

  const [query, setQuery] = useState('');

  // Склеиваем локального + удалённых
  const participants: Participant[] = useMemo(() => {
    const remotes: Participant[] = remoteStreams.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      avatarUrl: r.avatarUrl,
      isGuest: r.isGuest,
      isLocal: false,
    }));

    // локальный юзер — отдельной карточкой сверху
    const me: Participant = {
      id: 'local',
      nickname: username,
      avatarUrl: user?.avatarPath ?? null,
      isGuest: false,
      isLocal: true,
    };

    return [me, ...remotes].sort((a, b) =>
      a.isLocal ? -1 : b.isLocal ? 1 : a.nickname.localeCompare(b.nickname, 'ru')
    );
  }, [remoteStreams, username, user?.avatarPath]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {return participants;}
    return participants.filter((p) => p.nickname.toLowerCase().includes(q));
  }, [participants, query]);

  return (
    <aside className={styles.wrap} aria-label="Участники">
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Участники</span>
          <span className={styles.counter}>{participants.length}</span>
        </div>
        <button className={styles.iconBtn} onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>
      </header>

      <div className={styles.search}>
        <SearchIcon />
        <input
          className={styles.input}
          placeholder="Текст"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <ul className={styles.list}>
        {filtered.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.avatarUrl ? (
              <img className={styles.avatar} src={p.avatarUrl} alt={p.nickname} />
            ) : (
              <div className={styles.avatarFallback}>{initialLetter(p.nickname)}</div>
            )}

            <div className={styles.meta}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{p.nickname || 'Ник'}</span>
                {adminId && p.id === adminId && (
                  <span className={styles.badge}>Администратор</span>
                )}
              </div>
            </div>

            <button className={styles.kebabBtn} aria-label="Меню участника">
              <Kebab />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ParticipantsPanel;
