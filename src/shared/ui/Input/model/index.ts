import type React from 'react';
import type { Validation } from '../../../utils/validator';

export interface InputRef {
  value?: string;
  isDirty?: boolean;
  isValueHidden?: boolean;
  isError?: boolean;
}

export interface InputPropsI {
  initialValue: string;
  type?: string;
  validations?: Validation[] | [];
  name: string;
  mask?: (value: string) => string;
  placeholder: string;
  className?: string;
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  ref: InputRef;
}
