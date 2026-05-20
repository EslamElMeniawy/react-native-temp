import { TranslationNamespaces, translations } from '@modules/localization';
import { authTranslations } from '@modules/features-auth';
import { debugMenuTranslations } from '@modules/features-debug-menu';
import { homeTranslations } from '@modules/features-home';
import { notificationsTranslations } from '@modules/features-notifications';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof TranslationNamespaces.COMMON;
    resources: (typeof translations)['en'] & {
      [TranslationNamespaces.AUTH]: (typeof authTranslations)['en'];
      [TranslationNamespaces.DEBUG_MENU]: (typeof debugMenuTranslations)['en'];
      [TranslationNamespaces.HOME]: (typeof homeTranslations)['en'];
      [TranslationNamespaces.NOTIFICATIONS]: (typeof notificationsTranslations)['en'];
    };
  }
}
