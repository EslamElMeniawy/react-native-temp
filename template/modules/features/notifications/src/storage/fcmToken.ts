import {
  useLocalStorageString,
  getLocalStorageString,
  setLocalStorageString,
  deleteLocalStorageItem,
  LocalStorageKeys,
} from '@modules/core';

const getLogMessage = (message: string) =>
  `## LocalStorage::fcmToken:: ${message}`;

export const useLocalStorageFcmToken = () =>
  useLocalStorageString(LocalStorageKeys.FCM_TOKEN);

export const getFcmToken = () => {
  console.info(getLogMessage('getFcmToken'));
  const fcmToken = getLocalStorageString(LocalStorageKeys.FCM_TOKEN);
  console.info(getLogMessage('fcmToken'), fcmToken);
  return fcmToken;
};

export const setFcmToken = (fcmToken: string) => {
  console.info(getLogMessage('setFcmToken'), fcmToken);
  setLocalStorageString(LocalStorageKeys.FCM_TOKEN, fcmToken);
};

export const removeFcmToken = () => {
  console.info(getLogMessage('removeFcmToken'));
  deleteLocalStorageItem(LocalStorageKeys.FCM_TOKEN);
};
