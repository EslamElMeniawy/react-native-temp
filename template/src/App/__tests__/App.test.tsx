import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { screen } from '@testing-library/react-native';
import * as React from 'react';
import App from '@src/App/App';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';

const mockUseLocalStorageInitialization = jest.fn();

jest.mock('react-native-gesture-handler', () => {
  const rn = require('react-native');
  const react = require('react');
  return {
    ['GestureHandlerRootView']: ({ children }: any) =>
      react.createElement(rn.View, { testID: 'gesture-root' }, children),
  };
});

jest.mock('@modules/store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({})),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn(),
    [Symbol.observable]: jest.fn(),
  },
}));

jest.mock('@modules/theme', () => ({
  useAppTheme: () => ({
    colors: {
      background: '#ffffff',
    },
  }),
}));

jest.mock('../useLocalStorageInitiation', () => ({
  useLocalStorageInitialization: () => mockUseLocalStorageInitialization(),
}));

jest.mock('../AppContent', () => {
  const rn = require('react-native');
  const react = require('react');
  return () => react.createElement(rn.View, { testID: 'app-content' });
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render content when storage is not initialized', async () => {
    mockUseLocalStorageInitialization.mockReturnValue(false);

    await renderWithProviders(<App />);

    expect(screen.queryByTestId('app-content')).toBeNull();
  });

  it('renders content when storage is initialized', async () => {
    mockUseLocalStorageInitialization.mockReturnValue(true);

    await renderWithProviders(<App />);

    expect(screen.getByTestId('app-content')).toBeTruthy();
  });
});
