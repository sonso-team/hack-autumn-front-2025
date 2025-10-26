import { useNavigate } from 'react-router-dom';
import { useModal } from '@/shared/lib/hooks/useModal';
import type { ModalConfigI } from '@/shared/types/modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Paragraph } from '@/shared/ui/Paragraph';
import { DeleteAccountModal } from '@/widgets/ProfileForm/DeleteAccountModal';
import './profile-inputs.scss';

export const ProfileInputs = ({
  setPasswords,
}: {
  setPasswords: () => void;
}) => {
  const modalConfig: ModalConfigI = {
    title: 'Вы уверены, что хотите удалить аккаунт?',
    isPopup: true,
    primaryText: 'Удалить',
    secondaryText: 'Отмена',
    closeOutside: true,
    body: <div className="modalBody"></div>,
  };
  const navigate = useNavigate();
  const modal = useModal();
  return (
    <>
      <DeleteAccountModal />
      <div className="inputs-buttons">
        <div className="ProfileInputs">
          <Input
            initialValue={''}
            name={'username'}
            placeholder={'Имя пользователя'}
          />
          <Input
            initialValue={''}
            name={'email'}
            placeholder={'Электронная почта'}
          />
          <Input
            initialValue={''}
            name={'password'}
            placeholder={'Пароль'}
            type="password"
          />
        </div>
        <div className="change-delete-buttons">
          <Paragraph
            className="change"
            level={4}
          >
            <button onClick={setPasswords}>Изменить пароль</button>
          </Paragraph>
          <Paragraph
            className="delete"
            level={4}
          >
            <button onClick={() => modal.showModal(modalConfig)}>
              Удалить аккаунт
            </button>
          </Paragraph>
        </div>
        <div className="buttons">
          <Button
            style="primary"
            onClick={() => {}}
          >
            Сохранить
          </Button>
          <Button
            style="secondary"
            onClick={() => navigate('/')}
          >
            Назад
          </Button>
        </div>
      </div>
    </>
  );
};
