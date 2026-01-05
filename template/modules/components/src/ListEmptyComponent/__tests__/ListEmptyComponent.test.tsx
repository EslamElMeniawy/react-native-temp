import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import ListEmptyComponent from 'modules/components/src/ListEmptyComponent';

const mockIcon = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('IconMock', props);
});

jest.mock('react-native-paper', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.Icon = (props: any) => mockIcon(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.Text = (props: any) => {
    const react = require('react');
    const { Text: reactNativeText } = require('react-native');
    return react.createElement(reactNativeText, props);
  };
  moduleMock.ResponsiveDimensions = {
    vs: jest.fn((value: number) => value),
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/localization', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.TranslationNamespaces = {};
  Object.defineProperty(moduleMock.TranslationNamespaces, 'COMMON', {
    value: 'common',
  });
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn(
      (key: string, params?: { data?: string }) => `${key}:${params?.data}`,
    ),
  }),
}));

describe('ListEmptyComponent', () => {
  it('shows error icon and message when loading error with custom error message', () => {
    render(
      React.createElement(ListEmptyComponent, {
        isLoadingError: true,
        error: { errorMessage: 'Boom' } as any,
        data: 'items',
      }),
    );

    expect(mockIcon).toHaveBeenCalledWith(
      expect.objectContaining({ size: 64, source: 'alert-circle-outline' }),
    );
    expect(screen.getByText('Boom')).toBeTruthy();
  });

  it('shows no data message when no error', () => {
    render(
      React.createElement(ListEmptyComponent, {
        isLoadingError: false,
        data: 'users',
      }),
    );

    expect(mockIcon).toHaveBeenCalledWith(
      expect.objectContaining({ size: 64, source: 'database-remove-outline' }),
    );
    expect(screen.getByText('noDataAvailable:users')).toBeTruthy();
  });
});
