import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../../RegForm/ui/regForm.scss';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Heading } from '../../../shared/ui/Heading';
import { connectRoom } from '../../../entities/conference';
import { useAppDispatch } from '../../../shared/lib/hooks/useAppDispatch';
import { useModal } from '../../../shared/lib/hooks/useModal';

export const EnterConference = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const [val, setVal] = useState('');

  const join = async () => {
    try {
      const raw = val.trim();
      if (!raw) {
        return;
      }
      if (raw.startsWith('http') || raw.startsWith('hack')) {
        await dispatch(connectRoom({ roomId: val })).unwrap();
        navigate(raw);
      } else {
        const id = raw.match(/[a-z0-9-]{6,}/i)?.[0] ?? raw;
        const paths = window.location.pathname.split('/');
        await dispatch(
          connectRoom({ roomId: paths[paths.length - 1] }),
        ).unwrap();
        navigate(`/conference/${id}`);
      }
    } catch (e) {
      navigate('/');
      showModal({
        title: 'Ошибка при подключении к комнате',
        primaryText: 'Понятно',
      });
    }
  };

  return (
    <main className="AuthPage">
      <div className="RegForm Form">
        <Heading
          level={1}
          mode="bold"
        >
          Подключение
        </Heading>
        <div className="Form__form">
          <div className="Form__inputs">
            <Input
              name="enterRoom"
              initialValue=""
              placeholder="Идентификатор или ссылка"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVal(e.target.value)
              }
            />
          </div>
          <Button
            custom
            onClick={join}
            className="Form__submit"
          >
            Продолжить
          </Button>
          <Paragraph level={4}>
            <Link
              to="/"
              className="Form__link"
            >
              Назад
            </Link>
          </Paragraph>
        </div>
      </div>
    </main>
  );
};

export default EnterConference;
