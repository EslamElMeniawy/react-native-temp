import * as React from 'react';
import { getLanguage } from '@modules/core';
import { updateLanguage } from 'modules/localization';

export const useSplashLanguageLoader = (isBootSplashLogoLoaded: boolean) => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## SplashScreen::useSplashLanguageLoader:: ${message}`;
  // #endregion

  // #region State
  const [isLanguageLoaded, setLanguageLoaded] = React.useState<boolean>(false);
  // #endregion

  // #region Setup
  React.useEffect(() => {
    /**
     * getSavedLanguage
     *
     * Load language from local storage then:
     * - Update app language and set "isLanguageLoaded" state variable.
     */
    const getSavedLanguage = async () => {
      console.info(getLogMessage('getSavedLanguage'));
      const language = getLanguage();
      console.info(getLogMessage('language'), language);
      await updateLanguage(language);
      setLanguageLoaded(true);
    };

    if (isBootSplashLogoLoaded) {
      getSavedLanguage();
    }
  }, [isBootSplashLogoLoaded]);
  // #endregion

  return isLanguageLoaded;
};
