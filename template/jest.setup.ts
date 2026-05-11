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

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    BaseNavigationContainer: ({ children }: any) =>
      React.createElement(ReactNative.View, { children }),
    NavigationContainer: ({ children }: any) =>
      React.createElement(ReactNative.View, { children }),
    useFocusEffect: jest.fn(callback => {
      React.useEffect(callback, []);
    }),
    useRoute: jest.fn(() => ({ params: {} })),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setParams: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      isFocused: jest.fn(() => true),
      push: jest.fn(),
    })),
    createNavigationContainerRef: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setParams: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      isFocused: jest.fn(() => true),
      isReady: jest.fn(() => true),
      getCurrentRoute: jest.fn(() => ({ name: 'Home' })),
      push: jest.fn(),
    })),
    StackActions: {
      push: jest.fn((name: string, params?: any) => ({
        type: 'PUSH',
        payload: { name, params },
      })),
      replace: jest.fn((name: string, params?: any) => ({
        type: 'REPLACE',
        payload: { name, params },
      })),
      popToTop: jest.fn(() => ({
        type: 'POP_TO_TOP',
      })),
      pop: jest.fn((count?: number) => ({
        type: 'POP',
        payload: { count },
      })),
    },
    CommonActions: {
      navigate: jest.fn((name: string, params?: any) => ({
        type: 'NAVIGATE',
        payload: { name, params },
      })),
      goBack: jest.fn(() => ({
        type: 'GO_BACK',
      })),
      reset: jest.fn((state: any) => ({
        type: 'RESET',
        payload: state,
      })),
    },
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    createNativeStackNavigator: jest.fn(() => ({
      Navigator: ({ children }: any) =>
        React.createElement(ReactNative.View, { children }),
      Screen: ({ name, component }: any) =>
        React.createElement(component || ReactNative.View, { testID: name }),
    })),
  };
});

jest.mock('react-native-network-logger', () => ({ default: jest.fn() }));

jest.mock('axios', () => {
  const createMockClient = () => {
    const mockClient = {
      interceptors: {
        request: {
          use: jest.fn(
            (success: any) => {},
            (error: any) => {},
          ),
        },
        response: {
          use: jest.fn(
            (success: any) => {},
            (error: any) => {},
          ),
        },
      },
      defaults: { timeoutErrorMessage: 'Network Timeout' },
      request: jest.fn(() => Promise.resolve({ data: {} })),
      get: jest.fn(() => Promise.resolve({ data: {} })),
      delete: jest.fn(() => Promise.resolve({ data: {} })),
      head: jest.fn(() => Promise.resolve({ data: {} })),
      options: jest.fn(() => Promise.resolve({ data: {} })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
      put: jest.fn(() => Promise.resolve({ data: {} })),
      patch: jest.fn(() => Promise.resolve({ data: {} })),
      putForm: jest.fn(() => Promise.resolve({ data: {} })),
    };
    return mockClient;
  };

  return {
    create: jest.fn(createMockClient),
    default: {
      create: jest.fn(createMockClient),
    },
    isAxiosError: jest.fn(
      (error: any) => error && error.response !== undefined,
    ),
  };
});

jest.mock('toastify-react-native', () => {
  const mockToast = {
    show: jest.fn(),
    hideAll: jest.fn(),
    get: jest.fn(() => mockToast),
  };
  return {
    Toast: mockToast,
    default: jest.fn(),
  };
});

jest.mock('@modules/localization', () => ({
  translate: jest.fn((key: string) => key),
  getCurrentLocale: jest.fn(() => 'en-US'),
}));

jest.mock('@eslam-elmeniawy/react-native-common-components', () => ({
  multiply: jest.fn((a: number, b: number) => a * b),
  ResponsiveDimensions: {
    setBaseDimensions: jest.fn(),
    scale: jest.fn((x: number) => x),
    s: jest.fn((x: number) => x),
    verticalScale: jest.fn((x: number) => x),
    vs: jest.fn((x: number) => x),
    moderateScale: jest.fn((x: number) => x),
    ms: jest.fn((x: number) => x),
    moderateVerticalScale: jest.fn((x: number) => x),
    mvs: jest.fn((x: number) => x),
    percentWidth: jest.fn((x: number) => x),
    pw: jest.fn((x: number) => x),
    percentHeight: jest.fn((x: number) => x),
    ph: jest.fn((x: number) => x),
  },
  getStatusBarHeight: jest.fn((_skipAndroid?: boolean) => 0),
}));

jest.mock('react-native-nitro-modules', () => {
  return {
    NitroModules: () => {
      return {};
    },
  };
});

jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    private storage: Map<string, boolean | string | number | ArrayBuffer>;
    private listeners: Set<(changedKey: string) => void>;

    constructor() {
      this.storage = new Map();
      this.listeners = new Set();
    }

    set(key: string, value: boolean | string | number | ArrayBuffer): void {
      this.storage.set(key, value);
      this.notifyListeners(key);
    }

    getString(key: string): string | undefined {
      const value = this.storage.get(key);
      return typeof value === 'string' ? value : undefined;
    }

    getNumber(key: string): number | undefined {
      const value = this.storage.get(key);
      return typeof value === 'number' ? value : undefined;
    }

    getBoolean(key: string): boolean | undefined {
      const value = this.storage.get(key);
      return typeof value === 'boolean' ? value : undefined;
    }

    getBuffer(key: string): ArrayBuffer | undefined {
      const value = this.storage.get(key);
      return value as ArrayBuffer | undefined;
    }

    getAllKeys(): string[] {
      return Array.from(this.storage.keys());
    }

    recrypt(_key: string | undefined): void {
      throw new Error('Method not implemented.');
    }

    remove(key: string): boolean {
      const result = this.storage.delete(key);
      this.notifyListeners(key);
      return result;
    }

    contains(key: string): boolean {
      return this.storage.has(key);
    }

    clearAll(): void {
      const keys = Array.from(this.storage.keys());
      this.storage.clear();
      keys.forEach(key => this.notifyListeners(key));
    }

    addOnValueChangedListener(listener: (changedKey: string) => void): {
      remove: () => void;
    } {
      this.listeners.add(listener);
      return {
        remove: () => {
          this.listeners.delete(listener);
        },
      };
    }

    private notifyListeners(key: string): void {
      this.listeners.forEach(listener => listener(key));
    }
  }

  return {
    __esModule: true,
    MMKV: MockMMKV,
    createMMKV: jest.fn(() => new MockMMKV()),
  };
});

jest.mock('react-native-paper', () => {
  const ReactNative = require('react-native');
  const React = require('react');

  const mockTheme = {
    colors: {
      primary: '#1976D2',
      onPrimary: '#FFFFFF',
      primaryContainer: '#BBDEFB',
      onPrimaryContainer: '#0D47A1',
      secondary: '#424242',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#BDBDBD',
      onSecondaryContainer: '#212121',
      tertiary: '#FBC02D',
      onTertiary: '#000000',
      tertiaryContainer: '#FFF59D',
      onTertiaryContainer: '#F57F17',
      error: '#B00020',
      onError: '#FFFFFF',
      errorContainer: '#FFEBEE',
      onErrorContainer: '#B71C1C',
      background: '#FFFFFF',
      onBackground: '#212121',
      surface: '#FFFFFF',
      onSurface: '#212121',
      surfaceVariant: '#E0E0E0',
      onSurfaceVariant: '#616161',
      outline: '#424242',
      outlineVariant: '#BDBDBD',
      shadow: '#000000',
      scrim: '#000000',
      inverseSurface: '#212121',
      inverseOnSurface: '#F5F5F5',
      inversePrimary: '#BBDEFB',
      elevation: {
        level0: 'transparent',
        level1: '#F3E5F5',
        level2: '#EDE7F6',
        level3: '#E8E0F6',
        level4: '#E6DDF7',
        level5: '#E1D9F7',
      },
    },
    fonts: {
      displayLarge: {
        fontFamily: 'Roboto',
        fontSize: 57,
        fontWeight: '400',
        lineHeight: 64,
        letterSpacing: 0,
      },
      displayMedium: {
        fontFamily: 'Roboto',
        fontSize: 45,
        fontWeight: '400',
        lineHeight: 52,
        letterSpacing: 0,
      },
      displaySmall: {
        fontFamily: 'Roboto',
        fontSize: 36,
        fontWeight: '400',
        lineHeight: 44,
        letterSpacing: 0,
      },
      headlineLarge: {
        fontFamily: 'Roboto',
        fontSize: 32,
        fontWeight: '400',
        lineHeight: 40,
        letterSpacing: 0,
      },
      headlineMedium: {
        fontFamily: 'Roboto',
        fontSize: 28,
        fontWeight: '400',
        lineHeight: 36,
        letterSpacing: 0,
      },
      headlineSmall: {
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: '400',
        lineHeight: 32,
        letterSpacing: 0,
      },
      titleLarge: {
        fontFamily: 'Roboto',
        fontSize: 22,
        fontWeight: '500',
        lineHeight: 28,
        letterSpacing: 0,
      },
      titleMedium: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        letterSpacing: 0.15,
      },
      titleSmall: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        letterSpacing: 0.1,
      },
      bodyLarge: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0.15,
      },
      bodyMedium: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0.25,
      },
      bodySmall: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.4,
      },
      labelLarge: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        letterSpacing: 0.1,
      },
      labelMedium: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.5,
      },
      labelSmall: {
        fontFamily: 'Roboto',
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.5,
      },
    },
    roundness: 4,
    isV3: true,
  };

  const MD3LightTheme = { ...mockTheme, dark: false };
  const MD3DarkTheme = {
    ...mockTheme,
    dark: true,
    colors: {
      ...mockTheme.colors,
      background: '#121212',
      surface: '#1E1E1E',
      onBackground: '#E0E0E0',
      onSurface: '#EEEEEE',
    },
  };

  const configureFonts = (config: any) => config.config || config;

  return {
    Button: React.forwardRef((props, ref) =>
      React.createElement(
        ReactNative.TouchableOpacity,
        { ref, ...props },
        props.children,
      ),
    ),
    Text: React.forwardRef((props, ref) =>
      React.createElement(ReactNative.Text, { ref, ...props }, props.children),
    ),
    Provider: ({ children, theme }: any) =>
      React.createElement(ReactNative.View, { children }),
    PaperProvider: ({ children, theme }: any) =>
      React.createElement(ReactNative.View, { children }),
    MD3LightTheme,
    MD3DarkTheme,
    useTheme: () => mockTheme,
    Snackbar: React.forwardRef((props, ref) =>
      React.createElement(ReactNative.View, { ref, ...props }),
    ),
    Modal: React.forwardRef((props, ref) =>
      React.createElement(ReactNative.Modal, { ref, ...props }, props.children),
    ),
    Appbar: {
      Header: React.forwardRef((props, ref) =>
        React.createElement(
          ReactNative.View,
          { ref, ...props },
          props.children,
        ),
      ),
      BackAction: React.forwardRef((props, ref) =>
        React.createElement(
          ReactNative.TouchableOpacity,
          { ref, ...props },
          props.children,
        ),
      ),
    },
    ActivityIndicator: React.forwardRef((props, ref) =>
      React.createElement(ReactNative.ActivityIndicator, { ref, ...props }),
    ),
    Divider: React.forwardRef((props, ref) =>
      React.createElement(ReactNative.View, { ref, ...props }),
    ),
    Searchbar: React.forwardRef((props, ref) =>
      React.createElement(ReactNative.TextInput, { ref, ...props }),
    ),
    configureFonts,
  };
});
