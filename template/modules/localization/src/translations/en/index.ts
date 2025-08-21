import { TranslationNamespaces } from '@modules/localization/src/enums';
import common from './common';
import home from './home';
import login from './login';
import networkLogs from './networkLogs';
import notifications from './notifications';

export default {
  [TranslationNamespaces.COMMON]: common,
  [TranslationNamespaces.NETWORK_LOGS]: networkLogs,
  [TranslationNamespaces.LOGIN]: login,
  [TranslationNamespaces.HOME]: home,
  [TranslationNamespaces.NOTIFICATIONS]: notifications,
};
