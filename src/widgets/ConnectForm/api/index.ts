import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputRef } from '../../../shared/ui/Input';
import { setName } from '../../../entities/conference';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { connectRoom } from '../../../entities/conference/api/conferenceThunks';
import { useModal } from '../../../shared/lib/hooks/useModal';

export const useConnectForm = () => {
  const dispatch = useAppDispatch();
  const { showModal, hideModal } = useModal();
  const { roomId } = useAppSelector((state) => state.conferenceReducer);
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean>(false);
  // const confirmRef = useRef<CheckboxRef>(null);
  const nameRef = useRef<InputRef>(null);

  const submitHandler = async () => {
    try {
      dispatch(setName((() => nameRef.current.value)()));
      await dispatch(connectRoom({ roomId })).unwrap();
      navigate(`/conference/${roomId}`);
    } catch (e) {
      showModal({
        title: 'Ошибка при подключении к комнате',
        primaryText: 'Назад',
        primaryHandler: () => {
          hideModal();
          navigate(`/home/${roomId}`);
        },
      });
    }
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
