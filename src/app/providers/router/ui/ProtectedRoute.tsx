import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { Loader } from '../../../../entities/loader';

const ProtectedRoute: React.FC = () => {
  const { isAuth, isLoading } = useAppSelector((state) => state.authReducer);

  if (isLoading) {
    return <Loader type="global" />;
  }

  if (!isAuth) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
