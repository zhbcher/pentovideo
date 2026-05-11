/**
 * Re-exported from @pentovideo/engine.
 * @see engine/src/services/parallelCoordinator.ts for implementation.
 */
export {
  calculateOptimalWorkers,
  distributeFrames,
  executeParallelCapture,
  mergeWorkerFrames,
  getSystemResources,
  type WorkerTask,
  type WorkerResult,
  type ParallelProgress,
} from "@pentovideo/engine";
