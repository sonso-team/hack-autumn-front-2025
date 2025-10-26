import React, { useEffect } from 'react';
import './home-page.scss';
import { Button } from '@/shared/ui/Button';
import { Paragraph } from '@/shared/ui/Paragraph';
import { useNavigate } from 'react-router-dom';
import { setRoomId } from '../../../entities/conference';
import { useAppDispatch } from '../../../shared/lib/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/lib/hooks/useAppSelector';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const connectHandler = () => {
    navigate(`/auth/connect`);
  };

  useEffect(() => {
    const paths = window.location.pathname.split('/');
    if (paths[paths.length - 1]) {
      dispatch(setRoomId(paths[paths.length - 1]));
    }
  }, []);

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
