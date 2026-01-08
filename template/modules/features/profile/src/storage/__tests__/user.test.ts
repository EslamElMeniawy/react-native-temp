import { describe, expect, it } from '@jest/globals';

import {
  getUser,
  setUser,
  removeUser,
} from '@modules/features-profile/src/storage/user';

describe('User Storage', () => {
  it('getUser returns user or null', () => {
    const user = getUser();

    expect(user === null || typeof user === 'object').toBe(true);
  });

  it('setUser works without error', () => {
    const testUser = { id: 1, phone: '+1234567890' };
    expect(() => setUser(testUser)).not.toThrow();
  });

  it('removeUser works without error', () => {
    expect(() => removeUser()).not.toThrow();
  });
});
