import { describe, expect, it } from '@jest/globals';

import arTranslations from '@modules/features-home/src/translations/ar';

describe('Home AR Translations', () => {
  it('has home key', () => {
    expect(arTranslations.home).toBeDefined();
    expect(typeof arTranslations.home).toBe('string');
  });
});
