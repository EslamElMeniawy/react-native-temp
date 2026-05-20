import { TranslationNamespaces } from '@modules/localization/src/enums';
import type en from '@modules/localization/src/translations/en';
import common from './common';

const ar: typeof en = {
  [TranslationNamespaces.COMMON]: common,
};

export default ar;
