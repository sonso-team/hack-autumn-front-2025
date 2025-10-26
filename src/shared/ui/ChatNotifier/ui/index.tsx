import type { ReactNode } from 'react';
import React from 'react';
import './chat-notifier.scss';
import { Paragraph } from '../../Paragraph/ui/index';

const ChatNotifier: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={`notifier-wrap`}>
      <div className="notifier">
        <Paragraph
          className="notifier-username"
          children={children}
          level={3}
        ></Paragraph>
      </div>
    </div>
  );
};

export default ChatNotifier;
