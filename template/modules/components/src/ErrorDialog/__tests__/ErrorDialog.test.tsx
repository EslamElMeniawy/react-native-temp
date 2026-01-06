import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import ErrorDialog from 'modules/components/src/ErrorDialog';

const mockAlertDialog = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('AlertDialogMock', props);
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.AlertDialog = (props: any) => mockAlertDialog(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/store', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.useAppSelector = jest.fn();
  moduleMock.useAppDispatch = jest.fn();
  moduleMock.DialogsStore = { removeErrorDialog: jest.fn(() => 'remove') };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/localization', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.TranslationNamespaces = {};
  Object.defineProperty(moduleMock.TranslationNamespaces, 'COMMON', {
    value: 'common',
  });
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/utils', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.removeUserDataLogout = jest.fn();
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: jest.fn(key => key) }),
}));

describe('ErrorDialog', () => {
  const storeMock = jest.requireMock('@modules/store') as jest.Mocked<
    Record<string, any>
  >;
  const utilsMock = jest.requireMock('@modules/utils') as jest.Mocked<
    Record<string, any>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    storeMock.useAppDispatch.mockReturnValue(jest.fn());
  });

  it('renders dialog props from store', () => {
    storeMock.useAppSelector.mockImplementation(
      (selector: (state: any) => any) =>
        selector({
          dialogs: { errorDialogTitle: 'title', errorDialogMessage: 'msg' },
        }),
    );

    render(<ErrorDialog />);

    expect(mockAlertDialog).toHaveBeenCalledTimes(1);
    expect(mockAlertDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'title',
        message: 'msg',
        dialogProps: expect.objectContaining({ visible: true }),
      }),
    );
  });

  it('dismisses and clears store, triggering logout when session expired', () => {
    const dispatch = jest.fn();
    storeMock.useAppDispatch.mockReturnValue(dispatch);
    storeMock.useAppSelector.mockImplementation(
      (selector: (state: any) => any) =>
        selector({
          dialogs: {
            errorDialogTitle: 'title',
            errorDialogMessage: 'sessionExpired',
          },
        }),
    );

    render(<ErrorDialog />);

    const props = mockAlertDialog.mock.calls[0][0];
    const dismiss = props.actions[0].actionProps.onPress;
    dismiss();

    expect(utilsMock.removeUserDataLogout).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith('remove');
  });
});
