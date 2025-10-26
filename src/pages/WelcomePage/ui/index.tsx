import React, { useEffect } from 'react';
import './welcome-page.scss';
import { useNavigate } from 'react-router-dom';
import { setRoomId } from '../../../entities/conference';
import { useAppDispatch } from '../../../shared/lib/hooks/useAppDispatch';
import { Button } from '@/shared/ui/Button';
import { Paragraph } from '@/shared/ui/Paragraph';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const connectHandler = () => {
    navigate(`/auth/connect`);
  };

  useEffect(() => {
    const paths = window.location.pathname.split('/');
    if (paths[paths.length - 1]) {
      dispatch(setRoomId(paths[paths.length - 1]));
    } else {
      navigate('/home');
    }
  }, []);

  return (
    <main className="WelcomePage">
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

export default WelcomePage;
