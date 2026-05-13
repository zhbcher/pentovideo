# @pentovideo/core

Types, parsers, generators, compiler, linter, runtime, and frame adapters for the Pentovideo video framework.

## Install

```bash
npm install @pentovideo/core
```

> Most users don't need to install core directly — the [CLI](../cli), [producer](../producer), and [studio](../studio) packages depend on it internally.

## What's inside

| Module             | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **Types**          | `TimelineElement`, `CompositionSpec`, `Asset`, canvas dimensions, defaults                           |
| **Parsers**        | `parseHtml` — extract timeline elements from HTML; `parseGsapScript` — parse GSAP animations         |
| **Generators**     | `generatePentovideoHtml` — produce valid Pentovideo HTML from a composition spec                   |
| **Compiler**       | `compileTimingAttrs` — resolve `data-start` / `data-duration` into absolute times                    |
| **Linter**         | `lintPentovideoHtml` — validate Pentovideo HTML (missing attributes, overlapping tracks, etc.)      |
| **Runtime**        | IIFE script injected into the browser — manages seek, media playback, and the `window.__hf` protocol |
| **Frame Adapters** | Pluggable animation drivers (GSAP, Lottie, CSS, or custom)                                           |

## Frame Adapters

A frame adapter tells the engine how to seek your animation to a specific frame:

```typescript
import { createGSAPFrameAdapter } from "@pentovideo/core";

const adapter = createGSAPFrameAdapter({
  getTimeline: () => gsap.timeline(),
  compositionId: "my-video",
});
```

Implement `FrameAdapter` for custom animation runtimes:

```typescript
import type { FrameAdapter } from "@pentovideo/core";

const myAdapter: FrameAdapter = {
  id: "my-adapter",
  getDurationFrames: () => 300,
  seekFrame: (frame) => {
    /* seek your animation */
  },
};
```

## Parsing and generating HTML

```typescript
import { parseHtml, generatePentovideoHtml } from "@pentovideo/core";

const { elements, metadata } = parseHtml(htmlString);
const html = generatePentovideoHtml(spec);
```

## Linting

```typescript
import { lintPentovideoHtml } from "@pentovideo/core/lint";

const result = lintPentovideoHtml(htmlString);
// result.findings: { severity, message, elementId }[]
```

## Documentation

Full documentation: [github.com/zhbcher/pentovideo/packages/core](https://github.com/zhbcher/pentovideo/packages/core)

## Related packages

- [`@pentovideo/engine`](../engine) — rendering engine that drives the browser
- [`@pentovideo/producer`](../producer) — full render pipeline (capture + encode)
- [`pentovideo`](../cli) — CLI
