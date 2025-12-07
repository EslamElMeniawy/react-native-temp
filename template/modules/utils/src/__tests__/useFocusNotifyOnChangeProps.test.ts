import { describe, test, expect, jest } from '@jest/globals';
import { useFocusEffect } from '@react-navigation/native';
import { renderHookWithProviders } from '@src/utils/TestUtils';
import { useFocusNotifyOnChangeProps } from '@modules/utils/src/useFocusNotifyOnChangeProps';
import type { NotifyOnChangeProps } from '@tanstack/query-core';

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as object),
  useFocusEffect: jest.fn(),
}));

describe('useFocusNotifyOnChangeProps - Focused State', () => {
  test('should return notifyOnChangeProps when component is focused', () => {
    const notifyOnChangeProps = 'all';
    let focusCallback: () => void = () => {};

    (useFocusEffect as jest.Mock).mockImplementation((callback: unknown) => {
      focusCallback = callback as () => void;
    });

    const { result } = renderHookWithProviders(() =>
      useFocusNotifyOnChangeProps(notifyOnChangeProps),
    );

    // Simulate focus
    focusCallback();

    expect(result.current()).toEqual(notifyOnChangeProps);
  });

  test('should return result of notifyOnChangeProps function when component is focused', () => {
    const notifyOnChangeProps = jest.fn(() => ['data']);
    let focusCallback: () => void = () => {};

    (useFocusEffect as jest.Mock).mockImplementation((callback: unknown) => {
      focusCallback = callback as () => void;
    });

    const { result } = renderHookWithProviders(() =>
      useFocusNotifyOnChangeProps(
        notifyOnChangeProps as unknown as NotifyOnChangeProps,
      ),
    );

    // Simulate focus
    focusCallback();

    expect(result.current()).toEqual(['data']);
    expect(notifyOnChangeProps).toHaveBeenCalled();
  });
});

describe('useFocusNotifyOnChangeProps - Unfocused/Undefined State', () => {
  test('should return empty array when component is not focused', () => {
    const notifyOnChangeProps = 'all';
    let focusCallback: () => () => void = () => () => {};

    (useFocusEffect as jest.Mock).mockImplementation((callback: unknown) => {
      focusCallback = callback as () => () => void;
    });

    const { result } = renderHookWithProviders(() =>
      useFocusNotifyOnChangeProps(notifyOnChangeProps),
    );

    // Simulate focus then blur (cleanup)
    const cleanup = focusCallback();
    cleanup();

    expect(result.current()).toEqual([]);
  });

  test('should return an empty array when notifyOnChangeProps is undefined', () => {
    let focusCallback: () => void = () => {};
    (useFocusEffect as jest.Mock).mockImplementation((callback: unknown) => {
      focusCallback = callback as () => void;
    });

    const { result } = renderHookWithProviders(() =>
      useFocusNotifyOnChangeProps(),
    );

    // Simulate focus
    focusCallback();

    expect(result.current()).toBeUndefined();
  });
});
