import {
  useLocalStorageString,
  getLocalStorageString,
  setLocalStorageString,
  deleteLocalStorageItem,
  LocalStorageKeys,
} from '@modules/core';

const getLogMessage = (message: string) =>
  `## LocalStorage::apiToken:: ${message}`;

export const useLocalStorageApiToken = () =>
  useLocalStorageString(LocalStorageKeys.API_TOKEN);

export const getApiToken = () => {
  console.info(getLogMessage('getApiToken'));
  const apiToken = getLocalStorageString(LocalStorageKeys.API_TOKEN);
  console.info(getLogMessage('apiToken'), apiToken);
  return apiToken;
};

export const setApiToken = (apiToken: string) => {
  console.info(getLogMessage('setApiToken'), apiToken);
  setLocalStorageString(LocalStorageKeys.API_TOKEN, apiToken);
};

export const removeApiToken = () => {
  console.info(getLogMessage('removeApiToken'));
  deleteLocalStorageItem(LocalStorageKeys.API_TOKEN);
};
