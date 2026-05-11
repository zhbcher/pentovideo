import { buildPentovideoRuntimeScript } from "./pentovideoRuntime.engine";
import { PENTOVIDEO_BRIDGE_SOURCES, PENTOVIDEO_RUNTIME_GLOBALS } from "./runtimeContract";

export const PENTOVIDEO_RUNTIME_ARTIFACTS = {
  iife: "pentovideo.runtime.iife.js",
  esm: "pentovideo.runtime.mjs",
  manifest: "pentovideo.manifest.json",
} as const;

export type PentovideoRuntimeContract = {
  globals: typeof PENTOVIDEO_RUNTIME_GLOBALS;
  messageSources: typeof PENTOVIDEO_BRIDGE_SOURCES;
};

export const PENTOVIDEO_RUNTIME_CONTRACT: PentovideoRuntimeContract = {
  globals: PENTOVIDEO_RUNTIME_GLOBALS,
  messageSources: PENTOVIDEO_BRIDGE_SOURCES,
};

export function loadPentovideoRuntimeSource(): string | null {
  return buildPentovideoRuntimeScript();
}
