import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as Keychain from 'react-native-keychain';
import { useLocalStorageInitialization } from '@src/App/useLocalStorageInitiation';
import { initializeLocalStorage } from '@modules/core';

jest.mock('react-native-keychain');
jest.mock('@modules/core', () => ({
  initializeLocalStorage: jest.fn(),
}));

const mockGetRandomValues = jest.fn((arr: Uint8Array) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = i + 65;
  }
  return arr;
});

Object.defineProperty(global, 'crypto', {
  value: { getRandomValues: mockGetRandomValues },
  writable: true,
});

const KEYCHAIN_KEY = 'LOCAL_STORAGE_ENCRYPTION_KEY';
const mockKey = 'test-encryption-key';

const setupMocks = () => {
  jest.clearAllMocks();
  mockGetRandomValues.mockClear();
};

const mockKeychainGet = (value: unknown) =>
  (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(value as never);

const mockKeychainSet = () =>
  (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true as never);

describe('useLocalStorageInitialization - Key retrieval', () => {
  beforeEach(setupMocks);

  test('should use existing key from keychain', async () => {
    mockKeychainGet({
      username: 'localStorageEncryptionKey',
      password: mockKey,
      service: KEYCHAIN_KEY,
    });

    const { result } = renderHook(() => useLocalStorageInitialization());

    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
    expect(initializeLocalStorage).toHaveBeenCalledWith(mockKey);
  });

  test('should generate key when keychain is empty', async () => {
    mockKeychainGet(false);
    mockKeychainSet();

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => expect(result.current).toBe(true));
    expect(mockGetRandomValues).toHaveBeenCalled();
  });

  test('should generate key when password is missing', async () => {
    mockKeychainGet({
      username: 'localStorageEncryptionKey',
      password: '',
      service: KEYCHAIN_KEY,
    });
    mockKeychainSet();

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => expect(result.current).toBe(true));
    expect(mockGetRandomValues).toHaveBeenCalled();
  });
});

describe('useLocalStorageInitialization - Error handling', () => {
  beforeEach(setupMocks);

  test('should handle keychain get error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(
      new Error('Keychain error') as never,
    );
    mockKeychainSet();

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => expect(result.current).toBe(true));
    expect(spy).toHaveBeenCalledWith(
      '## useLocalStorageInitialization:: Error getting encryption key',
      expect.any(Error),
    );
    spy.mockRestore();
  });

  test('should handle keychain set error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockKeychainGet(false);
    (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(
      new Error('Keychain set error') as never,
    );

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => expect(result.current).toBe(true));
    expect(initializeLocalStorage).toHaveBeenCalledWith(null);
    spy.mockRestore();
  });
});

describe('useLocalStorageInitialization - State management', () => {
  beforeEach(setupMocks);

  test('should return false initially then true', async () => {
    mockKeychainGet({
      username: 'localStorageEncryptionKey',
      password: mockKey,
      service: KEYCHAIN_KEY,
    });

    const { result } = renderHook(() => useLocalStorageInitialization());

    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
  });

  test('should generate 16-character key', async () => {
    mockKeychainGet(false);
    mockKeychainSet();

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => expect(result.current).toBe(true));

    const setCall = (Keychain.setGenericPassword as jest.Mock).mock.calls[0];
    expect(setCall[1]).toHaveLength(16);
  });
});
