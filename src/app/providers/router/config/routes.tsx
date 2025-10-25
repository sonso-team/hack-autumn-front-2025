import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../ui/ProtectedRoute';
import MainLayout from '../../../../layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import WipPage from '@/pages/WipPage';

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
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: '/wip',
        element: <WipPage />,
      },
    ],
  },
  {
    element: <h1>Логин</h1>,
    path: '/auth/login',
  },
];

export default routes;
