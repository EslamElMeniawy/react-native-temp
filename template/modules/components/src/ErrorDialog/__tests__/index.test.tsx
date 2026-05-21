import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';

const mockDispatch = jest.fn();
const mockRemoveUserDataLogout = jest.fn();
let mockErrorDialogTitle: string | undefined;
let mockErrorDialogMessage: string | undefined;

jest.mock('@modules/utils', () => ({
  removeUserDataLogout: () => mockRemoveUserDataLogout(),
}));

const mockRemoveErrorDialog = jest.fn(() => ({
  type: 'dialogs/removeErrorDialog',
}));

jest.mock('@modules/store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn((selector: any) =>
    selector({
      dialogs: {
        errorDialogTitle: mockErrorDialogTitle,
        errorDialogMessage: mockErrorDialogMessage,
      },
    }),
  ),
  ['DialogsStore']: {
    removeErrorDialog: mockRemoveErrorDialog,
  },
}));

const mockTranslationNamespaces = { ['COMMON']: 'common' };

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: mockTranslationNamespaces,
}));

const mockAlertDialog = (props: {
  title?: string;
  message?: string;
  dialogProps?: { visible?: boolean; onDismiss?: () => void };
  actions?: Array<{ action: string; actionProps?: { onPress?: () => void } }>;
}) => {
  if (!props.dialogProps?.visible) return null;
  const reactNative = require('react');
  const rn = require('react-native');
  return reactNative.createElement(
    rn.View,
    { testID: 'alert-dialog' },
    props.title && reactNative.createElement(rn.Text, null, props.title),
    props.message && reactNative.createElement(rn.Text, null, props.message),
    props.actions &&
      props.actions.map(action =>
        reactNative.createElement(
          rn.Pressable,
          {
            key: action.action,
            onPress: action.actionProps?.onPress,
            testID: `action-button`,
          },
          reactNative.createElement(rn.Text, null, action.action),
        ),
      ),
  );
};

jest.mock('@eslam-elmeniawy/react-native-common-components', () => ({
  ['AlertDialog']: mockAlertDialog,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const errorDialogComponent = require('../').default;
const renderErrorDialog = async () =>
  render(React.createElement(errorDialogComponent));

const resetDialogState = () => {
  jest.clearAllMocks();
  mockErrorDialogTitle = undefined;
  mockErrorDialogMessage = undefined;
};

const pressOkButton = () => {
  const okButton = screen.getByText('ok');
  fireEvent.press(okButton);
};

const registerVisibilityTests = () => {
  describe('visibility', () => {
    beforeEach(resetDialogState);

    it('should not be visible when errorDialogMessage is undefined', async () => {
      await renderErrorDialog();
      expect(screen.queryByTestId('alert-dialog')).toBeNull();
    });

    it('should be visible when errorDialogMessage is set', async () => {
      mockErrorDialogMessage = 'Test error message';
      mockErrorDialogTitle = 'Error Title';

      await renderErrorDialog();

      expect(screen.getByText('Test error message')).toBeTruthy();
      expect(screen.getByText('Error Title')).toBeTruthy();
    });

    it('should display only message without title', async () => {
      mockErrorDialogMessage = 'Test error only';

      await renderErrorDialog();

      expect(screen.getByText('Test error only')).toBeTruthy();
    });
  });
};

const registerActionTests = () => {
  describe('actions', () => {
    beforeEach(resetDialogState);

    it('should dispatch removeErrorDialog when OK button is pressed', async () => {
      mockErrorDialogMessage = 'Test error';
      mockErrorDialogTitle = 'Error';

      await renderErrorDialog();
      pressOkButton();

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dialogs/removeErrorDialog',
        }),
      );
    });

    it('should call removeUserDataLogout when session expired', async () => {
      mockErrorDialogMessage = 'sessionExpired';

      await renderErrorDialog();
      pressOkButton();

      expect(mockRemoveUserDataLogout).toHaveBeenCalledTimes(1);
    });

    it('should not call removeUserDataLogout for non-session errors', async () => {
      mockErrorDialogMessage = 'Regular error message';

      await renderErrorDialog();
      pressOkButton();

      expect(mockRemoveUserDataLogout).not.toHaveBeenCalled();
    });
  });
};

describe('ErrorDialog', () => {
  registerVisibilityTests();
  registerActionTests();
});
