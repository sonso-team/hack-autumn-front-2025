import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Paragraph } from '@/shared/ui/Paragraph';
import './welcome-page.scss';

const WelcomePage: React.FC = () => {
  return (
    <main className="WelcomePage">
      <Button
        style="secondary"
        onClick={() => 1}
      >
        Присоединиться
      </Button>
      <Paragraph
        mode="link"
        level={5}
      >
        <a href="#">Политика обработки персональных данных</a>
      </Paragraph>
    </main>
  );
};

export default WelcomePage;
