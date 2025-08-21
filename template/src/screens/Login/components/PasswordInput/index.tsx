import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HookFormTextInput } from '@modules/components';

export default React.memo(() => {
  const { t: translate } = useTranslation();

  return (
    <HookFormTextInput
      name="password"
      rules={{
        required: {
          value: true,
          message: translate('field_required', {
            field: translate('password'),
          }),
        },
      }}
      textInputProps={{ label: translate('password'), secureTextEntry: true }}
    />
  );
});
