import TranslationNamespaces from '@modules/localization/src/enums/TranslationNamespaces';
import { registerTranslations } from '@modules/localization/src/translationRegistry';
import ar from './ar';
import en from './en';

registerTranslations(TranslationNamespaces.DEBUG_MENU, { en, ar });

export default {
  en,
  ar,
};
