import React, { forwardRef } from 'react';
import './input.scss';
import { Paragraph } from '../../Paragraph';
import type { InputPropsI, InputRef } from '../model';
import { useInput } from '../api';

export const Input = forwardRef<InputRef, InputPropsI>((props, ref) => {
  const { className, name, placeholder } = props;
  const { value, inputRef, errors, isDirty, dynamicType, handleChange } =
    useInput(ref, props);
  // Служебный ref для самого <input/>

  return (
    <div
      className={`inputWrapper ${className || ''} ${isDirty.current && Object.values(errors.current).length ? 'inputWrapper_invalid' : ''}`}
    >
      <input
        ref={inputRef}
        type={dynamicType}
        name={name}
        placeholder=" "
        className={`inputWrapper__input input ${value ? 'input_filled' : ''}`}
        value={value}
        onChange={handleChange}
      />
      <label
        htmlFor={name}
        className={'inputWrapper__label label'}
      >
        {placeholder}
      </label>
      {isDirty.current && Object.values(errors.current).length !== 0 && (
        <Paragraph
          level={4}
          mode="error"
          className={'inputWrapper__error'}
        >
          {Object.values(errors.current)?.[0]}
        </Paragraph>
      )}
    </div>
  );
});
