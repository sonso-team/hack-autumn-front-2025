import ProfilePage from '@/pages/ProfilePage';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import AuthPage from '../../../../pages/AuthPage/ui';
import ConferencePage from '../../../../pages/ConferencePage';
import ProtectedRoute from '../ui/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import WelcomePage from '../../../../pages/WelcomePage';

const routes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [{ element: <HomePage />, path: '/*' }],
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        element: <WelcomePage />,
        path: '/home/*',
      },
      {
        element: <ProfilePage />,
        path: '/profile/*',
      },
      {
        element: <AuthPage />,
        path: '/auth/*',
      },
      {
        element: <ConferencePage />,
        path: '/conference/*',
      },
    ],
  },
];

export default routes;
