import { authTranslations } from '@modules/features-auth';
import { debugMenuTranslations } from '@modules/features-debug-menu';
import { homeTranslations } from '@modules/features-home';
import { notificationsTranslations } from '@modules/features-notifications';
import { TranslationNamespaces } from '@modules/localization';
import common from './common';

export default {
  [TranslationNamespaces.COMMON]: common,
  [TranslationNamespaces.DEBUG_MENU]: debugMenuTranslations.en,
  [TranslationNamespaces.AUTH]: authTranslations.en,
  [TranslationNamespaces.HOME]: homeTranslations.en,
  [TranslationNamespaces.NOTIFICATIONS]: notificationsTranslations.en,
};
