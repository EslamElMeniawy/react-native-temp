import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import { UserLocalStorage, UserStore } from '@modules/features-profile';
import { reset } from '@modules/navigation';
import { store } from '@modules/store';
import type { User } from '@modules/core';
import {
  saveUserData,
  saveApiToken,
  saveUserDataOpenHome,
} from '@modules/utils/src/UserUtils';

// Mock all dependencies

jest.mock('@modules/features-auth', () => ({
  ['ApiTokenLocalStorage']: {
    setApiToken: jest.fn(),
  },
}));

jest.mock('@modules/features-notifications', () => ({}));

jest.mock('@modules/features-profile', () => ({
  ['UserLocalStorage']: {
    setUser: jest.fn(),
  },

  ['UserStore']: {
    setUser: jest.fn(() => ({ type: 'user/setUser' })),
    setApiToken: jest.fn(() => ({ type: 'user/setApiToken' })),
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
}));

jest.mock('@modules/utils', () => ({}));

describe('UserUtils - Storage - saveUserData', () => {
  const mockUser: User = {
    id: 123,
    name: 'Test User',
    email: 'test@example.com',
  };
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    console.info = jest.fn();
  });

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

describe('UserUtils - Storage - saveApiToken', () => {
  const mockApiToken = 'mock-api-token-12345';
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (store.dispatch as jest.Mock) = mockDispatch;
    console.info = jest.fn();
  });

  test('should save api token to local storage', () => {
    saveApiToken(mockApiToken);
    expect(ApiTokenLocalStorage.setApiToken).toHaveBeenCalledWith(mockApiToken);
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

describe('UserUtils - Storage - saveUserDataOpenHome', () => {
  const mockUser: User = {
    id: 123,
    name: 'Test User',
    email: 'test@example.com',
  };
  const mockApiToken = 'mock-api-token-12345';

  beforeEach(() => {
    jest.clearAllMocks();
    console.info = jest.fn();
  });

  test('should save user data', () => {
    saveUserDataOpenHome(mockUser, mockApiToken);
    expect(UserLocalStorage.setUser).toHaveBeenCalledWith(mockUser);
  });

  test('should save api token', () => {
    saveUserDataOpenHome(mockUser, mockApiToken);
    expect(ApiTokenLocalStorage.setApiToken).toHaveBeenCalledWith(mockApiToken);
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
