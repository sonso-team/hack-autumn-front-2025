import createAppointmentsImg from '@/shared/assets/images/appointments.png';
import createMeetingImg from '@/shared/assets/images/create-meeting.png';
import createEnterImg from '@/shared/assets/images/enter-meeting.png';
import React from 'react';
import './home-page.scss';
import ButtonGrande from './shared/ButtonGrande/ui';

const HomePage: React.FC = () => {
  return (
    <main className="HomePage">
      <div className="hp-container">
        <ButtonGrande
          imgUrl={createMeetingImg}
          bottomText={'Создать видеовстречу'}
        />
        <div className="smooll">
          <ButtonGrande
            imgUrl={createEnterImg}
            bottomText={'Подключиться'}
            className="smol"
          />
          <ButtonGrande
            imgUrl={createAppointmentsImg}
            bottomText={'История'}
            className="smol"
          />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
