import type TranslationNamespaces from '@modules/localization/src/enums/TranslationNamespaces';
import type { Resource } from 'i18next';

export interface TranslationResource {
  [language: string]: Record<string, string>;
}

const registry: Map<TranslationNamespaces, TranslationResource> = new Map();

/**
 * Register translations for a namespace.
 * Feature modules call this at module load time to register their translations
 * without creating a dependency from localization → features.
 *
 * @param namespace - The i18next namespace identifier
 * @param resources - Object keyed by language code (e.g. { en: {...}, ar: {...} })
 */
export const registerTranslations = (
  namespace: TranslationNamespaces,
  resources: TranslationResource,
) => {
  registry.set(namespace, resources);
};

/**
 * Build the i18next resources object from all registered translations.
 * Called internally by I18n initialization.
 */
export const buildResources = (
  coreResources: Resource,
): Resource => {
  const resources: Resource = { ...coreResources };

  registry.forEach((translations, namespace) => {
    Object.entries(translations).forEach(([language, content]) => {
      if (!resources[language]) {
        resources[language] = {};
      }

      (resources[language] as Record<string, unknown>)[namespace] = content;
    });
  });

  return resources;
};

/**
 * Get all registered namespace names.
 */
export const getRegisteredNamespaces = (): TranslationNamespaces[] =>
  Array.from(registry.keys());

/**
 * Clear the registry (for testing purposes).
 */
export const clearTranslationRegistry = () => {
  registry.clear();
};
