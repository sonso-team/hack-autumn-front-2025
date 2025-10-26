import { useCallback, useRef, useState } from 'react';
import type { InputRef } from '../../../shared/ui/Input';

export const useConfigForm = ({ request }) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  // const confirmRef = useRef<CheckboxRef>(null);
  const teamNameRef = useRef<InputRef>(null);
  const countRef = useRef<InputRef>(null);

  const submitHandler = () => {
    request({
      name: teamNameRef.current.value,
      maxParticipants: countRef.current.value,
    });
  };

  const getIsValid = useCallback(() => {
    return (
      !teamNameRef.current?.isError &&
      teamNameRef.current?.isDirty &&
      !countRef.current?.isError &&
      countRef.current?.isDirty
    );
  }, []);

  return {
    getIsValid,
    setIsValid,
    isValid,
    submitHandler,
    countRef,
    teamNameRef,
  };
};
