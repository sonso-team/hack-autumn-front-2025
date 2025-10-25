import React from 'react';
import './home-page.scss';
import { Button } from '@/shared/ui/Button';
import { Paragraph } from '@/shared/ui/Paragraph';

const HomePage: React.FC = () => {
  return (
    <main className="HomePage">
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

export default HomePage;
