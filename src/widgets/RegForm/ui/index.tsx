import { Heading } from '@/shared/ui/Heading';
import { Input } from '@/shared/ui/Input';
import { useRegForm } from '../api';
import { Button } from '../../../shared/ui/Button';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { Link } from 'react-router-dom';
import './regForm.scss'

const RegForm = (props: {request: ({ email, password, nickname }: { email: string, password:string, nickname: string }) => void}) => {
  const {
    isValid,
    getIsValid,
    setIsValid,
    submitHandler,
    nicknameRef,
    passwordRef,
    repPasswordRef,
    emailRef,
  } = useRegForm(props);

  return <div className="RegForm Form">
    <Heading level={1} mode="bold" >Регистрация</Heading>
    <div className="Form__form">
      <div className="Form__inputs">
        <Input
          placeholder="Никнейм"
          initialValue=""
          name="nickname"
          ref={nicknameRef}
          onChange={() => setIsValid(getIsValid())}
          validations={[
            {
              name: 'isEmpty',
              message: 'Введите никнейм',
            },
          ]}
        />
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
        <Input
          placeholder="Повторите пароль"
          type="password"
          initialValue=""
          name="repeat-password"
          ref={repPasswordRef}
          onChange={() => setIsValid(getIsValid())}
          validations={[
            {
              name: 'isEmpty',
              message: 'Введите пароль ещё раз',
            },
            {
              name: 'isEqualTo',
              params: {
                compareValue: () => passwordRef.current?.value
              },
              message: 'Пароли не совпадают'

            }
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
        Есть аккаунт ?{' '}
        <Link
          to="/auth/login"
          className="Form__link"
        >
          Войти
        </Link>
      </Paragraph>
    </div>
  </div>
}

export default RegForm;