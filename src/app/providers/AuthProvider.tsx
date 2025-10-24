import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import type React from 'react';
import { refresh } from '@/entities/session';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(refresh());
  }, []);

  return children;
};

export default AuthProvider;
