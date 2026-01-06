import { describe, expect, it } from '@jest/globals';

import * as DialogsStore from '@modules/store/src/dialogs';
import type { DialogsState } from '@modules/store/src/dialogs.types';

describe('Dialogs - Sequential Actions', () => {
  it('should handle show and remove for loading', () => {
    let state: DialogsState | undefined;

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.showLoadingDialog(),
    );
    expect(state?.showLoadingDialog).toBe(true);

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.showLogoutDialog(),
    );
    expect(state?.showLoadingDialog).toBe(true);
    expect(state?.showLogoutDialog).toBe(true);

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.removeLoadingDialog(),
    );
    expect(state?.showLoadingDialog).toBeUndefined();
    expect(state?.showLogoutDialog).toBe(true);
  });

  it('should handle all dialogs shown simultaneously', () => {
    let state: DialogsState | undefined;

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.showLoadingDialog(),
    );
    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.showLogoutDialog(),
    );
    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.showDeleteAccountDialog(),
    );

    expect(state?.showLoadingDialog).toBe(true);
    expect(state?.showLogoutDialog).toBe(true);
    expect(state?.showDeleteAccountDialog).toBe(true);
  });
});

describe('Dialogs - Mixed Error and Dialog Actions', () => {
  it('should handle mixing error and dialog actions', () => {
    let state: DialogsState | undefined;

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.setErrorDialogMessage('Error'),
    );
    expect(state?.errorDialogMessage).toBe('Error');

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.showLoadingDialog(),
    );
    expect(state?.errorDialogMessage).toBe('Error');
    expect(state?.showLoadingDialog).toBe(true);

    state = DialogsStore.errorDialogSlice.reducer(
      state,
      DialogsStore.removeErrorDialog(),
    );
    expect(state?.errorDialogMessage).toBeUndefined();
    expect(state?.showLoadingDialog).toBe(true);
  });
});
