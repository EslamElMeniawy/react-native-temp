import { store as reduxStore } from '@modules/store';
import { render, renderHook, screen } from '@testing-library/react-native';
import * as React from 'react';
import type { AppStore } from '@modules/store';
import type {
  RenderOptions,
  RenderHookOptions,
  RenderResult,
} from '@testing-library/react-native';

// This type interface extends the default options for render from RTL
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore;
}

// This type interface extends the default options for renderHook from RTL
interface ExtendedRenderHookOptions<Props> extends Omit<
  RenderHookOptions<Props>,
  'queries'
> {
  store?: AppStore;
}

/**
 * Simple wrapper component that just renders children without extra providers for test compatibility
 */
function TestWrapper({ children }: Readonly<React.PropsWithChildren>) {
  return <>{children}</>;
}

/**
 * Renders a React element with the test wrapper.
 * Returns the render result with screen object and rerender/unmount utilities.
 * Use screen.getByTestId() for query utilities per ESLint prefer-screen-queries.
 *
 * @param ui The React element to render.
 * @param renderOptions Additional options for rendering the element.
 *
 * @returns A promise that resolves to the render result with screen utilities and rerender/unmount methods.
 */
export async function renderWithProviders(
  ui: React.ReactElement,
  { store: _store = reduxStore, ...renderOptions }: ExtendedRenderOptions = {},
): Promise<RenderResult> {
  return await render(ui, { wrapper: TestWrapper, ...renderOptions });
}

/**
 * Renders a custom hook with the test wrapper.
 *
 * @param renderCallback A function that returns the result of the custom hook being tested.
 * @param renderOptions Additional options for rendering the custom hook.
 *
 * @returns A promise that resolves to an object containing the result, rerender, and unmount functions.
 */
export async function renderHookWithProviders<Result, Props>(
  renderCallback: (props: Props) => Result,
  {
    store: _store = reduxStore,
    ...renderOptions
  }: ExtendedRenderHookOptions<Props> = {},
) {
  return await renderHook(renderCallback, {
    wrapper: TestWrapper,
    ...renderOptions,
  });
}

export { screen, render, renderHook };
