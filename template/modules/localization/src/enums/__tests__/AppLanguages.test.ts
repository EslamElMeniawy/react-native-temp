import { describe, expect, it } from '@jest/globals';

import AppLanguages from '@modules/localization/src/enums/AppLanguages';

describe('AppLanguages', () => {
  it('has ARABIC value', () => {
    expect(AppLanguages.ARABIC).toBe('ar');
  });

  it('has ENGLISH value', () => {
    expect(AppLanguages.ENGLISH).toBe('en');
  });
});
