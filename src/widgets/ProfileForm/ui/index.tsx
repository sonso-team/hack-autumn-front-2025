import { Paragraph } from '@/shared/ui/Paragraph';
import { ProfilePic } from '@/shared/ui/ProfilePic';
import './profile-form.scss';
import { ProfileInputs } from './ProfileInputs';

export const ProfileForm = () => {
  return (
    <div className="ProfileForm">
      <h1>Аккаунт</h1>
      <ProfilePic letter="Н" />
      <Paragraph
        className="link"
        level={3}
      >
        Загрузить аватарку
      </Paragraph>
      <ProfileInputs />
    </div>
  );
};
