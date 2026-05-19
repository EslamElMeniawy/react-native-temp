import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import {
  registerUserServiceDependencies,
  removeLocalStorageUserData,
  removeReduxUserData,
  removeUserData,
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

describe('UserUtils - removeLocalStorageUserData', () => {
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
  });

  test('should remove user from local storage', () => {
    removeLocalStorageUserData();
    expect(mockDeps.removeUser).toHaveBeenCalled();
  });

  test('should remove unread notifications count from local storage', () => {
    removeLocalStorageUserData();
    expect(mockDeps.removeUnreadNotificationsCount).toHaveBeenCalled();
  });

  test('should remove api token from local storage', () => {
    removeLocalStorageUserData();
    expect(mockDeps.removeApiToken).toHaveBeenCalled();
  });

  test('should remove FCM token from local storage', () => {
    removeLocalStorageUserData();
    expect(mockDeps.removeFcmToken).toHaveBeenCalled();
  });

  test('should log the operation', () => {
    removeLocalStorageUserData();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeLocalStorageUserData'),
    );
  });
});

describe('UserUtils - removeReduxUserData', () => {
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
  });

  test('should dispatch removeUser action', () => {
    removeReduxUserData();
    expect(mockDeps.dispatchRemoveUser).toHaveBeenCalled();
  });

  test('should dispatch removeUnreadNotificationsCount action', () => {
    removeReduxUserData();
    expect(mockDeps.dispatchRemoveUnreadNotificationsCount).toHaveBeenCalled();
  });

  test('should dispatch removeApiToken action', () => {
    removeReduxUserData();
    expect(mockDeps.dispatchRemoveApiToken).toHaveBeenCalled();
  });

  test('should log the operation', () => {
    removeReduxUserData();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeReduxUserData'),
    );
  });
});

describe('UserUtils - removeUserData - Basic', () => {
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should remove local storage user data', async () => {
    await removeUserData();
    expect(mockDeps.removeUser).toHaveBeenCalled();
  });

  test('should remove Redux user data', async () => {
    await removeUserData();
    expect(mockDeps.dispatchRemoveUser).toHaveBeenCalled();
  });

  test('should delete FCM token', async () => {
    await removeUserData();
    expect(mockDeps.deleteMessagingToken).toHaveBeenCalled();
  });
});

describe('UserUtils - removeUserData - Advanced', () => {
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should call onFinish callback when provided', async () => {
    const onFinish = jest.fn();
    await removeUserData(onFinish);
    expect(onFinish).toHaveBeenCalled();
  });

  test('should handle deleteToken error gracefully', async () => {
    const error = new Error('Failed to delete token');
    (mockDeps.deleteMessagingToken as jest.Mock).mockRejectedValue(
      error as never,
    );
    await removeUserData();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('deleteToken Error'),
      error,
    );
  });

  test('should call onFinish even when deleteToken fails', async () => {
    const onFinish = jest.fn();
    (mockDeps.deleteMessagingToken as jest.Mock).mockRejectedValue(
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
