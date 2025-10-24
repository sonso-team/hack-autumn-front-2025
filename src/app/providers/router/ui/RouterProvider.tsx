import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from '../config/routes.tsx';

const AppRoutes = () => useRoutes(routes);

const RouterProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default RouterProvider;
