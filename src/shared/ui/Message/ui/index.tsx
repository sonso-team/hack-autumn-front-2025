import React from 'react';
import './message.scss';
import { Paragraph } from '../../Paragraph/ui/index';

type MessageProps = {
  type: 'incoming' | 'outgoing';
  username: string;
  time: string;
  children: React.ReactNode;
};

const Message: React.FC<MessageProps> = ({
  type,
  username,
  time,
  children,
}) => {
  return (
    <div className={`message-wrap ${type}`}>
      <div className="message">
        <Paragraph
          className="message-username"
          children={username}
          level={3}
        ></Paragraph>
        <Paragraph
          children={children}
          level={3}
        />
        <Paragraph
          className="message-time"
          children={time}
          level={3}
        ></Paragraph>
      </div>
    </div>
  );
};

export default Message;
