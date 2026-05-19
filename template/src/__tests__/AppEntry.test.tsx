import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { act } from '@testing-library/react-native';
import * as React from 'react';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';
let appEntry: React.ComponentType<{ isHeadless?: boolean }>;

const mockSetBaseDimensions =
  ResponsiveDimensions.setBaseDimensions as jest.Mock;

jest.mock('react', () => {
  const jestGlobals = require('@jest/globals');
  const actualReact = jestGlobals.jest.requireActual('react');
  const rn = require('react-native');
  return {
    ...actualReact,
    lazy: () => () =>
      actualReact.createElement(
        rn.Text,
        { testID: 'app-component' },
        'Mock App',
      ),
  };
});

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => 'messaging'),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const rn = require('react-native');
  const react = require('react');
  const jestGlobals = require('@jest/globals');
  return {
    ['ResponsiveDimensions']: {
      setBaseDimensions: jestGlobals.jest.fn(),
      scale: jestGlobals.jest.fn((x: number) => x),
      s: jestGlobals.jest.fn((x: number) => x),
      verticalScale: jestGlobals.jest.fn((x: number) => x),
      vs: jestGlobals.jest.fn((x: number) => x),
      moderateScale: jestGlobals.jest.fn((x: number) => x),
      ms: jestGlobals.jest.fn((x: number) => x),
      moderateVerticalScale: jestGlobals.jest.fn((x: number) => x),
      mvs: jestGlobals.jest.fn((x: number) => x),
      percentWidth: jestGlobals.jest.fn((x: number) => x),
      pw: jestGlobals.jest.fn((x: number) => x),
      percentHeight: jestGlobals.jest.fn((x: number) => x),
      ph: jestGlobals.jest.fn((x: number) => x),
    },
    ['Text']: (props: any) => react.createElement(rn.Text, props),
  };
});

jest.mock('@src/App', () => {
  const react = require('react');
  const rn = require('react-native');
  return {
    ['__esModule']: true,
    default: () =>
      react.createElement(rn.Text, { testID: 'app-component' }, 'Mock App'),
  };
});

describe('AppEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      appEntry = require('@src/AppEntry').default;
    });
  });

  it('returns null when launched headless', async () => {
    const view = await renderWithProviders(
      React.createElement(appEntry, { isHeadless: true }),
    );

    expect(view.toJSON()).toBeNull();
  });

  it('renders App and registers handlers when not headless', async () => {
    const view = await renderWithProviders(React.createElement(appEntry));

    await act(async () => Promise.resolve());

    expect(view.toJSON()).not.toBeNull();
    expect(getMessaging).toHaveBeenCalledTimes(1);
    expect(setBackgroundMessageHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
    );
    expect(mockSetBaseDimensions).toHaveBeenCalledWith({
      width: 430,
      height: 932,
    });
  });
});
