import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { I18nManager, StyleSheet } from 'react-native';
import BaseToast from 'modules/components/src/Toast/BaseToast';
import ErrorToast from 'modules/components/src/Toast/ErrorToast';
import InfoToast from 'modules/components/src/Toast/InfoToast';
import SuccessToast from 'modules/components/src/Toast/SuccessToast';
import ToastManager from 'modules/components/src/Toast/ToastManager';
import WarnToast from 'modules/components/src/Toast/WarnToast';

jest.mock('@modules/theme', () => {
  const mockTheme = {
    dark: false,
    colors: {
      surface: '#ffffff',
      onSurface: '#111111',
      primary: '#0055ff',
      primaryContainer: '#cce0ff',
      onPrimaryContainer: '#001122',
      error: '#ff0000',
      errorContainer: '#ffe0e0',
      onErrorContainer: '#330000',
      tertiary: '#ffaa00',
      tertiaryContainer: '#fff2d9',
      onTertiaryContainer: '#332200',
      elevation: {
        level3: '#222222',
      },
    },
  };

  const useAppTheme = jest.fn(() => mockTheme);

  return {
    useAppTheme,
  };
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const react = require('react');
  const responsiveDimensions = {
    ms: jest.fn((value: number) => value),
    vs: jest.fn((value: number) => value),
  };
  const textComponent = (props: any) =>
    react.createElement('Text', props, props.children);

  const moduleMock: Record<string, any> = {
    getStatusBarHeight: jest.fn(() => 12),
    responsiveDimensions,
    textComponent,
  };

  Object.defineProperty(moduleMock, 'ResponsiveDimensions', {
    value: responsiveDimensions,
  });
  Object.defineProperty(moduleMock, 'Text', { value: textComponent });

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

let mockCapturedToastProps: any;
const mockToastifyRender = jest.fn();

const flattenStyle = (style: any) =>
  Array.isArray(style)
    ? style.reduce((acc, curr) => ({ ...acc, ...(curr ?? {}) }), {})
    : style;

const lastColor = (styles: any) => {
  if (Array.isArray(styles)) {
    const last = styles[styles.length - 1];
    return last?.color;
  }
  return styles.color;
};

const assertSuccessToast = () => {
  const { toJSON } = render(
    <BaseToast
      type="success"
      text1="Title"
      text2="Body"
      icon={React.createElement('View', { testID: 'toast-icon' })}
      closeIcon={React.createElement('View', { testID: 'toast-close' })}
      iconColor="#123456"
    />,
  );

  const json = toJSON() as any;
  const containerStyle = flattenStyle(json.props.style);

  expect(containerStyle).toMatchObject({
    backgroundColor: '#cce0ff',
    borderColor: '#12345640',
    shadowColor: '#222222',
  });
  expect(screen.getByTestId('toast-icon')).toBeTruthy();
  expect(screen.getByTestId('toast-close')).toBeTruthy();

  const title = screen.getByText('Title');
  const body = screen.getByText('Body');

  expect(lastColor(title.props.style)).toBe('#001122');
  expect(lastColor(body.props.style)).toBe('#001122');
};

const assertWarnToast = () => {
  const { toJSON } = render(
    <BaseToast
      type="warn"
      text1="Warn Title"
      text2="Warn Body"
      icon={null}
      closeIcon={null}
    />,
  );

  const json = toJSON() as any;
  const containerStyle = flattenStyle(json.props.style);

  expect(containerStyle.backgroundColor).toBe('#fff2d9');
  expect(containerStyle.borderColor).toBe('#11111140');
  expect(lastColor(screen.getByText('Warn Body').props.style)).toBe('#332200');
};

const assertToastManagerBasics = (props: any) => {
  expect(props.theme).toBe('light');
  expect(props.topOffset).toBe(12);
  expect(props.isRTL).toBe(I18nManager.isRTL);
  const managerStyle = StyleSheet.flatten(props.style);
  expect(managerStyle.backgroundColor).toBe('#ffffff');
  expect(props.textColor).toBe('#111111');
};

const assertToastManagerIcons = (props: any) => {
  expect(Object.keys(props.icons)).toEqual(
    expect.arrayContaining(['success', 'error', 'info', 'warn', 'default']),
  );
  Object.values(props.icons).forEach(icon =>
    expect(React.isValidElement(icon)).toBe(true),
  );
};

const assertToastManagerConfig = (props: any) => {
  expect(props.config.success({ type: 'success' }).type).toBe(SuccessToast);
  expect(props.config.error({ type: 'error' }).type).toBe(ErrorToast);
  expect(props.config.info({ type: 'info' }).type).toBe(InfoToast);
  expect(props.config.warn({ type: 'warn' }).type).toBe(WarnToast);
  expect(props.config.default({ type: 'default' }).type).toBe(InfoToast);
};

const assertToastManager = () => {
  render(<ToastManager />);

  expect(mockToastifyRender).toHaveBeenCalledTimes(1);
  const props = mockCapturedToastProps;

  assertToastManagerBasics(props);
  assertToastManagerIcons(props);
  assertToastManagerConfig(props);
};

jest.mock('toastify-react-native', () => {
  const react = require('react');
  return (props: any) => {
    mockCapturedToastProps = props;
    mockToastifyRender(props);
    return react.createElement('ToastManagerMock', props);
  };
});

describe('BaseToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies success styling and renders content', async () => {
    assertSuccessToast();
  });

  it('falls back to warn styling when no iconColor is provided', () => {
    assertWarnToast();
  });
});

describe('ToastManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapturedToastProps = undefined;
    I18nManager.isRTL = true;
  });

  it('wires toast manager with theme, layout, icons, and config', () => {
    assertToastManager();
  });
});
