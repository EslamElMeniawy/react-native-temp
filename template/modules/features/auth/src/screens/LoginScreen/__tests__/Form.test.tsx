import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import Form from '@modules/features-auth/src/screens/LoginScreen/Form';

jest.mock('react-hook-form', () => {
  const react = require('react');
  const reactNative = require('react-native');

  return {
    useForm: jest.fn(() => ({
      control: {},
      handleSubmit: jest.fn((callback: any) =>
        callback({ username: '', password: '' }),
      ),
      watch: jest.fn(),
      formState: { errors: {} },
    })),
    ['FormProvider']: ({ children, ...props }: any) =>
      react.createElement(reactNative.View, props, children),
    useFormContext: jest.fn(() => ({
      control: {},
      watch: jest.fn(),
      formState: { errors: {} },
      handleSubmit: jest.fn(),
    })),
    useController: jest.fn(() => ({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: '',
      },
      fieldState: { error: undefined },
    })),
  };
});

jest.mock(
  '@modules/features-auth/src/screens/LoginScreen/UserNameInput',
  () => {
    const react = require('react');
    const reactNative = require('react-native');
    return function UserNameInput() {
      return react.createElement(
        reactNative.Text,
        { testID: 'username-input' },
        'Username Input',
      );
    };
  },
);

jest.mock(
  '@modules/features-auth/src/screens/LoginScreen/PasswordInput',
  () => {
    const react = require('react');
    const reactNative = require('react-native');
    return function PasswordInput() {
      return react.createElement(
        reactNative.Text,
        { testID: 'password-input' },
        'Password Input',
      );
    };
  },
);

jest.mock('@modules/features-auth/src/screens/LoginScreen/LoginButton', () => {
  const react = require('react');
  const reactNative = require('react-native');
  return function LoginButton() {
    return react.createElement(
      reactNative.Text,
      { testID: 'login-button' },
      'Login Button',
    );
  };
});

describe('LoginScreen Form', () => {
  it('should render all form inputs', () => {
    render(<Form />);

    expect(screen.getByTestId('username-input')).toBeTruthy();
    expect(screen.getByTestId('password-input')).toBeTruthy();
    expect(screen.getByTestId('login-button')).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    render(<Form />);

    const { useForm } = require('react-hook-form');
    expect(useForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: expect.objectContaining({
          username: '',
          password: '',
        }),
      }),
    );
  });

  it('should render FormProvider wrapper', () => {
    render(<Form />);

    expect(screen.getByTestId('username-input')).toBeTruthy();
  });

  it('should be a memo component', () => {
    expect(Form.$$typeof).toBeDefined();
  });
});
