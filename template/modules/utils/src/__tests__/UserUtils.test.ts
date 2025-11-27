import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import {
  UnreadNotificationsCountLocalStorage,
  FcmTokenLocalStorage,
} from '@modules/features-notifications';
import { UserLocalStorage, UserStore } from '@modules/features-profile';
import { reset } from '@modules/navigation';
import { store } from '@modules/store';
import { queryClient } from '@modules/utils';
import {
  saveUserData,
  saveApiToken,
  saveUserDataOpenHome,
  removeLocalStorageUserData,
  removeReduxUserData,
  removeUserData,
  removeUserDataLogout,
} from '@modules/utils/src/UserUtils';
import { getMessaging, deleteToken } from '@react-native-firebase/messaging';
import type { User } from '@modules/core';

// Mock all dependencies

jest.mock('@modules/features-auth', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ApiTokenLocalStorage: {
    setApiToken: jest.fn(),
    removeApiToken: jest.fn(),
  },
}));

jest.mock('@modules/features-notifications', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  UnreadNotificationsCountLocalStorage: {
    setUnreadNotificationsCount: jest.fn(),
    removeUnreadNotificationsCount: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FcmTokenLocalStorage: {
    removeFcmToken: jest.fn(),
  },
}));

jest.mock('@modules/features-profile', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  UserLocalStorage: {
    setUser: jest.fn(),
    removeUser: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  UserStore: {
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
  deleteToken: jest.fn(),
}));

jest.mock('@modules/utils', () => ({
  queryClient: {
    cancelQueries: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('UserUtils', () => {
  const mockUser: User = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockApiToken = 'mock-api-token-12345';
  const mockDispatch = jest.fn();
  const mockGetMessaging = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    (getMessaging as jest.Mock).mockReturnValue(mockGetMessaging);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  describe('saveUserData', () => {
    test('should save user to local storage', () => {
      saveUserData(mockUser);

      expect(UserLocalStorage.setUser).toHaveBeenCalledWith(mockUser);
    });

    test('should dispatch setUser action to Redux store', () => {
      saveUserData(mockUser);

      expect(mockDispatch).toHaveBeenCalledWith(UserStore.setUser(mockUser));
    });

    test('should log the operation', () => {
      saveUserData(mockUser);

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('saveUserData'),
        mockUser,
      );
    });
  });

  describe('saveApiToken', () => {
    test('should save api token to local storage', () => {
      saveApiToken(mockApiToken);

      expect(ApiTokenLocalStorage.setApiToken).toHaveBeenCalledWith(
        mockApiToken,
      );
    });

    test('should dispatch setApiToken action to Redux store', () => {
      saveApiToken(mockApiToken);

      expect(mockDispatch).toHaveBeenCalledWith(
        UserStore.setApiToken(mockApiToken),
      );
    });

    test('should log the operation', () => {
      saveApiToken(mockApiToken);

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('saveApiToken'),
        mockApiToken,
      );
    });
  });

  describe('saveUserDataOpenHome', () => {
    test('should save user data', () => {
      saveUserDataOpenHome(mockUser, mockApiToken);

      expect(UserLocalStorage.setUser).toHaveBeenCalledWith(mockUser);
    });

    test('should save api token', () => {
      saveUserDataOpenHome(mockUser, mockApiToken);

      expect(ApiTokenLocalStorage.setApiToken).toHaveBeenCalledWith(
        mockApiToken,
      );
    });

    test('should reset navigation to home screen', () => {
      saveUserDataOpenHome(mockUser, mockApiToken);

      expect(reset).toHaveBeenCalledWith('home');
    });

    test('should log the operation', () => {
      saveUserDataOpenHome(mockUser, mockApiToken);

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('saveUserDataOpenHome'),
        mockUser,
        mockApiToken,
      );
    });
  });

  describe('removeLocalStorageUserData', () => {
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

  describe('removeReduxUserData', () => {
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

  describe('removeUserData', () => {
    test('should remove local storage user data', async () => {
      await removeUserData();

      expect(UserLocalStorage.removeUser).toHaveBeenCalled();
    });

    test('should remove Redux user data', async () => {
      await removeUserData();

      expect(mockDispatch).toHaveBeenCalledWith(UserStore.removeUser());
    });

    test('should delete FCM token', async () => {
      (deleteToken as jest.Mock).mockResolvedValue(undefined);

      await removeUserData();

      expect(deleteToken).toHaveBeenCalledWith(mockGetMessaging);
    });

    test('should call onFinish callback when provided', async () => {
      const onFinish = jest.fn();
      (deleteToken as jest.Mock).mockResolvedValue(undefined);

      await removeUserData(onFinish);

      expect(onFinish).toHaveBeenCalled();
    });

    test('should handle deleteToken error gracefully', async () => {
      const error = new Error('Failed to delete token');
      (deleteToken as jest.Mock).mockRejectedValue(error);

      await removeUserData();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('deleteToken Error'),
        error,
      );
    });

    test('should call onFinish even when deleteToken fails', async () => {
      const onFinish = jest.fn();
      (deleteToken as jest.Mock).mockRejectedValue(new Error('Token error'));

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

  describe('removeUserDataLogout', () => {
    beforeEach(() => {
      (deleteToken as jest.Mock).mockResolvedValue(undefined);
      (queryClient.cancelQueries as jest.Mock).mockResolvedValue(undefined);
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

    test('should handle cancelQueries error gracefully', async () => {
      const error = new Error('Failed to cancel queries');
      (queryClient.cancelQueries as jest.Mock).mockRejectedValue(error);

      await removeUserDataLogout();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('cancelQueries Error'),
        error,
      );
    });

    test('should clear query client even when cancelQueries fails', async () => {
      (queryClient.cancelQueries as jest.Mock).mockRejectedValue(
        new Error('Cancel error'),
      );

      await removeUserDataLogout();

      expect(queryClient.clear).toHaveBeenCalled();
    });

    test('should reset navigation even when cancelQueries fails', async () => {
      (queryClient.cancelQueries as jest.Mock).mockRejectedValue(
        new Error('Cancel error'),
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
});
