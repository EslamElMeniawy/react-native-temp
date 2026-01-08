import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import PasswordInput from '@modules/features-auth/src/screens/LoginScreen/PasswordInput';

const mockTranslate = jest.fn((key: string, options?: any) => {
  if (key.includes('password')) return 'Password';
  if (key.includes('fieldRequired')) return `${options?.field} is required`;
  return key;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockTranslate,
  }),
}));

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: {
    ['COMMON']: 'common',
    ['AUTH']: 'auth',
  },
}));

jest.mock('@modules/components', () => {
  const react = require('react');
  const reactNative = require('react-native');

  return {
    ['HookFormTextInput']: ({ name, textInputProps }: any) =>
      react.createElement(reactNative.TextInput, {
        testID: `input-${name}`,
        placeholder: textInputProps?.label,
        secureTextEntry: textInputProps?.secureTextEntry,
      }),
  };
});

describe('PasswordInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with correct name', () => {
    render(<PasswordInput />);

    expect(screen.getByTestId('input-password')).toBeTruthy();
  });

  it('should set secureTextEntry to true', () => {
    render(<PasswordInput />);

    const input = screen.getByTestId('input-password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should translate password label', () => {
    render(<PasswordInput />);

    expect(mockTranslate).toHaveBeenCalledWith(
      expect.stringContaining('auth:password'),
    );
  });

  it('should have required validation rule', () => {
    render(<PasswordInput />);

    expect(mockTranslate).toHaveBeenCalledWith(
      expect.stringContaining('fieldRequired'),
      expect.any(Object),
    );
  });

  it('should be a memo component', () => {
    expect(PasswordInput.$$typeof).toBeDefined();
  });
});
