import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HookFormTextInput } from '@modules/components';
import { TranslationNamespaces } from '@modules/localization';

export default React.memo(() => {
  const { t: translate } = useTranslation([
    TranslationNamespaces.COMMON,
    TranslationNamespaces.LOGIN,
  ]);

  return (
    <HookFormTextInput
      name="username"
      rules={{
        required: {
          value: true,
          message: translate(`${TranslationNamespaces.COMMON}:fieldRequired`, {
            field: translate(`${TranslationNamespaces.LOGIN}:username`),
          }),
        },
      }}
      textInputProps={{
        label: translate(`${TranslationNamespaces.LOGIN}:username`),
        keyboardType: 'email-address',
      }}
    />
  );
});
