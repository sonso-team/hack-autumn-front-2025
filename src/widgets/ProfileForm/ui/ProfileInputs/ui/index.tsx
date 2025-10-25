import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Paragraph } from '@/shared/ui/Paragraph';
import './profile-inputs.scss';

export const ProfileInputs = () => {
  return (
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
        />
      </div>
      <div className="change-delete-buttons">
        <Paragraph
          className="change"
          level={4}
        >
          Изменить пароль
        </Paragraph>
        <Paragraph
          className="delete"
          level={4}
        >
          Удалить аккаунт
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
          onClick={() => {}}
        >
          Назад
        </Button>
      </div>
    </div>
  );
};
