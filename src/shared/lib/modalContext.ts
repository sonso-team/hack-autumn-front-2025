import { createContext } from 'react';
import type { ModalProviderContextI } from '@/shared/types/modal';

export const ModalContext = createContext<ModalProviderContextI | undefined>(
  undefined,
);
