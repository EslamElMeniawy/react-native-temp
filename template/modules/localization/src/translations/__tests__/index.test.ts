import { describe, expect, it } from '@jest/globals';

import { translations } from '@modules/localization/src/translations';

describe('Translations', () => {
  it('has ar translations', () => {
    expect(translations.ar).toBeDefined();
  });

  it('has en translations', () => {
    expect(translations.en).toBeDefined();
  });

  it('ar has common namespace', () => {
    expect(translations.ar.common).toBeDefined();
  });

  it('en has common namespace', () => {
    expect(translations.en.common).toBeDefined();
  });
});
