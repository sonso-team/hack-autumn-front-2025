import type { RouteObject } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import ProtectedRoute from '../ui/ProtectedRoute';
import ProfilePage from '@/pages/ProfilePage';

const routes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/lock', element: <h1>Страница с доступом по авторизации</h1> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProfilePage />,
        index: true,
      },
    ],
  },
  {
    element: <h1>Логин</h1>,
    path: '/auth/login',
  },
];

export default routes;
