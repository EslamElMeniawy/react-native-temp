import { View } from 'react-native';

export const createNavigationContainerRef = jest.fn(() => ({
  isReady: jest.fn(() => true),
  navigate: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => false),
}));

export const NavigationContainer = jest.fn(({ children }) => (
  <View>{children}</View>
));

export const StackActions = {
  push: jest.fn((name, params) => ({
    type: 'PUSH',
    payload: { name, params },
  })),
  replace: jest.fn((name, params) => ({
    type: 'REPLACE',
    payload: { name, params },
  })),
  popToTop: jest.fn(() => ({ type: 'POP_TO_TOP' })),
  pop: jest.fn(count => ({ type: 'POP', payload: { count } })),
};

export const CommonActions = {
  reset: jest.fn(obj => ({ type: 'RESET', payload: obj })),
  navigate: jest.fn((name, params) => ({
    type: 'NAVIGATE',
    payload: { name, params },
  })),
  goBack: jest.fn(() => ({ type: 'GO_BACK' })),
};

export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => false),
}));

export const useRoute = jest.fn(() => ({
  params: {},
  name: 'Home',
}));

export const useFocusEffect = jest.fn();

export const useIsFocused = jest.fn(() => true);

export const useLinkBuilder = jest.fn(() => ({ buildHref: jest.fn() }));

export const useScrollToTop = jest.fn();

export const useNavigationBuilder = jest.fn(() => ({
  state: { routes: [], index: 0 },
  navigation: {},
  descriptors: {},
}));
