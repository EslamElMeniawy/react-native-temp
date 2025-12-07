import * as React from 'react';
import * as Keychain from 'react-native-keychain';
import { initializeLocalStorage } from '@modules/core';

const getLogMessage = (message: string) =>
  `## useLocalStorageInitialization:: ${message}`;

export const useLocalStorageInitialization = () => {
  const KEYCHAIN_KEY = 'LOCAL_STORAGE_ENCRYPTION_KEY';

  // #region State
  const [storageInitialized, setStorageInitialized] =
    React.useState<boolean>(false);
  // #endregion

  const generateEncryptionKey = React.useCallback(async () => {
    const newKeyArr = new Uint8Array(16);
    crypto.getRandomValues(newKeyArr);
    let newKey = '';

    for (let i = 0; i < newKeyArr.length; i++) {
      newKey += String.fromCharCode(newKeyArr[i]);
    }

    try {
      await Keychain.setGenericPassword('localStorageEncryptionKey', newKey, {
        service: KEYCHAIN_KEY,
      });

      return newKey;
    } catch (error) {
      console.error(getLogMessage('Error setting encryption key'), error);
      return null;
    }
  }, []);

  const getEncryptionKey = React.useCallback(async () => {
    try {
      const keychainValue = await Keychain.getGenericPassword({
        service: KEYCHAIN_KEY,
      });

      if (keychainValue && keychainValue?.password) {
        return keychainValue.password;
      }

      return generateEncryptionKey();
    } catch (error) {
      console.error(getLogMessage('Error getting encryption key'), error);
      return generateEncryptionKey();
    }
  }, [generateEncryptionKey]);

  React.useEffect(() => {
    getEncryptionKey().then(encryptionKey => {
      initializeLocalStorage(encryptionKey);
      setStorageInitialized(true);
    });
  }, [getEncryptionKey]);

  return storageInitialized;
};
