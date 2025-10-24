import type React from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { OTPInputRef } from '../model';

export const useOtpInput = (
  length: number,
  ref: React.ForwardedRef<OTPInputRef>,
  onChange: () => void,
) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useImperativeHandle(ref, () => ({
    value: values.join(''),
    isValid: values.every((v) => v !== ''),
  }));

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Переход к следующему инпуту или снятие фокуса с последнего
    if (value) {
      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      } else {
        inputsRef.current[index]?.blur();
      }
    }

    setTimeout(() => {
      onChange?.();
    }, 0);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      if (values[index] === '' && index > 0) {
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return {
    handleChange,
    handleKeyDown,
    ref,
    values,
    inputsRef,
  };
};
