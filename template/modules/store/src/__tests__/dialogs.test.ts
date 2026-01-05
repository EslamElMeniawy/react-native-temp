import { describe, expect, it } from '@jest/globals';

import * as DialogsStore from '@modules/store/src/dialogs';
import type { DialogsState } from '@modules/store/src/dialogs.types';

describe('Dialogs Store Slice', () => {
  describe('Slice definition', () => {
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

  describe('Initial state', () => {
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

  describe('Action creators exist', () => {
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

  describe('setErrorDialogMessage reducer', () => {
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

  describe('setErrorDialogTitleMessage reducer', () => {
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

  describe('removeErrorDialog reducer', () => {
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
});
