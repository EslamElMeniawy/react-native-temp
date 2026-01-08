import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import Screen from 'modules/components/src/Screen';

const mockSystemBars = jest.fn((_props?: any) => null);

jest.mock('@modules/theme', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.useAppTheme = jest.fn(() => ({
    colors: {
      background: '#101010',
      onBackground: '#f0f0f0',
      primary: '#123456',
      onPrimary: '#abcdef',
    },
  }));
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('react-native-safe-area-context', () => {
  const react = require('react');
  const moduleMock: Record<string, any> = {};
  moduleMock.SafeAreaProvider = ({ children }: any) =>
    react.createElement(react.Fragment, null, children);
  moduleMock.useSafeAreaInsets = jest.fn(() => ({
    top: 10,
    bottom: 5,
    left: 2,
    right: 4,
  }));
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.SystemBars = (props: any) => mockSystemBars(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

describe('Screen', () => {
  const safeAreaMock = jest.requireMock(
    'react-native-safe-area-context',
  ) as jest.Mocked<Record<string, any>>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content with safe-area paddings and passes bar props', () => {
    const { toJSON } = render(
      <Screen
        statusBarProps={{ hidden: true }}
        statusBarColor="#111111"
        navigationBarProps={{ hidden: false }}
        navigationBarColor="#222222"
        style={{ paddingTop: 1 }}
      >
        <React.Fragment />
      </Screen>,
    );

    expect(mockSystemBars).toHaveBeenCalledWith(
      expect.objectContaining({
        statusBarProps: { hidden: true },
        statusBarColor: '#111111',
        navigationBarProps: { hidden: false },
        navigationBarColor: '#222222',
      }),
    );

    const tree = toJSON() as any[];
    expect(Array.isArray(tree)).toBe(true);

    expect(tree[0].props.style).toEqual(
      expect.objectContaining({ height: 10, backgroundColor: '#111111' }),
    );

    expect(tree[1].props.style).toEqual(
      expect.objectContaining({
        flex: 1,
        backgroundColor: '#101010',
        paddingLeft: 2,
        paddingRight: 4,
        paddingTop: 1,
      }),
    );

    expect(tree[2].props.style).toEqual(
      expect.objectContaining({ height: 5, backgroundColor: '#222222' }),
    );
  });

  it('respects edges by removing top and bottom padding', () => {
    safeAreaMock.useSafeAreaInsets.mockReturnValue({
      top: 3,
      bottom: 7,
      left: 9,
      right: 11,
    });

    const { toJSON } = render(
      <Screen edges={['left', 'right']}>
        <React.Fragment />
      </Screen>,
    );

    const tree = toJSON() as any[];

    expect(tree[0].props.style).toEqual(
      expect.objectContaining({ height: 0, backgroundColor: '#101010' }),
    );

    expect(tree[1].props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#101010',
        paddingLeft: 9,
        paddingRight: 11,
        flex: 1,
      }),
    );

    expect(tree[2].props.style).toEqual(
      expect.objectContaining({ height: 0, backgroundColor: '#101010' }),
    );
  });
});
