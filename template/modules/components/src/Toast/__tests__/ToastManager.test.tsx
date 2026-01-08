import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import ComponentToastManager from 'modules/components/src/Toast/ToastManager';

const mockToastManager = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('ToastManagerMock', props);
});

jest.mock('toastify-react-native', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = (props: any) => mockToastManager(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.getStatusBarHeight = jest.fn(() => 24);
  moduleMock.ResponsiveDimensions = {
    ms: jest.fn((value: number) => value),
    vs: jest.fn((value: number) => value),
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('@modules/theme', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.useAppTheme = jest.fn();
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/CloseIcon', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = () => {
    const react = require('react');
    return react.createElement('CloseIconMock');
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/SuccessIcon', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = () => {
    const react = require('react');
    return react.createElement('SuccessIconMock');
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/ErrorIcon', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = () => {
    const react = require('react');
    return react.createElement('ErrorIconMock');
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/InfoIcon', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = () => {
    const react = require('react');
    return react.createElement('InfoIconMock');
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/WarnIcon', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = () => {
    const react = require('react');
    return react.createElement('WarnIconMock');
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/SuccessToast', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = (props: any) => {
    const react = require('react');
    return react.createElement('SuccessToastMock', props);
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/ErrorToast', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = (props: any) => {
    const react = require('react');
    return react.createElement('ErrorToastMock', props);
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/InfoToast', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = (props: any) => {
    const react = require('react');
    return react.createElement('InfoToastMock', props);
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

jest.mock('modules/components/src/Toast/WarnToast', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.default = (props: any) => {
    const react = require('react');
    return react.createElement('WarnToastMock', props);
  };
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

describe('ToastManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const themeMock = jest.requireMock('@modules/theme') as jest.Mocked<
      Record<string, any>
    >;
    themeMock.useAppTheme.mockReturnValue({
      dark: true,
      colors: {
        surface: '#222222',
        onSurface: '#eeeeee',
      },
    });
  });

  function getToastComponents() {
    return {
      successToastComponent: jest.requireMock(
        'modules/components/src/Toast/SuccessToast',
      ) as jest.Mocked<Record<string, any>>,
      errorToastComponent: jest.requireMock(
        'modules/components/src/Toast/ErrorToast',
      ) as jest.Mocked<Record<string, any>>,
      infoToastComponent: jest.requireMock(
        'modules/components/src/Toast/InfoToast',
      ) as jest.Mocked<Record<string, any>>,
      warnToastComponent: jest.requireMock(
        'modules/components/src/Toast/WarnToast',
      ) as jest.Mocked<Record<string, any>>,
    };
  }

  it('passes theme, offsets, and icons to toast manager', () => {
    render(<ComponentToastManager />);

    expect(mockToastManager).toHaveBeenCalledTimes(1);

    const props = mockToastManager.mock.calls[0][0];

    expect(props.theme).toBe('dark');
    expect(props.topOffset).toBe(24);
    expect(props.textColor).toBe('#eeeeee');
    expect(props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#222222' }),
      ]),
    );
    expect(props.isRTL).toBe(false);

    expect(props.icons).toEqual(
      expect.objectContaining({
        success: expect.any(Object),
        error: expect.any(Object),
        info: expect.any(Object),
        warn: expect.any(Object),
        default: expect.any(Object),
      }),
    );
  });

  it('renders toast configs using provided components', () => {
    render(<ComponentToastManager />);

    const props = mockToastManager.mock.calls[0][0];
    const {
      successToastComponent,
      errorToastComponent,
      infoToastComponent,
      warnToastComponent,
    } = getToastComponents();

    const toastElements = [
      {
        element: props.config.success({ text1: 'ok' }),
        comp: successToastComponent,
      },
      {
        element: props.config.error({ text1: 'err' }),
        comp: errorToastComponent,
      },
      {
        element: props.config.info({ text1: 'info' }),
        comp: infoToastComponent,
      },
      {
        element: props.config.warn({ text1: 'warn' }),
        comp: warnToastComponent,
      },
      {
        element: props.config.default({ text1: 'def' }),
        comp: infoToastComponent,
      },
    ];

    toastElements.forEach(({ element, comp }) => {
      expect(element.type).toBe(comp.default);
    });
  });

  it('uses light theme colors when dark mode is false', () => {
    const themeMock = jest.requireMock('@modules/theme') as jest.Mocked<
      Record<string, any>
    >;
    themeMock.useAppTheme.mockReturnValue({
      dark: false,
      colors: {
        surface: '#ffffff',
        onSurface: '#111111',
      },
    });

    render(<ComponentToastManager />);

    const props = mockToastManager.mock.calls[0][0];

    expect(props.theme).toBe('light');
    expect(props.textColor).toBe('#111111');
    expect(props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#ffffff' }),
      ]),
    );
  });
});
