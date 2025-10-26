import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Loader } from '../../../../entities/loader';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';

const ProtectedRoute: React.FC = () => {
  const { isAuth, isLoading } = useAppSelector((state) => state.authReducer);
  const paths = window.location.pathname.split('/');

  if (isLoading) {
    return <Loader type="global" />;
  }

  if (!isAuth) {
    return paths[paths.length - 1] ? (
      <Navigate to={`/home/${paths[paths.length - 1]}`} />
    ) : (
      <Navigate to="/auth/login" />
    );
  } else if (paths[paths.length - 1]) {
    return <Navigate to={`/conference/${paths[paths.length - 1]}`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
