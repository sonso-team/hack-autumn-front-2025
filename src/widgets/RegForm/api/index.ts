import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputRef } from '../../../shared/ui/Input';
import { hideLoader, showLoader } from '../../../entities/loader';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';

export const useRegForm = ({ request }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, goConfirmStep } = useAppSelector(
    (state) => state.authReducer,
  );
  const [isValid, setIsValid] = useState<boolean>(false);
  // const confirmRef = useRef<CheckboxRef>(null);
  const nicknameRef = useRef<InputRef>(null);
  const emailRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);
  const repPasswordRef = useRef<InputRef>(null);

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
      nickname: nicknameRef.current.value,
    });
  };

  const getIsValid = useCallback(() => {
    return (
      !nicknameRef.current?.isError &&
      nicknameRef.current?.isDirty &&
      !emailRef.current?.isError &&
      emailRef.current?.isDirty &&
      !passwordRef.current?.isError &&
      passwordRef.current?.isDirty &&
      !repPasswordRef.current?.isError &&
      repPasswordRef.current?.isDirty
    );
  }, []);

  return {
    getIsValid,
    setIsValid,
    isValid,
    submitHandler,
    nicknameRef,
    passwordRef,
    repPasswordRef,
    emailRef,
  };
};
