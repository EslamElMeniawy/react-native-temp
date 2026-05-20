import { useFirebaseMessagingInitialization } from '../useFirebaseMessagingInitialization';
import { useForegroundMessagesListener } from '../useForegroundMessagesListener';
import { useHttpClientDependenciesRegistration } from '../useHttpClientDependenciesRegistration';
import { useLocalizationInitialization } from '../useLocalizationInitialization';
import { useLogInitialization } from '../useLogInitialization';
import { useNetworkListener } from '../useNetworkListener';
import { useNotificationsInteraction } from '../useNotificationsInteraction';
import { useOrientationLocker } from '../useOrientationLocker';
import { useReactQueryFocusManager } from '../useReactQueryFocusManager';
import { useReactQueryOnlineManager } from '../useReactQueryOnlineManager';
import { useUserServiceDependenciesRegistration } from '../useUserServiceDependenciesRegistration';
import InitPhase, { PhaseStatus } from './types';
import type { InitializationState } from './types';

/**
 * App initialization orchestrator.
 *
 * Calls all boot hooks in dependency-respecting order and tracks
 * completion state per phase. The app is considered ready once all
 * phases with async gates (currently localization) have completed.
 *
 * Phase execution order:
 * 1. CORE_SERVICES — HTTP client deps, user service deps
 * 2. PLATFORM — logging, orientation, localization (async)
 * 3. NETWORK — network listener, React Query managers
 * 4. NOTIFICATIONS — Firebase messaging, foreground listener, interaction
 */
export const useInitialization = (): InitializationState => {
  // Phase 1: Core Services (no dependencies)
  useHttpClientDependenciesRegistration();
  useUserServiceDependenciesRegistration();

  // Phase 2: Platform (depends on core services)
  useLogInitialization();
  const languageLoaded = useLocalizationInitialization();
  useOrientationLocker();

  // Phase 3: Network (depends on core services)
  useNetworkListener();
  useReactQueryFocusManager();
  useReactQueryOnlineManager();

  // Phase 4: Notifications (depends on platform + network)
  useFirebaseMessagingInitialization();
  useForegroundMessagesListener();
  useNotificationsInteraction();

  return {
    isReady: languageLoaded,
    phases: {
      [InitPhase.CORE_SERVICES]: PhaseStatus.COMPLETED,
      [InitPhase.PLATFORM]: languageLoaded
        ? PhaseStatus.COMPLETED
        : PhaseStatus.RUNNING,
      [InitPhase.NETWORK]: PhaseStatus.COMPLETED,
      [InitPhase.NOTIFICATIONS]: PhaseStatus.COMPLETED,
    },
  };
};
