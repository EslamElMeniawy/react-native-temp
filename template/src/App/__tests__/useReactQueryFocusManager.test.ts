import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { focusManager } from '@tanstack/react-query';
import { act } from '@testing-library/react-native';
import { useReactQueryFocusManager } from '@src/App/useReactQueryFocusManager';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import type { AppStateStatus } from 'react-native';

let appStateHandler: ((status: AppStateStatus) => void) | undefined;
const mockRemove = jest.fn();

jest.mock('react-native', () => ({
  ['Platform']: {
    ['OS']: 'ios',
    select: jest.fn(
      (options: Record<string, unknown>) => options.ios || options.default,
    ),
  },
  ['AppState']: {
    addEventListener: jest.fn(
      (_event: string, handler: (status: AppStateStatus) => void) => {
        appStateHandler = handler;
        return { remove: mockRemove };
      },
    ),
  },
}));

describe('useReactQueryFocusManager', () => {
  const setFocusedSpy = jest.spyOn(focusManager, 'setFocused');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates focus manager on app state changes', async () => {
    const { unmount } = await renderHookWithProviders(() =>
      useReactQueryFocusManager(),
    );

    act(() => {
      appStateHandler?.('active');
    });
    expect(setFocusedSpy).toHaveBeenCalledWith(true);

    act(() => {
      appStateHandler?.('background');
    });
    expect(setFocusedSpy).toHaveBeenCalledWith(false);

    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });
});
