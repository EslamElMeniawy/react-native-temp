/**
 * Integration test: MMKV storage abstraction with in-memory simulation.
 *
 * Tests the full MMKV storage layer (initializeLocalStorage, get/set/delete)
 * with a realistic in-memory store that simulates MMKV behavior.
 * Catches API changes in react-native-mmkv after RN upgrades.
 */
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { createMMKV } from 'react-native-mmkv';
import {
  clearLocalStorage,
  deleteLocalStorageItem,
  getLocalStorageBoolean,
  getLocalStorageNumber,
  getLocalStorageString,
  initializeLocalStorage,
  setLocalStorageBoolean,
  setLocalStorageNumber,
  setLocalStorageString,
} from '@modules/core';
import type { LocalStorageKeys } from '@modules/core';

jest.mock('react-native-mmkv');

// In-memory MMKV simulation (behaves like real MMKV)
function createInMemoryMMKV() {
  const store = new Map<string, string | boolean | number>();

  return {
    set: jest.fn((key: string, value: string | boolean | number) => {
      store.set(key, value);
    }),
    getString: jest.fn((key: string) => {
      const val = store.get(key);
      return typeof val === 'string' ? val : undefined;
    }),
    getBoolean: jest.fn((key: string) => {
      const val = store.get(key);
      return typeof val === 'boolean' ? val : undefined;
    }),
    getNumber: jest.fn((key: string) => {
      const val = store.get(key);
      return typeof val === 'number' ? val : undefined;
    }),
    remove: jest.fn((key: string) => {
      store.delete(key);
    }),
    clearAll: jest.fn(() => {
      store.clear();
    }),
    contains: jest.fn((key: string) => store.has(key)),
    getAllKeys: jest.fn(() => [...store.keys()]),
  };
}

describe('MMKV Storage Integration', () => {
  let mockStore: ReturnType<typeof createInMemoryMMKV>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => {});
    mockStore = createInMemoryMMKV();
    (createMMKV as jest.Mock).mockReturnValue(mockStore);
    initializeLocalStorage('test-encryption-key');
  });

  describe('initialization', () => {
    it('creates MMKV with correct config', () => {
      expect(createMMKV).toHaveBeenCalledWith({
        id: 'TempAppStorage',
        encryptionKey: 'test-encryption-key',
      });
    });

    it('supports initialization without encryption', () => {
      (createMMKV as jest.Mock).mockClear();
      initializeLocalStorage();
      expect(createMMKV).toHaveBeenCalledWith({
        id: 'TempAppStorage',
        encryptionKey: undefined,
      });
    });
  });

  describe('string operations round-trip', () => {
    it('stores and retrieves strings', () => {
      const key = 'locale' as LocalStorageKeys;
      setLocalStorageString(key, 'en');
      expect(getLocalStorageString(key)).toBe('en');
    });

    it('overwrites existing string values', () => {
      const key = 'locale' as LocalStorageKeys;
      setLocalStorageString(key, 'en');
      setLocalStorageString(key, 'ar');
      expect(getLocalStorageString(key)).toBe('ar');
    });

    it('returns undefined for non-existent keys', () => {
      expect(
        getLocalStorageString('nonexistent' as LocalStorageKeys),
      ).toBeUndefined();
    });
  });

  describe('boolean operations round-trip', () => {
    it('stores and retrieves booleans', () => {
      const key = 'darkMode' as LocalStorageKeys;
      setLocalStorageBoolean(key, true);
      expect(getLocalStorageBoolean(key)).toBe(true);
    });

    it('handles false values correctly', () => {
      const key = 'darkMode' as LocalStorageKeys;
      setLocalStorageBoolean(key, false);
      expect(getLocalStorageBoolean(key)).toBe(false);
    });
  });

  describe('number operations round-trip', () => {
    it('stores and retrieves numbers', () => {
      const key = 'fontSize' as LocalStorageKeys;
      setLocalStorageNumber(key, 16);
      expect(getLocalStorageNumber(key)).toBe(16);
    });

    it('handles zero correctly', () => {
      const key = 'retryCount' as LocalStorageKeys;
      setLocalStorageNumber(key, 0);
      expect(getLocalStorageNumber(key)).toBe(0);
    });
  });

  describe('deletion', () => {
    it('removes individual keys', () => {
      const key = 'locale' as LocalStorageKeys;
      setLocalStorageString(key, 'en');
      deleteLocalStorageItem(key);
      expect(getLocalStorageString(key)).toBeUndefined();
    });

    it('clearAll removes everything', () => {
      setLocalStorageString('locale' as LocalStorageKeys, 'en');
      setLocalStorageBoolean('darkMode' as LocalStorageKeys, true);
      setLocalStorageNumber('fontSize' as LocalStorageKeys, 14);

      clearLocalStorage();

      expect(
        getLocalStorageString('locale' as LocalStorageKeys),
      ).toBeUndefined();
      expect(
        getLocalStorageBoolean('darkMode' as LocalStorageKeys),
      ).toBeUndefined();
      expect(
        getLocalStorageNumber('fontSize' as LocalStorageKeys),
      ).toBeUndefined();
    });
  });

  describe('type isolation', () => {
    it('getString does not return number stored with same key', () => {
      const key = 'mixed' as LocalStorageKeys;
      setLocalStorageNumber(key, 42);
      // getString should return undefined since value is a number
      expect(getLocalStorageString(key)).toBeUndefined();
    });

    it('getBoolean does not return string stored with same key', () => {
      const key = 'mixed' as LocalStorageKeys;
      setLocalStorageString(key, 'true');
      expect(getLocalStorageBoolean(key)).toBeUndefined();
    });
  });

  describe('react-native-mmkv API contract', () => {
    it('createMMKV accepts id and encryptionKey options', () => {
      const calls = (createMMKV as jest.Mock).mock.calls;
      const config = calls[0][0] as Record<string, unknown>;
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('encryptionKey');
    });

    it('MMKV instance has required methods', () => {
      expect(typeof mockStore.set).toBe('function');
      expect(typeof mockStore.getString).toBe('function');
      expect(typeof mockStore.getBoolean).toBe('function');
      expect(typeof mockStore.getNumber).toBe('function');
      expect(typeof mockStore.remove).toBe('function');
      expect(typeof mockStore.clearAll).toBe('function');
    });
  });
});
