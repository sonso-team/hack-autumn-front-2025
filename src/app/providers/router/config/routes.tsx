import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import AuthPage from '../../../../pages/AuthPage/ui';
import ConferencePage from '../../../../pages/ConferencePage';
import ProtectedRoute from '../ui/ProtectedRoute';

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
        element: <HomePage />,
        index: true,
      },
      {
        element: <ProfilePage />,
        path: '/profile/*'
      },
      {
        element: <AuthPage />,
        path: '/auth/*'
      },
      {
        element: <ConferencePage />,
        path: '/conference/*'
      }
    ],
  },
];

export default routes;
