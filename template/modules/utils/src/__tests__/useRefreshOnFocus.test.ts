import { describe, test, expect, jest } from '@jest/globals';
import { useFocusEffect } from '@react-navigation/native';
import { renderHookWithProviders } from '@src/utils/TestUtils';
import { useRefreshOnFocus } from '@modules/utils/src/useRefreshOnFocus';

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as object),
  useFocusEffect: jest.fn(),
}));

describe('useRefreshOnFocus', () => {
  test('should not trigger refetch on initial render', () => {
    const refetch = jest.fn<() => Promise<unknown>>().mockResolvedValue({});
    renderHookWithProviders(() => useRefreshOnFocus(refetch));
    expect(refetch).toHaveBeenCalledTimes(0);
  });

  test('should trigger refetch when screen gains focus', () => {
    const refetch = jest.fn<() => Promise<unknown>>().mockResolvedValue({});
    let focusCallback: () => void = () => {};

    (useFocusEffect as jest.Mock).mockImplementation((callback: unknown) => {
      focusCallback = callback as () => void;
    });

    renderHookWithProviders(() => useRefreshOnFocus(refetch));

    // Simulate first focus (should be skipped)
    focusCallback();
    expect(refetch).toHaveBeenCalledTimes(0);

    // Simulate second focus (should trigger refetch)
    focusCallback();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
