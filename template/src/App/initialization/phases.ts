import InitPhase from './types';
import type { PhaseDefinition } from './types';

/**
 * Defines the boot phase dependency graph.
 * Each phase lists the phases it depends on.
 * The orchestrator uses this to determine execution order.
 */
const phases: PhaseDefinition[] = [
  {
    phase: InitPhase.CORE_SERVICES,
    dependsOn: [],
  },
  {
    phase: InitPhase.PLATFORM,
    dependsOn: [InitPhase.CORE_SERVICES],
  },
  {
    phase: InitPhase.NETWORK,
    dependsOn: [InitPhase.CORE_SERVICES],
  },
  {
    phase: InitPhase.NOTIFICATIONS,
    dependsOn: [InitPhase.PLATFORM, InitPhase.NETWORK],
  },
];

export default phases;
