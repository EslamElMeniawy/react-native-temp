import { jest } from '@jest/globals';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('react-native-localize', () => {
  const getCalendar = () => 'gregorian';
  const getCountry = () => 'US';
  const getCurrencies = () => ['USD', 'EUR'];

  const getLocales = () => [
    {
      countryCode: 'US',
      languageTag: 'en-US',
      languageCode: 'en',
      isRTL: false,
    },
    {
      countryCode: 'FR',
      languageTag: 'fr-FR',
      languageCode: 'fr',
      isRTL: false,
    },
  ];

  const getNumberFormatSettings = () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  });

  const findBestLanguageTag = () => ({ languageTag: 'en-US', isRTL: false });

  const getTemperatureUnit = () => 'celsius';
  const getTimeZone = () => 'Europe/Paris';
  const uses24HourClock = () => true;
  const usesAutoDateAndTime = () => true;
  const usesAutoTimeZone = () => true;
  const usesMetricSystem = () => true;

  return {
    getCalendar,
    getCountry,
    getCurrencies,
    getLocales,
    getNumberFormatSettings,
    findBestLanguageTag,
    getTemperatureUnit,
    getTimeZone,
    uses24HourClock,
    usesAutoDateAndTime,
    usesAutoTimeZone,
    usesMetricSystem,
  };
});

jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn<() => Promise<void>>().mockResolvedValue(),
    isVisible: jest.fn<() => Promise<boolean>>().mockResolvedValue(false),
    useHideAnimation: jest.fn().mockReturnValue({
      container: {},
      logo: { source: 0 },
      brand: { source: 0 },
    }),
  };
});

jest.mock('react-native-keyboard-controller', () => {
  const values = {
    animated: { progress: 0, height: 0 },
    reanimated: {
      progress: { value: 0, get: jest.fn().mockReturnValue(0), set: jest.fn() },
      height: { value: 0, get: jest.fn().mockReturnValue(0), set: jest.fn() },
    },
  };
  const inputData = {
    target: 1,
    parentScrollViewTarget: -1,
    layout: {
      x: 0,
      y: 0,
      width: 200,
      height: 40,
      absoluteX: 0,
      absoluteY: 100,
    },
  };
  const focusedInput = {
    input: {
      value: inputData,
      get: jest.fn().mockReturnValue(inputData),
      set: jest.fn(),
    },
  };

  const RNKeyboardController = {
    // hooks
    /// keyboard
    useKeyboardAnimation: jest.fn().mockReturnValue(values.animated),
    useReanimatedKeyboardAnimation: jest
      .fn()
      .mockReturnValue(values.reanimated),
    useResizeMode: jest.fn(),
    useGenericKeyboardHandler: jest.fn(),
    useKeyboardHandler: jest.fn(),
    useKeyboardContext: jest.fn().mockReturnValue(values),
    /// input
    useReanimatedFocusedInput: jest.fn().mockReturnValue(focusedInput),
    useFocusedInputHandler: jest.fn(),
    /// module
    useKeyboardController: jest
      .fn()
      .mockReturnValue({ setEnabled: jest.fn(), enabled: true }),
    // modules
    KeyboardController: {
      setInputMode: jest.fn(),
      setDefaultMode: jest.fn(),
      dismiss: jest.fn().mockReturnValue(Promise.resolve()),
      setFocusTo: jest.fn(),
      isVisible: jest.fn().mockReturnValue(false),
      state: jest.fn().mockReturnValue(null),
    },
    AndroidSoftInputModes: {
      SOFT_INPUT_ADJUST_NOTHING: 48,
      SOFT_INPUT_ADJUST_PAN: 32,
      SOFT_INPUT_ADJUST_RESIZE: 16,
      SOFT_INPUT_ADJUST_UNSPECIFIED: 0,
      SOFT_INPUT_IS_FORWARD_NAVIGATION: 256,
      SOFT_INPUT_MASK_ADJUST: 240,
      SOFT_INPUT_MASK_STATE: 15,
      SOFT_INPUT_MODE_CHANGED: 512,
      SOFT_INPUT_STATE_ALWAYS_HIDDEN: 3,
      SOFT_INPUT_STATE_ALWAYS_VISIBLE: 5,
      SOFT_INPUT_STATE_HIDDEN: 2,
      SOFT_INPUT_STATE_UNCHANGED: 1,
      SOFT_INPUT_STATE_UNSPECIFIED: 0,
      SOFT_INPUT_STATE_VISIBLE: 4,
    },
    KeyboardEvents: { addListener: jest.fn(() => ({ remove: jest.fn() })) },
    // views
    KeyboardControllerView: 'KeyboardControllerView',
    KeyboardGestureArea: 'KeyboardGestureArea',
    OverKeyboardView: 'OverKeyboardView',
    // providers
    KeyboardProvider: 'KeyboardProvider',
  };

  return RNKeyboardController;
});

jest.mock('react-native', () => {
  const RN = jest.requireActual<typeof import('react-native')>('react-native');

  Object.defineProperty(RN, 'Settings', {
    get: jest.fn(() => {
      return { get: jest.fn(), set: jest.fn(), watchKeys: jest.fn() };
    }),
  });

  Object.defineProperty(RN, 'I18nManager', {
    get: jest.fn(() => {
      return {
        getConstants: () => ({ isRTL: false }),
        allowRTL: jest.fn(),
        forceRTL: jest.fn(),
        isRTL: false,
      };
    }),
  });

  return RN;
});

jest.mock('@notifee/react-native', () => {
  /**
   * Devido a vários problemas ao importar o mock oferecido pela notifee, resolvi
   * criar manualmente o mock apenas das funcionalidades que utilizamos no app.
   * https://github.com/invertase/notifee/issues/739
   */

  const notifee = {
    getInitialNotification: jest
      .fn<() => Promise<null>>()
      .mockResolvedValue(null),
    displayNotification: jest.fn<() => Promise<void>>().mockResolvedValue(),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
    onBackgroundEvent: jest.fn(),
    createChannelGroup: jest
      .fn<() => Promise<string>>()
      .mockResolvedValue('channel-group-id'),
    createChannel: jest.fn<() => Promise<void>>().mockResolvedValue(),
    setBadgeCount: jest.fn<() => Promise<void>>().mockResolvedValue(),
    cancelNotification: jest.fn(),
  };

  return notifee;
});

jest.mock('@react-native-firebase/analytics', () => () => ({
  getAnalytics: jest.fn(),
  logScreenView: jest.fn(() => Promise.resolve()),
  logEvent: jest.fn(),
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  setCurrentScreen: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => () => ({
  getMessaging: jest.fn(),
  deleteToken: jest.fn(),
  setBackgroundMessageHandler: jest.fn(),
  onMessage: jest.fn(),
  isAutoInitEnabled: jest.fn(() => true),
  setAutoInitEnabled: jest.fn(),
  hasPermission: jest.fn(() => Promise.resolve(true)),
  onNotificationOpenedApp: jest.fn(),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve('myMockToken')),
}));

jest.mock('react-native-network-logger', () => ({ default: jest.fn() }));

jest.mock('@modules/localization', () => ({
  translate: jest.fn((key: string) => key),
}));
