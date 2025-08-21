import { TranslationNamespaces } from '@modules/localization/src/enums';
import general from './general';
import home from './home';
import login from './login';
import networkLogs from './networkLogs';
import notifications from './notifications';

export default {
  [TranslationNamespaces.DEFAULT]: general,
  [TranslationNamespaces.NETWORK_LOGS]: networkLogs,
  [TranslationNamespaces.LOGIN]: login,
  [TranslationNamespaces.HOME]: home,
  [TranslationNamespaces.NOTIFICATIONS]: notifications,
};
