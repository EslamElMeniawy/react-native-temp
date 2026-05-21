import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import * as React from 'react';
import SystemBars from 'modules/components/src/SystemBars';

const mockSystemBars = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('SystemBarsMock', props);
});

jest.mock('@modules/theme', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.useAppTheme = jest.fn();
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('react-native-edge-to-edge', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.SystemBars = (props: any) => mockSystemBars(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

describe('SystemBars', () => {
  const { useAppTheme } = jest.requireMock('@modules/theme') as jest.Mocked<
    Record<string, any>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('derives light styles from light background when props omitted', async () => {
    useAppTheme.mockReturnValue({ colors: { background: '#ffffff' } });

    await renderWithProviders(<SystemBars />);

    expect(mockSystemBars).toHaveBeenCalledTimes(1);
    expect(mockSystemBars).toHaveBeenCalledWith(
      expect.objectContaining({
        style: { statusBar: 'dark', navigationBar: 'dark' },
        hidden: { statusBar: undefined, navigationBar: undefined },
      }),
    );
  });

  it('uses provided styles and hidden flags', async () => {
    useAppTheme.mockReturnValue({ colors: { background: '#000000' } });

    await renderWithProviders(
      <SystemBars
        statusBarProps={{ style: 'light', hidden: true }}
        navigationBarProps={{ style: 'dark', hidden: false }}
      />,
    );

    expect(mockSystemBars).toHaveBeenCalledWith(
      expect.objectContaining({
        style: { statusBar: 'light', navigationBar: 'dark' },
        hidden: { statusBar: true, navigationBar: false },
      }),
    );
  });
});
