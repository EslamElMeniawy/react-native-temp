/**
 * Abstraction layer for httpClient external dependencies.
 * This breaks the coupling between core module and store/localization modules.
 * Concrete implementations are registered at app startup.
 */

export interface HttpClientDependencies {
  getApiToken: () => string | undefined;
  getCurrentLocale: () => string;
  translate: (key: string) => string;
  onSessionExpired: (message: string) => void;
}

let dependencies: HttpClientDependencies | null = null;

export const registerHttpClientDependencies = (
  deps: HttpClientDependencies,
) => {
  dependencies = deps;
};

export const getHttpClientDependencies = (): HttpClientDependencies => {
  if (!dependencies) {
    throw new Error(
      'HttpClient dependencies not registered. Call registerHttpClientDependencies() at app startup.',
    );
  }

  return dependencies;
};
