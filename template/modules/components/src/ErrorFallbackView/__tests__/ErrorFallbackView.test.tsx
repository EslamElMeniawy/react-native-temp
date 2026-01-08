import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import ErrorFallbackView from 'modules/components/src/ErrorFallbackView';

const mockText = jest.fn((props: any) => {
  const react = require('react');
  const { Text: reactNativeText } = require('react-native');
  return react.createElement(reactNativeText, props);
});

const mockButton = jest.fn((props: any) => {
  const react = require('react');
  const {
    Pressable: reactNativePressable,
    Text: reactNativeText,
  } = require('react-native');
  return react.createElement(
    reactNativePressable,
    { onPress: props.onPress, testID: 'restart-button', style: props.style },
    react.createElement(reactNativeText, props.textProps, props.text),
  );
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.Text = (props: any) => mockText(props);
  moduleMock.Button = (props: any) => mockButton(props);
  moduleMock.ResponsiveDimensions = {
    vs: jest.fn((value: number) => value),
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/localization', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.translate = jest.fn((key: string) => key);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/theme', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.useAppTheme = jest.fn(() => ({
    colors: {
      background: '#000000',
      onBackground: '#ffffff',
      primary: '#123456',
      onPrimary: '#abcdef',
    },
  }));
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.Screen = ({ children, style }: any) => {
    const react = require('react');
    const { View: reactNativeView } = require('react-native');
    return react.createElement(
      reactNativeView,
      { style, testID: 'screen' },
      children,
    );
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('react-native-safe-area-context', () => {
  const react = require('react');
  const moduleMock: Record<string, any> = {};
  moduleMock.SafeAreaProvider = ({ children }: any) =>
    react.createElement(react.Fragment, null, children);
  moduleMock.useSafeAreaInsets = () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('react-native-restart', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.Restart = jest.fn();
  moduleMock.default = moduleMock;
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

describe('ErrorFallbackView', () => {
  const localizationMock = jest.requireMock(
    '@modules/localization',
  ) as jest.Mocked<Record<string, any>>;
  const restartMock = jest.requireMock('react-native-restart') as jest.Mocked<
    Record<string, any>
  >;
  const bootSplashMock = jest.requireMock(
    'react-native-bootsplash',
  ) as jest.Mocked<Record<string, any>>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hides bootsplash and renders translated texts', () => {
    render(<ErrorFallbackView />);

    expect(bootSplashMock.hide).toHaveBeenCalledTimes(1);
    expect(localizationMock.translate).toHaveBeenCalledWith(
      'errorFallbackTitle',
    );
    expect(localizationMock.translate).toHaveBeenCalledWith(
      'errorFallbackMessage',
    );
    expect(localizationMock.translate).toHaveBeenCalledWith('restartApp');

    expect(screen.getByText('errorFallbackTitle')).toBeTruthy();
    expect(screen.getByText('errorFallbackMessage')).toBeTruthy();
    expect(screen.getByText('restartApp')).toBeTruthy();
  });

  it('restarts the app when the button is pressed', () => {
    render(<ErrorFallbackView />);

    fireEvent.press(screen.getByTestId('restart-button'));

    expect(restartMock.Restart).toHaveBeenCalledTimes(1);
  });
});
