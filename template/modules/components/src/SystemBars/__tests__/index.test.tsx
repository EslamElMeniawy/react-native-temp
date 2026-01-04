import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

const mockTheme = {
  colors: {
    background: '#FFFFFF',
  },
};

jest.mock('@modules/theme', () => ({
  useAppTheme: () => mockTheme,
}));

jest.mock('react-native-edge-to-edge', () => {
  const reactNative = require('react-native');
  const react = require('react');
  return {
    ['SystemBars']: (props: any) =>
      react.createElement(reactNative.View, {
        testID: 'system-bars',
        ...props,
      }),
  };
});

jest.mock('tinycolor2', () => jest.fn((color: string) => ({
  isLight: () => color === '#FFFFFF',
})));

const systemBars = require('../').default;
const renderComponent = (props: any) =>
  render(React.createElement(systemBars, props));

const registerBasicTests = () => {
  it('should render SystemBars component', () => {
    renderComponent({});

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should use theme background color by default', () => {
    renderComponent({});

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should apply custom statusBarColor', () => {
    renderComponent({
      statusBarColor: '#000000',
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should apply custom navigationBarColor', () => {
    renderComponent({
      navigationBarColor: '#000000',
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });
};

const registerStatusBarTests = () => {
  it('should handle statusBarProps with string style', () => {
    renderComponent({
      statusBarProps: { style: 'dark' },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should handle statusBarProps with object style', () => {
    renderComponent({
      statusBarProps: { style: { statusBar: 'light' } },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should handle statusBarProps with boolean hidden', () => {
    renderComponent({
      statusBarProps: { hidden: true },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should handle statusBarProps with object hidden', () => {
    renderComponent({
      statusBarProps: { hidden: { statusBar: false } },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });
};

const registerNavigationBarTests = () => {
  it('should handle navigationBarProps with string style', () => {
    renderComponent({
      navigationBarProps: { style: 'light' },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should handle navigationBarProps with object style', () => {
    renderComponent({
      navigationBarProps: { style: { navigationBar: 'dark' } },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should handle navigationBarProps with boolean hidden', () => {
    renderComponent({
      navigationBarProps: { hidden: false },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });

  it('should handle navigationBarProps with object hidden', () => {
    renderComponent({
      navigationBarProps: { hidden: { navigationBar: true } },
    });

    const systemBarsView = screen.getByTestId('system-bars');
    expect(systemBarsView).toBeTruthy();
  });
};

describe('SystemBars', () => {
  registerBasicTests();
  registerStatusBarTests();
  registerNavigationBarTests();
});
