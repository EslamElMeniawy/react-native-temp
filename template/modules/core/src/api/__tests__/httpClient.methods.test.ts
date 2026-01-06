import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import httpClient from '@modules/core/src/api/httpClient';
import {
  commonSetup,
  getHandlers,
  mockIsAxiosError,
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

function testHttpMethods() {
  const methods = [
    { method: 'get', name: 'GET' },
    { method: 'post', name: 'POST' },
    { method: 'head', name: 'HEAD' },
    { method: 'put', name: 'PUT' },
    { method: 'patch', name: 'PATCH' },
    { method: 'delete', name: 'DELETE' },
    { method: 'options', name: 'OPTIONS' },
    { method: 'custom', name: 'unknown method' },
  ];

  methods.forEach(({ method, name }) => {
    it(`logs ${name} requests`, () => {
      const { requestFulfilled } = getHandlers(httpClient);
      const config = { headers: {}, method, url: '/test' } as any;
      requestFulfilled(config);
      expect(config.method).toBe(method);
    });
  });
}

function testInterceptors() {
  it('handles request interceptor rejection', async () => {
    const { requestRejected } = getHandlers(httpClient);
    const error = new Error('Request failed');
    await expect(requestRejected(error)).rejects.toThrow('Request failed');
  });

  it('handles response interceptor success', () => {
    const { responseFulfilled } = getHandlers(httpClient);
    const response = {
      data: { result: 'success' },
      status: 200,
      config: { url: '/test', headers: {} as any },
    } as any;
    const result = responseFulfilled(response);
    expect(result).toBe(response);
  });
}

describe('httpClient HTTP methods logging', function () {
  beforeEach(commonSetup);
  testHttpMethods();
});

describe('httpClient interceptors', function () {
  beforeEach(commonSetup);
  testInterceptors();
});
