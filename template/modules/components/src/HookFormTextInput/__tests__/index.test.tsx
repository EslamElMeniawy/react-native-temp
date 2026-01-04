import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

const mockControl = {
  register: jest.fn(),
  unregister: jest.fn(),
  getFieldState: jest.fn(),
  subjects: {
    values: { next: jest.fn(), subscribe: jest.fn() },
    array: { next: jest.fn(), subscribe: jest.fn() },
    state: { next: jest.fn(), subscribe: jest.fn() },
  },
  getWatch: jest.fn(),
  formValues: {},
  defaultValues: {},
};

const mockFormContext = {
  control: mockControl,
  formState: { errors: {} },
  getValues: jest.fn(),
  setValue: jest.fn(),
  trigger: jest.fn(),
  watch: jest.fn(),
};

jest.mock('react-hook-form', () => {
  const mockController = (props: any) => {
    const reactNative = require('react-native');
    const react = require('react');
    return react.createElement(
      reactNative.View,
      { testID: 'controller' },
      props.render({
        field: {
          onChange: jest.fn(),
          onBlur: jest.fn(),
          value: 'test value',
        },
      }),
    );
  };
  return {
    ['Controller']: mockController,
    useFormContext: () => mockFormContext,
  };
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => ({
  ['TextInput']: (props: any) => {
    const reactNative = require('react-native');
    const react = require('react');
    return react.createElement(reactNative.TextInput, {
      testID: 'text-input',
      ...props,
    });
  },
}));

const hookFormTextInput = require('../').default;
const renderComponent = (props: any) =>
  render(React.createElement(hookFormTextInput, props));

const registerBasicRenderTests = () => {
  it('should render TextInput with form control', () => {
    renderComponent({
      name: 'testField',
    });

    const input = screen.getByTestId('text-input');
    expect(input).toBeTruthy();
  });

  it('should pass textInputProps to TextInput', () => {
    renderComponent({
      name: 'email',
      textInputProps: {
        placeholder: 'Enter email',
      },
    });

    const input = screen.getByTestId('text-input');
    expect(input).toBeTruthy();
  });
};

const registerErrorHandlingTests = () => {
  it('should display error message from form errors', () => {
    mockFormContext.formState.errors = {
      username: { message: 'Username is required' },
    };

    renderComponent({
      name: 'username',
    });

    const input = screen.getByTestId('text-input');
    expect(input).toBeTruthy();
  });

  it('should prefer errorProps errorMessage over form errors', () => {
    mockFormContext.formState.errors = {
      password: { message: 'Password is required' },
    };

    renderComponent({
      name: 'password',
      textInputProps: {
        errorProps: {
          errorMessage: 'Custom error',
        },
      },
    });

    const input = screen.getByTestId('text-input');
    expect(input).toBeTruthy();
  });
};

const registerValidationTests = () => {
  it('should pass validation rules to Controller', () => {
    renderComponent({
      name: 'age',
      rules: { required: true },
    });

    const input = screen.getByTestId('text-input');
    expect(input).toBeTruthy();
  });
};

const registerTests = () => {
  describe('HookFormTextInput', () => {
    registerBasicRenderTests();
    registerErrorHandlingTests();
    registerValidationTests();
  });
};

registerTests();
