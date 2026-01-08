import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import {
  getCurrentRouteName,
  goBack,
  navigate,
  navigationRef,
  popToTop,
  push,
  replace,
  reset,
} from 'modules/navigation/src/NavigationUtils';

const mockNavigate = jest.fn();
const mockGetCurrentRoute = jest.fn();
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();
let mockIsReadyFlag = false;

const wireNavigationRef = () => {
  (navigationRef as any).isReady = () => mockIsReadyFlag;
  (navigationRef as any).navigate = mockNavigate;
  (navigationRef as any).getCurrentRoute = mockGetCurrentRoute;
  (navigationRef as any).goBack = mockGoBack;
  (navigationRef as any).dispatch = mockDispatch;
};

const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});

jest.mock('@react-navigation/native', () => {
  const reactNavigationMock: Record<string, any> = {};
  reactNavigationMock.createNavigationContainerRef = () => ({
    isReady: () => mockIsReadyFlag,
    navigate: mockNavigate,
    getCurrentRoute: mockGetCurrentRoute,
    goBack: mockGoBack,
    dispatch: mockDispatch,
  });

  const makeAction = (type: string) =>
    jest.fn((...args: any[]) => ({ type, args }));

  reactNavigationMock.StackActions = {
    push: makeAction('push'),
    replace: makeAction('replace'),
    popToTop: makeAction('popToTop'),
  };

  reactNavigationMock.CommonActions = {
    reset: jest.fn((...args: any[]) => ({ type: 'reset', args })),
  };

  return reactNavigationMock;
});

beforeEach(() => {
  mockIsReadyFlag = false;
  jest.clearAllMocks();
  wireNavigationRef();
});

describe('NavigationUtils navigation', () => {
  it('does not navigate when navigation ref is not ready', () => {
    navigate('home');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates when navigation ref is ready', () => {
    mockIsReadyFlag = true;

    navigate('home');

    expect(mockNavigate).toHaveBeenCalledWith('home', undefined);
  });
});

describe('NavigationUtils route name lookup', () => {
  it('returns current route name when ready', () => {
    mockIsReadyFlag = true;
    mockGetCurrentRoute.mockReturnValue({ name: 'home' });

    expect(getCurrentRouteName()).toBe('home');
  });

  it('returns undefined route name when not ready', () => {
    mockGetCurrentRoute.mockReturnValue({ name: 'home' });

    expect(getCurrentRouteName()).toBeUndefined();
  });
});

describe('NavigationUtils stack actions', () => {
  it('goBack triggers when ready', () => {
    mockIsReadyFlag = true;

    goBack();

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('dispatches stack actions when ready', () => {
    mockIsReadyFlag = true;

    push('home');
    replace('home');
    popToTop();

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch.mock.calls[0][0]).toMatchObject({ type: 'push' });
    expect(mockDispatch.mock.calls[1][0]).toMatchObject({ type: 'replace' });
    expect(mockDispatch.mock.calls[2][0]).toMatchObject({ type: 'popToTop' });
  });

  it('skips actions when not ready', () => {
    push('home');
    replace('home');
    popToTop();
    reset('home');

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

describe('NavigationUtils reset action', () => {
  it('resets navigation when ready', () => {
    mockIsReadyFlag = true;

    reset('home');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0]).toMatchObject({ type: 'reset' });
  });
});

describe('NavigationUtils navigation ref wiring', () => {
  it('exposes navigationRef with readiness checks', () => {
    expect(typeof navigationRef.isReady).toBe('function');
    expect(navigationRef.isReady()).toBe(false);
  });
});

afterAll(() => {
  consoleSpy.mockRestore();
});
