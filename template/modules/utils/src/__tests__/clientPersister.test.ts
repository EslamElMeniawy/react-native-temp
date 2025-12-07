import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { localStorage } from '@modules/core';
import { clientPersister } from '@modules/utils/src/clientPersister';

// Mock the localStorage
jest.mock('@modules/core', () => ({
  localStorage: {
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('clientPersister - persistClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call localStorage.set when persisting client state', async () => {
    const clientState = { mutations: [], queries: [] };
    const buster = 'test-buster';

    await clientPersister.persistClient({
      clientState,
      buster,
      timestamp: Date.now(),
    });

    expect(localStorage?.set).toHaveBeenCalled();
  });

  test('should handle persisting multiple times', async () => {
    const clientState1 = { mutations: [], queries: [] };
    await clientPersister.persistClient({
      clientState: clientState1,
      buster: 'v1',
      timestamp: Date.now(),
    });

    const clientState2 = { mutations: [], queries: [] };
    await clientPersister.persistClient({
      clientState: clientState2,
      buster: 'v2',
      timestamp: Date.now(),
    });

    expect(localStorage?.set).toHaveBeenCalledTimes(2);
  });
});

describe('clientPersister - restoreClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call localStorage.getString and return the parsed client state', async () => {
    const clientState = { mutations: [], queries: [] };
    const buster = 'test-buster';
    const timestamp = Date.now();
    const storedValue = JSON.stringify({ clientState, buster, timestamp });
    (localStorage?.getString as jest.Mock).mockReturnValue(storedValue);

    const result = await clientPersister.restoreClient();

    expect(localStorage?.getString).toHaveBeenCalled();
    expect(result).toEqual({ clientState, buster, timestamp });
  });

  test('should return undefined when stored value is undefined', async () => {
    (localStorage?.getString as jest.Mock).mockReturnValue(undefined);

    const result = await clientPersister.restoreClient();

    expect(result).toBeUndefined();
  });

  test('should return undefined when stored value is null', async () => {
    (localStorage?.getString as jest.Mock).mockReturnValue(null);

    const result = await clientPersister.restoreClient();

    expect(result).toBeUndefined();
  });
});

describe('clientPersister - removeClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call localStorage.remove', async () => {
    await clientPersister.removeClient();

    expect(localStorage?.remove).toHaveBeenCalled();
  });

  test('should handle removing multiple times', async () => {
    await clientPersister.removeClient();
    await clientPersister.removeClient();
    await clientPersister.removeClient();

    expect(localStorage?.remove).toHaveBeenCalledTimes(3);
  });
});

describe('clientPersister - structure', () => {
  test('should be defined and have expected methods', () => {
    expect(clientPersister).toBeDefined();
    expect(clientPersister.persistClient).toBeDefined();
    expect(clientPersister.restoreClient).toBeDefined();
    expect(clientPersister.removeClient).toBeDefined();
  });
});
