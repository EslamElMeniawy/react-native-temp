import { BaseNavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { render, renderHook } from '@testing-library/react-native';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import type { AppStore } from '@src/store';
import { store as reduxStore } from '@src/store';
import { ToastManager } from '@modules/components';
import { useAppTheme } from '@modules/theme';
import {
  queryClient as appQueryClient,
  clientPersister as appClientPersister,
} from '@modules/utils';
import type { QueryClient } from '@tanstack/react-query';
import type { Persister } from '@tanstack/react-query-persist-client';
import type {
  RenderOptions,
  RenderHookOptions,
} from '@testing-library/react-native';
import type { MD3Theme } from 'react-native-paper';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore;
  theme?: MD3Theme;
  queryClient?: QueryClient;
}

// This type interface extends the default options for renderHook from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderHookOptions<Props>
  extends Omit<RenderHookOptions<Props>, 'queries'> {
  store?: AppStore;
  theme?: MD3Theme;
  queryClient?: QueryClient;
}

function Wrapper({
  store = reduxStore,
  theme,
  queryClient = appQueryClient,
  clientPersister = appClientPersister,
  children,
}: Readonly<
  React.PropsWithChildren<{
    store?: AppStore;
    theme?: MD3Theme;
    queryClient?: QueryClient;
    clientPersister?: Persister;
  }>
>) {
  const appTheme = useAppTheme();

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme ?? appTheme}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: clientPersister }}
        >
          <BaseNavigationContainer>{children}</BaseNavigationContainer>
        </PersistQueryClientProvider>
        <ToastManager />
      </PaperProvider>
    </ReduxProvider>
  );
}

/**
 * Renders a React element with the necessary providers for the application.
 *
 * @param ui The React element to render.
 * @param store The Redux store instance to use. If not provided, the default store will be used.
 * @param theme The theme to apply to the PaperProvider. If not provided, the app theme will be used.
 * @param queryClient The QueryClient instance to use for React Query.
 * @param renderOptions Additional options for rendering the element.
 *
 * @returns An object containing the store, theme, queryClient, and the result of rendering the element with the specified providers.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    store = reduxStore,
    theme,
    queryClient = appQueryClient,
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  return {
    store,
    theme,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Renders a custom hook with the specified providers for Redux, Paper, Toast, and QueryClient.
 *
 * @param renderCallback A function that returns the result of the custom hook being tested.
 * @param store The Redux store instance to be used. Defaults to the application's Redux store.
 * @param theme The theme to be used by the PaperProvider. If not provided, the app's theme will be used.
 * @param queryClient The QueryClient instance to be used. Defaults to the application's query client.
 * @param renderOptions Additional options for rendering the custom hook.
 *
 * @returns An object containing the store, theme, queryClient, and the result of rendering the custom hook.
 */
export function renderHookWithProviders<Result, Props>(
  renderCallback: (props: Props) => Result,
  {
    store = reduxStore,
    theme,
    queryClient = appQueryClient,
    ...renderOptions
  }: ExtendedRenderHookOptions<Props> = {},
) {
  return {
    store,
    theme,
    queryClient,
    ...renderHook(renderCallback, { wrapper: Wrapper, ...renderOptions }),
  };
}
