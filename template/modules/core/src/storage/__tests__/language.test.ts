import { describe, expect, it } from '@jest/globals';

import AppLanguages from '@modules/localization/src/enums/AppLanguages';
import {
  getLanguage,
  setLanguage,
  removeLanguage,
} from '@modules/core/src/storage/language';

describe('Language Storage', () => {
  it('getLanguage returns language or null', () => {
    const language = getLanguage();

    expect(language === null || typeof language === 'string').toBe(true);
  });

  it('setLanguage works without error', () => {
    expect(() => setLanguage(AppLanguages.ARABIC)).not.toThrow();
  });

  it('removeLanguage works without error', () => {
    expect(() => removeLanguage()).not.toThrow();
  });
});
