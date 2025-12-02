import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock Firebase messaging BEFORE importing anything else
const mockGetMessaging = jest.fn();
const mockIsAutoInitEnabled = jest.fn();
const mockSetAutoInitEnabled = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: () => mockGetMessaging(),
  isAutoInitEnabled: (messaging: unknown) => mockIsAutoInitEnabled(messaging),
  setAutoInitEnabled: (messaging: unknown, enabled: boolean) =>
    mockSetAutoInitEnabled(messaging, enabled),
}));

import { useMessagingAutoInitialize } from '@src/App/useMessagingAutoInitialize';
import { renderHookWithProviders } from '@src/utils/TestUtils';

describe('useMessagingAutoInitialize', () => {
  const mockMessaging = {};

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMessaging.mockReturnValue(mockMessaging);
  });

  test('should enable auto-init when disabled', () => {
    mockIsAutoInitEnabled.mockReturnValue(false);

    renderHookWithProviders(() => useMessagingAutoInitialize());

    expect(mockGetMessaging).toHaveBeenCalledTimes(1);
    expect(mockIsAutoInitEnabled).toHaveBeenCalledWith(mockMessaging);
    expect(mockSetAutoInitEnabled).toHaveBeenCalledWith(mockMessaging, true);
  });

  test('should not enable auto-init when already enabled', () => {
    mockIsAutoInitEnabled.mockReturnValue(true);

    renderHookWithProviders(() => useMessagingAutoInitialize());

    expect(mockGetMessaging).toHaveBeenCalledTimes(1);
    expect(mockIsAutoInitEnabled).toHaveBeenCalledWith(mockMessaging);
    expect(mockSetAutoInitEnabled).not.toHaveBeenCalled();
  });

  test('should call getMessaging on mount', () => {
    mockIsAutoInitEnabled.mockReturnValue(true);

    renderHookWithProviders(() => useMessagingAutoInitialize());

    expect(mockGetMessaging).toHaveBeenCalledTimes(1);
  });
});
