import {localStorage} from '@modules/core';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';

const clientStorage = {
  setItem: (key: string, value: string) => {
    localStorage.set(key, value);
  },
  getItem: (key: string) => {
    const value = localStorage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    localStorage.delete(key);
  },
};

export const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
});
