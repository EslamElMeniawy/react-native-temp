import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import Header from '@modules/features-home/src/screens/HomeScreen/Header';

const mockNavigationPush = jest.fn();
const mockRemoveUserDataLogout = jest.fn();
const mockTranslate = jest.fn((key: string) => key);

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: {
    ['HOME']: 'home',
  },
}));

jest.mock('@modules/utils', () => ({
  removeUserDataLogout: () => mockRemoveUserDataLogout(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    push: mockNavigationPush,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockTranslate,
  }),
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
      ['Action']: ({ icon, onPress, ...props }: any) =>
        react.createElement(
          reactNative.Pressable,
          { testID: `appbar-action-${icon}`, onPress, ...props },
          react.createElement(reactNative.Text, null, icon),
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

describe('HomeScreen Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslate.mockImplementation((key: string) => key);
  });

  it('renders header with correct structure', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-header')).toBeTruthy();
    expect(screen.getByTestId('appbar-content')).toBeTruthy();
  });

  it('displays translated home title', () => {
    mockTranslate.mockReturnValue('Home Screen');

    render(<Header />);

    expect(mockTranslate).toHaveBeenCalledWith('home');
    expect(screen.getByTestId('appbar-title')).toBeTruthy();
  });

  it('renders notifications bell icon', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-action-bell')).toBeTruthy();
  });

  it('renders logout icon', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-action-logout')).toBeTruthy();
  });

  it('navigates to notifications screen when bell icon is pressed', () => {
    render(<Header />);

    const bellButton = screen.getByTestId('appbar-action-bell');
    fireEvent.press(bellButton);

    expect(mockNavigationPush).toHaveBeenCalledWith('notifications');
  });

  it('calls removeUserDataLogout when logout icon is pressed', () => {
    render(<Header />);

    const logoutButton = screen.getByTestId('appbar-action-logout');
    fireEvent.press(logoutButton);

    expect(mockRemoveUserDataLogout).toHaveBeenCalled();
  });

  it('handles multiple bell icon presses', () => {
    render(<Header />);

    const bellButton = screen.getByTestId('appbar-action-bell');
    fireEvent.press(bellButton);
    fireEvent.press(bellButton);
    fireEvent.press(bellButton);

    expect(mockNavigationPush).toHaveBeenCalledTimes(3);
    expect(mockNavigationPush).toHaveBeenCalledWith('notifications');
  });

  it('handles multiple logout presses', () => {
    render(<Header />);

    const logoutButton = screen.getByTestId('appbar-action-logout');
    fireEvent.press(logoutButton);
    fireEvent.press(logoutButton);

    expect(mockRemoveUserDataLogout).toHaveBeenCalledTimes(2);
  });

  it('uses TranslationNamespaces.HOME for translations', () => {
    render(<Header />);

    expect(mockTranslate).toHaveBeenCalled();
  });
});
