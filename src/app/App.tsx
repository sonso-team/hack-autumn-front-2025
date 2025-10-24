import React from 'react';
import RouterProvider from './providers/router';
import LoaderProvider from './providers/LoaderProvider';
import AuthProvider from './providers/AuthProvider';
import StoreProvider from './providers/store';
import ModalProvider from './providers/modal';
import '@/shared/styles/main.scss';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AuthProvider>
        <LoaderProvider>
          <ModalProvider>
            <RouterProvider />
          </ModalProvider>
        </LoaderProvider>
      </AuthProvider>
    </StoreProvider>
  );
};

export default App;
