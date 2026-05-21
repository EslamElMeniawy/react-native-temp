import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as React from 'react';
import FeatureErrorBoundary from 'modules/components/src/FeatureErrorBoundary';

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
    { onPress: props.onPress, testID: 'try-again-button', style: props.style },
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

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('FeatureErrorBoundary', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when no error occurs', async () => {
    await render(
      <FeatureErrorBoundary featureName="TestFeature">
        <React.Fragment>
          {React.createElement(
            require('react-native').Text,
            null,
            'Child content',
          )}
        </React.Fragment>
      </FeatureErrorBoundary>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('renders fallback UI when a child throws an error', async () => {
    await render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ProblemChild />
      </FeatureErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(
      screen.getByText('The TestFeature feature encountered an error.'),
    ).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('calls onError callback with error and featureName', async () => {
    const onError = jest.fn();

    await render(
      <FeatureErrorBoundary featureName="TestFeature" onError={onError}>
        <ProblemChild />
      </FeatureErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'TestFeature');
  });

  it('logs the error to console.error with feature name', async () => {
    await render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ProblemChild />
      </FeatureErrorBoundary>,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'FeatureErrorBoundary::TestFeature',
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it('resets the error boundary when Try Again is pressed', async () => {
    let shouldThrow = true;

    const ConditionalChild = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return React.createElement(
        require('react-native').Text,
        null,
        'Recovered content',
      );
    };

    await render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ConditionalChild />
      </FeatureErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();

    shouldThrow = false;
    fireEvent.press(screen.getByTestId('try-again-button'));

    await waitFor(() => {
      expect(screen.getByText('Recovered content')).toBeTruthy();
    });
  });

  it('applies theme colors to the fallback component', async () => {
    await render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ProblemChild />
      </FeatureErrorBoundary>,
    );

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        style: expect.objectContaining({ color: '#ffffff' }),
      }),
    );

    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        style: expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#123456' }),
        ]),
      }),
    );
  });
});
