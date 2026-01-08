import { describe, expect, it } from '@jest/globals';

import * as NetworkStateStore from '@modules/store/src/networkState';
import type { NetworkStateState } from '@modules/store/src/networkState.types';

describe('NetworkState - setIsInternetAvailable True', () => {
  it('should set isInternetAvailable to true', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: false,
      isConnectionExpensive: false,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.setIsInternetAvailable(true),
    );

    expect(state.isInternetAvailable).toBe(true);
  });
});

describe('NetworkState - setIsInternetAvailable False', () => {
  it('should set isInternetAvailable to false', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: true,
      isConnectionExpensive: false,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.setIsInternetAvailable(false),
    );

    expect(state.isInternetAvailable).toBe(false);
  });

  it('should preserve isConnectionExpensive', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: false,
      isConnectionExpensive: true,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.setIsInternetAvailable(true),
    );

    expect(state.isInternetAvailable).toBe(true);
    expect(state.isConnectionExpensive).toBe(true);
  });

  it('should work from default initial state', () => {
    const state = NetworkStateStore.networkStateSlice.reducer(
      undefined,
      NetworkStateStore.setIsInternetAvailable(false),
    );

    expect(state.isInternetAvailable).toBe(false);
    expect(state.isConnectionExpensive).toBe(false);
  });
});

describe('NetworkState - setIsConnectionExpensive True', () => {
  it('should set isConnectionExpensive to true', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: true,
      isConnectionExpensive: false,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.setIsConnectionExpensive(true),
    );

    expect(state.isConnectionExpensive).toBe(true);
  });
});

describe('NetworkState - setIsConnectionExpensive False', () => {
  it('should set isConnectionExpensive to false', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: true,
      isConnectionExpensive: true,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.setIsConnectionExpensive(false),
    );

    expect(state.isConnectionExpensive).toBe(false);
  });

  it('should preserve isInternetAvailable', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: false,
      isConnectionExpensive: false,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.setIsConnectionExpensive(true),
    );

    expect(state.isInternetAvailable).toBe(false);
    expect(state.isConnectionExpensive).toBe(true);
  });

  it('should work from default initial state', () => {
    const state = NetworkStateStore.networkStateSlice.reducer(
      undefined,
      NetworkStateStore.setIsConnectionExpensive(true),
    );

    expect(state.isInternetAvailable).toBe(true);
    expect(state.isConnectionExpensive).toBe(true);
  });
});

describe('NetworkState - removeIsConnectionExpensive Undefined', () => {
  it('should set isConnectionExpensive to undefined', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: true,
      isConnectionExpensive: true,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.removeIsConnectionExpensive(),
    );

    expect(state.isConnectionExpensive).toBeUndefined();
  });
});

describe('NetworkState - removeIsConnectionExpensive Preserve', () => {
  it('should preserve isInternetAvailable', () => {
    const initialState: NetworkStateState = {
      isInternetAvailable: false,
      isConnectionExpensive: true,
    };

    const state = NetworkStateStore.networkStateSlice.reducer(
      initialState,
      NetworkStateStore.removeIsConnectionExpensive(),
    );

    expect(state.isInternetAvailable).toBe(false);
    expect(state.isConnectionExpensive).toBeUndefined();
  });

  it('should work from default initial state', () => {
    const state = NetworkStateStore.networkStateSlice.reducer(
      undefined,
      NetworkStateStore.removeIsConnectionExpensive(),
    );

    expect(state.isInternetAvailable).toBe(true);
    expect(state.isConnectionExpensive).toBeUndefined();
  });
});
