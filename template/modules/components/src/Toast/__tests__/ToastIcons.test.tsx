import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import CloseIcon from 'modules/components/src/Toast/CloseIcon';
import ErrorIcon from 'modules/components/src/Toast/ErrorIcon';
import ErrorToast from 'modules/components/src/Toast/ErrorToast';
import InfoIcon from 'modules/components/src/Toast/InfoIcon';
import InfoToast from 'modules/components/src/Toast/InfoToast';
import SuccessIcon from 'modules/components/src/Toast/SuccessIcon';
import SuccessToast from 'modules/components/src/Toast/SuccessToast';
import WarnIcon from 'modules/components/src/Toast/WarnIcon';
import WarnToast from 'modules/components/src/Toast/WarnToast';

jest.mock('@modules/theme', () => {
  const mockTheme = {
    dark: false,
    colors: {
      surface: '#ffffff',
      onSurface: '#111111',
      primary: '#0055ff',
      onPrimaryContainer: '#001122',
      error: '#ff0000',
      onErrorContainer: '#330000',
      tertiary: '#ffaa00',
      onTertiaryContainer: '#332200',
    },
  };

  const useAppTheme = jest.fn(() => mockTheme);

  return {
    useAppTheme,
  };
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const ms = jest.fn((value: number) => value);
  const responsiveDimensions = { ms };
  const moduleMock: Record<string, any> = { responsiveDimensions };

  Object.defineProperty(moduleMock, 'ResponsiveDimensions', {
    value: responsiveDimensions,
  });

  return moduleMock;
});

let mockCapturedBaseProps: any;
const mockBaseToast = jest.fn((props: any) => {
  const react = require('react');
  mockCapturedBaseProps = props;
  return react.createElement('BaseToastMock', props);
});

jest.mock('modules/components/src/Toast/BaseToast', () => {
  const moduleMock: Record<string, any> = {
    default: (props: any) => mockBaseToast(props),
  };

  Object.defineProperty(moduleMock, '__esModule', { value: true });

  return moduleMock;
});

jest.mock('@react-native-vector-icons/material-design-icons', () => {
  const react = require('react');
  const materialDesignIcons = (props: any) =>
    react.createElement('Icon', {
      name: props.name,
      color: props.color,
      size: props.size,
      testID: props.testID,
    });

  const moduleMock: Record<string, any> = { materialDesignIcons };

  Object.defineProperty(moduleMock, 'MaterialDesignIcons', {
    value: materialDesignIcons,
  });

  return moduleMock;
});

const getIconProps = async (element: React.ReactElement) => {
  const { toJSON } = await render(element);
  return (toJSON() as any)?.props;
};
const getCloseIconColor = async (closeIcon?: React.ReactElement) => {
  if (!closeIcon) {
    return undefined;
  }

  const { toJSON } = await render(closeIcon);
  return (toJSON() as any)?.props?.color;
};

const assertBaseToastCall = async (
  expected: Partial<any>,
  expectedCloseIconColor?: string,
) => {
  expect(mockBaseToast).toHaveBeenCalledTimes(1);
  const props = mockCapturedBaseProps;
  expect(props).toMatchObject(expected);

  if (expectedCloseIconColor) {
    expect(await getCloseIconColor(props.closeIcon)).toBe(
      expectedCloseIconColor,
    );
    return;
  }

  expect(props.closeIcon).toBeUndefined();
};

describe('Toast icons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapturedBaseProps = undefined;
  });

  it('renders CloseIcon with provided color and size', async () => {
    const props = await getIconProps(<CloseIcon color="#abcdef" />);

    expect(props).toMatchObject({
      name: 'close',
      color: '#abcdef',
      size: 24,
    });
  });

  it('defaults CloseIcon color to theme', async () => {
    const props = await getIconProps(<CloseIcon />);

    expect(props).toMatchObject({
      name: 'close',
      color: '#111111',
      size: 24,
    });
  });

  it('renders SuccessIcon with theme primary color', async () => {
    const props = await getIconProps(<SuccessIcon />);

    expect(props).toMatchObject({
      name: 'check-circle',
      color: '#0055ff',
      size: 28,
    });
  });

  it('renders ErrorIcon with theme error color', async () => {
    const props = await getIconProps(<ErrorIcon />);

    expect(props).toMatchObject({
      name: 'alert-circle',
      color: '#ff0000',
      size: 28,
    });
  });

  it('renders InfoIcon with theme onSurface color', async () => {
    const props = await getIconProps(<InfoIcon />);

    expect(props).toMatchObject({
      name: 'information-variant-circle',
      color: '#111111',
      size: 28,
    });
  });

  it('renders WarnIcon with theme tertiary color', async () => {
    const props = await getIconProps(<WarnIcon />);

    expect(props).toMatchObject({
      name: 'alert',
      color: '#ffaa00',
      size: 28,
    });
  });
});

describe('Toast variants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapturedBaseProps = undefined;
  });

  it('SuccessToast passes primary colors and close icon', async () => {
    await render(<SuccessToast type="success" />);

    await assertBaseToastCall(
      {
        iconColor: '#0055ff',
        progressBarColor: '#0055ff',
        type: 'success',
      },
      '#001122',
    );
  });

  it('ErrorToast passes error colors and close icon', async () => {
    await render(<ErrorToast type="error" />);

    await assertBaseToastCall(
      {
        iconColor: '#ff0000',
        progressBarColor: '#ff0000',
        type: 'error',
      },
      '#330000',
    );
  });

  it('WarnToast passes tertiary colors and close icon', async () => {
    await render(<WarnToast type="warn" />);

    await assertBaseToastCall(
      {
        iconColor: '#ffaa00',
        progressBarColor: '#ffaa00',
        type: 'warn',
      },
      '#332200',
    );
  });

  it('InfoToast passes onSurface colors and no close icon', async () => {
    await render(<InfoToast type="info" />);

    await assertBaseToastCall(
      {
        iconColor: '#111111',
        progressBarColor: '#111111',
      },
      undefined,
    );
  });

  it('InfoToast forwards provided text props', async () => {
    await render(<InfoToast type="info" text1="Hello" text2="World" />);

    await assertBaseToastCall(
      {
        iconColor: '#111111',
        progressBarColor: '#111111',
        text1: 'Hello',
        text2: 'World',
        type: 'info',
      },
      undefined,
    );
  });
});
