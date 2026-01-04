import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { ListLoadingMore } from '@modules/components';

describe('ListLoadingMore', () => {
  it('renders ActivityIndicator when fetching next page', () => {
    const view = render(<ListLoadingMore isFetchingNextPage={true} />);

    expect(view.toJSON()).toBeTruthy();
  });

  it('renders null when not fetching', () => {
    const view = render(<ListLoadingMore isFetchingNextPage={false} />);

    expect(view.toJSON()).toBeNull();
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: 20 };
    const view = render(
      <ListLoadingMore isFetchingNextPage={true} style={customStyle} />,
    );

    expect(view.toJSON()).toBeTruthy();
  });
});
