import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import Orientation from 'react-native-orientation-locker';
import { useOrientationLocker } from '@src/App/useOrientationLocker';
import { renderHookWithProviders } from '@modules/utils';

// Mock react-native-orientation-locker
jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
}));

describe('useOrientationLocker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should lock orientation to portrait on mount', () => {
    renderHookWithProviders(() => useOrientationLocker());

    expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1);
  });
});
