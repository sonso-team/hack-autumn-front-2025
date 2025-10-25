import { Link } from 'react-router-dom';
import { useConnectForm } from '../api';
import { Button } from '../../../shared/ui/Button';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Heading } from '@/shared/ui/Heading';
import { Input } from '@/shared/ui/Input';
import './../../RegForm/ui/regForm.scss';

const ConnectForm = () => {
  const { isValid, getIsValid, setIsValid, submitHandler, nameRef } =
    useConnectForm();

  return (
    <div className="RegForm Form">
      <Heading
        level={1}
        mode="bold"
      >
        Вход
      </Heading>
      <div className="Form__form">
        <div className="Form__inputs">
          <Input
            placeholder="Имя"
            initialValue=""
            name="email"
            ref={nameRef}
            onChange={() => setIsValid(getIsValid())}
            validations={[
              {
                name: 'isEmpty',
                message: 'Введите имя',
              },
            ]}
          />
        </div>
        <Button
          custom
          onClick={submitHandler}
          disabled={!isValid}
          className="Form__submit"
        >
          Продолжить
        </Button>
        <Paragraph level={4}>
          <Link
            to="/auth/registration"
            className="Form__link"
          >
            Назад
          </Link>
        </Paragraph>
      </div>
    </div>
  );
};

export default ConnectForm;
