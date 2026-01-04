import { describe, expect, it } from '@jest/globals';

import * as NetworkStateStore from '@modules/store/src/networkState';

describe('Network State Store Slice', () => {
  it('has default export', () => {
    expect(NetworkStateStore.default).toBeDefined();
  });

  it('has networkStateSlice', () => {
    expect(NetworkStateStore.networkStateSlice).toBeDefined();
  });

  it('initial state is defined', () => {
    const state = NetworkStateStore.networkStateSlice.reducer(undefined, {
      type: '',
    });
    expect(state).toBeDefined();
    expect(state.isInternetAvailable).toBe(true);
    expect(state.isConnectionExpensive).toBe(false);
  });

  it('setIsInternetAvailable action exists', () => {
    expect(
      NetworkStateStore.networkStateSlice.actions.setIsInternetAvailable,
    ).toBeDefined();
  });

  it('setIsConnectionExpensive action exists', () => {
    expect(
      NetworkStateStore.networkStateSlice.actions.setIsConnectionExpensive,
    ).toBeDefined();
  });
});
