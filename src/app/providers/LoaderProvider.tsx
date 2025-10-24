import type { PropsWithChildren } from 'react';
import React from 'react';
import { useAppSelector } from '../../shared/lib/hooks/useAppSelector';
import { Loader } from '../../entities/loader';

const LoaderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isLoaderLoading } = useAppSelector((state) => state.loaderReducer);
  return (
    <>
      {children}
      {isLoaderLoading && <Loader type="local" />}
    </>
  );
};

export default LoaderProvider;
