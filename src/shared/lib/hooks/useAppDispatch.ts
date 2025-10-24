import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/shared/types/store';

export const useAppDispatch = (): AppDispatch => {
  return useDispatch<AppDispatch>();
};
