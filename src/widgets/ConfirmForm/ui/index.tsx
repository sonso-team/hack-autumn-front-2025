import { Link, useNavigate } from 'react-router-dom';
import { OtpInput } from '../../../features/OtpInput';
import { Button } from '../../../shared/ui/Button';
import { Heading } from '../../../shared/ui/Heading';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { useConfirmForm } from '../api';

const ConfirmForm = (props: {request: ({ password }: { password:string }) => void}) => {
  const { isValid, submitHandler, codeRef, setIsValid, getIsValid } =
    useConfirmForm(props);
    const navigate = useNavigate();

  return (
    <div className="ConfirmForm Form">
      <Heading level={1} mode="bold" >Введите код из письма</Heading>
      <div className="Form__form">
        <div className="AuthPage__inputs">
          <OtpInput
            ref={codeRef}
            onChange={() => setIsValid(getIsValid())}
          />
        </div>
        <Button
          custom
          onClick={submitHandler}
          disabled={!isValid}
        >
          Подтвердить почту
        </Button>
        <Paragraph level={4}>
          Неправильная почта ?{' '}
          <Link
            to="/auth"
            className="AuthPage__link"
            onClick={() => navigate('/auth')}
          >
            Назад
          </Link>
        </Paragraph>
        </div>
    </div>
  );
};

export default ConfirmForm;