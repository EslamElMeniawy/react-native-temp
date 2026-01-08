import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import httpClient from '@modules/core/src/api/httpClient';
import {
  buildAxiosError,
  commonSetup,
  getHandlers,
  mockDispatch,
  mockGetState,
  mockIsAxiosError,
  mockSetErrorDialogMessage,
} from './httpClient.helpers';

jest.mock('@modules/store', () => ({
  ['store']: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  ['DialogsStore']: {
    setErrorDialogMessage: jest.fn(),
  },
}));

jest.mock('@modules/localization', () => ({
  translate: jest.fn(),
  getCurrentLocale: jest.fn(),
}));

jest.mock('axios', () => {
  const interceptors = {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  };

  return {
    create: jest.fn(() => ({ interceptors })),
    isAxiosError: (...args: unknown[]) => mockIsAxiosError(...args),
  };
});

describe('httpClient headers', function () {
  beforeEach(commonSetup);

  it('adds headers including Authorization when token exists', () => {
    const { requestFulfilled } = getHandlers(httpClient);
    const config = { headers: {}, method: 'get' } as any;

    const result = requestFulfilled(config);

    expect(result.headers).toMatchObject({
      ['Accept']: 'application/json',
      ['Content-Type']: 'application/json',
      ['Accept-Language']: 'en',
      ['Authorization']: 'Bearer TOKEN',
      ['cache-control']: 'no-cache',
    });
  });

  it('omits Authorization when token is missing', () => {
    const { requestFulfilled } = getHandlers(httpClient);
    mockGetState.mockReturnValue({ user: {} });
    const config = { headers: {}, method: 'post' } as any;

    const result = requestFulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('httpClient 401 handling', function () {
  beforeEach(commonSetup);

  it('dispatches dialog on 401 errors outside skip list', async () => {
    const { responseRejected } = getHandlers(httpClient);
    const error = buildAxiosError({
      response: {
        status: 401,
        data: { error: 'Auth error' },
        config: { url: '/resource', headers: {} as any },
        statusText: 'Error',
        headers: {} as any,
      },
      request: { responseURL: 'https://api/resource' },
    });

    await expect(responseRejected(error)).rejects.toMatchObject({
      status: 401,
      errorMessage: 'Auth error',
    });

    expect(mockSetErrorDialogMessage).toHaveBeenCalledWith(
      'translated:sessionExpired',
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'translated:sessionExpired',
      type: 'setErrorDialogMessage',
    });
  });

  it('skips dialog on 401 for skip401Urls', async () => {
    const { responseRejected } = getHandlers(httpClient);
    const error = buildAxiosError({
      response: {
        status: 401,
        data: { error: 'Auth error' },
        config: { url: '/login', headers: {} as any },
        statusText: 'Error',
        headers: {} as any,
      },
      request: { responseURL: 'https://api/login' },
    });

    await expect(responseRejected(error)).rejects.toMatchObject({
      status: 401,
      errorMessage: 'Auth error',
    });

    expect(mockSetErrorDialogMessage).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

describe('httpClient error handling', function () {
  beforeEach(commonSetup);

  it('falls back to translate unknownError when not axios error', async () => {
    const { responseRejected } = getHandlers(httpClient);
    mockIsAxiosError.mockReturnValue(false);
    const error = { message: 'boom', response: { config: { url: '/x' } } };

    await expect(responseRejected(error)).rejects.toMatchObject({
      errorMessage: 'translated:unknownError',
    });
    expect(mockSetErrorDialogMessage).not.toHaveBeenCalled();
  });
});
