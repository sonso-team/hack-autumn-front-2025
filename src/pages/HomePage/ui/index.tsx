import React from 'react';
import './home-page.scss';
import { Button } from '@/shared/ui/Button';
import { Paragraph } from '@/shared/ui/Paragraph';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const connectHandler = () => {
    const paths = window.location.pathname.split('/');
    const roomId = paths[paths.length - 1];
    navigate(`/conference/${roomId}`);
  };
  return (
    <main className="HomePage">
      <Button
        style="secondary"
        onClick={connectHandler}
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
