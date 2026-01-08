import { describe, expect, jest, test, beforeEach } from '@jest/globals';

import { useFirebaseMessagingInitialization } from '@src/App/useFirebaseMessagingInitialization';
import { useMessagingAutoInitialize } from '@src/App/useMessagingAutoInitialize';
import { useMessagingPermission } from '@src/App/useMessagingPermission';
import { useNotificationsChannels } from '@src/App/useNotificationsChannels';
import { renderHookWithProviders } from '@modules/utils';

jest.mock('@src/App/useMessagingAutoInitialize');
jest.mock('@src/App/useMessagingPermission');
jest.mock('@src/App/useNotificationsChannels');

describe('useFirebaseMessagingInitialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call all messaging initialization hooks', () => {
    renderHookWithProviders(() => useFirebaseMessagingInitialization());

    expect(useMessagingAutoInitialize).toHaveBeenCalledTimes(1);
    expect(useMessagingPermission).toHaveBeenCalledTimes(1);
    expect(useNotificationsChannels).toHaveBeenCalledTimes(1);
  });
});
