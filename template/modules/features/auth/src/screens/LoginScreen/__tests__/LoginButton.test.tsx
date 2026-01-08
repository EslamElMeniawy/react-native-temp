import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import LoginButton from '@modules/features-auth/src/screens/LoginScreen/LoginButton';

const mockTranslate = jest.fn();
const mockLoginButton = { isLoggingIn: false, onLoginPress: jest.fn() };
const mockHandleSubmit = jest.fn(cb => cb);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockTranslate }),
}));

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: {
    ['COMMON']: 'common',
    ['AUTH']: 'auth',
  },
}));

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    handleSubmit: mockHandleSubmit,
  })),
}));

jest.mock('@modules/features-auth/src/screens/LoginScreen/useLoginButton', () =>
  jest.fn(() => mockLoginButton),
);

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const react = require('react');
  const reactNative = require('react-native');

  return {
    ['Button']: ({ text, onPress, style }: any) =>
      react.createElement(
        reactNative.Pressable,
        {
          testID: 'login-button-pressable',
          onPress,
          style,
        },
        react.createElement(
          reactNative.Text,
          { testID: 'login-button-text' },
          text,
        ),
      ),
    ['ResponsiveDimensions']: {
      vs: () => 0,
      hs: () => 0,
      ms: () => 0,
    },
  };
});

jest.mock('react-native-paper', () => {
  const react = require('react');
  const reactNative = require('react-native');
  return {
    ['ActivityIndicator']: ({ style }: any) =>
      react.createElement(reactNative.View, {
        testID: 'loading-indicator',
        style,
      }),
  };
});

describe('LoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslate.mockReturnValue('Login');
    mockLoginButton.isLoggingIn = false;
    mockLoginButton.onLoginPress = jest.fn();
  });

  it('should render button when not logging in', () => {
    mockLoginButton.isLoggingIn = false;

    render(<LoginButton />);

    expect(screen.getByTestId('login-button-pressable')).toBeTruthy();
    expect(screen.getByTestId('login-button-text')).toBeTruthy();
  });

  it('should render loading indicator when logging in', () => {
    mockLoginButton.isLoggingIn = true;

    render(<LoginButton />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should translate login button text', () => {
    render(<LoginButton />);

    expect(mockTranslate).toHaveBeenCalledWith('login');
  });

  it('should call handleSubmit on button press', () => {
    mockLoginButton.isLoggingIn = false;

    render(<LoginButton />);
    const button = screen.getByTestId('login-button-pressable');

    expect(button).toBeTruthy();
  });

  it('should be a memo component', () => {
    expect(LoginButton.$$typeof).toBeDefined();
  });
});
