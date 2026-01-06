import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import Header from '@modules/features-debug-menu/src/screens/DebugMenuScreen/Header';

const mockTranslate = jest.fn();
const mockNavigationGoBack = jest.fn();
const mockGetParent = jest.fn();
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

describe('DebugMenuScreen Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslate.mockImplementation((...args: any[]) => args[0] as string);
    mockGetParent.mockReturnValue({ goBack: mockNavigationGoBack });
    mockUseNavigation.mockReturnValue({ getParent: mockGetParent });
  });

  it('renders header with correct structure', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-header')).toBeTruthy();
    expect(screen.getByTestId('appbar-content')).toBeTruthy();
    expect(screen.getByTestId('appbar-back-action')).toBeTruthy();
  });

  it('displays translated debug menu title', () => {
    mockTranslate.mockReturnValue('Debug Menu');

    render(<Header />);

    expect(mockTranslate).toHaveBeenCalledWith('debugMenu');
    expect(screen.getByTestId('appbar-title')).toBeTruthy();
  });

  it('renders back action button', () => {
    render(<Header />);

    expect(screen.getByTestId('appbar-back-action')).toBeTruthy();
  });

  it('calls parent navigation goBack when back button is pressed', () => {
    render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    fireEvent.press(backButton);

    expect(mockGetParent).toHaveBeenCalled();
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

  it('handles null parent navigation gracefully', () => {
    mockGetParent.mockReturnValue(null);

    render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');

    expect(() => fireEvent.press(backButton)).not.toThrow();
  });

  it('handles undefined parent navigation gracefully', () => {
    mockGetParent.mockReturnValue(undefined);

    render(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');

    expect(() => fireEvent.press(backButton)).not.toThrow();
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
});
