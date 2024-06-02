import {describe, test, expect} from '@jest/globals';
import {renderHookWithProviders} from '@src/utils';
import {useFocusNotifyOnChangeProps} from '@src/utils/useFocusNotifyOnChangeProps';

describe('useFocusNotifyOnChangeProps', () => {
  test('should return notifyOnChangeProps when component is focused', () => {
    const notifyOnChangeProps = 'all';

    const {result} = renderHookWithProviders(() =>
      useFocusNotifyOnChangeProps(notifyOnChangeProps),
    );

    expect(result.current()).toEqual(notifyOnChangeProps);
  });

  test('should return an empty array when notifyOnChangeProps is undefined', () => {
    const {result} = renderHookWithProviders(() =>
      useFocusNotifyOnChangeProps(),
    );

    expect(result.current()).toBeUndefined();
  });
});
