import {
  useLocalStorageString,
  getLocalStorageString,
  setLocalStorageString,
  deleteLocalStorageItem,
  LocalStorageKeys,
} from '@src/core';
import type {AppLanguages} from '@src/enums';

const getLogMessage = (message: string) =>
  `## LocalStorage::language:: ${message}`;

export const useLocalStorageLanguage = () =>
  useLocalStorageString(LocalStorageKeys.LANGUAGE);

export const getLanguage = () => {
  console.info(getLogMessage('getLanguage'));
  const language = getLocalStorageString(LocalStorageKeys.LANGUAGE);
  console.info(getLogMessage('language'), language);
  return language ? (language as AppLanguages) : null;
};

export const setLanguage = (language: AppLanguages) => {
  console.info(getLogMessage('setLanguage'), language);
  setLocalStorageString(LocalStorageKeys.LANGUAGE, language);
};

export const removeLanguage = () => {
  console.info(getLogMessage('removeLanguage'));
  deleteLocalStorageItem(LocalStorageKeys.LANGUAGE);
};
