import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import * as React from 'react';
import ListLoadingMore from 'modules/components/src/ListLoadingMore';

const mockActivityIndicator = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('ActivityIndicatorMock', props);
});

jest.mock('react-native-paper', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.ActivityIndicator = (props: any) => mockActivityIndicator(props);

  Object.defineProperty(moduleMock, '__esModule', { value: true });

  return moduleMock;
});

describe('ListLoadingMore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders indicator when fetching next page', async () => {
    const customStyle = { marginTop: 8 };
    const { toJSON } = await renderWithProviders(
      <ListLoadingMore isFetchingNextPage style={customStyle} />,
    );

    expect(mockActivityIndicator).toHaveBeenCalledTimes(1);
    expect(mockActivityIndicator).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'small',
        style: expect.arrayContaining([
          expect.objectContaining({ marginVertical: 8 }),
          expect.objectContaining(customStyle),
        ]),
      }),
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders nothing when not fetching', async () => {
    const { toJSON } = await renderWithProviders(
      <ListLoadingMore isFetchingNextPage={false} />,
    );

    expect(mockActivityIndicator).not.toHaveBeenCalled();
    expect(toJSON()).toBeNull();
  });
});
