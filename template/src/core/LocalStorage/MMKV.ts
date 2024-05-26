import {
  MMKV,
  useMMKVString,
  useMMKVBoolean,
  useMMKVNumber,
} from 'react-native-mmkv';
import uuid from 'react-native-uuid';
import type {LocalStorageKeys} from '@src/core';

const getLogMessage = (message: string) => `## LocalStorage:: ${message}`;

export const localStorage = new MMKV({
  id: 'TempAppStorage',
  encryptionKey: uuid.v5('TempApp', 'TempApp').toString(),
});

export const setLocalStorageString = (key: LocalStorageKeys, value: string) => {
  console.info(getLogMessage('setLocalStorageString'), key, value);
  localStorage.set(key, value);
};

export const getLocalStorageString = (key: LocalStorageKeys) => {
  console.info(getLogMessage('getLocalStorageString'), key);
  return localStorage.getString(key);
};

export const useLocalStorageString = useMMKVString;

export const setLocalStorageBoolean = (
  key: LocalStorageKeys,
  value: boolean,
) => {
  console.info(getLogMessage('setLocalStorageBoolean'), key, value);
  localStorage.set(key, value);
};

export const getLocalStorageBoolean = (key: LocalStorageKeys) => {
  console.info(getLogMessage('getLocalStorageBoolean'), key);
  return localStorage.getBoolean(key);
};

export const useLocalStorageBoolean = useMMKVBoolean;

export const setLocalStorageNumber = (key: LocalStorageKeys, value: number) => {
  console.info(getLogMessage('setLocalStorageNumber'), key, value);
  localStorage.set(key, value);
};

export const getLocalStorageNumber = (key: LocalStorageKeys) => {
  console.info(getLogMessage('getLocalStorageNumber'), key);
  return localStorage.getNumber(key);
};

export const useLocalStorageNumber = useMMKVNumber;

export const deleteLocalStorageItem = (key: LocalStorageKeys) => {
  console.info(getLogMessage('deleteLocalStorageItem'), key);
  localStorage.delete(key);
};

export const clearLocalStorage = () => {
  console.info(getLogMessage('clearLocalStorage'));
  localStorage.clearAll();
};
