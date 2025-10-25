import React, { forwardRef } from 'react';
import './otp-input.scss';
import type { OTPInputProps, OTPInputRef } from '../model';
import { useOtpInput } from '../api';

export const OtpInput = forwardRef<OTPInputRef, OTPInputProps>(
  ({ length = 6, onChange }, ref) => {
    const { values, handleKeyDown, handleChange, inputsRef } = useOtpInput(
      length,
      ref,
      onChange,
    );

    return (
      <div className="OtpInput">
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) {
                inputsRef.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="OtpInput__input"
          />
        ))}
      </div>
    );
  },
);
