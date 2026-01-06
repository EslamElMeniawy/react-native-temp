import { describe, expect, it } from '@jest/globals';

import arTranslations from '@modules/features-auth/src/translations/ar';

describe('Auth AR Translations', () => {
  it('has login key', () => {
    expect(arTranslations.login).toBeDefined();
    expect(typeof arTranslations.login).toBe('string');
  });

  it('has username key', () => {
    expect(arTranslations.username).toBeDefined();
    expect(typeof arTranslations.username).toBe('string');
  });

  it('has password key', () => {
    expect(arTranslations.password).toBeDefined();
    expect(typeof arTranslations.password).toBe('string');
  });
});
