import * as React from 'react';
import type { User } from '@modules/core';
import {
  useLocalStorageString,
  getLocalStorageString,
  setLocalStorageString,
  deleteLocalStorageItem,
  LocalStorageKeys,
} from '@modules/core';

const getLogMessage = (message: string) => `## LocalStorage::user:: ${message}`;

export const useLocalStorageUser: () => [
  User | undefined | null,
  (user: User) => void,
] = () => {
  console.info(getLogMessage('useLocalStorageUser'));
  const [jsonUser, setJsonUser] = useLocalStorageString(LocalStorageKeys.USER);
  console.info(getLogMessage('jsonUser'), jsonUser);

  const userObject = React.useMemo(
    () => (jsonUser ? (JSON.parse(jsonUser) as User) : null),
    [jsonUser],
  );

  console.info(getLogMessage('userObject'), userObject);

  const setUserObject = React.useCallback(
    (user: User) => setJsonUser(JSON.stringify(user)),
    [setJsonUser],
  );

  return [userObject, setUserObject];
};

export const getUser = () => {
  console.info(getLogMessage('getUser'));
  const jsonUser = getLocalStorageString(LocalStorageKeys.USER);
  console.info(getLogMessage('jsonUser'), jsonUser);
  const userObject = jsonUser ? (JSON.parse(jsonUser) as User) : null;
  console.info(getLogMessage('userObject'), userObject);
  return userObject;
};

export const setUser = (user: User) => {
  console.info(getLogMessage('setUser'), user);
  setLocalStorageString(LocalStorageKeys.USER, JSON.stringify(user));
};

export const removeUser = () => {
  console.info(getLogMessage('removeUser'));
  deleteLocalStorageItem(LocalStorageKeys.USER);
};
