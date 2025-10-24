import type { PropsWithChildren } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '../model';

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={setupStore()}>{children}</Provider>;
};

export default StoreProvider;
