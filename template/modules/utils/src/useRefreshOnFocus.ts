import {useFocusEffect} from '@react-navigation/native';
import * as React from 'react';

/**
 * Custom hook that triggers a refetch action when the component gains focus, excluding the first time.
 *
 * @template T The type of data returned by the refetch function
 * @param {() => Promise<T>} refetch A function that returns a promise to refetch data
 */
export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch]),
  );
}
