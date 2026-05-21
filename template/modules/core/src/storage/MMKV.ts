import {
  createMMKV,
} from 'react-native-mmkv';
import type { LocalStorageKeys } from '@modules/core';
import { StorageError, StorageErrorCode } from '@modules/core/src/errors';
import type { MMKV } from 'react-native-mmkv';

const getLogMessage = (message: string) => `## LocalStorage:: ${message}`;

export let localStorage: MMKV | null = null;

export const initializeLocalStorage = (encryptionKey?: string | null) => {
  localStorage = createMMKV({
    id: 'TempAppStorage',
    encryptionKey: encryptionKey ?? undefined,
  });
};

export const setLocalStorageString = (key: LocalStorageKeys, value: string) => {
  console.info(getLogMessage('setLocalStorageString'), key, value);

  try {
    localStorage?.set(key, value);
  } catch (error) {
    throw new StorageError(
      `Failed to write string for key "${key}"`,
      StorageErrorCode.WRITE_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const getLocalStorageString = (key: LocalStorageKeys) => {
  console.info(getLogMessage('getLocalStorageString'), key);

  try {
    return localStorage?.getString(key);
  } catch (error) {
    throw new StorageError(
      `Failed to read string for key "${key}"`,
      StorageErrorCode.READ_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const setLocalStorageBoolean = (
  key: LocalStorageKeys,
  value: boolean,
) => {
  console.info(getLogMessage('setLocalStorageBoolean'), key, value);

  try {
    localStorage?.set(key, value);
  } catch (error) {
    throw new StorageError(
      `Failed to write boolean for key "${key}"`,
      StorageErrorCode.WRITE_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const getLocalStorageBoolean = (key: LocalStorageKeys) => {
  console.info(getLogMessage('getLocalStorageBoolean'), key);

  try {
    return localStorage?.getBoolean(key);
  } catch (error) {
    throw new StorageError(
      `Failed to read boolean for key "${key}"`,
      StorageErrorCode.READ_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const setLocalStorageNumber = (key: LocalStorageKeys, value: number) => {
  console.info(getLogMessage('setLocalStorageNumber'), key, value);

  try {
    localStorage?.set(key, value);
  } catch (error) {
    throw new StorageError(
      `Failed to write number for key "${key}"`,
      StorageErrorCode.WRITE_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const getLocalStorageNumber = (key: LocalStorageKeys) => {
  console.info(getLogMessage('getLocalStorageNumber'), key);

  try {
    return localStorage?.getNumber(key);
  } catch (error) {
    throw new StorageError(
      `Failed to read number for key "${key}"`,
      StorageErrorCode.READ_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const deleteLocalStorageItem = (key: LocalStorageKeys) => {
  console.info(getLogMessage('deleteLocalStorageItem'), key);

  try {
    localStorage?.remove(key);
  } catch (error) {
    throw new StorageError(
      `Failed to delete key "${key}"`,
      StorageErrorCode.DELETE_FAILED,
      key,
      error instanceof Error ? error : undefined,
    );
  }
};

export const clearLocalStorage = () => {
  console.info(getLogMessage('clearLocalStorage'));

  try {
    localStorage?.clearAll();
  } catch (error) {
    throw new StorageError(
      'Failed to clear local storage',
      StorageErrorCode.DELETE_FAILED,
      undefined,
      error instanceof Error ? error : undefined,
    );
  }
};
