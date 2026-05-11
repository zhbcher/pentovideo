import { initSandboxRuntimeModular } from "./init";
import { fitTextFontSize } from "../text/fitTextFontSize";
import { getVariables } from "./getVariables";

type PentovideoWindow = Window & {
  __pentovideoRuntimeBootstrapped?: boolean;
  __pentovideo?: {
    fitTextFontSize: typeof fitTextFontSize;
    getVariables: typeof getVariables;
  };
};

// Inline composition scripts can run before DOMContentLoaded.
// Ensure timeline registry exists at script evaluation time.
(window as PentovideoWindow).__timelines = (window as PentovideoWindow).__timelines || {};

// Expose runtime helpers immediately so composition scripts can use them
// before DOMContentLoaded (font sizing runs during script evaluation, and
// getVariables is read by composition setup before the timeline is built).
(window as PentovideoWindow).__pentovideo = {
  fitTextFontSize,
  getVariables,
};

function bootstrapPentovideoRuntime(): void {
  const win = window as PentovideoWindow;
  if (win.__pentovideoRuntimeBootstrapped) {
    return;
  }
  win.__pentovideoRuntimeBootstrapped = true;
  initSandboxRuntimeModular();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapPentovideoRuntime, { once: true });
} else {
  bootstrapPentovideoRuntime();
}
