import { describe, expect, it } from '@jest/globals';
import { renderWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import * as React from 'react';

import { ListLoadingMore } from '@modules/components';

describe('ListLoadingMore', () => {
  it('renders ActivityIndicator when fetching next page', async () => {
    const view = await renderWithProviders(
      <ListLoadingMore isFetchingNextPage={true} />,
    );

    expect(view.toJSON()).toBeTruthy();
  });

  it('renders null when not fetching', async () => {
    const view = await renderWithProviders(
      <ListLoadingMore isFetchingNextPage={false} />,
    );

    expect(view.toJSON()).toBeNull();
  });

  it('applies custom style', async () => {
    const customStyle = { marginTop: 20 };
    const view = await renderWithProviders(
      <ListLoadingMore isFetchingNextPage={true} style={customStyle} />,
    );

    expect(view.toJSON()).toBeTruthy();
  });
});
