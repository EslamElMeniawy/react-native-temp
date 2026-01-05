import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import httpClient from '@modules/core/src/api/httpClient';
import type { AxiosError } from 'axios';

const mockDispatch = jest.fn();
const mockGetState = jest.fn();
const mockSetErrorDialogMessage = jest.fn((message: string) => ({
  type: 'setErrorDialogMessage',
  payload: message,
})) as jest.Mock;
const mockTranslate = jest.fn((key: string) => `translated:${key}`) as jest.Mock;
const mockGetCurrentLocale = jest.fn(() => 'en');

const mockIsAxiosError = jest.fn();

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

const storeModule = jest.requireMock('@modules/store') as any;
const store = storeModule.store;
const dialogsStore = storeModule.DialogsStore;
const localization = jest.requireMock('@modules/localization') as any;

const assignMocks = () => {
  (localization.translate as unknown as jest.Mock) = mockTranslate;
  (localization.getCurrentLocale as unknown as jest.Mock) = mockGetCurrentLocale;
  (store.getState as jest.Mock) = mockGetState;
  (store.dispatch as jest.Mock) = mockDispatch;
  (dialogsStore.setErrorDialogMessage as unknown as jest.Mock) =
    mockSetErrorDialogMessage;
};

assignMocks();

const getHandlers = () => {
  const reqUse = (httpClient.interceptors.request.use as jest.Mock).mock
    .calls[0];
  const resUse = (httpClient.interceptors.response.use as jest.Mock).mock
    .calls[0];

  return {
    requestFulfilled: reqUse?.[0] as (cfg: any) => any,
    requestRejected: reqUse?.[1] as (err: any) => any,
    responseFulfilled: resUse?.[0] as (res: any) => any,
    responseRejected: resUse?.[1] as (err: any) => any,
  };
};

const buildAxiosError = (overrides: Partial<AxiosError> = {}) =>
  ({
    isAxiosError: true,
    response: {
      status: 500,
      data: {},
      statusText: 'Error',
      headers: {} as any,
      config: { url: '/test', headers: {} as any },
      ...overrides.response,
    },
    request: {
      responseURL: 'https://api/test',
      ...overrides.request,
    },
    message: 'error',
    ...overrides,
  } as unknown as AxiosError);

const clearAllMocks = () => {
  [
    mockDispatch,
    mockGetState,
    mockSetErrorDialogMessage,
    mockTranslate,
    mockGetCurrentLocale,
    mockIsAxiosError,
  ].forEach(mock => mock.mockClear());
};

const commonSetup = () => {
  clearAllMocks();

  assignMocks();
  mockGetState.mockReturnValue({ user: { apiToken: 'TOKEN' } });
  mockGetCurrentLocale.mockReturnValue('en');
  mockTranslate.mockImplementation((...args: unknown[]) => {
    const key = String(args[0]);
    return `translated:${key}`;
  });
  mockIsAxiosError.mockReturnValue(true);
};

describe('httpClient headers', function () {
  beforeEach(commonSetup);

  it('adds headers including Authorization when token exists', () => {
    const { requestFulfilled } = getHandlers();
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
    const { requestFulfilled } = getHandlers();
    mockGetState.mockReturnValue({ user: {} });
    const config = { headers: {}, method: 'post' } as any;

    const result = requestFulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('httpClient 401 handling', function () {
  beforeEach(commonSetup);

  it('dispatches dialog on 401 errors outside skip list', async () => {
    const { responseRejected } = getHandlers();
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
    const { responseRejected } = getHandlers();
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

describe('httpClient error messages', function () {
  beforeEach(commonSetup);

  it('builds error message from errors.message array', async () => {
    const { responseRejected } = getHandlers();
    const error = buildAxiosError({
      response: {
        status: 500,
        data: { errors: { message: ['first', 'second'] } },
        config: { url: '/resource', headers: {} as any },
        statusText: 'Error',
        headers: {} as any,
      },
    });

    await expect(responseRejected(error)).rejects.toMatchObject({
      errorMessage: 'first\nsecond',
    });
  });

  it('falls back to translate unknownError when not axios error', async () => {
    const { responseRejected } = getHandlers();
    mockIsAxiosError.mockReturnValue(false);
    const error = { message: 'boom', response: { config: { url: '/x' } } };

    await expect(responseRejected(error)).rejects.toMatchObject({
      errorMessage: 'translated:unknownError',
    });
    expect(mockSetErrorDialogMessage).not.toHaveBeenCalled();
  });
});
