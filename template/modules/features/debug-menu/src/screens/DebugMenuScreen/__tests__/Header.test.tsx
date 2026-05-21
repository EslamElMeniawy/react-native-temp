import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import { fireEvent, screen } from '@testing-library/react-native';
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
  translate: jest.fn((key: string) => key),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockTranslate }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockUseNavigation(),
  createNavigationContainerRef: jest.fn(() => ({
    isReady: jest.fn(() => false),
    navigate: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => false),
  })),
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

  it('renders header with correct structure', async () => {
    await renderWithProviders(<Header />);

    expect(screen.getByTestId('appbar-header')).toBeTruthy();
    expect(screen.getByTestId('appbar-content')).toBeTruthy();
    expect(screen.getByTestId('appbar-back-action')).toBeTruthy();
  });

  it('displays translated debug menu title', async () => {
    mockTranslate.mockReturnValue('Debug Menu');

    await renderWithProviders(<Header />);

    expect(mockTranslate).toHaveBeenCalledWith('debugMenu');
    expect(screen.getByTestId('appbar-title')).toBeTruthy();
  });

  it('renders back action button', async () => {
    await renderWithProviders(<Header />);

    expect(screen.getByTestId('appbar-back-action')).toBeTruthy();
  });

  it('calls parent navigation goBack when back button is pressed', async () => {
    await renderWithProviders(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    await fireEvent.press(backButton);

    expect(mockGetParent).toHaveBeenCalled();
    expect(mockNavigationGoBack).toHaveBeenCalled();
  });

  it('handles multiple back button presses', async () => {
    await renderWithProviders(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    await fireEvent.press(backButton);
    await fireEvent.press(backButton);

    expect(mockNavigationGoBack).toHaveBeenCalledTimes(2);
  });

  it('uses TranslationNamespaces.DEBUG_MENU for translations', async () => {
    await renderWithProviders(<Header />);

    expect(mockTranslate).toHaveBeenCalled();
  });

  it('handles null parent navigation gracefully', async () => {
    mockGetParent.mockReturnValue(null);

    await renderWithProviders(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    await fireEvent.press(backButton);
  });

  it('handles undefined parent navigation gracefully', async () => {
    mockGetParent.mockReturnValue(undefined);

    await renderWithProviders(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    await fireEvent.press(backButton);
  });

  it('uses React.useCallback for onBackPress handler', async () => {
    const view = await renderWithProviders(<Header />);

    const backButton = screen.getByTestId('appbar-back-action');
    const originalOnPress = backButton.props.onPress;

    await view.rerender(<Header />);

    const updatedBackButton = screen.getByTestId('appbar-back-action');
    const newOnPress = updatedBackButton.props.onPress;

    // useCallback should keep the same reference
    expect(originalOnPress).toBe(newOnPress);
  });
});
