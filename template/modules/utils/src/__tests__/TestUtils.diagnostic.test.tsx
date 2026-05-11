import { describe, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react-native';
import * as React from 'react';
import { View, Text } from 'react-native';
import { renderWithProviders } from './TestUtils';

describe('renderWithProviders - Diagnostic Tests', () => {
  it('should return screen with getByTestId and getByText utilities', async () => {
    const TestComponent = () => (
      <View testID="test-view">
        <Text>Test Text</Text>
      </View>
    );

    await renderWithProviders(<TestComponent />);

    console.log('screen object keys:', Object.keys(screen));
    console.log('getByTestId type:', typeof screen.getByTestId);
    console.log('getByText type:', typeof screen.getByText);

    expect(screen).toBeDefined();
    expect(typeof screen.getByTestId).toBe('function');
    expect(typeof screen.getByText).toBe('function');
  });

  it('should successfully query elements with getByTestId', async () => {
    const TestComponent = () => (
      <View testID="my-test-id">
        <Text>Hello World</Text>
      </View>
    );

    await renderWithProviders(<TestComponent />);

    const view = screen.getByTestId('my-test-id');
    expect(view).toBeTruthy();

    const text = screen.getByText('Hello World');
    expect(text).toBeTruthy();
  });
});
