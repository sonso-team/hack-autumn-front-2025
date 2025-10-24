import { useContext } from 'react';
import { ModalContext } from '../modalContext';
import type { ModalProviderContextI } from '@/shared/types/modal';

export const useModal = (): ModalProviderContextI => {
  return useContext(ModalContext);
};
