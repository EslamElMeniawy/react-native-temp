import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

const mockLoadingDialog = 'LoadingDialog';

const mockLoadingDialogComponent = (props: { visible?: boolean }) => {
  if (!props.visible) return null;
  const reactNative = require('react');
  return reactNative.createElement('View', {
    testID: mockLoadingDialog,
  });
};

jest.mock('@eslam-elmeniawy/react-native-common-components', () => ({
  ['LoadingDialog']: mockLoadingDialogComponent,
}));

let mockShowLoadingDialog: boolean | undefined;

jest.mock('@modules/store', () => ({
  useAppSelector: jest.fn((selector: any) =>
    selector({
      dialogs: {
        showLoadingDialog: mockShowLoadingDialog,
      },
    }),
  ),
}));

const loadingDialogComponent = require('../').default;
const renderLoadingDialog = () =>
  render(React.createElement(loadingDialogComponent));

describe('LoadingDialog', () => {
  it('should not be visible when showLoadingDialog is undefined', () => {
    mockShowLoadingDialog = undefined;
    renderLoadingDialog();
    expect(screen.queryByTestId(mockLoadingDialog)).toBeNull();
  });

  it('should not be visible when showLoadingDialog is false', () => {
    mockShowLoadingDialog = false;
    renderLoadingDialog();
    expect(screen.queryByTestId(mockLoadingDialog)).toBeNull();
  });

  it('should be visible when showLoadingDialog is true', () => {
    mockShowLoadingDialog = true;
    renderLoadingDialog();
    const loadingIndicator = screen.getByTestId(mockLoadingDialog);
    expect(loadingIndicator).toBeTruthy();
  });
});
