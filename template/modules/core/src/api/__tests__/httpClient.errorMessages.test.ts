import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import httpClient from '@modules/core/src/api/httpClient';
import {
  buildAxiosError,
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

function testArrayErrorMessage() {
  it('builds error message from errors.message array', async () => {
    const { responseRejected } = getHandlers(httpClient);
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
}

function testStringErrorMessage() {
  it('extracts error message from errors as string', async () => {
    const { responseRejected } = getHandlers(httpClient);
    const error = buildAxiosError({
      response: {
        status: 400,
        data: { errors: 'single error string' },
        config: { url: '/resource', headers: {} as any },
        statusText: 'Error',
        headers: {} as any,
      },
    });

    await expect(responseRejected(error)).rejects.toMatchObject({
      errorMessage: 'single error string',
    });
  });
}

function testDataMessageExtraction() {
  it('extracts error message from data.message', async () => {
    const { responseRejected } = getHandlers(httpClient);
    const error = buildAxiosError({
      response: {
        status: 400,
        data: { message: 'direct message' },
        config: { url: '/resource', headers: {} as any },
        statusText: 'Error',
        headers: {} as any,
      },
    });

    await expect(responseRejected(error)).rejects.toMatchObject({
      errorMessage: 'direct message',
    });
  });
}

function testFallbackMessage() {
  it('extracts error message from error.message fallback', async () => {
    const { responseRejected } = getHandlers(httpClient);
    const error = buildAxiosError({
      message: 'fallback message',
      response: {
        status: 400,
        data: {},
        config: { url: '/resource', headers: {} as any },
        statusText: 'Error',
        headers: {} as any,
      },
    });

    await expect(responseRejected(error)).rejects.toMatchObject({
      errorMessage: 'fallback message',
    });
  });
}

describe('httpClient error messages', function () {
  beforeEach(commonSetup);
  testArrayErrorMessage();
  testStringErrorMessage();
  testDataMessageExtraction();
  testFallbackMessage();
});
