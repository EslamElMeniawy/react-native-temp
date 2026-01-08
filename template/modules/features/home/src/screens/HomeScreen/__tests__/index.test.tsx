import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { useGetUserDetailsApi } from '@modules/features-profile';
import { useFocusNotifyOnChangeProps, useRefreshOnFocus } from '@modules/utils';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import HomeScreen from '@modules/features-home/src/screens/HomeScreen';

jest.mock('@modules/components', () => {
  const react = require('react');
  const reactNative = require('react-native');
  return {
    ['Screen']: ({ children }: any) => children,
    ['ScrollContainer']: ({ children, style, contentContainerStyle }: any) =>
      react.createElement(
        reactNative.View,
        { style: [style, contentContainerStyle] },
        children,
      ),
  };
});

jest.mock('@modules/features-profile', () => ({
  useGetUserDetailsApi: jest.fn(),
}));

jest.mock('@modules/utils', () => ({
  useFocusNotifyOnChangeProps: jest.fn(),
  useRefreshOnFocus: jest.fn(),
}));

jest.mock('@modules/features-home/src/screens/HomeScreen/Header', () => {
  const react = require('react');
  const reactNative = require('react-native');
  return function Header() {
    return react.createElement(
      reactNative.Text,
      { testID: 'home-header' },
      'Header',
    );
  };
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const react = require('react');
  const reactNative = require('react-native');

  return {
    ['Text']: ({ children, ...props }: any) =>
      react.createElement(reactNative.Text, props, children),
    ['ResponsiveDimensions']: {
      vs: () => 0,
      hs: () => 0,
      ms: () => 0,
    },
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFocusNotifyOnChangeProps as jest.Mock).mockReturnValue(() => ({
      notifyOnChange: jest.fn(),
    }));
    (useGetUserDetailsApi as jest.Mock).mockReturnValue({
      data: { id: 1, name: 'Test User' },
      dataUpdatedAt: Date.now(),
      refetch: jest.fn(),
    });
    (useRefreshOnFocus as jest.Mock).mockImplementation(() => {});
  });

  it('should render correctly', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('home-header')).toBeTruthy();
  });

  it('should call useGetUserDetailsApi with notifyOnChangeProps', () => {
    render(<HomeScreen />);

    expect(useGetUserDetailsApi).toHaveBeenCalled();
    expect(useFocusNotifyOnChangeProps).toHaveBeenCalled();
  });

  it('should call useRefreshOnFocus with refetch function', () => {
    render(<HomeScreen />);

    expect(useRefreshOnFocus).toHaveBeenCalled();
  });

  it('should display user data when available', () => {
    const testData = { id: 123, name: 'John Doe', email: 'john@example.com' };
    (useGetUserDetailsApi as jest.Mock).mockReturnValue({
      data: testData,
      dataUpdatedAt: 1609459200000,
      refetch: jest.fn(),
    });

    render(<HomeScreen />);

    expect(screen.getByText(/UserData/)).toBeTruthy();
  });

  it('should handle null user data gracefully', () => {
    (useGetUserDetailsApi as jest.Mock).mockReturnValue({
      data: null,
      dataUpdatedAt: 0,
      refetch: jest.fn(),
    });

    render(<HomeScreen />);

    expect(screen.getByText(/UserData/)).toBeTruthy();
  });

  it('should be a memo component', () => {
    expect(HomeScreen.$$typeof).toBeDefined();
  });
});
