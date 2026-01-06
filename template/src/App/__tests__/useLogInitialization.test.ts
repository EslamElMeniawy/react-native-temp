import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { getApplicationName } from 'react-native-device-info';
import { startNetworkLogging } from 'react-native-network-logger';
import Shake from 'react-native-shake';
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query';

jest.mock('react-native-config', () => ({
  ['ENABLE_LOCAL_LOG']: 'false',
  ['ENABLE_FIREBASE_LOG']: 'false',
}));

jest.mock('react-native-device-info', () => ({
  getApplicationName: jest.fn(),
}));

jest.mock('react-native-network-logger', () => ({
  startNetworkLogging: jest.fn(),
}));

jest.mock('react-native-shake', () => ({
  ['__esModule']: true,
  default: {
    addListener: jest.fn(),
  },
}));

jest.mock('reactotron-react-native-mmkv', () => jest.fn());

jest.mock('reactotron-react-query', () => {
  const mockQueryClientManager = jest.fn(function (this: {
    unsubscribe?: jest.Mock;
  }) {
    this.unsubscribe = jest.fn();
  } as any);
  const mockReactotronReactQuery = jest.fn();

  return {
    ['QueryClientManager']: mockQueryClientManager,
    reactotronReactQuery: mockReactotronReactQuery,
  };
});

jest.mock('@modules/core', () => ({
  localStorage: null,
}));

jest.mock('@modules/navigation', () => ({
  getCurrentRouteName: jest.fn(),
  push: jest.fn(),
}));

jest.mock('@modules/utils', () => ({
  queryClient: {},
}));

jest.mock('@eslam-elmeniawy/react-native-common-components', () => ({
  configureLog: jest.fn(),
}));

const {
  configureLog,
} = require('@eslam-elmeniawy/react-native-common-components');
const { useLogInitialization } = require('../useLogInitialization');

const mockGetApplicationName = getApplicationName as jest.Mock;
const mockStartNetworkLogging = startNetworkLogging as jest.Mock;
const mockShake = Shake as unknown as { addListener: jest.Mock };
const mockQueryClientManager = QueryClientManager as jest.Mock;
const mockReactotronReactQuery = reactotronReactQuery as jest.Mock;
const mockConfigureLog = configureLog as jest.Mock;

const testBasicSetup = function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls configureLog on mount', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    expect(mockConfigureLog).toHaveBeenCalled();
  });

  it('passes app name to configureLog', function () {
    const appName = 'MyTestApp';
    mockGetApplicationName.mockReturnValue(appName);

    renderHook(() => useLogInitialization());

    const lastCall =
      mockConfigureLog.mock.calls[mockConfigureLog.mock.calls.length - 1];
    expect(lastCall[0]).toMatchObject({
      appName,
    });
  });

  it('does not call startNetworkLogging when ENABLE_LOCAL_LOG is false', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    expect(mockStartNetworkLogging).not.toHaveBeenCalled();
  });

  it('does not set shake listener when ENABLE_LOCAL_LOG is false', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    // Verify Shake.addListener was not called
    const shakeAddListenerCallCount = mockShake.addListener.mock.calls.length;
    expect(shakeAddListenerCallCount).toBe(0);
  });
};

const testFirebaseLogConfiguration = function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not set firebaseLogLevels when ENABLE_FIREBASE_LOG is false', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    const lastCall =
      mockConfigureLog.mock.calls[mockConfigureLog.mock.calls.length - 1];
    expect((lastCall[0] as any).firebaseLogLevels).toBeUndefined();
  });

  it('sets isLocalLogEnable based on ENABLE_LOCAL_LOG', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    const lastCall =
      mockConfigureLog.mock.calls[mockConfigureLog.mock.calls.length - 1];
    expect(lastCall[0] as any).toMatchObject({
      isLocalLogEnable: false,
    });
  });
};

const testNetworkLoggingSetup = function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('includes onDisconnect callback in clientOptions', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    const lastCall =
      mockConfigureLog.mock.calls[mockConfigureLog.mock.calls.length - 1];
    const clientOptions = (lastCall[0] as any).clientOptions;
    expect(clientOptions).toHaveProperty('onDisconnect');
    expect(typeof clientOptions.onDisconnect).toBe('function');
  });

  it('calls unsubscribe on disconnect', function () {
    mockGetApplicationName.mockReturnValue('TestApp');
    const mockUnsubscribe = jest.fn();
    mockQueryClientManager.mockImplementation(function (this: {
      unsubscribe?: jest.Mock;
    }) {
      this.unsubscribe = mockUnsubscribe;
    } as any);

    renderHook(() => useLogInitialization());

    const lastCall =
      mockConfigureLog.mock.calls[mockConfigureLog.mock.calls.length - 1];
    const onDisconnect = (lastCall[0] as any).clientOptions.onDisconnect;
    onDisconnect();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('calls reactotronReactQuery plugin creator', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    renderHook(() => useLogInitialization());

    expect(mockReactotronReactQuery).toHaveBeenCalled();
  });
};

const testCleanup = function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cleanup function on mount', function () {
    mockGetApplicationName.mockReturnValue('TestApp');

    const { unmount } = renderHook(() => useLogInitialization());

    expect(() => {
      unmount();
    }).not.toThrow();
  });
};

describe('useLogInitialization', function () {
  describe('basic setup', testBasicSetup);
  describe('firebase log configuration', testFirebaseLogConfiguration);
  describe('network logging setup', testNetworkLoggingSetup);
  describe('cleanup', testCleanup);
});
