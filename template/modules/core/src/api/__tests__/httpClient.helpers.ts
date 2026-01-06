import { jest } from '@jest/globals';
import type { AxiosError } from 'axios';

export const mockDispatch = jest.fn();
export const mockGetState = jest.fn();
export const mockSetErrorDialogMessage = jest.fn((message: string) => ({
  type: 'setErrorDialogMessage',
  payload: message,
})) as jest.Mock;
export const mockTranslate = jest.fn(
  (key: string) => `translated:${key}`,
) as jest.Mock;
export const mockGetCurrentLocale = jest.fn(() => 'en');
export const mockIsAxiosError = jest.fn();

export function setupMocks() {
  const storeModule = jest.requireMock('@modules/store') as any;
  const store = storeModule.store;
  const dialogsStore = storeModule.DialogsStore;
  const localization = jest.requireMock('@modules/localization') as any;

  (localization.translate as unknown as jest.Mock) = mockTranslate;
  (localization.getCurrentLocale as unknown as jest.Mock) =
    mockGetCurrentLocale;
  (store.getState as jest.Mock) = mockGetState;
  (store.dispatch as jest.Mock) = mockDispatch;
  (dialogsStore.setErrorDialogMessage as unknown as jest.Mock) =
    mockSetErrorDialogMessage;
}

export function getHandlers(httpClient: any) {
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
}

export function buildAxiosError(overrides: Partial<AxiosError> = {}) {
  return {
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
  } as unknown as AxiosError;
}

export function clearAllMocks() {
  [
    mockDispatch,
    mockGetState,
    mockSetErrorDialogMessage,
    mockTranslate,
    mockGetCurrentLocale,
    mockIsAxiosError,
  ].forEach(mock => mock.mockClear());
}

export function commonSetup() {
  clearAllMocks();
  setupMocks();
  mockGetState.mockReturnValue({ user: { apiToken: 'TOKEN' } });
  mockGetCurrentLocale.mockReturnValue('en');
  mockTranslate.mockImplementation((...args: unknown[]) => {
    const key = String(args[0]);
    return `translated:${key}`;
  });
  mockIsAxiosError.mockReturnValue(true);
}
