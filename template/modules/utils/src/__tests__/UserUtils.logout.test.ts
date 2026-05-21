import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import {
  registerUserServiceDependencies,
  removeUserDataLogout,
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

describe('UserUtils - removeUserDataLogout - Basic', () => {
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should remove local storage user data', async () => {
    await removeUserDataLogout();
    expect(mockDeps.removeUser).toHaveBeenCalled();
  });

  test('should remove Redux user data', async () => {
    await removeUserDataLogout();
    expect(mockDeps.dispatchRemoveUser).toHaveBeenCalled();
  });

  test('should cancel all queries', async () => {
    await removeUserDataLogout();
    expect(mockDeps.cancelQueries).toHaveBeenCalled();
  });

  test('should clear query client', async () => {
    await removeUserDataLogout();
    expect(mockDeps.clearQueryCache).toHaveBeenCalled();
  });

  test('should reset navigation to login screen', async () => {
    await removeUserDataLogout();
    expect(mockDeps.resetNavigation).toHaveBeenCalledWith('login');
  });
});

describe('UserUtils - removeUserDataLogout - Advanced', () => {
  let mockDeps: UserServiceDependencies;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeps = createMockDeps();
    registerUserServiceDependencies(mockDeps);
    console.info = jest.fn();
    console.error = jest.fn();
  });

  test('should handle cancelQueries error gracefully', async () => {
    const error = new Error('Failed to cancel queries');
    (mockDeps.cancelQueries as jest.Mock).mockRejectedValue(error as never);
    await removeUserDataLogout();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('cancelQueries Error'),
      error,
    );
  });

  test('should clear query client even when cancelQueries fails', async () => {
    (mockDeps.cancelQueries as jest.Mock).mockRejectedValue(
      new Error('Cancel error') as never,
    );
    await removeUserDataLogout();
    expect(mockDeps.clearQueryCache).toHaveBeenCalled();
  });

  test('should reset navigation even when cancelQueries fails', async () => {
    (mockDeps.cancelQueries as jest.Mock).mockRejectedValue(
      new Error('Cancel error') as never,
    );
    await removeUserDataLogout();
    expect(mockDeps.resetNavigation).toHaveBeenCalledWith('login');
  });

  test('should log the operation', async () => {
    await removeUserDataLogout();
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('removeUserDataLogout'),
    );
  });
});
