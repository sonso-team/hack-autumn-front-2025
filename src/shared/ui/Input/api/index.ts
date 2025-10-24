import type React from 'react';
import { useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Validation } from '../../../utils/validator';
import { Validator } from '../../../utils/validator';

export const useInput = (ref, props) => {
  const {
    initialValue,
    type = 'text',
    validations = [],
    mask = null,
    onChange,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState<string>(initialValue);
  const isDirty = useRef(false);
  const isValueHidden = useRef(true);
  const errors = useRef<object>({});
  const isError = useRef(false);

  useImperativeHandle(ref, () => {
    return {
      isDirty: isDirty.current,
      isError: isError.current,
      value,
      isValueHidden: isValueHidden.current,
    };
  }, [value]);

  const dynamicType = useMemo(() => {
    if (type !== 'password') {
      return type;
    }
    return isValueHidden ? 'password' : 'text';
  }, [type, isValueHidden]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    isDirty.current = true;
    errors.current = {};
    validations.forEach((validation: Validation) => {
      const isError = Validator[validation.name](
        ...[e.target.value, validation.params],
      );
      if (isError) {
        errors.current[validation.name] = validation.message;
      }
    });
    isError.current = Object.values(errors.current).length !== 0;
    if (mask) {
      setValue(mask(e.target.value));
    } else {
      setValue(e.target.value);
    }
    // ToDo Убрать этот костыль
    setTimeout(() => onChange?.(e), 0);
  };

  return {
    handleChange,
    dynamicType,
    isDirty,
    value,
    errors,
    inputRef,
  };
};
