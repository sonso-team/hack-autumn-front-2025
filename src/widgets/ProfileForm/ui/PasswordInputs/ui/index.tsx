import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import './password-inputs.scss';

export const PasswordInputs = () => {
  return (
    <div className="inputs-buttons">
      <div className="PasswordInputs">
        <Input
          initialValue={''}
          name={'old-pass'}
          placeholder={'Введите старый пароль'}
        />
        <Input
          initialValue={''}
          name={'new-pass'}
          placeholder={'Введите новый пароль'}
        />
        <Input
          initialValue={''}
          name={'new-pass-repeat'}
          placeholder={'Введите новый пароль повторно'}
        />
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
