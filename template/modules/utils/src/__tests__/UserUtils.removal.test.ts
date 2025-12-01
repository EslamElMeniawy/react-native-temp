import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import {
  UnreadNotificationsCountLocalStorage,
  FcmTokenLocalStorage,
} from '@modules/features-notifications';
import { UserLocalStorage, UserStore } from '@modules/features-profile';
import { store } from '@modules/store';
import { getMessaging, deleteToken } from '@react-native-firebase/messaging';
import {
  removeLocalStorageUserData,
  removeReduxUserData,
  removeUserData,
} from '@modules/utils/src/UserUtils';

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
    setUser: jest.fn(),
    removeUser: jest.fn(),
  },

  ['UserStore']: {
    setUser: jest.fn(() => ({ type: 'user/setUser' })),
    setApiToken: jest.fn(() => ({ type: 'user/setApiToken' })),
    removeUser: jest.fn(() => ({ type: 'user/removeUser' })),
    removeUnreadNotificationsCount: jest.fn(() => ({
      type: 'user/removeUnreadNotificationsCount',
    })),
    removeApiToken: jest.fn(() => ({ type: 'user/removeApiToken' })),
    setUnreadNotificationsCount: jest.fn(() => ({
      type: 'user/setUnreadNotificationsCount',
    })),
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
  getMessaging: jest.fn(),
  deleteToken: jest.fn<() => Promise<void>>(),
}));

jest.mock('@modules/utils', () => ({}));

describe('UserUtils - removeLocalStorageUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.info = jest.fn();
  });

  test('should remove user from local storage', () => {
    removeLocalStorageUserData();
    expect(UserLocalStorage.removeUser).toHaveBeenCalled();
  });

  test('should remove unread notifications count from local storage', () => {
    removeLocalStorageUserData();
    expect(
      UnreadNotificationsCountLocalStorage.removeUnreadNotificationsCount,
    ).toHaveBeenCalled();
  });

  test('should remove api token from local storage', () => {
    removeLocalStorageUserData();
    expect(ApiTokenLocalStorage.removeApiToken).toHaveBeenCalled();
  });

  test('should remove FCM token from local storage', () => {
    removeLocalStorageUserData();
    expect(FcmTokenLocalStorage.removeFcmToken).toHaveBeenCalled();
  });

  test('should log the operation', () => {
    removeLocalStorageUserData();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeLocalStorageUserData'),
    );
  });
});

describe('UserUtils - removeReduxUserData', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    console.info = jest.fn();
  });

  test('should dispatch removeUser action', () => {
    removeReduxUserData();
    expect(mockDispatch).toHaveBeenCalledWith(UserStore.removeUser());
  });

  test('should dispatch removeUnreadNotificationsCount action', () => {
    removeReduxUserData();
    expect(mockDispatch).toHaveBeenCalledWith(
      UserStore.removeUnreadNotificationsCount(),
    );
  });

  test('should dispatch removeApiToken action', () => {
    removeReduxUserData();
    expect(mockDispatch).toHaveBeenCalledWith(UserStore.removeApiToken());
  });

  test('should log the operation', () => {
    removeReduxUserData();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeReduxUserData'),
    );
  });
});

describe('UserUtils - removeUserData - Basic', () => {
  const mockDispatch = jest.fn();
  const mockGetMessaging = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    (getMessaging as jest.Mock).mockReturnValue(mockGetMessaging);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should remove local storage user data', async () => {
    await removeUserData();
    expect(UserLocalStorage.removeUser).toHaveBeenCalled();
  });

  test('should remove Redux user data', async () => {
    await removeUserData();
    expect(mockDispatch).toHaveBeenCalledWith(UserStore.removeUser());
  });

  test('should delete FCM token', async () => {
    (deleteToken as jest.Mock).mockResolvedValue(undefined as never);
    await removeUserData();
    expect(deleteToken).toHaveBeenCalledWith(mockGetMessaging as never);
  });
});

describe('UserUtils - removeUserData - Advanced', () => {
  const mockDispatch = jest.fn();
  const mockGetMessaging = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    (getMessaging as jest.Mock).mockReturnValue(mockGetMessaging);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should call onFinish callback when provided', async () => {
    const onFinish = jest.fn();
    (deleteToken as jest.Mock).mockResolvedValue(undefined as never);
    await removeUserData(onFinish);
    expect(onFinish).toHaveBeenCalled();
  });

  test('should handle deleteToken error gracefully', async () => {
    const error = new Error('Failed to delete token');
    (deleteToken as jest.Mock).mockRejectedValue(error as never);
    await removeUserData();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('deleteToken Error'),
      error,
    );
  });

  test('should call onFinish even when deleteToken fails', async () => {
    const onFinish = jest.fn();
    (deleteToken as jest.Mock).mockRejectedValue(
      new Error('Token error') as never,
    );
    await removeUserData(onFinish);
    expect(onFinish).toHaveBeenCalled();
  });

  test('should log the operation', async () => {
    await removeUserData();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeUserData'),
    );
  });
});
