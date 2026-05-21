/**
 * Boot phases for app initialization.
 * Phases execute in dependency order — a phase only runs
 * after all its dependencies have completed.
 */
enum InitPhase {
  /** HTTP client and user service dependency wiring. */
  CORE_SERVICES = 'coreServices',
  /** Logging, orientation, and localization setup. */
  PLATFORM = 'platform',
  /** Network listeners and React Query managers. */
  NETWORK = 'network',
  /** Firebase messaging, foreground listener, notification interaction. */
  NOTIFICATIONS = 'notifications',
}

export interface PhaseDefinition {
  phase: InitPhase;
  dependsOn: InitPhase[];
}

export interface InitializationState {
  isReady: boolean;
  phases: Record<InitPhase, PhaseStatus>;
}

export enum PhaseStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export default InitPhase;
