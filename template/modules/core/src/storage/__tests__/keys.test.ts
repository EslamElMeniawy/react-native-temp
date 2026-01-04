import { describe, expect, it } from '@jest/globals';

import LocalStorageKeys from '@modules/core/src/storage/keys';

describe('LocalStorageKeys', () => {
  it('has LANGUAGE key', () => {
    expect(LocalStorageKeys.LANGUAGE).toBe('Language');
  });

  it('has USER key', () => {
    expect(LocalStorageKeys.USER).toBe('User');
  });

  it('has UNREAD_NOTIFICATIONS_COUNT key', () => {
    expect(LocalStorageKeys.UNREAD_NOTIFICATIONS_COUNT).toBe(
      'UnreadNotificationsCount',
    );
  });

  it('has API_TOKEN key', () => {
    expect(LocalStorageKeys.API_TOKEN).toBe('ApiToken');
  });

  it('has FCM_TOKEN key', () => {
    expect(LocalStorageKeys.FCM_TOKEN).toBe('FcmToken');
  });
});
