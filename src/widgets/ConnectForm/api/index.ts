import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputRef } from '../../../shared/ui/Input';
import { hideLoader, showLoader } from '../../../entities/loader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { setName } from '../../../entities/conference';

export const useConnectForm = () => {
  const dispatch = useAppDispatch();
  const { roomId } = useAppSelector((state) => state.conferenceReducer);
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean>(false);
  // const confirmRef = useRef<CheckboxRef>(null);
  const nameRef = useRef<InputRef>(null);

  const submitHandler = () => {
    console.log(nameRef.current.value);
    dispatch(setName((() => nameRef.current.value)()));
    navigate(`/conference/${roomId}`);
  };

  const getIsValid = useCallback(() => {
    return !nameRef.current?.isError && nameRef.current?.isDirty;
  }, []);

  return {
    getIsValid,
    setIsValid,
    isValid,
    submitHandler,
    nameRef,
  };
};
