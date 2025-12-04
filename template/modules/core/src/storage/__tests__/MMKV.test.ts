import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { createMMKV } from 'react-native-mmkv';
import {
  clearLocalStorage,
  deleteLocalStorageItem,
  getLocalStorageBoolean,
  getLocalStorageNumber,
  getLocalStorageString,
  initializeLocalStorage,
  LocalStorageKeys,
  setLocalStorageBoolean,
  setLocalStorageNumber,
  setLocalStorageString,
} from '@modules/core';

jest.mock('react-native-mmkv');

const mockMMKVInstance = {
  set: jest.fn(),
  getString: jest.fn(),
  getBoolean: jest.fn(),
  getNumber: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
};

const setupTest = () => {
  jest.clearAllMocks();
  (createMMKV as jest.Mock).mockReturnValue(mockMMKVInstance);
};

const mockConsoleInfo = () =>
  jest.spyOn(console, 'info').mockImplementation(() => {});

describe('MMKV - initializeLocalStorage', () => {
  beforeEach(setupTest);

  test('should initialize with encryption key', () => {
    initializeLocalStorage('test-key');
    expect(createMMKV).toHaveBeenCalledWith({
      id: 'TempAppStorage',
      encryptionKey: 'test-key',
    });
  });

  test('should initialize without encryption key', () => {
    initializeLocalStorage();
    expect(createMMKV).toHaveBeenCalledWith({
      id: 'TempAppStorage',
      encryptionKey: undefined,
    });
  });

  test('should handle null encryption key', () => {
    initializeLocalStorage(null);
    expect(createMMKV).toHaveBeenCalledWith({
      id: 'TempAppStorage',
      encryptionKey: undefined,
    });
  });
});

describe('MMKV - String operations', () => {
  beforeEach(setupTest);

  test('should set string value', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    setLocalStorageString(LocalStorageKeys.LANGUAGE, 'en');

    expect(mockMMKVInstance.set).toHaveBeenCalledWith(
      LocalStorageKeys.LANGUAGE,
      'en',
    );
    spy.mockRestore();
  });

  test('should get string value', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    mockMMKVInstance.getString.mockReturnValue('en');

    const result = getLocalStorageString(LocalStorageKeys.LANGUAGE);

    expect(mockMMKVInstance.getString).toHaveBeenCalledWith(
      LocalStorageKeys.LANGUAGE,
    );
    expect(result).toBe('en');
    spy.mockRestore();
  });
});

describe('MMKV - Boolean operations', () => {
  beforeEach(setupTest);

  test('should set boolean value', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    setLocalStorageBoolean(LocalStorageKeys.USER, true);

    expect(mockMMKVInstance.set).toHaveBeenCalledWith(
      LocalStorageKeys.USER,
      true,
    );
    spy.mockRestore();
  });

  test('should get boolean value', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    mockMMKVInstance.getBoolean.mockReturnValue(true);

    const result = getLocalStorageBoolean(LocalStorageKeys.USER);

    expect(mockMMKVInstance.getBoolean).toHaveBeenCalledWith(
      LocalStorageKeys.USER,
    );
    expect(result).toBe(true);
    spy.mockRestore();
  });
});

describe('MMKV - Number operations', () => {
  beforeEach(setupTest);

  test('should set number value', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    setLocalStorageNumber(LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT, 123);

    expect(mockMMKVInstance.set).toHaveBeenCalledWith(
      LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
      123,
    );
    spy.mockRestore();
  });

  test('should get number value', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    mockMMKVInstance.getNumber.mockReturnValue(123);

    const result = getLocalStorageNumber(
      LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
    );

    expect(mockMMKVInstance.getNumber).toHaveBeenCalledWith(
      LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
    );
    expect(result).toBe(123);
    spy.mockRestore();
  });
});

describe('MMKV - Storage management', () => {
  beforeEach(setupTest);

  test('should delete item', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    deleteLocalStorageItem(LocalStorageKeys.LANGUAGE);

    expect(mockMMKVInstance.remove).toHaveBeenCalledWith(
      LocalStorageKeys.LANGUAGE,
    );
    spy.mockRestore();
  });

  test('should clear all items', () => {
    const spy = mockConsoleInfo();
    initializeLocalStorage();
    clearLocalStorage();

    expect(mockMMKVInstance.clearAll).toHaveBeenCalled();
    spy.mockRestore();
  });
});
