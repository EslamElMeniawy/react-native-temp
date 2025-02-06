import {
  useLocalStorageNumber,
  getLocalStorageNumber,
  setLocalStorageNumber,
  deleteLocalStorageItem,
  LocalStorageKeys,
} from '@modules/core';

const getLogMessage = (message: string) =>
  `## LocalStorage::unreadNotificationsCount:: ${message}`;

export const useLocalStorageUnreadNotificationsCount = () =>
  useLocalStorageNumber(LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT);

export const getUnreadNotificationsCount = () => {
  console.info(getLogMessage('getUnreadNotificationsCount'));

  const unreadNotificationsCount = getLocalStorageNumber(
    LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
  );

  console.info(
    getLogMessage('unreadNotificationsCount'),
    unreadNotificationsCount,
  );

  return unreadNotificationsCount;
};

export const setUnreadNotificationsCount = (
  unreadNotificationsCount: number,
) => {
  console.info(
    getLogMessage('setUnreadNotificationsCount'),
    unreadNotificationsCount,
  );

  setLocalStorageNumber(
    LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT,
    unreadNotificationsCount,
  );
};

export const removeUnreadNotificationsCount = () => {
  console.info(getLogMessage('removeUnreadNotificationsCount'));
  deleteLocalStorageItem(LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT);
};
