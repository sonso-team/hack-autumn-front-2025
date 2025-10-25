import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputRef } from '../../../shared/ui/Input';
import { hideLoader, showLoader } from '../../../entities/loader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';

export const useAuthForm = ({ request }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, goConfirmStep } = useAppSelector(
    (state) => state.authReducer,
  );
  const [isValid, setIsValid] = useState<boolean>(false);
  // const confirmRef = useRef<CheckboxRef>(null);
  const emailRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoader());
    } else {
      if (goConfirmStep) {
        navigate('/auth/confirm');
      }
      dispatch(hideLoader());
    }
  }, [isLoading]);

  const submitHandler = () => {
    request({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })
  };

  const getIsValid = useCallback(() => {
    return (
      !emailRef.current?.isError &&
      emailRef.current?.isDirty &&
      !passwordRef.current?.isError &&
      passwordRef.current?.isDirty
    );
  }, []);

  return {
    getIsValid,
    setIsValid,
    isValid,
    submitHandler,
    passwordRef,
    emailRef,
  };
};
