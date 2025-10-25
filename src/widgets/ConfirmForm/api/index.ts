import { useCallback, useEffect, useRef, useState } from 'react';
import { hideLoader, showLoader } from '../../../entities/loader';
import { useAppSelector } from '../../../shared/lib/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/lib/hooks/useAppDispatch';
import type { OTPInputRef } from '../../../features/OtpInput';

export const useConfirmForm = ({ request }) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authReducer);
  const [isValid, setIsValid] = useState<boolean>(false);
  const codeRef = useRef<OTPInputRef>(null);

  useEffect(() => {
    if (authState.isLoading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [dispatch, authState.isLoading]);

  const submitHandler = () => {
    request({ password: codeRef.current.value });
  };

  const getIsValid = useCallback(() => {
    return codeRef.current?.isValid;
  }, []);

  return {
    submitHandler,
    codeRef,
    setIsValid,
    getIsValid,
    isValid,
  };
};
