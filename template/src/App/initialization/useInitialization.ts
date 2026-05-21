import { useMemo } from 'react';
import { useFirebaseMessagingInitialization } from '@src/App/useFirebaseMessagingInitialization';
import { useForegroundMessagesListener } from '@src/App/useForegroundMessagesListener';
import { useHttpClientDependenciesRegistration } from '@src/App/useHttpClientDependenciesRegistration';
import { useLocalizationInitialization } from '@src/App/useLocalizationInitialization';
import { useLogInitialization } from '@src/App/useLogInitialization';
import { useNetworkListener } from '@src/App/useNetworkListener';
import { useNotificationsInteraction } from '@src/App/useNotificationsInteraction';
import { useOrientationLocker } from '@src/App/useOrientationLocker';
import { useReactQueryFocusManager } from '@src/App/useReactQueryFocusManager';
import { useReactQueryOnlineManager } from '@src/App/useReactQueryOnlineManager';
import { useUserServiceDependenciesRegistration } from '@src/App/useUserServiceDependenciesRegistration';
import phases from './phases';
import resolvePhaseStatuses from './resolvePhaseStatuses';
import InitPhase, { PhaseStatus } from './types';
import type { InitializationState } from './types';

/**
 * App initialization orchestrator.
 *
 * Calls all boot hooks in dependency-respecting order and uses the
 * phase dependency graph from `phases.ts` to compute completion state.
 * The app is considered ready once all phases are COMPLETED.
 *
 * Phase execution order (derived from dependency graph):
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

  // Resolve phase statuses using the dependency graph.
  const phaseStatuses = useMemo(() => {
    const ownStatuses: Record<InitPhase, PhaseStatus> = {
      [InitPhase.CORE_SERVICES]: PhaseStatus.COMPLETED,
      [InitPhase.PLATFORM]: languageLoaded
        ? PhaseStatus.COMPLETED
        : PhaseStatus.RUNNING,
      [InitPhase.NETWORK]: PhaseStatus.COMPLETED,
      [InitPhase.NOTIFICATIONS]: PhaseStatus.COMPLETED,
    };

    return resolvePhaseStatuses(phases, ownStatuses);
  }, [languageLoaded]);

  const isReady = useMemo(
    () =>
      Object.values(phaseStatuses).every(s => s === PhaseStatus.COMPLETED),
    [phaseStatuses],
  );

  return { isReady, phases: phaseStatuses };
};
