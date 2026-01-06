import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { hide as rnBootSplashHide } from 'react-native-bootsplash';
import { useHideSplash } from '@src/screens/Splash/useHideSplash';
import { useAppSelector } from '@modules/store';

type Navigation = {
  replace: jest.Mock;
} & Partial<any>;

const mockStagger = jest.fn(() => ({ start: jest.fn() }));
const mockSpring = jest.fn(() => ({ start: jest.fn() }));
const mockTiming = jest.fn(() => ({ start: jest.fn((cb: any) => cb && cb()) }));

jest.mock('react-native', () => ({
  ['Animated']: {
    ['Value']: jest.fn(() => ({ current: 1 })),
    // @ts-expect-error - Mock implementation
    stagger: (...args: any[]) => mockStagger(...args),
    // @ts-expect-error - Mock implementation
    spring: (...args: any[]) => mockSpring(...args),
    // @ts-expect-error - Mock implementation
    timing: (...args: any[]) => mockTiming(...args),
  },
  ['Dimensions']: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(() => Promise.resolve()),
}));

jest.mock('@modules/store', () => ({
  useAppSelector: jest.fn(),
}));

describe('useHideSplash', () => {
  const flushPromises = () => new Promise(resolve => setImmediate(resolve));

  const buildProps = (
    navigation: Navigation,
    isLanguageLoaded: boolean,
    isUserLoaded: boolean,
  ) => ({
    navigation,
    opacity: { current: new Animated.Value(1) },
    translateY: { current: new Animated.Value(0) },
    isLanguageLoaded,
    isUserLoaded,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hides splash and navigates to login when no user', async () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: undefined });
    const navigation = { replace: jest.fn() } as any;

    const { result } = renderHook(() =>
      useHideSplash(buildProps(navigation, true, true) as any),
    );

    await act(async () => {
      await flushPromises();
    });

    expect(rnBootSplashHide).toHaveBeenCalled();
    expect(navigation.replace).toHaveBeenCalledWith('login');
    expect(result.current).toBe(false);
  });

  it('hides splash and navigates to home when user exists', async () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: { id: '1' } });
    const navigation = { replace: jest.fn() } as any;

    const { result } = renderHook(() =>
      useHideSplash(buildProps(navigation, true, true) as any),
    );

    await act(async () => {
      await flushPromises();
    });

    expect(navigation.replace).toHaveBeenCalledWith('home');
    expect(result.current).toBe(false);
  });
});
