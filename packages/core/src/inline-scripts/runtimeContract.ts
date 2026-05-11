export const PENTOVIDEO_RUNTIME_GLOBALS = {
  player: "__player",
  playerReady: "__playerReady",
  renderReady: "__renderReady",
  timelines: "__timelines",
  clipManifest: "__clipManifest",
} as const;

export const PENTOVIDEO_BRIDGE_SOURCES = {
  parent: "hf-parent",
  preview: "hf-preview",
} as const;

export const PENTOVIDEO_CONTROL_ACTIONS = [
  "play",
  "pause",
  "seek",
  "set-muted",
  "set-playback-rate",
  "enable-pick-mode",
  "disable-pick-mode",
] as const;

export type PentovideoControlAction = (typeof PENTOVIDEO_CONTROL_ACTIONS)[number];
