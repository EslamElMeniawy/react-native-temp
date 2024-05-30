import {getStatusBarHeight} from '@eslam-elmeniawy/react-native-common-components';
import {BaseNavigationContainer} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import {render, renderHook} from '@testing-library/react-native';
import * as React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider as ReduxProvider} from 'react-redux';
import {Toast} from '@src/components';
import type {AppStore} from '@src/store';
import {store as reduxStore} from '@src/store';
import {useAppTheme} from './Theme';
import {queryClient as appQueryClient} from './queryClient';
import type {QueryClient} from '@tanstack/react-query';
import type {
  RenderOptions,
  RenderHookOptions,
} from '@testing-library/react-native';
import type {MD3Theme} from 'react-native-paper';

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
  function Wrapper({
    children,
  }: Readonly<React.PropsWithChildren<{}>>): JSX.Element {
    const appTheme = useAppTheme();

    return (
      <ReduxProvider store={store}>
        <PaperProvider theme={theme ?? appTheme}>
          <ToastProvider
            placement="top"
            offset={getStatusBarHeight()}
            renderToast={toastOptions => <Toast {...toastOptions} />}>
            <QueryClientProvider client={queryClient}>
              <BaseNavigationContainer>{children}</BaseNavigationContainer>
            </QueryClientProvider>
          </ToastProvider>
        </PaperProvider>
      </ReduxProvider>
    );
  }

  return {
    store,
    theme,
    queryClient,
    ...render(ui, {wrapper: Wrapper, ...renderOptions}),
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
  function Wrapper({
    children,
  }: Readonly<React.PropsWithChildren<{}>>): JSX.Element {
    const appTheme = useAppTheme();

    return (
      <ReduxProvider store={store}>
        <PaperProvider theme={theme ?? appTheme}>
          <ToastProvider
            placement="top"
            offset={getStatusBarHeight()}
            renderToast={toastOptions => <Toast {...toastOptions} />}>
            <QueryClientProvider client={queryClient}>
              <BaseNavigationContainer>{children}</BaseNavigationContainer>
            </QueryClientProvider>
          </ToastProvider>
        </PaperProvider>
      </ReduxProvider>
    );
  }

  return {
    store,
    theme,
    queryClient,
    ...renderHook(renderCallback, {wrapper: Wrapper, ...renderOptions}),
  };
}
