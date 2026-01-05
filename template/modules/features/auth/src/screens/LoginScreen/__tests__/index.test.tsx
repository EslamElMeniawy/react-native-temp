import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import LoginScreen from '@modules/features-auth/src/screens/LoginScreen';

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

jest.mock('@modules/features-auth/src/screens/LoginScreen/Header', () => {
  const react = require('react');
  const reactNative = require('react-native');
  return function Header() {
    return react.createElement(
      reactNative.Text,
      { testID: 'login-header' },
      'Header',
    );
  };
});

jest.mock('@modules/features-auth/src/screens/LoginScreen/Form', () => {
  const react = require('react');
  const reactNative = require('react-native');
  return function Form() {
    return react.createElement(
      reactNative.Text,
      { testID: 'login-form' },
      'Form',
    );
  };
});

describe('LoginScreen', () => {
  it('should render correctly', () => {
    render(<LoginScreen />);

    expect(screen.getByTestId('login-header')).toBeTruthy();
    expect(screen.getByTestId('login-form')).toBeTruthy();
  });

  it('should render with correct scroll structure', () => {
    render(<LoginScreen />);

    const form = screen.getByTestId('login-form');
    expect(form).toBeTruthy();
  });

  it('should be a memo component', () => {
    expect(LoginScreen.$$typeof).toBeDefined();
  });
});
