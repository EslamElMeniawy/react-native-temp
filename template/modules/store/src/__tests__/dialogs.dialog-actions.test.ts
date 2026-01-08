import { describe, expect, it } from '@jest/globals';

import * as DialogsStore from '@modules/store/src/dialogs';
import type { DialogsState } from '@modules/store/src/dialogs.types';

describe('Dialogs - showLoadingDialog', () => {
  it('should set showLoadingDialog to true', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.showLoadingDialog(),
    );

    expect(state.showLoadingDialog).toBe(true);
  });

  it('should preserve other state properties', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: undefined,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: true,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.showLoadingDialog(),
    );

    expect(state.showLoadingDialog).toBe(true);
    expect(state.errorDialogTitle).toBe('Title');
    expect(state.errorDialogMessage).toBe('Message');
    expect(state.showDeleteAccountDialog).toBe(true);
  });
});

describe('Dialogs - showLogoutDialog', () => {
  it('should set showLogoutDialog to true', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.showLogoutDialog(),
    );

    expect(state.showLogoutDialog).toBe(true);
  });

  it('should preserve other state properties', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: true,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: false,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.showLogoutDialog(),
    );

    expect(state.showLogoutDialog).toBe(true);
    expect(state.showLoadingDialog).toBe(true);
    expect(state.showDeleteAccountDialog).toBe(false);
  });
});

describe('Dialogs - showDeleteAccountDialog', () => {
  it('should set showDeleteAccountDialog to true', () => {
    const state = DialogsStore.errorDialogSlice.reducer(
      undefined,
      DialogsStore.showDeleteAccountDialog(),
    );

    expect(state.showDeleteAccountDialog).toBe(true);
  });

  it('should preserve other state properties', () => {
    const initialState: DialogsState = {
      errorDialogTitle: undefined,
      errorDialogMessage: 'Message',
      showLoadingDialog: true,
      showLogoutDialog: true,
      showDeleteAccountDialog: undefined,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.showDeleteAccountDialog(),
    );

    expect(state.showDeleteAccountDialog).toBe(true);
    expect(state.showLoadingDialog).toBe(true);
    expect(state.showLogoutDialog).toBe(true);
  });
});

describe('Dialogs - removeLoadingDialog', () => {
  it('should set showLoadingDialog to undefined', () => {
    const initialState: DialogsState = {
      errorDialogTitle: undefined,
      errorDialogMessage: undefined,
      showLoadingDialog: true,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: undefined,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeLoadingDialog(),
    );

    expect(state.showLoadingDialog).toBeUndefined();
  });

  it('should preserve other state properties', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: true,
      showLogoutDialog: true,
      showDeleteAccountDialog: true,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeLoadingDialog(),
    );

    expect(state.showLoadingDialog).toBeUndefined();
    expect(state.errorDialogTitle).toBe('Title');
    expect(state.showLogoutDialog).toBe(true);
    expect(state.showDeleteAccountDialog).toBe(true);
  });
});

describe('Dialogs - removeLogoutDialog', () => {
  it('should set showLogoutDialog to undefined', () => {
    const initialState: DialogsState = {
      errorDialogTitle: undefined,
      errorDialogMessage: undefined,
      showLoadingDialog: undefined,
      showLogoutDialog: true,
      showDeleteAccountDialog: undefined,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeLogoutDialog(),
    );

    expect(state.showLogoutDialog).toBeUndefined();
  });

  it('should preserve other state properties', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: true,
      showLogoutDialog: true,
      showDeleteAccountDialog: true,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeLogoutDialog(),
    );

    expect(state.showLogoutDialog).toBeUndefined();
    expect(state.errorDialogTitle).toBe('Title');
    expect(state.showLoadingDialog).toBe(true);
    expect(state.showDeleteAccountDialog).toBe(true);
  });
});

describe('Dialogs - removeDeleteAccountDialog', () => {
  it('should set showDeleteAccountDialog to undefined', () => {
    const initialState: DialogsState = {
      errorDialogTitle: undefined,
      errorDialogMessage: undefined,
      showLoadingDialog: undefined,
      showLogoutDialog: undefined,
      showDeleteAccountDialog: true,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeDeleteAccountDialog(),
    );

    expect(state.showDeleteAccountDialog).toBeUndefined();
  });

  it('should preserve other state properties', () => {
    const initialState: DialogsState = {
      errorDialogTitle: 'Title',
      errorDialogMessage: 'Message',
      showLoadingDialog: true,
      showLogoutDialog: true,
      showDeleteAccountDialog: true,
    };

    const state = DialogsStore.errorDialogSlice.reducer(
      initialState,
      DialogsStore.removeDeleteAccountDialog(),
    );

    expect(state.showDeleteAccountDialog).toBeUndefined();
    expect(state.errorDialogTitle).toBe('Title');
    expect(state.showLoadingDialog).toBe(true);
    expect(state.showLogoutDialog).toBe(true);
  });
});
