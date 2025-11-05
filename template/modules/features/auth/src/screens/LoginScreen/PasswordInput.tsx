import { HookFormTextInput } from '@modules/components';
import { TranslationNamespaces } from '@modules/localization';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export default React.memo(() => {
  const { t: translate } = useTranslation([
    TranslationNamespaces.COMMON,
    TranslationNamespaces.AUTH,
  ]);

  return (
    <HookFormTextInput
      name="password"
      rules={{
        required: {
          value: true,
          message: translate(`${TranslationNamespaces.COMMON}:fieldRequired`, {
            field: translate(`${TranslationNamespaces.AUTH}:password`),
          }),
        },
      }}
      textInputProps={{
        label: translate(`${TranslationNamespaces.AUTH}:password`),
        secureTextEntry: true,
      }}
    />
  );
});
