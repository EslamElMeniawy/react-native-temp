import {describe, test, expect, jest} from '@jest/globals';

import {renderHookWithProviders} from '@src/utils';
import {useRefreshOnFocus} from '@src/utils/useRefreshOnFocus';

describe('useRefreshOnFocus', () => {
  test('should not trigger refetch on initial render', () => {
    const refetch = jest.fn<() => Promise<unknown>>().mockResolvedValue({});
    renderHookWithProviders(() => useRefreshOnFocus(refetch));
    expect(refetch).toHaveBeenCalledTimes(0);
  });
});
