import { PhaseStatus } from './types';
import type InitPhase from './types';
import type { PhaseDefinition } from './types';

/**
 * Resolves the status of each phase based on the dependency graph.
 *
 * A phase is COMPLETED only if its own work is done AND all dependencies are COMPLETED.
 * A phase is RUNNING if its own work has started but dependencies may still be resolving.
 * A phase is PENDING if any dependency is not yet COMPLETED.
 */
const resolvePhaseStatuses = (
  phaseDefs: PhaseDefinition[],
  ownStatuses: Record<InitPhase, PhaseStatus>,
): Record<InitPhase, PhaseStatus> => {
  const resolved = { ...ownStatuses };

  const getResolvedStatus = (phase: InitPhase): PhaseStatus => {
    const def = phaseDefs.find(p => p.phase === phase);

    if (!def) {
      return resolved[phase];
    }

    const ownStatus = ownStatuses[phase];

    // If own work failed, phase is failed regardless of dependencies.
    if (ownStatus === PhaseStatus.FAILED) {
      return PhaseStatus.FAILED;
    }

    // Check if all dependencies are completed.
    const allDepsCompleted = def.dependsOn.every(
      dep => getResolvedStatus(dep) === PhaseStatus.COMPLETED,
    );

    if (!allDepsCompleted) {
      // If own work is done but deps aren't, phase is still pending.
      return ownStatus === PhaseStatus.COMPLETED
        ? PhaseStatus.PENDING
        : ownStatus;
    }

    return ownStatus;
  };

  for (const def of phaseDefs) {
    resolved[def.phase] = getResolvedStatus(def.phase);
  }

  return resolved;
};

export default resolvePhaseStatuses;
