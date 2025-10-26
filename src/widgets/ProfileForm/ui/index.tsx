import { Paragraph } from '@/shared/ui/Paragraph';
import { ProfilePic } from '@/shared/ui/ProfilePic';
import { useState } from 'react';
import { PasswordInputs } from './PasswordInputs';
import './profile-form.scss';
import { ProfileInputs } from './ProfileInputs';

type mode = 'profile' | 'passwords';

export const ProfileForm = () => {
  const handleFormChange = (mode: mode) => {
    setMode(mode);
  };
  const [mode, setMode] = useState<mode>('profile');
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
      {mode === 'profile' ? (
        <ProfileInputs setPasswords={() => handleFormChange('passwords')} />
      ) : (
        <PasswordInputs setPasswords={() => handleFormChange('profile')} />
      )}
    </div>
  );
};
