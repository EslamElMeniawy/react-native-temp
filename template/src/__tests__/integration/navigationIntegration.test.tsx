/**
 * Integration test: React Navigation APIs and router logic.
 *
 * Tests the REAL StackRouter state machine and navigation action creators
 * to ensure they work correctly after RN/dependency upgrades.
 * Router tests are pure JS (no React/native needed).
 * API contract tests verify the public surface hasn't changed.
 */
import { describe, expect, it, jest } from '@jest/globals';

// Use real routers package (no manual mock exists for it).
// The module is imported via requireActual to bypass manual mocks.
const realRouters = jest.requireActual('@react-navigation/routers');
const stackRouter = (realRouters as Record<string, Function>).StackRouter;
const commonActions = (realRouters as Record<string, Record<string, Function>>)
  .CommonActions;
const stackActions = (realRouters as Record<string, Record<string, Function>>)
  .StackActions;

function createRouteNames(): string[] {
  return ['home', 'details', 'settings'];
}

function createInitialState() {
  return stackRouter({}).getInitialState({
    routeNames: createRouteNames(),
    routeParamList: {
      home: undefined,
      details: undefined,
      settings: undefined,
    },
    routeGetIdList: {},
  });
}

describe('Navigation Integration - StackRouter', () => {
  it('creates initial state with first route', () => {
    const state = createInitialState();

    expect(state.routes.length).toBe(1);
    expect(state.routes[0].name).toBe('home');
    expect(state.index).toBe(0);
    expect(state.type).toBe('stack');
  });

  it('handles NAVIGATE action', () => {
    const router = stackRouter({});
    const state = createInitialState();

    const action = commonActions.navigate('details', { id: 42 });
    const newState = router.getStateForAction(state, action, {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    });

    expect(newState).not.toBeNull();
    expect(newState!.routes.length).toBe(2);
    expect(newState!.routes[1].name).toBe('details');
    expect((newState!.routes[1].params as any)?.id).toBe(42);
    expect(newState!.index).toBe(1);
  });

  it('handles GO_BACK action', () => {
    const router = stackRouter({});
    let state: any = createInitialState();

    // Navigate to details
    state = router.getStateForAction(state, commonActions.navigate('details'), {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    })!;

    expect(state.index).toBe(1);

    // Go back
    const newState = router.getStateForAction(state, commonActions.goBack(), {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    });

    expect(newState).not.toBeNull();
    expect(newState!.index).toBe(0);
    expect(newState!.routes[0].name).toBe('home');
  });

  it('handles RESET action', () => {
    const router = stackRouter({});
    let state: any = createInitialState();

    // Navigate to create history
    state = router.getStateForAction(
      state,
      commonActions.navigate('details', { id: 1 }),
      {
        routeNames: createRouteNames(),
        routeParamList: {
          home: undefined,
          details: undefined,
          settings: undefined,
        },
        routeGetIdList: {},
      },
    )!;

    // Reset to settings only
    const newState = router.getStateForAction(
      state,
      commonActions.reset({
        index: 0,
        routes: [{ name: 'settings' }],
      }),
      {
        routeNames: createRouteNames(),
        routeParamList: {
          home: undefined,
          details: undefined,
          settings: undefined,
        },
        routeGetIdList: {},
      },
    );

    expect(newState).not.toBeNull();
    expect(newState!.routes.length).toBe(1);
    expect(newState!.routes[0].name).toBe('settings');
    expect(newState!.index).toBe(0);
  });

  it('handles PUSH action (adds to stack even if same route)', () => {
    const router = stackRouter({});
    let state = createInitialState();

    const action = stackActions.push('home');
    const newState = router.getStateForAction(state, action, {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    });

    expect(newState).not.toBeNull();
    expect(newState!.routes.length).toBe(2);
    expect(newState!.routes[0].name).toBe('home');
    expect(newState!.routes[1].name).toBe('home');
  });

  it('handles POP action', () => {
    const router = stackRouter({});
    let state: any = createInitialState();

    // Push two screens
    state = router.getStateForAction(state, commonActions.navigate('details'), {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    })!;
    state = router.getStateForAction(
      state,
      commonActions.navigate('settings'),
      {
        routeNames: createRouteNames(),
        routeParamList: {
          home: undefined,
          details: undefined,
          settings: undefined,
        },
        routeGetIdList: {},
      },
    )!;

    expect(state.routes.length).toBe(3);

    // Pop one
    const newState = router.getStateForAction(state, stackActions.pop(1), {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    });

    expect(newState).not.toBeNull();
    expect(newState!.routes.length).toBe(2);
    expect(newState!.index).toBe(1);
    expect(newState!.routes[1].name).toBe('details');
  });

  it('handles POP_TO_TOP action', () => {
    const router = stackRouter({});
    let state: any = createInitialState();

    // Navigate to build stack
    state = router.getStateForAction(state, commonActions.navigate('details'), {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    })!;
    state = router.getStateForAction(
      state,
      commonActions.navigate('settings'),
      {
        routeNames: createRouteNames(),
        routeParamList: {
          home: undefined,
          details: undefined,
          settings: undefined,
        },
        routeGetIdList: {},
      },
    )!;

    const newState = router.getStateForAction(state, stackActions.popToTop(), {
      routeNames: createRouteNames(),
      routeParamList: {
        home: undefined,
        details: undefined,
        settings: undefined,
      },
      routeGetIdList: {},
    });

    expect(newState).not.toBeNull();
    expect(newState!.routes.length).toBe(1);
    expect(newState!.routes[0].name).toBe('home');
    expect(newState!.index).toBe(0);
  });
});

describe('Navigation Integration - API Contract', () => {
  it('@react-navigation/native exports expected hooks', () => {
    const native = jest.requireActual<Record<string, unknown>>(
      '@react-navigation/native',
    );

    // Core hooks our app uses
    expect(typeof native.useNavigation).toBe('function');
    expect(typeof native.useRoute).toBe('function');
    expect(typeof native.useFocusEffect).toBe('function');
    expect(typeof native.useIsFocused).toBe('function');
    expect(typeof native.useScrollToTop).toBe('function');
    expect(typeof native.useLinkBuilder).toBe('function');
  });

  it('@react-navigation/native exports expected components and utilities', () => {
    const native = jest.requireActual<Record<string, unknown>>(
      '@react-navigation/native',
    );

    expect(typeof native.NavigationContainer).toBe('function');
    expect(typeof native.createNavigationContainerRef).toBe('function');
  });

  it('@react-navigation/native-stack exports createNativeStackNavigator', () => {
    const nativeStack = jest.requireActual<Record<string, unknown>>(
      '@react-navigation/native-stack',
    );

    expect(typeof nativeStack.createNativeStackNavigator).toBe('function');
  });

  it('StackActions has expected action creators', () => {
    expect(typeof stackActions.push).toBe('function');
    expect(typeof stackActions.pop).toBe('function');
    expect(typeof stackActions.popToTop).toBe('function');
    expect(typeof stackActions.replace).toBe('function');

    // Verify action shapes
    const pushAction = stackActions.push('test', { id: 1 });
    expect(pushAction.type).toBe('PUSH');
    expect(pushAction.payload).toEqual({ name: 'test', params: { id: 1 } });
  });

  it('CommonActions has expected action creators', () => {
    expect(typeof commonActions.navigate).toBe('function');
    expect(typeof commonActions.reset).toBe('function');
    expect(typeof commonActions.goBack).toBe('function');

    const navAction = commonActions.navigate('test', { id: 1 });
    expect(navAction.type).toBe('NAVIGATE');
  });
});
