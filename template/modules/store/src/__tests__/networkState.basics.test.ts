import { describe, expect, it } from '@jest/globals';

import * as NetworkStateStore from '@modules/store/src/networkState';

describe('NetworkState Store Slice - Definitions', () => {
  it('has default export', () => {
    expect(NetworkStateStore.default).toBeDefined();
  });

  it('has networkStateSlice', () => {
    expect(NetworkStateStore.networkStateSlice).toBeDefined();
  });

  it('has correct slice name', () => {
    expect(NetworkStateStore.networkStateSlice.name).toBe('networkState');
  });
});

describe('NetworkState Store Slice - Initial State', () => {
  it('initial state is defined', () => {
    const state = NetworkStateStore.networkStateSlice.reducer(undefined, {
      type: '',
    });
    expect(state).toBeDefined();
  });

  it('has correct default values', () => {
    const state = NetworkStateStore.networkStateSlice.reducer(undefined, {
      type: '',
    });
    expect(state.isInternetAvailable).toBe(true);
    expect(state.isConnectionExpensive).toBe(false);
  });
});

describe('NetworkState Store Slice - Action Creators', () => {
  it('setIsInternetAvailable action exists', () => {
    expect(NetworkStateStore.setIsInternetAvailable).toBeDefined();
  });

  it('setIsConnectionExpensive action exists', () => {
    expect(NetworkStateStore.setIsConnectionExpensive).toBeDefined();
  });

  it('removeIsConnectionExpensive action exists', () => {
    expect(NetworkStateStore.removeIsConnectionExpensive).toBeDefined();
  });
});
