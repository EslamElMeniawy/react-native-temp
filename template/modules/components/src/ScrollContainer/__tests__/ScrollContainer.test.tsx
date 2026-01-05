import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import ScrollContainer from 'modules/components/src/ScrollContainer';

const mockScrollView = jest.fn((props: any) => {
  const react = require('react');
  return react.createElement('ScrollViewMock', props, props.children);
});

jest.mock('@eslam-elmeniawy/react-native-common-components', () => {
  const moduleMock: Record<string, any> = {};
  moduleMock.ScrollView = (props: any) => mockScrollView(props);
  moduleMock.responsiveDimensions = {
    percentWidth: jest.fn((value: number) => value),
  };
  Object.defineProperty(moduleMock, 'ResponsiveDimensions', {
    value: moduleMock.responsiveDimensions,
  });

  Object.defineProperty(moduleMock, '__esModule', { value: true });

  return moduleMock;
});

describe('ScrollContainer', () => {
  it('composes content container styles and passes through props', () => {
    const inner = React.createElement('View', { testID: 'child' });
    const { toJSON } = render(
      <ScrollContainer contentContainerStyle={{ padding: 12 }} testID="list">
        {inner}
      </ScrollContainer>,
    );

    expect(mockScrollView).toHaveBeenCalledTimes(1);
    const props = mockScrollView.mock.calls[0][0];

    expect(props.contentContainerStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: 100, paddingHorizontal: 5 }),
        expect.objectContaining({ padding: 12 }),
      ]),
    );
    expect(props.testID).toBe('list');
    expect(toJSON()).toBeTruthy();
  });
});
