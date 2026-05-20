import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import * as React from 'react';
import {
  ServiceProvider,
  useHttpClient,
  useLocalStorage,
} from '@modules/core/src/providers/ServiceContext';

import type { AxiosInstance } from 'axios';
import type { PropsWithChildren } from 'react';

describe('ServiceContext', () => {
  const mockHttpClient = { get: jest.fn() } as unknown as AxiosInstance;
  const mockLocalStorage = null;

  const wrapper = ({ children }: PropsWithChildren) => (
    <ServiceProvider
      httpClient={mockHttpClient}
      localStorage={mockLocalStorage}
    >
      {children}
    </ServiceProvider>
  );

  describe('useHttpClient', () => {
    it('returns httpClient from context', async () => {
      const { result } = await renderHook(() => useHttpClient(), { wrapper });
      expect(result.current).toBe(mockHttpClient);
    });
  });

  describe('useLocalStorage', () => {
    it('returns localStorage from context', async () => {
      const { result } = await renderHook(() => useLocalStorage(), { wrapper });
      expect(result.current).toBe(mockLocalStorage);
    });
  });
});
