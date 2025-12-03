import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { createMMKV } from 'react-native-mmkv';
import {
  initializeLocalStorage,
  setLocalStorageString,
  getLocalStorageString,
  setLocalStorageBoolean,
  getLocalStorageBoolean,
  setLocalStorageNumber,
  getLocalStorageNumber,
  deleteLocalStorageItem,
  clearLocalStorage,
  LocalStorageKeys,
} from '@modules/core';

jest.mock('react-native-mmkv');

describe('MMKV Storage', () => {
  const mockMMKVInstance = {
    set: jest.fn(),
    getString: jest.fn(),
    getBoolean: jest.fn(),
    getNumber: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createMMKV as jest.Mock).mockReturnValue(mockMMKVInstance);
  });

  describe('initializeLocalStorage', () => {
    test('should initialize storage with encryption key', () => {
      const encryptionKey = 'test-encryption-key';

      initializeLocalStorage(encryptionKey);

      expect(createMMKV).toHaveBeenCalledWith({
        id: 'TempAppStorage',
        encryptionKey: encryptionKey,
      });
    });

    test('should initialize storage without encryption key when not provided', () => {
      initializeLocalStorage();

      expect(createMMKV).toHaveBeenCalledWith({
        id: 'TempAppStorage',
        encryptionKey: undefined,
      });
    });

    test('should initialize storage without encryption key when null is provided', () => {
      initializeLocalStorage(null);

      expect(createMMKV).toHaveBeenCalledWith({
        id: 'TempAppStorage',
        encryptionKey: undefined,
      });
    });

    test('should initialize storage without encryption key when empty string is provided', () => {
      initializeLocalStorage('');

      expect(createMMKV).toHaveBeenCalledWith({
        id: 'TempAppStorage',
        encryptionKey: '',
      });
    });
  });

  describe('setLocalStorageString', () => {
    test('should set string value in storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      setLocalStorageString(LocalStorageKeys.LANGUAGE, 'en');

      expect(mockMMKVInstance.set).toHaveBeenCalledWith(
        LocalStorageKeys.LANGUAGE,
        'en',
      );
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: setLocalStorageString',
        LocalStorageKeys.LANGUAGE,
        'en',
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('getLocalStorageString', () => {
    test('should get string value from storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      mockMMKVInstance.getString.mockReturnValue('en');

      const result = getLocalStorageString(LocalStorageKeys.LANGUAGE);

      expect(mockMMKVInstance.getString).toHaveBeenCalledWith(
        LocalStorageKeys.LANGUAGE,
      );
      expect(result).toBe('en');
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: getLocalStorageString',
        LocalStorageKeys.LANGUAGE,
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('setLocalStorageBoolean', () => {
    test('should set boolean value in storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      setLocalStorageBoolean(LocalStorageKeys.USER, true);

      expect(mockMMKVInstance.set).toHaveBeenCalledWith(
        LocalStorageKeys.USER,
        true,
      );
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: setLocalStorageBoolean',
        LocalStorageKeys.USER,
        true,
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('getLocalStorageBoolean', () => {
    test('should get boolean value from storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      mockMMKVInstance.getBoolean.mockReturnValue(true);

      const result = getLocalStorageBoolean(LocalStorageKeys.USER);

      expect(mockMMKVInstance.getBoolean).toHaveBeenCalledWith(
        LocalStorageKeys.USER,
      );
      expect(result).toBe(true);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: getLocalStorageBoolean',
        LocalStorageKeys.USER,
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('setLocalStorageNumber', () => {
    test('should set number value in storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      setLocalStorageNumber(LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT, 123);

      expect(mockMMKVInstance.set).toHaveBeenCalledWith(
        LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
        123,
      );
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: setLocalStorageNumber',
        LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
        123,
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('getLocalStorageNumber', () => {
    test('should get number value from storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      mockMMKVInstance.getNumber.mockReturnValue(123);

      const result = getLocalStorageNumber(
        LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
      );

      expect(mockMMKVInstance.getNumber).toHaveBeenCalledWith(
        LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
      );
      expect(result).toBe(123);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: getLocalStorageNumber',
        LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('deleteLocalStorageItem', () => {
    test('should delete item from storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      deleteLocalStorageItem(LocalStorageKeys.LANGUAGE);

      expect(mockMMKVInstance.remove).toHaveBeenCalledWith(
        LocalStorageKeys.LANGUAGE,
      );
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: deleteLocalStorageItem',
        LocalStorageKeys.LANGUAGE,
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('clearLocalStorage', () => {
    test('should clear all items from storage', () => {
      const consoleInfoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      initializeLocalStorage();
      clearLocalStorage();

      expect(mockMMKVInstance.clearAll).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '## LocalStorage:: clearLocalStorage',
      );

      consoleInfoSpy.mockRestore();
    });
  });
});
