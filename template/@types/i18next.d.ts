import { TranslationNamespaces, translations } from '@modules/localization';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof TranslationNamespaces.COMMON;
    resources: (typeof translations)['en'];
  }
}
