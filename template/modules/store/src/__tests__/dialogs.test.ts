import { describe, expect, it } from '@jest/globals';

import * as DialogsStore from '@modules/store/src/dialogs';

describe('Dialogs Store Slice', () => {
  it('has default export', () => {
    expect(DialogsStore.default).toBeDefined();
  });

  it('has errorDialogSlice', () => {
    expect(DialogsStore.errorDialogSlice).toBeDefined();
  });

  it('initial state is defined', () => {
    const state = DialogsStore.errorDialogSlice.reducer(undefined, {
      type: '',
    });
    expect(state).toBeDefined();
    expect(state.showLoadingDialog).toBeUndefined();
    expect(state.errorDialogMessage).toBeUndefined();
  });

  it('showLoadingDialog action exists', () => {
    expect(
      DialogsStore.errorDialogSlice.actions.showLoadingDialog,
    ).toBeDefined();
  });

  it('removeLoadingDialog action exists', () => {
    expect(
      DialogsStore.errorDialogSlice.actions.removeLoadingDialog,
    ).toBeDefined();
  });

  it('removeErrorDialog action exists', () => {
    expect(
      DialogsStore.errorDialogSlice.actions.removeErrorDialog,
    ).toBeDefined();
  });
});
