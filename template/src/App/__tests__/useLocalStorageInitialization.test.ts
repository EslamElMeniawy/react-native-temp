import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as Keychain from 'react-native-keychain';
import { useLocalStorageInitialization } from '@src/App/useLocalStorageInitiation';
import { initializeLocalStorage } from '@modules/core';

jest.mock('react-native-keychain');
jest.mock('@modules/core', () => ({
  initializeLocalStorage: jest.fn(),
}));

// Mock crypto.getRandomValues
const mockGetRandomValues = jest.fn((arr: Uint8Array) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = i + 65; // Fill with ASCII values starting from 'A'
  }
  return arr;
});

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: mockGetRandomValues,
  },
  writable: true,
});

describe('useLocalStorageInitialization', () => {
  const mockEncryptionKey = 'test-encryption-key';
  const KEYCHAIN_KEY = 'LOCAL_STORAGE_ENCRYPTION_KEY';

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetRandomValues.mockClear();
  });

  test('should initialize storage with existing encryption key from keychain', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'localStorageEncryptionKey',
      password: mockEncryptionKey,
      service: KEYCHAIN_KEY,
    } as never);

    const { result } = renderHook(() => useLocalStorageInitialization());

    expect(result.current).toBe(false);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
      service: KEYCHAIN_KEY,
    });
    expect(initializeLocalStorage).toHaveBeenCalledWith(mockEncryptionKey);
  });

  test('should generate new encryption key when keychain is empty', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(
      false as never,
    );
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true as never);

    const { result } = renderHook(() => useLocalStorageInitialization());

    expect(result.current).toBe(false);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(Keychain.getGenericPassword).toHaveBeenCalledWith({
      service: KEYCHAIN_KEY,
    });
    expect(mockGetRandomValues).toHaveBeenCalled();
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'localStorageEncryptionKey',
      expect.any(String),
      { service: KEYCHAIN_KEY },
    );
    expect(initializeLocalStorage).toHaveBeenCalledWith(expect.any(String));
  });

  test('should generate new encryption key when keychain password is missing', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'localStorageEncryptionKey',
      password: '',
      service: KEYCHAIN_KEY,
    } as never);
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true as never);

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(mockGetRandomValues).toHaveBeenCalled();
    expect(Keychain.setGenericPassword).toHaveBeenCalled();
  });

  test('should handle error when getting encryption key from keychain', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(
      new Error('Keychain error') as never,
    );
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true as never);

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '## useLocalStorageInitialization:: Error getting encryption key',
      expect.any(Error),
    );
    expect(mockGetRandomValues).toHaveBeenCalled();
    expect(Keychain.setGenericPassword).toHaveBeenCalled();
    expect(initializeLocalStorage).toHaveBeenCalledWith(expect.any(String));

    consoleErrorSpy.mockRestore();
  });

  test('should handle error when setting encryption key to keychain', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(
      false as never,
    );
    (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(
      new Error('Keychain set error') as never,
    );

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '## useLocalStorageInitialization:: Error setting encryption key',
      expect.any(Error),
    );
    expect(initializeLocalStorage).toHaveBeenCalledWith(null);

    consoleErrorSpy.mockRestore();
  });

  test('should return false initially and true after initialization', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'localStorageEncryptionKey',
      password: mockEncryptionKey,
      service: KEYCHAIN_KEY,
    } as never);

    const { result } = renderHook(() => useLocalStorageInitialization());

    // Initially false
    expect(result.current).toBe(false);

    // After initialization, should be true
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  test('should generate encryption key with correct length', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(
      false as never,
    );
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true as never);

    const { result } = renderHook(() => useLocalStorageInitialization());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    const setPasswordCall = (Keychain.setGenericPassword as jest.Mock).mock
      .calls[0];
    const generatedKey = setPasswordCall[1];

    // Should generate a 16-character key
    expect(generatedKey).toHaveLength(16);
  });
});
