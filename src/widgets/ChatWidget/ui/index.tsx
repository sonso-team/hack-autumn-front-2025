import React, { useEffect, useMemo, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import './chat-widget.scss';
import ChatNotifier from '@/shared/ui/ChatNotifier';
import Message from '@/shared/ui/Message';
import { Heading } from '@/shared/ui/Heading';

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
  confId?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  baseUrl = 'https://hack.kinoko.su',
  confId = 'ed2d2f2d-ba9e-4f69-a62e-f5a31f68dc39',
}) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [username] = useState('Гость');
  const [text, setText] = useState('');
  const sockRef = useRef<WebSocket | null>(null);

  const connectUrl = useMemo(() => {
    const path = `/chat/${confId}`;
    const query = `?username=${encodeURIComponent(username)}`;
    return `${baseUrl}${path}${query}`;
  }, [baseUrl, confId, username]);

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
          setMessages(data.messages || []);
        } else if (data.type === 'MESSAGE') {
          setMessages((prev) => [...prev, data.message]);
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

  const send = () => {
    const t = text.trim();
    if (!t || !sockRef.current) {
      return;
    }
    const evt: ClientEvent = { action: 'SEND', text: t };
    sockRef.current.send(JSON.stringify(evt));
    setText('');
  };

  useEffect(() => {
    connect();
    return () => sockRef.current?.close();
  }, []);

  const renderMessage = (m: MessageI, i: number) => {
    const time = m.timestamp
      ? new Date(m.timestamp).toLocaleTimeString()
      : new Date().toLocaleTimeString();

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
        <Heading level={2}>Чат конференции</Heading>
      </div>

      <div className="chat-body">
        <div className="chat-messages">{messages.map(renderMessage)}</div>
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
