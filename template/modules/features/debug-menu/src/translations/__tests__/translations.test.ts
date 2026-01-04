import { describe, expect, it } from '@jest/globals';

import arTranslations from '@modules/features-debug-menu/src/translations/ar';

describe('Debug Menu AR Translations', () => {
  it('has debugMenu key', () => {
    expect(arTranslations.debugMenu).toBeDefined();
    expect(typeof arTranslations.debugMenu).toBe('string');
  });

  it('has networkLogs key', () => {
    expect(arTranslations.networkLogs).toBeDefined();
    expect(typeof arTranslations.networkLogs).toBe('string');
  });

  it('has appVersion key', () => {
    expect(arTranslations.appVersion).toBeDefined();
    expect(typeof arTranslations.appVersion).toBe('string');
  });

  it('has environment key', () => {
    expect(arTranslations.environment).toBeDefined();
    expect(typeof arTranslations.environment).toBe('string');
  });
});
