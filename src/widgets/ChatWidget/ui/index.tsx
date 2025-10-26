import React, { useEffect, useMemo, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import './chat-widget.scss';
import ChatNotifier from '@/shared/ui/ChatNotifier';
import Message from '@/shared/ui/Message';
import { Heading } from '@/shared/ui/Heading';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { Button } from '@/shared/ui/Button';
import crossSVG from '@/shared/assets/icons/x.svg';
import { icons } from '@/shared/lib/icons';

interface MessageI {
  type: 'SYSTEM' | 'USER';
  username: string;
  text: string;
  timestamp?: string;
}

interface ClientEvent {
  action: 'SEND' | 'END';
  text?: string;
}

interface ChatWidgetProps {
  baseUrl?: string;
  roomId?: string;
  closeHandler: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  baseUrl = 'https://hack.kinoko.su',
  roomId = 'ed2d2f2d-ba9e-4f69-a62e-f5a31f68dc39',
  closeHandler,
}) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const username = user?.nickname || user?.name || 'Гость';

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [text, setText] = useState('');
  const sockRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // создаём URL для подключения
  const connectUrl = useMemo(() => {
    const path = `/ws/chat?conf=${roomId}&`;
    const query = `username=${encodeURIComponent(username)}`;
    return `${baseUrl}${path}${query}`;
  }, [baseUrl, roomId, username]);

  // подключение к сокету
  const connect = () => {
    if (connected) {
      return;
    }

    const sock = new SockJS(connectUrl);
    sockRef.current = sock;

    sock.onopen = () => setConnected(true);

    sock.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type === 'INIT') {
          const msgs = (data.messages || []).map((m: MessageI) => ({
            ...m,
            timestamp: m.timestamp || new Date().toISOString(),
          }));
          setMessages(msgs);
        } else if (data.type === 'MESSAGE') {
          const msg = {
            ...data.message,
            timestamp: data.message.timestamp || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, msg]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    sock.onclose = () => {
      setConnected(false);
      sockRef.current = null;
    };

    sock.onerror = () => {
      setConnected(false);
    };
  };

  // отправка сообщения
  const send = () => {
    const t = text.trim();
    if (!t || !sockRef.current) {
      return;
    }

    const evt: ClientEvent = { action: 'SEND', text: t };
    sockRef.current.send(JSON.stringify(evt));
    setText('');
  };

  // скролл к низу
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // подключаем сокет при монтировании
  useEffect(() => {
    connect();
    return () => sockRef.current?.close();
  }, []);

  // скроллим вниз при изменении сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // отрисовка сообщений
  const renderMessage = (m: MessageI, i: number) => {
    const time = new Date(m.timestamp!).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (m.type === 'SYSTEM') {
      return <ChatNotifier key={i}>{m.text}</ChatNotifier>;
    }

    const msgType = m.username === username ? 'outgoing' : 'incoming';

    return (
      <Message
        key={i}
        type={msgType}
        username={m.username}
        time={time}
      >
        {m.text}
      </Message>
    );
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <Heading
          level={2}
          children={`Чат`}
        ></Heading>
        <Button
          onClick={closeHandler}
          children={
            <img
              src={icons.cross}
              alt=""
            ></img>
          }
        ></Button>
      </div>

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-footer">
        <input
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          className="chat-send"
          onClick={send}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
