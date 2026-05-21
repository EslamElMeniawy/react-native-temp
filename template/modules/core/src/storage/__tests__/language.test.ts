import { describe, expect, it, beforeAll } from '@jest/globals';

import AppLanguages from '@modules/localization/src/enums/AppLanguages';
import { initializeLocalStorage } from '@modules/core/src/storage/MMKV';
import {
  getLanguage,
  setLanguage,
  removeLanguage,
} from '@modules/core/src/storage/language';

describe('Language Storage', () => {
  beforeAll(() => {
    initializeLocalStorage();
  });

  it('getLanguage returns null when no language is set', () => {
    removeLanguage();
    const language = getLanguage();
    expect(language).toBeNull();
  });

  it('getLanguage returns stored language after setLanguage', () => {
    setLanguage(AppLanguages.ARABIC);
    const language = getLanguage();
    expect(language).toBe(AppLanguages.ARABIC);
  });

  it('setLanguage works without error', () => {
    expect(() => setLanguage(AppLanguages.ARABIC)).not.toThrow();
  });

  it('removeLanguage works without error', () => {
    expect(() => removeLanguage()).not.toThrow();
  });
});
