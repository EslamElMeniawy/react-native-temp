import { describe, expect, it } from '@jest/globals';

import arTranslations from '@modules/features-notifications/src/translations/ar';

describe('Notifications AR Translations', () => {
  it('has notifications key', () => {
    expect(arTranslations.notifications).toBeDefined();
    expect(typeof arTranslations.notifications).toBe('string');
  });
});
