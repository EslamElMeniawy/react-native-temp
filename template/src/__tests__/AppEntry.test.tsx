import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { render, act } from '@testing-library/react-native';
import * as React from 'react';
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

  it('returns null when launched headless', () => {
    const view = render(React.createElement(appEntry, { isHeadless: true }));

    expect(view.toJSON()).toBeNull();
  });

  it('renders App and registers handlers when not headless', async () => {
    const view = render(React.createElement(appEntry));

    await act(async () => Promise.resolve());

    expect(view.toJSON()).not.toBeNull();
    expect(getMessaging).toHaveBeenCalledTimes(1);
    expect(setBackgroundMessageHandler).toHaveBeenCalledWith(
      'messaging',
      expect.any(Function),
    );
    expect(mockSetBaseDimensions).toHaveBeenCalledWith({
      width: 430,
      height: 932,
    });
  });
});
