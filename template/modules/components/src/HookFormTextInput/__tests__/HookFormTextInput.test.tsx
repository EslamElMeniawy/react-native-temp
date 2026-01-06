import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import HookFormTextInput from 'modules/components/src/HookFormTextInput';

const mockTextInput = jest.fn((props: any) => {
  const react = require('react');
  const { TextInput: reactNativeTextInput } = require('react-native');
  return react.createElement(reactNativeTextInput, props);
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.TextInput = (props: any) => mockTextInput(props);
  Object.defineProperty(moduleMock, '__esModule', { value: true });
  return moduleMock;
});

describe('HookFormTextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm<{ name: string }>({ defaultValues: { name: '' } });
    return <FormProvider {...methods}>{children}</FormProvider>;
  }

  it('renders value and updates form state on change', () => {
    render(
      <Wrapper>
        <HookFormTextInput
          name="name"
          textInputProps={{ placeholder: 'your-name' }}
        />
      </Wrapper>,
    );

    fireEvent.changeText(screen.getByPlaceholderText('your-name'), 'Alice');

    expect(mockTextInput).toHaveBeenCalledWith(
      expect.objectContaining({ value: '', placeholder: 'your-name' }),
    );

    fireEvent.changeText(screen.getByPlaceholderText('your-name'), 'Bob');

    expect(mockTextInput).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: 'Bob' }),
    );
  });

  it('prefers provided error message over form error', () => {
    render(
      <Wrapper>
        <HookFormTextInput
          name="name"
          textInputProps={{
            errorProps: { errorMessage: 'custom-error' },
            placeholder: 'name-input',
          }}
        />
      </Wrapper>,
    );

    const textInputProps = mockTextInput.mock.calls[0][0];

    expect(textInputProps.errorProps).toEqual(
      expect.objectContaining({ errorMessage: 'custom-error' }),
    );
  });

  it('falls back to form error message when provided', () => {
    const FormWithError = () => {
      const methods = useForm<{ name: string }>({
        defaultValues: { name: '' },
        mode: 'onChange',
      });

      React.useEffect(() => {
        methods.setError('name', { type: 'manual', message: 'form-error' });
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <HookFormTextInput
            name="name"
            textInputProps={{ placeholder: 'input' }}
          />
        </FormProvider>
      );
    };

    render(<FormWithError />);

    const textInputProps = mockTextInput.mock.calls[1][0];

    expect(textInputProps.errorProps).toEqual(
      expect.objectContaining({ errorMessage: 'form-error' }),
    );
  });
});
