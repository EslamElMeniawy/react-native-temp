import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import LoadingDialog from 'modules/components/src/LoadingDialog';

const mockLoadingDialog = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('LoadingDialogMock', props);
});

jest.mock('@modules/store', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.useAppSelector = jest.fn();
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.LoadingDialog = (props: any) => mockLoadingDialog(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

describe('LoadingDialog', () => {
  const { useAppSelector } = jest.requireMock('@modules/store') as jest.Mocked<
    Record<string, any>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows dialog when store flag is true', () => {
    useAppSelector.mockReturnValue({ showLoadingDialog: true });

    render(<LoadingDialog />);

    expect(mockLoadingDialog).toHaveBeenCalledTimes(1);
    expect(mockLoadingDialog).toHaveBeenCalledWith(
      expect.objectContaining({ visible: true }),
    );
  });

  it('hides dialog when store flag is false', () => {
    useAppSelector.mockReturnValue({ showLoadingDialog: false });

    const { toJSON } = render(<LoadingDialog />);

    expect(mockLoadingDialog).toHaveBeenCalledWith(
      expect.objectContaining({ visible: false }),
    );
    expect(toJSON()).toBeTruthy();
  });
});
