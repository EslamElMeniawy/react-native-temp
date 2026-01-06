import { describe, expect, it } from '@jest/globals';

import * as DialogsStore from '@modules/store/src/dialogs';

describe('Dialogs Store Slice - Definitions', () => {
  it('has default export', () => {
    expect(DialogsStore.default).toBeDefined();
  });

  it('has errorDialogSlice', () => {
    expect(DialogsStore.errorDialogSlice).toBeDefined();
  });

  it('has correct slice name', () => {
    expect(DialogsStore.errorDialogSlice.name).toBe('dialogs');
  });
});

describe('Dialogs Store Slice - Initial State', () => {
  it('initial state is defined', () => {
    const state = DialogsStore.errorDialogSlice.reducer(undefined, {
      type: '',
    });
    expect(state).toBeDefined();
  });

  it('all initial properties are undefined', () => {
    const state = DialogsStore.errorDialogSlice.reducer(undefined, {
      type: '',
    });
    expect(state.errorDialogTitle).toBeUndefined();
    expect(state.errorDialogMessage).toBeUndefined();
    expect(state.showLoadingDialog).toBeUndefined();
    expect(state.showLogoutDialog).toBeUndefined();
    expect(state.showDeleteAccountDialog).toBeUndefined();
  });
});

describe('Dialogs Store Slice - Action Creators', () => {
  it('setErrorDialogMessage action exists', () => {
    expect(DialogsStore.setErrorDialogMessage).toBeDefined();
  });

  it('setErrorDialogTitleMessage action exists', () => {
    expect(DialogsStore.setErrorDialogTitleMessage).toBeDefined();
  });

  it('showLoadingDialog action exists', () => {
    expect(DialogsStore.showLoadingDialog).toBeDefined();
  });

  it('showLogoutDialog action exists', () => {
    expect(DialogsStore.showLogoutDialog).toBeDefined();
  });

  it('showDeleteAccountDialog action exists', () => {
    expect(DialogsStore.showDeleteAccountDialog).toBeDefined();
  });

  it('removeErrorDialog action exists', () => {
    expect(DialogsStore.removeErrorDialog).toBeDefined();
  });

  it('removeLoadingDialog action exists', () => {
    expect(DialogsStore.removeLoadingDialog).toBeDefined();
  });

  it('removeLogoutDialog action exists', () => {
    expect(DialogsStore.removeLogoutDialog).toBeDefined();
  });

  it('removeDeleteAccountDialog action exists', () => {
    expect(DialogsStore.removeDeleteAccountDialog).toBeDefined();
  });
});
