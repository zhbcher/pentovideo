// Types
export type {
  ExecutionMode,
  Orientation,
  Asset,
  TimelineElement,
  TimelineElementBase,
  TimelineMediaElement,
  TimelineTextElement,
  TimelineCompositionElement,
  TimelineElementType,
  MediaElementType,
  CanvasResolution,
  MediaFile,
  CompositionAPI,
  PlayerAPI,
  AddElementData,
  ValidationResult,
  CompositionAsset,
  Keyframe,
  KeyframeProperties,
  ElementKeyframes,
  StageZoom,
  StageZoomKeyframe,
  CompositionVariableType,
  CompositionVariableBase,
  StringVariable,
  NumberVariable,
  ColorVariable,
  BooleanVariable,
  EnumVariable,
  CompositionVariable,
  CompositionSpec,
  WaveformData,
} from "./core.types";

export {
  CANVAS_DIMENSIONS,
  VALID_CANVAS_RESOLUTIONS,
  normalizeResolutionFlag,
  TIMELINE_COLORS,
  DEFAULT_DURATIONS,
  COMPOSITION_VARIABLE_TYPES,
  isTextElement,
  isMediaElement,
  isCompositionElement,
  getDefaultStageZoom,
  isStringVariable,
  isNumberVariable,
  isColorVariable,
  isBooleanVariable,
  isEnumVariable,
} from "./core.types";

// Templates
export { generateBaseHtml, getStageStyles } from "./templates/base";
export {
  GSAP_CDN,
  BASE_STYLES,
  ELEMENT_BASE_STYLES,
  MEDIA_STYLES,
  TEXT_STYLES,
  ZOOM_CONTAINER_STYLES,
} from "./templates/constants";

// Parsers
export type { GsapAnimation, GsapMethod, ParsedGsap } from "./parsers/gsapParser";

export {
  parseGsapScript,
  serializeGsapAnimations,
  updateAnimationInScript,
  addAnimationToScript,
  removeAnimationFromScript,
  getAnimationsForElement,
  validateCompositionGsap,
  keyframesToGsapAnimations,
  gsapAnimationsToKeyframes,
  SUPPORTED_PROPS,
  SUPPORTED_EASES,
} from "./parsers/gsapParser";

export type { ParsedHtml, CompositionMetadata } from "./parsers/htmlParser";

export {
  parseHtml,
  updateElementInHtml,
  addElementToHtml,
  removeElementFromHtml,
  validateCompositionHtml,
  extractCompositionMetadata,
} from "./parsers/htmlParser";

// Generators
export type { SerializeOptions } from "./generators/pentovideo";

export {
  generatePentovideoHtml,
  generateGsapTimelineScript,
  generatePentovideoStyles,
} from "./generators/pentovideo";

// Compiler (timing only — browser-safe, no linkedom/esbuild)
export type {
  UnresolvedElement,
  ResolvedDuration,
  ResolvedMediaElement,
  CompilationResult,
} from "./compiler/timingCompiler";

export {
  compileTimingAttrs,
  injectDurations,
  extractResolvedMedia,
  clampDurations,
  shouldClampMediaDuration,
} from "./compiler/timingCompiler";

// Lint
export type {
  PentovideoLintSeverity,
  PentovideoLintFinding,
  PentovideoLintResult,
  PentovideoLinterOptions,
} from "./lint/types";
export { lintPentovideoHtml } from "./lint/pentovideoLinter";
export {
  rewriteAssetPaths,
  rewriteAssetPath,
  rewriteCssAssetUrls,
} from "./compiler/rewriteSubCompPaths";

// Inline scripts
export {
  PENTOVIDEO_RUNTIME_ARTIFACTS,
  PENTOVIDEO_RUNTIME_CONTRACT,
  loadPentovideoRuntimeSource,
  type PentovideoRuntimeContract,
} from "./inline-scripts/pentovideo";
export {
  PENTOVIDEO_RUNTIME_GLOBALS,
  PENTOVIDEO_BRIDGE_SOURCES,
  PENTOVIDEO_CONTROL_ACTIONS,
  type PentovideoControlAction,
} from "./inline-scripts/runtimeContract";
export { getPentovideoRuntimeScript } from "./generated/runtime-inline";
export {
  buildPentovideoRuntimeScript,
  type PentovideoRuntimeBuildOptions,
} from "./inline-scripts/pentovideoRuntime.engine";
export {
  MEDIA_VISUAL_STYLE_PROPERTIES,
  copyMediaVisualStyles,
  quantizeTimeToFrame,
  type MediaVisualStyleProperty,
} from "./inline-scripts/parityContract";
export type {
  PentovideoPickerApi,
  PentovideoPickerBoundingBox,
  PentovideoPickerElementInfo,
} from "./inline-scripts/pickerApi";

// Frame adapters
export type { FrameAdapter, FrameAdapterContext } from "./adapters/types";
export type { GSAPTimelineLike, CreateGSAPFrameAdapterOptions } from "./adapters/gsap";
export { createGSAPFrameAdapter } from "./adapters/gsap";

// Text measurement
export { fitTextFontSize } from "./text/index.js";
export type { FitTextOptions, FitTextResult } from "./text/index.js";

// Runtime helpers (composition-side)
export { getVariables } from "./runtime/getVariables.js";

// Variable validation (CLI / tooling-side)
export {
  validateVariables,
  formatVariableValidationIssue,
  type VariableValidationIssue,
} from "./runtime/validateVariables.js";

// Registry
export type {
  ItemType,
  FileType,
  FileTarget,
  RegistryItemDimensions,
  RegistryItemPreview,
  RegistryItem,
  ExampleItem,
  BlockItem,
  ComponentItem,
  RegistryManifestEntry,
  RegistryManifest,
} from "./registry/index.js";

export {
  ITEM_TYPES,
  FILE_TYPES,
  ITEM_TYPE_DIRS,
  isExampleItem,
  isBlockItem,
  isComponentItem,
} from "./registry/index.js";
