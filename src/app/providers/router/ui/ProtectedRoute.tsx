import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Loader } from '../../../../entities/loader';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { connectRoom } from '../../../../entities/conference/api/conferenceThunks';
import { useAppDispatch } from '../../../../shared/lib/hooks/useAppDispatch';
import { useModal } from '../../../../shared/lib/hooks/useModal';

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { isAuth, isLoading } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  const paths = window.location.pathname.split('/');

  if (isLoading) {
    return <Loader type="global" />;
  }

  const roomConnectNoAuth = async () => {
    try {
      await dispatch(connectRoom({ roomId: paths[paths.length - 1] })).unwrap();
      navigate(`/home/${paths[paths.length - 1]}`);
    } catch (err) {
      navigate(`/auth/login`);
      showModal({
        title: 'Ошибка при подключении к комнате',
        primaryText: 'Понятно',
      });
    }
  };

  const roomConnectAuth = async () => {
    try {
      await dispatch(connectRoom({ roomId: paths[paths.length - 1] })).unwrap();
      navigate(`/conference/${paths[paths.length - 1]}`);
    } catch (err) {
      navigate(`/`);
      showModal({
        title: 'Ошибка при подключении к комнате',
        primaryText: 'Понятно',
      });
    }
  };

  if (!isAuth) {
    if (paths[paths.length - 1]) {
      roomConnectNoAuth();
    } else {
      return <Navigate to="/auth/login" />;
    }
  } else if (paths[paths.length - 1]) {
    roomConnectAuth();
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
