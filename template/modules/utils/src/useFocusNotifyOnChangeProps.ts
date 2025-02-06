import {useFocusEffect} from '@react-navigation/native';
import * as React from 'react';
import type {NotifyOnChangeProps} from '@tanstack/query-core';

/**
 * Custom React hook that returns a function to notify changes only when the component is focused.
 *
 * @param notifyOnChangeProps Optional props to be notified when changes occur
 * @returns A function that returns the notifyOnChangeProps if the component is focused, otherwise an empty array
 */
export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: NotifyOnChangeProps,
) {
  const focusedRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, []),
  );

  return () => {
    if (!focusedRef.current) {
      return [];
    }

    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps();
    }

    return notifyOnChangeProps;
  };
}
