import React from 'react';
import createAppointmentsImg from '@/shared/assets/images/appointments.png';
import createMeetingImg from '@/shared/assets/images/create-meeting.png';
import createEnterImg from '@/shared/assets/images/enter-meeting.png';
import './home-page.scss';
import ButtonGrande from './shared/ButtonGrande/ui';
import { useModal } from '../../../shared/lib/hooks/useModal';
import ConfigForm from '../../../widgets/ConfigForm/ui';
import { createRoom } from '../../../entities/conference';
import { useAppDispatch } from '../../../shared/lib/hooks/useAppDispatch';
import { connectRoom } from '../../../entities/conference/api/conferenceThunks';
import { useNavigate } from 'react-router';
import Message from '../../../shared/ui/Message/ui/index';
import ChatNotifier from '@/shared/ui/ChatNotifier';
import ChatWidget from '@/widgets/ChatWidget';

const HomePage: React.FC = () => {
  const { showModal, hideModal } = useModal();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const createMeetingHandler = () => {
    showModal({
      overrideContent: <ConfigForm request={createMeetingRequest} />,
    });
  };

  const createMeetingRequest = async ({ name, maxParticipants }) => {
    try {
      const res = await dispatch(
        createRoom({ name, maxParticipants }),
      ).unwrap();
      await dispatch(connectRoom({ roomId: res })).unwrap();
      hideModal();
      navigate(`/conference/${res}`);
    } catch {
      showModal({
        title: 'Ошибка создания комнаты',
        primaryText: 'Понятно',
        icon: 'error',
      });
    }
  };

  const techWorksHandler = () => {
    showModal({
      title: 'Функционал в разработке',
    });
  };

  return (
    <main className="HomePage">
      <div className="hp-container">
        <ButtonGrande
          imgUrl={createMeetingImg}
          onClick={createMeetingHandler}
          bottomText={'Создать видеовстречу'}
        />
        <div className="smooll">
          <ButtonGrande
            imgUrl={createEnterImg}
            bottomText={'Подключиться'}
            className="smol"
            onClick={techWorksHandler}
          />
          <ButtonGrande
            imgUrl={createAppointmentsImg}
            bottomText={'История'}
            className="smol"
            onClick={techWorksHandler}
          />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
