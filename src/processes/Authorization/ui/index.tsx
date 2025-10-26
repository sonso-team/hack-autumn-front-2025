import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RegForm from '../../../widgets/RegForm/ui';
import AuthForm from '../../../widgets/AuthForm/ui';
import { useAppSelector } from '../../../shared/lib/hooks/useAppSelector';
import { login, registration } from '../../../entities/session';
import { useAppDispatch } from '../../../shared/lib/hooks/useAppDispatch';

import { authCode } from '../../../entities/session/api';
import ConfirmForm from '../../../widgets/ConfirmForm/ui';
import ConnectForm from '../../../widgets/ConnectForm/ui';

const Authorization = () => {
  const [confirmStep, setConfirmStep] = useState(false);
  const { user } = useAppSelector((state) => state.authReducer);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const regSubmit = async ({ email, password, nickname }) => {
    try {
      await dispatch(registration({ email, password, nickname })).unwrap();
      setConfirmStep(true); // успех
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  const loginSubmit = async ({ email, password }) => {
    try {
      await dispatch(login({ email, password })).unwrap();
      setConfirmStep(true); // успех
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  const codeSubmit = async ({ password }) => {
    try {
      await dispatch(
        authCode({
          login: user.email,
          password,
        }),
      ).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  if (confirmStep) {
    return <ConfirmForm request={codeSubmit} />;
  }
  if (location.pathname === '/auth/login') {
    return <AuthForm request={loginSubmit} />;
  }
  if (location.pathname === '/auth/connect') {
    return <ConnectForm />;
  }

  return <RegForm request={regSubmit} />;
};

export default Authorization;
