import { describe, expect, it } from '@jest/globals';

import * as NetworkStateStore from '@modules/store/src/networkState';
import type { NetworkStateState } from '@modules/store/src/networkState.types';

describe('NetworkState - Internet Availability Transitions', () => {
  it('should handle sequential internet availability changes', () => {
    let state: NetworkStateState | undefined;

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsInternetAvailable(false),
    );
    expect(state?.isInternetAvailable).toBe(false);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsInternetAvailable(true),
    );
    expect(state?.isInternetAvailable).toBe(true);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsInternetAvailable(false),
    );
    expect(state?.isInternetAvailable).toBe(false);
  });
});

describe('NetworkState - Connection Expense Transitions', () => {
  it('should handle sequential expensive connection changes', () => {
    let state: NetworkStateState | undefined;

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsConnectionExpensive(true),
    );
    expect(state?.isConnectionExpensive).toBe(true);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsConnectionExpensive(false),
    );
    expect(state?.isConnectionExpensive).toBe(false);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.removeIsConnectionExpensive(),
    );
    expect(state?.isConnectionExpensive).toBeUndefined();
  });
});

describe('NetworkState - Combined State Transitions', () => {
  it('should maintain state during independent changes', () => {
    let state: NetworkStateState | undefined;

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsInternetAvailable(false),
    );
    expect(state?.isInternetAvailable).toBe(false);
    expect(state?.isConnectionExpensive).toBe(false);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsConnectionExpensive(true),
    );
    expect(state?.isInternetAvailable).toBe(false);
    expect(state?.isConnectionExpensive).toBe(true);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsInternetAvailable(true),
    );
    expect(state?.isInternetAvailable).toBe(true);
    expect(state?.isConnectionExpensive).toBe(true);
  });

  it('should handle multiple state changes combined', () => {
    let state: NetworkStateState | undefined;

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsInternetAvailable(false),
    );
    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.setIsConnectionExpensive(false),
    );

    expect(state?.isInternetAvailable).toBe(false);
    expect(state?.isConnectionExpensive).toBe(false);

    state = NetworkStateStore.networkStateSlice.reducer(
      state,
      NetworkStateStore.removeIsConnectionExpensive(),
    );
    expect(state?.isConnectionExpensive).toBeUndefined();
    expect(state?.isInternetAvailable).toBe(false);
  });
});
