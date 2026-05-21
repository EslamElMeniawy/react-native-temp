import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { screen } from '@testing-library/react-native';
import * as React from 'react';
import AppContent from '@src/App/AppContent';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';

const mockUseInitialization = jest.fn();

jest.mock('@modules/components', () => {
  const rn = require('react-native');
  const react = require('react');
  return {
    ['ToastManager']: () =>
      react.createElement(rn.View, { testID: 'toast-manager' }),
    ['ErrorDialog']: () =>
      react.createElement(rn.View, { testID: 'error-dialog' }),
    ['LoadingDialog']: () =>
      react.createElement(rn.View, { testID: 'loading-dialog' }),
  };
});

jest.mock('@modules/navigation', () => {
  const rn = require('react-native');
  const react = require('react');
  return {
    ['NavigationContainer']: () =>
      react.createElement(rn.View, { testID: 'navigation-container' }),
  };
});

jest.mock('@modules/theme', () => ({
  useAppTheme: () => ({
    dark: false,
    colors: {
      background: '#ffffff',
      surface: '#ffffff',
      onSurface: '#000000',
      primary: '#123456',
      onPrimaryContainer: '#654321',
      error: '#ff0000',
    },
  }),
}));

jest.mock('@modules/utils', () => ({
  clientPersister: {},
  queryClient: {},
  registerUserServiceDependencies: jest.fn(),
}));

jest.mock('@tanstack/react-query-persist-client', () => {
  const rn = require('react-native');
  const react = require('react');
  return {
    ['PersistQueryClientProvider']: ({ children }: any) =>
      react.createElement(rn.View, { testID: 'persist-provider' }, children),
  };
});

jest.mock('react-native-paper', () => {
  const rn = require('react-native');
  const react = require('react');
  return {
    ['Provider']: ({ children }: any) =>
      react.createElement(rn.View, { testID: 'paper-provider' }, children),
  };
});

jest.mock('react-native-keyboard-controller', () => {
  const rn = require('react-native');
  const react = require('react');
  return {
    ['KeyboardProvider']: ({ children }: any) =>
      react.createElement(rn.View, { testID: 'keyboard-provider' }, children),
  };
});

jest.mock('../initialization', () => ({
  useInitialization: () => mockUseInitialization(),
}));
describe('AppContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders providers and core UI when language is loaded', async () => {
    mockUseInitialization.mockReturnValue({ isReady: true });

    await renderWithProviders(<AppContent />);

    expect(screen.getByTestId('keyboard-provider')).toBeTruthy();
    expect(screen.getByTestId('paper-provider')).toBeTruthy();
    expect(screen.getByTestId('persist-provider')).toBeTruthy();
    expect(screen.getByTestId('navigation-container')).toBeTruthy();
    expect(screen.getByTestId('error-dialog')).toBeTruthy();
    expect(screen.getByTestId('loading-dialog')).toBeTruthy();
    expect(screen.getByTestId('toast-manager')).toBeTruthy();
  });

  it('returns null when language is not loaded', async () => {
    mockUseInitialization.mockReturnValue({ isReady: false });

    const view = await renderWithProviders(<AppContent />);

    expect(view.toJSON()).toBeNull();
  });
});
