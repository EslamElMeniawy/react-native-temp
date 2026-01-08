import { describe, expect, it } from '@jest/globals';

import TranslationNamespaces from '@modules/localization/src/enums/TranslationNamespaces';

describe('TranslationNamespaces', () => {
  it('has COMMON value', () => {
    expect(TranslationNamespaces.COMMON).toBe('common');
  });

  it('has DEBUG_MENU value', () => {
    expect(TranslationNamespaces.DEBUG_MENU).toBe('debugMenu');
  });

  it('has AUTH value', () => {
    expect(TranslationNamespaces.AUTH).toBe('auth');
  });

  it('has HOME value', () => {
    expect(TranslationNamespaces.HOME).toBe('home');
  });

  it('has NOTIFICATIONS value', () => {
    expect(TranslationNamespaces.NOTIFICATIONS).toBe('notifications');
  });
});
