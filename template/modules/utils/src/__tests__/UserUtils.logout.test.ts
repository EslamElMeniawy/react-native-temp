import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { UserLocalStorage, UserStore } from '@modules/features-profile';
import { reset } from '@modules/navigation';
import { store } from '@modules/store';
import { deleteToken } from '@react-native-firebase/messaging';
import { queryClient } from '@modules/utils';
import { removeUserDataLogout } from '@modules/utils/src/UserUtils';

// Mock all dependencies

jest.mock('@modules/features-auth', () => ({
  ['ApiTokenLocalStorage']: {
    setApiToken: jest.fn(),
    removeApiToken: jest.fn(),
  },
}));

jest.mock('@modules/features-notifications', () => ({
  ['UnreadNotificationsCountLocalStorage']: {
    setUnreadNotificationsCount: jest.fn(),
    removeUnreadNotificationsCount: jest.fn(),
  },

  ['FcmTokenLocalStorage']: {
    removeFcmToken: jest.fn(),
  },
}));

jest.mock('@modules/features-profile', () => ({
  ['UserLocalStorage']: {
    removeUser: jest.fn(),
  },

  ['UserStore']: {
    removeUser: jest.fn(() => ({ type: 'user/removeUser' })),
    removeUnreadNotificationsCount: jest.fn(() => ({
      type: 'user/removeUnreadNotificationsCount',
    })),
    removeApiToken: jest.fn(() => ({ type: 'user/removeApiToken' })),
  },
}));

jest.mock('@modules/navigation', () => ({
  reset: jest.fn(),
}));

jest.mock('@modules/store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/messaging', () => ({
  deleteToken: jest.fn<() => Promise<void>>(),
}));

jest.mock('@modules/utils', () => ({
  queryClient: {
    cancelQueries: jest.fn<() => Promise<void>>(),
    clear: jest.fn(),
  },
}));

describe('UserUtils - removeUserDataLogout - Basic', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    (deleteToken as jest.Mock).mockResolvedValue(undefined as never);
    (queryClient.cancelQueries as jest.Mock).mockResolvedValue(
      undefined as never,
    );
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should remove local storage user data', async () => {
    await removeUserDataLogout();
    expect(UserLocalStorage.removeUser).toHaveBeenCalled();
  });

  test('should remove Redux user data', async () => {
    await removeUserDataLogout();
    expect(mockDispatch).toHaveBeenCalledWith(UserStore.removeUser());
  });

  test('should cancel all queries', async () => {
    await removeUserDataLogout();
    expect(queryClient.cancelQueries).toHaveBeenCalled();
  });

  test('should clear query client', async () => {
    await removeUserDataLogout();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  test('should reset navigation to login screen', async () => {
    await removeUserDataLogout();
    expect(reset).toHaveBeenCalledWith('login');
  });
});

describe('UserUtils - removeUserDataLogout - Advanced', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    (deleteToken as jest.Mock).mockResolvedValue(undefined as never);
    (queryClient.cancelQueries as jest.Mock).mockResolvedValue(
      undefined as never,
    );
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should handle cancelQueries error gracefully', async () => {
    const error = new Error('Failed to cancel queries');
    (queryClient.cancelQueries as jest.Mock).mockRejectedValue(error as never);
    await removeUserDataLogout();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('cancelQueries Error'),
      error,
    );
  });

  test('should clear query client even when cancelQueries fails', async () => {
    (queryClient.cancelQueries as jest.Mock).mockRejectedValue(
      new Error('Cancel error') as never,
    );
    await removeUserDataLogout();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  test('should reset navigation even when cancelQueries fails', async () => {
    (queryClient.cancelQueries as jest.Mock).mockRejectedValue(
      new Error('Cancel error') as never,
    );
    await removeUserDataLogout();
    expect(reset).toHaveBeenCalledWith('login');
  });

  test('should log the operation', async () => {
    await removeUserDataLogout();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeUserDataLogout'),
    );
  });
});
