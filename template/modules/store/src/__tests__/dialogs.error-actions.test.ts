import { describe, expect, it } from '@jest/globals';

import * as DialogsStore from '@modules/store/src/dialogs';
import type { DialogsState } from '@modules/store/src/dialogs.types';

describe('Dialogs - setErrorDialogMessage', () => {
  it('should set error dialog message', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.setErrorDialogMessage('Error message'),
    );

    expect(state.errorDialogMessage).toBe('Error message');
    expect(state.errorDialogTitle).toBeUndefined();
  });

  it('should clear title when setting message', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Error',
      errorDialogMessage: 'Old message',
      showLoadingDialog: undefined,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: undefined,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.setErrorDialogMessage('New message'),
    );

    expect(state.errorDialogMessage).toBe('New message');
    expect(state.errorDialogTitle).toBeUndefined();
  });

  it('should handle empty string message', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.setErrorDialogMessage(''),
    );

    expect(state.errorDialogMessage).toBe('');
  });
});

describe('Dialogs - setErrorDialogTitleMessage', () => {
  it('should set both title and message', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.setErrorDialogTitleMessage({
        title: 'Error Title',
        message: 'Error description',
      }),
    );

    expect(state.errorDialogTitle).toBe('Error Title');
    expect(state.errorDialogMessage).toBe('Error description');
  });

  it('should overwrite previous values', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Old Title',
      errorDialogMessage: 'Old message',
      showLoadingDialog: undefined,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: undefined,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.setErrorDialogTitleMessage({
        title: 'New Title',
        message: 'New message',
      }),
    );

    expect(state.errorDialogTitle).toBe('New Title');
    expect(state.errorDialogMessage).toBe('New message');
  });

  it('should handle empty strings', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.setErrorDialogTitleMessage({
        title: '',
        message: '',
      }),
    );

    expect(state.errorDialogTitle).toBe('');
    expect(state.errorDialogMessage).toBe('');
  });
});

describe('Dialogs - removeErrorDialog', () => {
  it('should clear error title and message', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: undefined,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: undefined,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeErrorDialog(),
    );

    expect(state.errorDialogTitle).toBeUndefined();
    expect(state.errorDialogMessage).toBeUndefined();
  });

  it('should not affect loading dialogs', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: true,
      showLogoutDialog: true,
      showDeleteAccountDialog: true,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeErrorDialog(),
    );

    expect(state.errorDialogTitle).toBeUndefined();
    expect(state.errorDialogMessage).toBeUndefined();
    expect(state.showLoadingDialog).toBe(true);
    expect(state.showLogoutDialog).toBe(true);
    expect(state.showDeleteAccountDialog).toBe(true);
  });
});
