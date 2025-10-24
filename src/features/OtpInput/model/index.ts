import type React from 'react';

export type OTPInputRef = {
  value: string;
  isValid: boolean;
};

export type OTPInputProps = {
  length?: number;
  onChange: (event?: React.ChangeEvent<HTMLInputElement>) => void;
};
