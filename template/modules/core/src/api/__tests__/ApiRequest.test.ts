import { describe, expect, it } from '@jest/globals';

import type ApiRequest from '@modules/core/src/api/ApiRequest';

describe('ApiRequest Type', () => {
  it('can be instantiated with params', () => {
    const request: ApiRequest = {
      params: { key: 'value' },
    };

    expect(request.params).toEqual({ key: 'value' });
  });

  it('can be instantiated with body', () => {
    const request: ApiRequest = {
      body: { data: 'test' },
    };

    expect(request.body).toEqual({ data: 'test' });
  });

  it('can be instantiated with pathVar', () => {
    const request: ApiRequest = {
      pathVar: { id: '123' },
    };

    expect(request.pathVar).toEqual({ id: '123' });
  });

  it('can be instantiated with all properties', () => {
    const request: ApiRequest = {
      params: { key: 'value' },
      body: { data: 'test' },
      pathVar: { id: '123' },
    };

    expect(request.params).toEqual({ key: 'value' });
    expect(request.body).toEqual({ data: 'test' });
    expect(request.pathVar).toEqual({ id: '123' });
  });
});
