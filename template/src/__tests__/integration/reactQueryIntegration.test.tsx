/**
 * Integration test: React Query (TanStack Query) with mocked HTTP layer.
 *
 * Tests that QueryClient, useQuery, and useMutation work correctly
 * with a real QueryClient instance and mocked axios responses.
 * Catches breaking changes in React Query APIs after upgrades.
 */
import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import * as React from 'react';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe('React Query Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
    queryClient.unmount();
  });

  describe('QueryClient', () => {
    it('creates with default options', () => {
      const client = new QueryClient({
        defaultOptions: {
          queries: { networkMode: 'always' },
          mutations: { networkMode: 'always' },
        },
      });

      expect(client).toBeDefined();
      expect(client.getDefaultOptions().queries?.networkMode).toBe('always');
      expect(client.getDefaultOptions().mutations?.networkMode).toBe('always');
    });

    it('can set and get query data imperatively', () => {
      queryClient.setQueryData(['test'], { value: 42 });
      const data = queryClient.getQueryData(['test']);
      expect(data).toEqual({ value: 42 });
    });

    it('can invalidate queries', async () => {
      queryClient.setQueryData(['users'], [{ id: 1 }]);
      await queryClient.invalidateQueries({ queryKey: ['users'] });

      const state = queryClient.getQueryState(['users']);
      expect(state?.isInvalidated).toBe(true);
    });

    it('can cancel queries', async () => {
      await expect(
        queryClient.cancelQueries({ queryKey: ['anything'] }),
      ).resolves.toBeUndefined();
    });

    it('clear() removes all cached data', () => {
      queryClient.setQueryData(['a'], 1);
      queryClient.setQueryData(['b'], 2);
      queryClient.clear();

      expect(queryClient.getQueryData(['a'])).toBeUndefined();
      expect(queryClient.getQueryData(['b'])).toBeUndefined();
    });
  });

  describe('useQuery', () => {
    it('fetches data with a query function', async () => {
      const mockFn = jest
        .fn<() => Promise<{ name: string }>>()
        .mockResolvedValue({ name: 'test' });

      const { result } = await renderHook(
        () => useQuery({ queryKey: ['user'], queryFn: mockFn }),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({ name: 'test' });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('reports error state on fetch failure', async () => {
      const mockFn = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error('Network Error'));

      const { result } = await renderHook(
        () => useQuery({ queryKey: ['failing'], queryFn: mockFn }),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe('Network Error');
    });

    it('uses cached data on subsequent renders', async () => {
      const mockFn = jest.fn<() => Promise<number>>().mockResolvedValue(42);

      // First render
      const { result, unmount } = await renderHook(
        () => useQuery({ queryKey: ['cached'], queryFn: mockFn }),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      await unmount();

      // Second render - should use cache
      const { result: result2 } = await renderHook(
        () => useQuery({ queryKey: ['cached'], queryFn: mockFn }),
        { wrapper: createWrapper(queryClient) },
      );

      // Data is immediately available from cache
      expect(result2.current.data).toBe(42);
    });

    it('supports enabled option to skip fetching', async () => {
      const mockFn = jest.fn<() => Promise<string>>().mockResolvedValue('data');

      const { result } = await renderHook(
        () =>
          useQuery({ queryKey: ['disabled'], queryFn: mockFn, enabled: false }),
        { wrapper: createWrapper(queryClient) },
      );

      // Should not fetch
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('useMutation', () => {
    it('executes mutation and returns data', async () => {
      const mockMutationFn = jest
        .fn<(data: { name: string }) => Promise<{ id: number; name: string }>>()
        .mockImplementation(async data => ({ id: 1, ...data }));

      const { result } = await renderHook(
        () => useMutation({ mutationFn: mockMutationFn }),
        { wrapper: createWrapper(queryClient) },
      );

      await act(async () => {
        result.current.mutate({ name: 'test' });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({ id: 1, name: 'test' });
    });

    it('reports error on mutation failure', async () => {
      const mockMutationFn = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error('Server Error'));

      const { result } = await renderHook(
        () => useMutation({ mutationFn: mockMutationFn }),
        { wrapper: createWrapper(queryClient) },
      );

      await act(async () => {
        result.current.mutate(undefined);
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect((result.current.error as Error).message).toBe('Server Error');
    });

    it('supports onSuccess callback', async () => {
      const onSuccess = jest.fn();
      const mockMutationFn = jest
        .fn<() => Promise<string>>()
        .mockResolvedValue('done');

      const { result } = await renderHook(
        () => useMutation({ mutationFn: mockMutationFn, onSuccess }),
        { wrapper: createWrapper(queryClient) },
      );

      await act(async () => {
        result.current.mutate(undefined);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(onSuccess).toHaveBeenCalledWith(
        'done',
        undefined,
        undefined,
        expect.objectContaining({ client: expect.anything() }),
      );
    });

    it('mutateAsync returns a promise', async () => {
      const mockMutationFn = jest
        .fn<(v: number) => Promise<number>>()
        .mockImplementation(async v => v * 2);

      const { result } = await renderHook(
        () => useMutation({ mutationFn: mockMutationFn }),
        { wrapper: createWrapper(queryClient) },
      );

      let mutationResult: number | undefined;
      await act(async () => {
        mutationResult = await result.current.mutateAsync(5);
      });

      expect(mutationResult).toBe(10);
    });
  });
});
