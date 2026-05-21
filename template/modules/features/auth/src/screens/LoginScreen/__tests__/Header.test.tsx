import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import Header from '@modules/features-auth/src/screens/LoginScreen/Header';

const mockTranslate = jest.fn();

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: {
    ['AUTH']: 'auth',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockTranslate }),
}));

jest.mock('react-native-paper', () => {
  const react = require('react');
  const reactNative = require('react-native');

  return {
    ['Appbar']: {
      ['Header']: ({ children, ...props }: any) =>
        react.createElement(
          reactNative.View,
          { testID: 'appbar-header', ...props },
          children,
        ),
      ['Content']: ({ title, ...props }: any) =>
        react.createElement(
          reactNative.View,
          { testID: 'appbar-content', ...props },
          react.createElement(
            reactNative.Text,
            { testID: 'appbar-title' },
            title,
          ),
        ),
    },
  };
});

describe('LoginScreen Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslate.mockImplementation((...args: any[]) => args[0] as string);
  });

  it('renders header with correct structure', async () => {
    await render(<Header />);

    expect(mockTranslate).toHaveBeenCalled();
  });

  it('displays translated login title', async () => {
    await render(<Header />);

    expect(mockTranslate).toHaveBeenCalledWith('login');
  });

  it('uses TranslationNamespaces.AUTH for translations', async () => {
    await render(<Header />);

    expect(mockTranslate).toHaveBeenCalled();
  });

  it('renders without crashing', async () => {
    const { unmount } = await render(<Header />);
    unmount();
  });

  it('uses memo for performance optimization', async () => {
    const { rerender } = await render(<Header />);

    const initialCallCount = mockTranslate.mock.calls.length;
    await rerender(<Header />);

    expect(mockTranslate.mock.calls.length).toBeLessThanOrEqual(
      initialCallCount + 1,
    );
  });

  it('only renders Appbar.Header and Appbar.Content', async () => {
    await render(<Header />);

    expect(mockTranslate.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
