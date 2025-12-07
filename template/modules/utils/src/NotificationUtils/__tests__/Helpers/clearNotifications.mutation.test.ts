import { test, expect, jest, describe, beforeEach } from '@jest/globals';
import notifee from '@notifee/react-native';
import { queryClient } from '@modules/utils';
import { clearNotifications } from '@modules/utils/src/NotificationUtils/Helpers';

import type { QueryClient } from '@tanstack/react-query';

// Mock dependencies
jest.mock('@modules/utils', () => ({
  queryClient: {
    getMutationCache: jest.fn(),
    invalidateQueries: jest.fn(),
  },
}));

jest.mock('react-native-config', () => ({
  ['ENV_NAME']: 'Development',
  ['USE_FAKE_API']: 'true',
}));

const mockCancelLocalNotification = jest.spyOn(notifee, 'cancelNotification');

describe('clearNotifications - Mutation Build and Execute', () => {
  const mockExecute = jest.fn();
  const mockBuild = jest.fn(
    (
      _client: QueryClient,
      _options: {
        mutationFn: (request: unknown) => Promise<unknown>;
        onSuccess: () => void;
      },
    ) => ({ execute: mockExecute }),
  );
  const mockGetMutationCache = jest.fn(() => ({ build: mockBuild }));

  beforeEach(() => {
    jest.clearAllMocks();
    (queryClient.getMutationCache as jest.Mock) = mockGetMutationCache;
  });

  test('should execute mutation when ENV_NAME is not Unit Testing', () => {
    const notification = {
      id: '123',
      key: '123',
      title: 'Test',
      message: 'Test message',
    };

    clearNotifications(notification);

    expect(mockCancelLocalNotification).toHaveBeenCalledWith('123');
    expect(mockGetMutationCache).toHaveBeenCalled();
    expect(mockBuild).toHaveBeenCalledWith(queryClient, expect.any(Object));
    expect(mockExecute).toHaveBeenCalledWith({ pathVar: '123' });
  });
});

describe('clearNotifications - Mutation Configuration', () => {
  const mockExecute = jest.fn();
  const mockBuild = jest.fn(
    (
      _client: QueryClient,
      _options: {
        mutationFn: (request: unknown) => Promise<unknown>;
        onSuccess: () => void;
      },
    ) => ({ execute: mockExecute }),
  );
  const mockGetMutationCache = jest.fn(() => ({ build: mockBuild }));

  beforeEach(() => {
    jest.clearAllMocks();
    (queryClient.getMutationCache as jest.Mock) = mockGetMutationCache;
  });

  test('should configure mutation with correct options', () => {
    const notification = {
      id: '456',
      key: '456',
      title: 'Test',
      message: 'Test message',
    };

    clearNotifications(notification);

    expect(mockBuild).toHaveBeenCalledWith(
      queryClient,
      expect.objectContaining({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );
  });
});

describe('clearNotifications - Mutation Success Callback', () => {
  const mockExecute = jest.fn();
  const mockBuild = jest.fn(
    (
      _client: QueryClient,
      _options: {
        mutationFn: (request: unknown) => Promise<unknown>;
        onSuccess: () => void;
      },
    ) => ({ execute: mockExecute }),
  );
  const mockGetMutationCache = jest.fn(() => ({ build: mockBuild }));

  beforeEach(() => {
    jest.clearAllMocks();
    (queryClient.getMutationCache as jest.Mock) = mockGetMutationCache;
  });

  test('should invalidate notifications queries on mutation success', () => {
    const notification = {
      id: '789',
      key: '789',
      title: 'Test',
      message: 'Test message',
    };

    clearNotifications(notification);

    // Get the onSuccess callback from the build call
    const buildCallArgs = mockBuild.mock.calls[0] as [
      QueryClient,
      {
        mutationFn: (request: unknown) => Promise<unknown>;
        onSuccess: () => void;
      },
    ];
    const mutationOptions = buildCallArgs[1];
    const onSuccess = mutationOptions.onSuccess;

    // Call onSuccess
    onSuccess();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['notifications'],
    });
  });
});
