import { Link } from 'react-router-dom';
import { Heading } from '../../../shared/ui/Heading';
import { useConfirmForm } from '../api';
import { OtpInput } from '../../../features/OtpInput';
import { Button } from '../../../shared/ui/Button';
import { Paragraph } from '../../../shared/ui/Paragraph';

const ConfirmForm = (props: {request: ({ password }: { password:string }) => void}) => {
  const { isValid, submitHandler, codeRef, setIsValid, getIsValid } =
    useConfirmForm(props);

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
          Неправильный номер ?{' '}
          <Link
            to="/auth/"
            className="AuthPage__link"
          >
            Назад
          </Link>
        </Paragraph>
        </div>
    </div>
  );
};

export default ConfirmForm;