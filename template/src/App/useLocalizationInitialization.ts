import * as React from 'react';
import { setI18nConfig } from '@modules/localization';

// Ensure feature module translations are registered before i18n initializes.
// These side-effect imports call registerTranslations() at evaluation time.
import '@modules/features-auth/src/translations';
import '@modules/features-debug-menu/src/translations';
import '@modules/features-home/src/translations';
import '@modules/features-notifications/src/translations';

export const useLocalizationInitialization = () => {
  // #region State
  const [languageLoaded, setLanguageLoaded] = React.useState<boolean>(false);
  // #endregion

  React.useEffect(() => {
    setI18nConfig().then(() => setLanguageLoaded(true));
  }, []);

  return languageLoaded;
};
