import * as React from 'react';

import type { AxiosInstance } from 'axios';
import type { PropsWithChildren } from 'react';
import type { MMKV } from 'react-native-mmkv';

export interface ServiceContextValue {
  httpClient: AxiosInstance;
  localStorage: MMKV | null;
}

const ServiceContext = React.createContext<ServiceContextValue | null>(null);

interface ServiceProviderProps {
  httpClient: AxiosInstance;
  localStorage: MMKV | null;
}

export const ServiceProvider = ({
  httpClient,
  localStorage,
  children,
}: PropsWithChildren<ServiceProviderProps>) => {
  const value = React.useMemo(
    () => ({ httpClient, localStorage }),
    [httpClient, localStorage],
  );

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
};

export const useHttpClient = (): AxiosInstance => {
  const context = React.useContext(ServiceContext);

  if (!context) {
    throw new Error('useHttpClient must be used within a ServiceProvider');
  }

  return context.httpClient;
};

export const useLocalStorage = (): MMKV | null => {
  const context = React.useContext(ServiceContext);

  if (!context) {
    throw new Error('useLocalStorage must be used within a ServiceProvider');
  }

  return context.localStorage;
};
