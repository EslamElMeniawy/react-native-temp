import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface MockedRequest {
  method: string;
  url?: string;
  config: AxiosRequestConfig;
}

interface MockAxiosError {
  message: string;
  isAxiosError: boolean;
  response?: {
    data: any;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
  };
  config?: AxiosRequestConfig;
  request?: any;
}

interface QueuedResponse {
  type: 'success' | 'error';
  value: any;
}

interface MockAxiosInstance {
  instance: AxiosInstance;
  requests: MockedRequest[];
  enqueueResponse: (method: string, response: any) => void;
  enqueueError: (method: string, error: MockAxiosError | any) => void;
  clear: () => void;
  getLastRequest: () => MockedRequest | undefined;
  getRequestsByMethod: (method: string) => MockedRequest[];
}

const createMockResponse = <T = any>(
  data: T,
  config: AxiosRequestConfig = {},
): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: config as any,
});

const createMockError = (
  error: Partial<MockAxiosError>,
  config: AxiosRequestConfig = {},
): MockAxiosError => ({
  message: error.message || 'Network Error',
  isAxiosError: true,
  config: config as any,
  ...error,
});

const getStatusText = (status: number): string => {
  const statusTexts: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return statusTexts[status] || 'Unknown';
};

const createInterceptors = () => {
  const mockFn = (fn: any) => {
    const mock: any = (...args: any[]) => (fn ? fn(...args) : undefined);
    mock.mockImplementation = (impl: any) => {
      Object.assign(mock, impl);
    };
    return mock;
  };

  return {
    request: {
      use: mockFn(() => 0),
      eject: mockFn(() => undefined),
    },
    response: {
      use: mockFn(() => 0),
      eject: mockFn(() => undefined),
    },
  };
};

const isReadMethod = (method: string): boolean =>
  method === 'get' || method === 'delete' || method === 'head';

const buildFullConfig = (
  method: string,
  url: string,
  args: any[],
): AxiosRequestConfig => {
  const config: AxiosRequestConfig = isReadMethod(method)
    ? args[0] || {}
    : args[1] || {};

  return {
    ...config,
    method,
    url,
  };
};

const handleQueuedResponse = (
  queuedResponse: QueuedResponse | undefined,
  fullConfig: AxiosRequestConfig,
): Promise<AxiosResponse<any>> => {
  if (!queuedResponse) {
    return Promise.resolve(createMockResponse({}, fullConfig));
  }

  if (queuedResponse.type === 'error') {
    const errorObj = queuedResponse.value.isAxiosError
      ? queuedResponse.value
      : { message: queuedResponse.value };
    const error = createMockError(errorObj, fullConfig);
    return Promise.reject(error);
  }

  return Promise.resolve(createMockResponse(queuedResponse.value, fullConfig));
};

type QueueStore = {
  requests: MockedRequest[];
  getQueue: (method: string) => QueuedResponse[];
  clear: () => void;
};

const createQueueStore = (): QueueStore => {
  const requests: MockedRequest[] = [];
  const responseQueues: Record<string, QueuedResponse[]> = {};

  const getQueue = (method: string): QueuedResponse[] => {
    const normalizedMethod = method.toLowerCase();
    if (!responseQueues[normalizedMethod]) {
      responseQueues[normalizedMethod] = [];
    }
    return responseQueues[normalizedMethod];
  };

  const clear = () => {
    requests.length = 0;
    Object.keys(responseQueues).forEach(key => {
      responseQueues[key] = [];
    });
  };

  return { requests, getQueue, clear };
};

const createVerbHandler = (method: string, store: QueueStore) => {
  const handler: any = (url: string, ...args: any[]) => {
    const fullConfig = buildFullConfig(method, url, args);

    store.requests.push({
      method: method.toUpperCase(),
      url,
      config: fullConfig,
    });

    const queue = store.getQueue(method);
    const queuedResponse = queue.shift();

    return handleQueuedResponse(queuedResponse, fullConfig);
  };

  handler.mockClear = () => {
    handler.mock = { calls: [], results: [] };
  };
  handler.mock = { calls: [], results: [] };
  return handler;
};

const createMockRequest = () => {
  const mockRequest: any = () => Promise.resolve(createMockResponse({}, {}));
  mockRequest.mockClear = () => undefined;
  mockRequest.mock = { calls: [], results: [] };
  return mockRequest;
};

const createAxiosInstance = (
  store: QueueStore,
  interceptors: ReturnType<typeof createInterceptors>,
): AxiosInstance =>
  ({
    get: createVerbHandler('get', store),
    post: createVerbHandler('post', store),
    put: createVerbHandler('put', store),
    patch: createVerbHandler('patch', store),
    delete: createVerbHandler('delete', store),
    head: createVerbHandler('head', store),
    options: createVerbHandler('options', store),
    request: createMockRequest(),
    interceptors,
  }) as unknown as AxiosInstance;

const enqueueFactory =
  (store: QueueStore, type: QueuedResponse['type']) =>
  (method: string, value: any) => {
    const queue = store.getQueue(method);
    queue.push({
      type,
      value,
    });
  };

/**
 * Creates a lightweight axios mock factory for per-suite testing.
 *
 * Usage:
 * ```ts
 * const mockAxios = createMockAxios();
 * jest.mock('axios', () => ({
 *   create: jest.fn(() => mockAxios.instance),
 *   isAxiosError: jest.fn((error) => error?.isAxiosError === true),
 * }));
 *
 * // In test:
 * mockAxios.enqueueResponse('get', { data: { id: 1 } });
 * const result = await httpClient.get('/endpoint');
 * expect(mockAxios.requests).toHaveLength(1);
 * ```
 */
export const createMockAxios = (): MockAxiosInstance => {
  const store = createQueueStore();
  const interceptors = createInterceptors();
  const instance = createAxiosInstance(store, interceptors);
  const enqueueResponse = enqueueFactory(store, 'success');
  const enqueueError = enqueueFactory(store, 'error');

  const getLastRequest = (): MockedRequest | undefined =>
    store.requests[store.requests.length - 1];

  const getRequestsByMethod = (method: string): MockedRequest[] =>
    store.requests.filter(
      req => req.method.toLowerCase() === method.toLowerCase(),
    );

  return {
    instance,
    requests: store.requests,
    enqueueResponse,
    enqueueError,
    clear: store.clear,
    getLastRequest,
    getRequestsByMethod,
  };
};

/**
 * Helper to create an axios-like error object for testing error scenarios
 */
export const createAxiosError = (
  status: number,
  data: any,
  message?: string,
  config?: AxiosRequestConfig,
): MockAxiosError => ({
  message: message || `Request failed with status code ${status}`,
  isAxiosError: true,
  response: {
    data,
    status,
    statusText: getStatusText(status),
    headers: {},
    config: config || ({} as any),
  },
  config: config || ({} as any),
  request: {},
});
