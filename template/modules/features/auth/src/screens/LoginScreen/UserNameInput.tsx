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
      name="username"
      rules={{
        required: {
          value: true,
          message: translate(`${TranslationNamespaces.COMMON}:fieldRequired`, {
            field: translate(`${TranslationNamespaces.AUTH}:username`),
          }),
        },
      }}
      textInputProps={{
        label: translate(`${TranslationNamespaces.AUTH}:username`),
        keyboardType: 'email-address',
      }}
    />
  );
});
