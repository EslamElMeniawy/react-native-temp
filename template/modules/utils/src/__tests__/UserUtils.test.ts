import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import type { User } from '@modules/core';
import {
  registerUserServiceDependencies,
  saveUserData,
  saveApiToken,
  saveUserDataOpenHome,
} from '@modules/utils/src';
import type { UserServiceDependencies } from '@modules/utils/src/userServiceDependencies';

const createMockDeps = (): UserServiceDependencies => ({
  setUser: jest.fn(),
  removeUser: jest.fn(),
  setApiToken: jest.fn(),
  removeApiToken: jest.fn(),
  removeUnreadNotificationsCount: jest.fn(),
  removeFcmToken: jest.fn(),
  dispatchSetUser: jest.fn(),
  dispatchSetApiToken: jest.fn(),
  dispatchRemoveUser: jest.fn(),
  dispatchRemoveApiToken: jest.fn(),
  dispatchRemoveUnreadNotificationsCount: jest.fn(),
  resetNavigation: jest.fn(),
  deleteMessagingToken: jest.fn<() => Promise<void>>().mockResolvedValue(),
  cancelQueries: jest.fn<() => Promise<void>>().mockResolvedValue(),
  clearQueryCache: jest.fn(),
});

describe('UserUtils - Storage - saveUserData', () => {
  const mockUser: User = {
    id: 123,
    name: 'Test User',
    email: 'test@example.com',
  };
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
  });

  test('should save user to local storage', () => {
    saveUserData(mockUser);
    expect(mockDeps.setUser).toHaveBeenCalledWith(mockUser);
  });

  test('should dispatch setUser action to Redux store', () => {
    saveUserData(mockUser);
    expect(mockDeps.dispatchSetUser).toHaveBeenCalledWith(mockUser);
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
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
  });

  test('should save api token to local storage', () => {
    saveApiToken(mockApiToken);
    expect(mockDeps.setApiToken).toHaveBeenCalledWith(mockApiToken);
  });

  test('should dispatch setApiToken action to Redux store', () => {
    saveApiToken(mockApiToken);
    expect(mockDeps.dispatchSetApiToken).toHaveBeenCalledWith(mockApiToken);
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
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
  });

  test('should save user data', () => {
    saveUserDataOpenHome(mockUser, mockApiToken);
    expect(mockDeps.setUser).toHaveBeenCalledWith(mockUser);
  });

  test('should save api token', () => {
    saveUserDataOpenHome(mockUser, mockApiToken);
    expect(mockDeps.setApiToken).toHaveBeenCalledWith(mockApiToken);
  });

  test('should reset navigation to home screen', () => {
    saveUserDataOpenHome(mockUser, mockApiToken);
    expect(mockDeps.resetNavigation).toHaveBeenCalledWith('home');
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
