import { describe, expect, it } from '@jest/globals';
import {
  createMockAxios,
  createAxiosError,
} from '@modules/utils/src/axiosMockFactory';

const testEnqueueAndResponse = function () {
  it('enqueues success response and resolves with data', async function () {
    const mockAxios = createMockAxios();
    const responseData = { id: 1, name: 'Test' };

    mockAxios.enqueueResponse('get', responseData);
    const result = await mockAxios.instance.get('/test');

    expect(result.data).toEqual(responseData);
  });

  it('enqueues error response and rejects', async function () {
    const mockAxios = createMockAxios();
    const error = createAxiosError(
      401,
      { message: 'Unauthorized' },
      'Unauthorized',
    );

    mockAxios.enqueueError('post', error);

    await expect(
      mockAxios.instance.post('/login', { user: 'test' }),
    ).rejects.toMatchObject({
      message: 'Unauthorized',
      response: { status: 401 },
    });
  });

  it('returns empty data when no response queued', async function () {
    const mockAxios = createMockAxios();

    const result = await mockAxios.instance.get('/test');

    expect(result.data).toEqual({});
  });
};

const testCaptureBasics = function () {
  it('captures request method and url', async function () {
    const mockAxios = createMockAxios();

    await mockAxios.instance.get('/users/123');
    await mockAxios.instance.post('/users', { name: 'John' });

    expect(mockAxios.requests).toHaveLength(2);
    expect(mockAxios.requests[0]).toMatchObject({
      method: 'GET',
      url: '/users/123',
    });
    expect(mockAxios.requests[1]).toMatchObject({
      method: 'POST',
      url: '/users',
    });
  });

  it('getLastRequest returns most recent request', async function () {
    const mockAxios = createMockAxios();

    await mockAxios.instance.get('/first');
    await mockAxios.instance.put('/second');

    const last = mockAxios.getLastRequest();

    expect(last).toMatchObject({
      method: 'PUT',
      url: '/second',
    });
  });

  it('getLastRequest returns undefined when no requests', function () {
    const mockAxios = createMockAxios();

    expect(mockAxios.getLastRequest()).toBeUndefined();
  });
};

const testFilterMethods = function () {
  it('getRequestsByMethod filters requests by verb', async function () {
    const mockAxios = createMockAxios();

    await mockAxios.instance.get('/users');
    await mockAxios.instance.post('/users');
    await mockAxios.instance.get('/posts');

    const gets = mockAxios.getRequestsByMethod('get');

    expect(gets).toHaveLength(2);
    expect(gets.every(r => r.method === 'GET')).toBe(true);
  });

  it('getRequestsByMethod is case-insensitive', async function () {
    const mockAxios = createMockAxios();

    await mockAxios.instance.delete('/item/1');

    const deletes = mockAxios.getRequestsByMethod('DELETE');

    expect(deletes).toHaveLength(1);
    expect(deletes[0].method).toBe('DELETE');
  });

  it('clear empties requests and response queues', async function () {
    const mockAxios = createMockAxios();

    await mockAxios.instance.get('/test');
    mockAxios.enqueueResponse('get', { data: 'queued' });

    mockAxios.clear();

    expect(mockAxios.requests).toHaveLength(0);
    const result = await mockAxios.instance.get('/test2');
    expect(result.data).toEqual({});
  });
};

const testVerbHandlers = function () {
  it('supports basic HTTP methods', async function () {
    const mockAxios = createMockAxios();
    ['get', 'post', 'put', 'patch'].forEach(verb => {
      mockAxios.enqueueResponse(
        verb as Parameters<typeof mockAxios.enqueueResponse>[0],
        { method: verb.toUpperCase() },
      );
    });
    const results = [
      await mockAxios.instance.get('/test'),
      await mockAxios.instance.post('/test', {}),
      await mockAxios.instance.put('/test', {}),
      await mockAxios.instance.patch('/test', {}),
    ];
    results.forEach((result, idx) => {
      expect(result.data.method).toBe(['GET', 'POST', 'PUT', 'PATCH'][idx]);
    });
  });

  it('supports DELETE, HEAD, and OPTIONS methods', async function () {
    const mockAxios = createMockAxios();

    mockAxios.enqueueResponse('delete', { method: 'DELETE' });
    mockAxios.enqueueResponse('head', { method: 'HEAD' });
    mockAxios.enqueueResponse('options', { method: 'OPTIONS' });

    const deleteResult = await mockAxios.instance.delete('/test');
    const headResult = await mockAxios.instance.head('/test');
    const optionsResult = await mockAxios.instance.options('/test');

    expect(deleteResult.data.method).toBe('DELETE');
    expect(headResult.data.method).toBe('HEAD');
    expect(optionsResult.data.method).toBe('OPTIONS');
  });

  it('queues responses in FIFO order', async function () {
    const mockAxios = createMockAxios();

    mockAxios.enqueueResponse('get', { id: 1 });
    mockAxios.enqueueResponse('get', { id: 2 });
    mockAxios.enqueueResponse('get', { id: 3 });

    const res1 = await mockAxios.instance.get('/test');
    const res2 = await mockAxios.instance.get('/test');
    const res3 = await mockAxios.instance.get('/test');

    expect(res1.data.id).toBe(1);
    expect(res2.data.id).toBe(2);
    expect(res3.data.id).toBe(3);
  });
};

const testInterceptors = function () {
  it('provides request/response interceptor hooks', function () {
    const mockAxios = createMockAxios();

    expect(mockAxios.instance.interceptors.request.use).toBeDefined();
    expect(mockAxios.instance.interceptors.request.eject).toBeDefined();
    expect(mockAxios.instance.interceptors.response.use).toBeDefined();
    expect(mockAxios.instance.interceptors.response.eject).toBeDefined();
  });
};

describe('createMockAxios', function () {
  describe('enqueue and response', testEnqueueAndResponse);
  describe('capture basics', testCaptureBasics);
  describe('filter methods', testFilterMethods);
  describe('verb handlers', testVerbHandlers);
  describe('interceptors', testInterceptors);
});

const testErrorBasics = function () {
  it('creates error with status, statusText, and data', function () {
    const error = createAxiosError(
      404,
      { message: 'Not found' },
      'Custom message',
    );

    expect(error.message).toBe('Custom message');
    expect(error.response?.status).toBe(404);
    expect(error.response?.statusText).toBe('Not Found');
    expect(error.response?.data).toEqual({ message: 'Not found' });
  });

  it('uses default message when not provided', function () {
    const error = createAxiosError(500, { error: 'Server error' });

    expect(error.message).toBe('Request failed with status code 500');
  });

  it('marks error as axios error', function () {
    const error = createAxiosError(400, {});

    expect(error.isAxiosError).toBe(true);
  });
};

const testErrorStatusText = function () {
  it('creates statusText for common status codes', function () {
    const statuses = [
      [400, 'Bad Request'],
      [401, 'Unauthorized'],
      [403, 'Forbidden'],
      [404, 'Not Found'],
      [500, 'Internal Server Error'],
      [502, 'Bad Gateway'],
      [503, 'Service Unavailable'],
    ] as const;

    statuses.forEach(([code, text]) => {
      const error = createAxiosError(code, {});
      expect(error.response?.statusText).toBe(text);
    });
  });

  it('uses "Unknown" for unmapped status codes', function () {
    const error = createAxiosError(418, {});

    expect(error.response?.statusText).toBe('Unknown');
  });
};

const testErrorConfig = function () {
  it('preserves custom config in error', function () {
    const config = { method: 'post', url: '/api/data' };
    const error = createAxiosError(400, {}, undefined, config);

    expect(error.response?.config).toEqual(config);
    expect(error.config).toEqual(config);
  });

  it('includes empty request object by default', function () {
    const error = createAxiosError(500, {});

    expect(error.request).toBeDefined();
    expect(error.request).toEqual({});
  });
};

describe('createAxiosError', function () {
  describe('error basics', testErrorBasics);
  describe('status text mapping', testErrorStatusText);
  describe('config and request', testErrorConfig);
});
