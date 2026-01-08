import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import Header from '@modules/features-debug-menu/src/screens/NetworkLogsScreen/Header';

const mockTranslate = jest.fn();
const mockNavigationGoBack = jest.fn();
const mockUseNavigation = jest.fn();

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: {
    ['DEBUG_MENU']: 'debug-menu',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockTranslate }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockUseNavigation(),
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
      ['BackAction']: ({ onPress, ...props }: any) =>
        react.createElement(
          reactNative.Pressable,
          { testID: 'appbar-back-action', onPress, ...props },
          react.createElement(reactNative.Text, null, 'Back'),
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

describe('NetworkLogsScreen Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslate.mockImplementation((...args: any[]) => args[0] as string);
    mockUseNavigation.mockReturnValue({ goBack: mockNavigationGoBack });
  });

  it('renders header with correct structure', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-header')).toBeTruthy();
    expect(screen.getByTestId('appbar-content')).toBeTruthy();
    expect(screen.getByTestId('appbar-back-action')).toBeTruthy();
  });

  it('displays translated network logs title', () => {
    mockTranslate.mockReturnValue('Network Logs');

    render(<Header />);

    expect(mockTranslate).toHaveBeenCalledWith('networkLogs');
    expect(screen.getByTestId('appbar-title')).toBeTruthy();
  });

  it('renders back action button', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-back-action')).toBeTruthy();
  });

  it('calls navigation goBack when back button is pressed', () => {
    render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    fireEvent.press(backButton);

    expect(mockNavigationGoBack).toHaveBeenCalled();
  });

  it('handles multiple back button presses', () => {
    render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    fireEvent.press(backButton);

    expect(mockNavigationGoBack).toHaveBeenCalledTimes(3);
  });

  it('uses TranslationNamespaces.DEBUG_MENU for translations', () => {
    render(<Header />);

    expect(mockTranslate).toHaveBeenCalled();
  });

  it('uses React.useCallback for onBackPress handler', () => {
    const { rerender } = render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    const originalOnPress = backButton.props.onPress;

    rerender(<Header />);

    const updatedBackButton = screen.getByTestId('appbar-back-action');
    const newOnPress = updatedBackButton.props.onPress;

    // useCallback should keep the same reference
    expect(originalOnPress).toBe(newOnPress);
  });

  it('calls navigation goBack directly without getParent', () => {
    render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    fireEvent.press(backButton);

    // Verify navigation.goBack() is called directly, not navigation.getParent()?.goBack()
    expect(mockNavigationGoBack).toHaveBeenCalled();
    expect(mockUseNavigation).toHaveBeenCalled();
  });
});
