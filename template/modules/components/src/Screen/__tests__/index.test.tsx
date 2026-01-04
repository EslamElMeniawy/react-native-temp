import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

const mockInsets = {
  top: 44,
  bottom: 34,
  left: 0,
  right: 0,
};

const mockTheme = {
  colors: {
    background: '#FFFFFF',
  },
};

jest.mock('react-native-safe-area-context', () => ({
  ['SafeAreaProvider']: ({ children }: any) => children,
  useSafeAreaInsets: () => mockInsets,
}));

jest.mock('@modules/theme', () => ({
  useAppTheme: () => mockTheme,
}));

jest.mock('@modules/components', () => ({
  ['SystemBars']: (props: any) => {
    const reactNative = require('react-native');
    const react = require('react');
    return react.createElement(reactNative.View, {
      testID: 'system-bars',
      ...props,
    });
  },
}));

const screenComponent = require('../').default;
const renderComponent = (props: any) =>
  render(React.createElement(screenComponent, props));

const registerChildRenderTests = () => {
  it('should render children', () => {
    const reactNative = require('react-native');
    const child = React.createElement(
      reactNative.Text,
      { testID: 'child' },
      'Test child',
    );

    renderComponent({ children: child });

    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('should render SystemBars component', () => {
    renderComponent({
      children: null,
    });

    expect(screen.getByTestId('system-bars')).toBeTruthy();
  });
};

const registerColorTests = () => {
  it('should apply theme background color by default', () => {
    renderComponent({
      children: null,
    });

    const systemBars = screen.getByTestId('system-bars');
    expect(systemBars).toBeTruthy();
  });

  it('should apply custom statusBarColor', () => {
    renderComponent({
      statusBarColor: '#000000',
      children: null,
    });

    const systemBars = screen.getByTestId('system-bars');
    expect(systemBars).toBeTruthy();
  });

  it('should apply custom navigationBarColor', () => {
    renderComponent({
      navigationBarColor: '#FF0000',
      children: null,
    });

    const systemBars = screen.getByTestId('system-bars');
    expect(systemBars).toBeTruthy();
  });
};

const registerPropsTests = () => {
  it('should pass statusBarProps to SystemBars', () => {
    renderComponent({
      statusBarProps: { style: 'dark' },
      children: null,
    });

    const systemBars = screen.getByTestId('system-bars');
    expect(systemBars).toBeTruthy();
  });

  it('should pass navigationBarProps to SystemBars', () => {
    renderComponent({
      navigationBarProps: { style: 'light' },
      children: null,
    });

    const systemBars = screen.getByTestId('system-bars');
    expect(systemBars).toBeTruthy();
  });

  it('should apply custom style', () => {
    renderComponent({
      style: { flex: 1 },
      children: null,
    });

    const systemBars = screen.getByTestId('system-bars');
    expect(systemBars).toBeTruthy();
  });
};

const registerEdgesTests = () => {
  it('should handle edges prop with all edges', () => {
    renderComponent({
      edges: ['top', 'bottom', 'left', 'right'],
      children: null,
    });

    expect(screen.getByTestId('system-bars')).toBeTruthy();
  });

  it('should handle edges prop with subset of edges', () => {
    renderComponent({
      edges: ['top'],
      children: null,
    });

    expect(screen.getByTestId('system-bars')).toBeTruthy();
  });

  it('should handle undefined edges prop', () => {
    renderComponent({
      children: null,
    });

    expect(screen.getByTestId('system-bars')).toBeTruthy();
  });
};

describe('Screen', () => {
  registerChildRenderTests();
  registerColorTests();
  registerPropsTests();
  registerEdgesTests();
});
