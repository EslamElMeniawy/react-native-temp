import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import UserNameInput from '@modules/features-auth/src/screens/LoginScreen/UserNameInput';

const mockTranslate = jest.fn((key: string, options?: any) => {
  if (key.includes('username')) return 'Username';
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
        keyboardType: textInputProps?.keyboardType,
      }),
  };
});

describe('UserNameInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with correct name', () => {
    render(<UserNameInput />);

    expect(screen.getByTestId('input-username')).toBeTruthy();
  });

  it('should set keyboard type to email-address', () => {
    render(<UserNameInput />);

    const input = screen.getByTestId('input-username');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should translate username label', () => {
    render(<UserNameInput />);

    expect(mockTranslate).toHaveBeenCalledWith(
      expect.stringContaining('auth:username'),
    );
  });

  it('should have required validation rule', () => {
    render(<UserNameInput />);

    expect(mockTranslate).toHaveBeenCalledWith(
      expect.stringContaining('fieldRequired'),
      expect.any(Object),
    );
  });

  it('should be a memo component', () => {
    expect(UserNameInput.$$typeof).toBeDefined();
  });
});
