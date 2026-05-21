import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { focusManager } from '@tanstack/react-query';
import { act } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useReactQueryFocusManager } from '@src/App/useReactQueryFocusManager';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import type { AppStateStatus } from 'react-native';

let appStateHandler: ((status: AppStateStatus) => void) | undefined;
const mockRemove = jest.fn();

jest.spyOn(AppState, 'addEventListener').mockImplementation(
  (_event: string, handler: (state: AppStateStatus) => void) => {
    appStateHandler = handler;
    return { remove: mockRemove } as any;
  },
);

describe('useReactQueryFocusManager', () => {
  const setFocusedSpy = jest.spyOn(focusManager, 'setFocused');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppState, 'addEventListener').mockImplementation(
      (_event: string, handler: (state: AppStateStatus) => void) => {
        appStateHandler = handler;
        return { remove: mockRemove } as any;
      },
    );
  });

  it('updates focus manager on app state changes', async () => {
    const { unmount } = await renderHookWithProviders(() =>
      useReactQueryFocusManager(),
    );

    await act(() => {
      appStateHandler?.('active');
    });
    expect(setFocusedSpy).toHaveBeenCalledWith(true);

    await act(() => {
      appStateHandler?.('background');
    });
    expect(setFocusedSpy).toHaveBeenCalledWith(false);

    await unmount();
    expect(mockRemove).toHaveBeenCalled();
  });
});
