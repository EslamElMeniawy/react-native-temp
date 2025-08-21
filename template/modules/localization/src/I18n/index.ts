import { getLanguage, setLanguage } from '@modules/core';
import * as i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform, Settings, I18nManager } from 'react-native';
import { default as Config } from 'react-native-config';
import * as RNLocalize from 'react-native-localize';
import RNRestart from 'react-native-restart';
import {
  AppLanguages,
  TranslationNamespaces,
} from '@modules/localization/src/enums';
import { translations } from '@modules/localization/src/translations';

const getLogMessage = (message: string) => `## I18n:: ${message}`;

// Get device language.
const deviceLanguage =
  Platform.OS === 'ios'
    ? Settings.get('AppleLocale') || Settings.get('AppleLanguages')?.[0]
    : I18nManager.getConstants().localeIdentifier;

const defaultLocale: string =
  deviceLanguage?.toLowerCase()?.indexOf(AppLanguages.ARABIC) > -1
    ? AppLanguages.ARABIC
    : AppLanguages.ENGLISH;

const i18n = i18next.use(initReactI18next);

const handleRestart = (locale: string) => {
  if (locale === AppLanguages.ARABIC && !I18nManager.isRTL) {
    setTimeout(() => RNRestart.Restart(), 500);
  }

  if (locale === AppLanguages.ENGLISH && I18nManager.isRTL) {
    setTimeout(() => RNRestart.Restart(), 500);
  }
};

export const setI18nConfig = async () => {
  console.info(getLogMessage('setI18nConfig'));

  await i18n.init({
    debug: Config.ENABLE_LOCAL_LOG === 'true',
    compatibilityJSON: 'v4',
    resources: translations,
    lng: defaultLocale,
    ns: Object.values(TranslationNamespaces),
    defaultNS: TranslationNamespaces.COMMON,
    interpolation: { escapeValue: false },
  });

  const locales = RNLocalize.getLocales();

  if (Array.isArray(locales)) {
    await i18n.changeLanguage(locales[0].languageTag);
  }

  // Get user language.
  const userLanguage = getLanguage();

  // Set the locale.
  await updateLanguage(userLanguage);
};

export const updateLanguage = async (language?: AppLanguages | null) => {
  console.info(getLogMessage('updateLanguage'), language);
  const locale = language ?? defaultLocale;

  // Save user language.
  if (language) {
    setLanguage(language);
  }

  // Set the locale.
  await i18n.changeLanguage(locale);
  I18nManager.allowRTL(locale === AppLanguages.ARABIC);
  I18nManager.forceRTL(locale === AppLanguages.ARABIC);

  // Restart if needed.
  handleRestart(locale);
};

export const getCurrentLocale = () => i18n.language;

export const translate = i18n.t;
