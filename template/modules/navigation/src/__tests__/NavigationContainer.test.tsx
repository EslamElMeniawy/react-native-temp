import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { logEvent, getAnalytics } from '@react-native-firebase/analytics';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import config from 'react-native-config';
import {
  NavigationContainer as AppNavigationContainer,
  navigationRef,
  push,
} from '@modules/navigation';

const mockConfig = config as Record<string, string>;
const mockGetCurrentRoute = navigationRef.getCurrentRoute as jest.Mock;

let lastGesture: any;

jest.mock('react-native-config', () => ({
  ['ENABLE_LOCAL_LOG']: 'true',
}));

jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(() => 'analytics-instance'),
  logEvent: jest.fn(),
}));

jest.mock('@modules/navigation/src/NavigationUtils', () => {
  const navigationRefMock = {
    getCurrentRoute: jest.fn(),
    isReady: jest.fn(() => true),
    dispatch: jest.fn(),
  };

  return {
    navigationRef: navigationRefMock,
    push: jest.fn(),
  };
});

jest.mock('@modules/navigation/src/RootStack', () => {
  const rn = require('react-native');
  const react = require('react');
  return () => react.createElement(rn.View, { testID: 'root-stack' });
});

jest.mock('react-native-gesture-handler', () => {
  const rn = require('react-native');
  const react = require('react');

  const tapFactory = () => {
    const gesture: any = {
      onEndCallback: undefined,
      minPointers: () => gesture,
      runOnJS: () => gesture,
      onEnd: (callback: any) => {
        gesture.onEndCallback = callback;
        return gesture;
      },
      invokeOnEnd: (success: boolean) => gesture.onEndCallback?.({}, success),
    };
    lastGesture = gesture;
    return gesture;
  };

  const GestureDetector = ({ gesture, children }: any) =>
    react.createElement(
      rn.View,
      { testID: 'gesture-detector', gesture },
      children,
    );

  return {
    ['Gesture']: { ['Tap']: tapFactory },
    ['GestureDetector']: GestureDetector,
  };
});

jest.mock('@react-navigation/native', () => {
  const rn = require('react-native');
  const react = require('react');
  const createNavigationContainerRef = () => ({
    getCurrentRoute: jest.fn(),
    isReady: jest.fn(() => true),
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  });
  const stackActionCreator = (type: string) =>
    jest.fn((...args: any[]) => ({ type, args }));
  return {
    ['NavigationContainer']: ({ children, onReady, onStateChange }: any) => {
      react.useEffect(() => {
        onReady?.();
      }, [onReady]);

      return react.createElement(
        rn.View,
        { testID: 'nav-container', onStateChange },
        children,
      );
    },
    ['BaseNavigationContainer']: jest.fn(),
    createNavigationContainerRef,
    ['StackActions']: {
      push: stackActionCreator('push'),
      replace: stackActionCreator('replace'),
      popToTop: stackActionCreator('popToTop'),
    },
    ['CommonActions']: {
      reset: jest.fn((...args: any[]) => ({ type: 'reset', args })),
    },
  };
});

describe('NavigationContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentRoute.mockReset();
    mockGetCurrentRoute
      .mockReturnValueOnce({ name: 'home' })
      .mockReturnValueOnce({ name: 'settings' });
    mockConfig.ENABLE_LOCAL_LOG = 'true';
  });

  const triggerStateChange = () => {
    const container = screen.getByTestId('nav-container');
    container.props.onStateChange?.();
  };

  it('logs analytics when route changes', () => {
    render(<AppNavigationContainer />);

    triggerStateChange();

    expect(getAnalytics).toHaveBeenCalledTimes(1);
    expect(logEvent).toHaveBeenCalledWith('analytics-instance', 'screen_view', {
      firebase_screen: 'settings',
      firebase_screen_class: 'settings',
    });
  });

  it('renders gesture detector when local log is enabled', () => {
    render(<AppNavigationContainer />);

    expect(screen.getByTestId('gesture-detector')).toBeTruthy();
    expect(screen.getByTestId('root-stack')).toBeTruthy();
  });

  it('skips gesture detector when local log is disabled', () => {
    mockConfig.ENABLE_LOCAL_LOG = 'false';

    render(<AppNavigationContainer />);

    expect(screen.queryByTestId('gesture-detector')).toBeNull();
    expect(screen.getByTestId('root-stack')).toBeTruthy();
  });

  it('pushes debug menu when two-finger gesture succeeds on non-debug screens', () => {
    render(<AppNavigationContainer />);

    triggerStateChange();
    lastGesture.invokeOnEnd(true);

    expect(push).toHaveBeenCalledWith('debugMenuStack', {
      screen: 'debugMenu',
    });
  });

  it('does not push debug menu when already on debug screens', () => {
    mockGetCurrentRoute.mockReset();
    mockGetCurrentRoute
      .mockReturnValueOnce({ name: 'debugMenu' })
      .mockReturnValueOnce({ name: 'debugMenu' });

    render(<AppNavigationContainer />);

    triggerStateChange();
    lastGesture.invokeOnEnd(true);

    expect(push).not.toHaveBeenCalled();
  });
});
