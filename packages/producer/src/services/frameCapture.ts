/**
 * Re-exported from @pentovideo/engine.
 * @see engine/src/services/frameCapture.ts for implementation.
 */
export {
  createCaptureSession,
  initializeSession,
  closeCaptureSession,
  captureFrame,
  captureFrameToBuffer,
  getCompositionDuration,
  getCapturePerfSummary,
  prepareCaptureSessionForReuse,
  type CaptureOptions,
  type CaptureResult,
  type CaptureBufferResult,
  type CapturePerfSummary,
  type CaptureSession,
  type BeforeCaptureHook,
} from "@pentovideo/engine";
