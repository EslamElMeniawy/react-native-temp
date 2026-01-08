import { describe, expect, it } from '@jest/globals';

import skip401Urls from '@modules/core/src/api/skip401Urls';

describe('Skip401Urls', () => {
  it('is an array', () => {
    expect(Array.isArray(skip401Urls)).toBe(true);
  });

  it('contains login url', () => {
    expect(skip401Urls).toContain('/login');
  });
});
