import { Link } from 'react-router-dom';
import { useAuthForm } from '../api';
import { Button } from '../../../shared/ui/Button';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Heading } from '@/shared/ui/Heading';
import { Input } from '@/shared/ui/Input';
import './../../RegForm/ui/regForm.scss'

const AuthForm = (props: {request: ({ email, password }: { email: string, password:string }) => void}) => {
  const {
    isValid,
    getIsValid,
    setIsValid,
    submitHandler,
    passwordRef,
    emailRef,
  } = useAuthForm(props);

  return <div className="RegForm Form">
    <Heading level={1} mode="bold" >Вход</Heading>
    <div className="Form__form" >
      <div className="Form__inputs">
        <Input
          placeholder="Почта"
          initialValue=""
          name="email"
          ref={emailRef}
          onChange={() => setIsValid(getIsValid())}
          validations={[
            {
              name: 'isEmpty',
              message: 'Введите почту',
            },
            {
              name: 'isEmail',
              message: 'Введите корректный адрес почты',
            },
          ]}
        />
        <Input
          placeholder="Пароль"
          type="password"
          initialValue=""
          name="password"
          ref={passwordRef}
          onChange={() => setIsValid(getIsValid())}
          validations={[
            {
              name: 'isEmpty',
              message: 'Введите пароль',
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
        Нет аккаунта ?{' '}
        <Link
          to="/auth/registration"
          className="Form__link"
        >
          Зарегистрироваться
        </Link>
      </Paragraph>
    </div>
  </div>
}

export default AuthForm;