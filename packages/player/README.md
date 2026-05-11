# @pentovideo/player

Embeddable web component for playing PentoVideo compositions. Zero dependencies, works with any framework.

## Install

```bash
npm install @pentovideo/player
```

Or load directly via CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@pentovideo/player"></script>
```

If you need a classic `<script>` tag instead of ESM, use the explicit global build:

```html
<script src="https://cdn.jsdelivr.net/npm/@pentovideo/player/dist/pentovideo-player.global.js"></script>
```

## Usage

```html
<pentovideo-player src="./my-composition/index.html" controls></pentovideo-player>
```

The player loads the composition in a sandboxed iframe, auto-detects its dimensions and duration, and scales it responsively to fit the container.

### With a framework

```typescript
import "@pentovideo/player";

// The custom element is now registered — use it in your markup
// React: <pentovideo-player src="..." controls />
// Vue:   <pentovideo-player :src="url" controls />
```

### Poster image

Show a static image before playback starts:

```html
<pentovideo-player
  src="./composition/index.html"
  poster="./thumbnail.jpg"
  controls
></pentovideo-player>
```

## Attributes

| Attribute              | Type                            | Default       | Description                                                                 |
| ---------------------- | ------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `src`                  | string                          | —             | URL to the composition HTML file                                            |
| `audio-src`            | string                          | —             | Audio URL for parent-frame playback (mobile)                                |
| `width`                | number                          | 1920          | Composition width in pixels (aspect ratio)                                  |
| `height`               | number                          | 1080          | Composition height in pixels (aspect ratio)                                 |
| `controls`             | boolean                         | false         | Show play/pause, scrubber, and time display                                 |
| `muted`                | boolean                         | false         | Mute audio playback                                                         |
| `poster`               | string                          | —             | Image URL shown before playback starts                                      |
| `playback-rate`        | number                          | 1             | Speed multiplier (0.5 = half, 2 = double)                                   |
| `autoplay`             | boolean                         | false         | Start playing when ready                                                    |
| `loop`                 | boolean                         | false         | Restart when the composition ends                                           |
| `shader-capture-scale` | number                          | —             | Shader transition snapshot scale forwarded to browser previews (`0.25`-`1`) |
| `shader-loading`       | `composition \| player \| none` | `composition` | Controls shader transition prep loading UI ownership                        |

### Shader transition previews

When a composition uses `@pentovideo/shader-transitions`, the player can own preview-only shader capture settings:

```html
<pentovideo-player
  src="./composition/index.html"
  shader-capture-scale="1"
  shader-loading="player"
  controls
></pentovideo-player>
```

`shader-loading="player"` shows the player-owned transition-prep overlay from shader progress messages. `composition` leaves direct composition fallback behavior alone, and `none` suppresses the loader.

### Mobile audio

Mobile browsers block `audio.play()` inside iframes when the user gesture happened in the parent frame (the [User Activation spec](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation) does not propagate activation across frame boundaries via `postMessage`).

The player handles this automatically for same-origin iframes (the default — `sandbox` includes `allow-same-origin`):

1. When the composition is ready, the player extracts all timed media (`audio[data-start]`, `video[data-start]`) from the iframe DOM and creates parent-frame copies.
2. The iframe originals are disabled (`src` and `data-start` removed) so the runtime doesn't try to play them.
3. When `play()` is called (from a user gesture), parent media `.play()` runs synchronously in the gesture call stack, satisfying mobile autoplay policy.
4. Both parent media and the GSAP timeline start simultaneously and free-run — no active sync needed since both are real-time systems.

No changes are required by consumers — this works out of the box.

The optional `audio-src` attribute can be used to start preloading a primary audio track before the iframe loads (useful on slow connections), but is not required for mobile playback.

## JavaScript API

```js
const player = document.querySelector("pentovideo-player");

// Playback
player.play();
player.pause();
player.seek(2.5); // jump to 2.5 seconds

// Properties
player.currentTime; // number (read/write)
player.duration; // number (read-only)
player.paused; // boolean (read-only)
player.ready; // boolean (read-only)
player.playbackRate; // number (read/write)
player.muted; // boolean (read/write)
player.loop; // boolean (read/write)
player.shaderCaptureScale; // number (read/write)
player.shaderLoading; // "composition" | "player" | "none" (read/write)

// Inner iframe access (for advanced consumers — see "Advanced: iframe access" below)
player.iframeElement; // HTMLIFrameElement (read-only)
```

## Advanced: iframe access

The composition runs inside a sandboxed `<iframe>` in the player's Shadow DOM. For most use cases you don't need direct access — the JavaScript API above is enough. But if you're building an editor, recorder, or custom timeline that needs to inspect the composition's DOM or read its `__player` / `__timelines` runtime objects, use the `iframeElement` getter:

```js
const player = document.querySelector("pentovideo-player");
const iframe = player.iframeElement;

// Now you can reach into the composition's DOM and runtime
iframe.contentDocument.querySelectorAll("[data-composition-id]");
iframe.contentWindow.__timelines;
```

This is the canonical way to bridge the player into tools like [`@pentovideo/studio`](../studio). The studio exports a `resolveIframe` helper that works with both iframe refs and web-component refs:

```ts
import { useTimelinePlayer, resolveIframe } from "@pentovideo/studio";

const { iframeRef } = useTimelinePlayer();
const player = document.createElement("pentovideo-player");
player.setAttribute("src", src);
container.appendChild(player);

// Forward the inner iframe so useTimelinePlayer can drive play/pause/seek.
iframeRef.current = resolveIframe(player);
```

### React: declarative ref pattern

If you prefer JSX over imperative element creation, attach a ref directly to the web component and resolve the iframe inside an effect:

```tsx
import "@pentovideo/player";
import type { PentovideoPlayer } from "@pentovideo/player";
import { useTimelinePlayer, resolveIframe } from "@pentovideo/studio";

function StudioPreview({ src }: { src: string }) {
  const { iframeRef, onIframeLoad } = useTimelinePlayer();
  const playerRef = useRef<PentovideoPlayer>(null);

  useEffect(() => {
    iframeRef.current = resolveIframe(playerRef.current);
  });

  return <pentovideo-player ref={playerRef} src={src} onLoad={onIframeLoad} />;
}
```

> **Heads up — common gotcha**
>
> If you pass the `<pentovideo-player>` element itself (not `iframeElement`) into a hook that expects an `<iframe>`, every `.contentWindow` / `.contentDocument` access returns `null` because the iframe lives inside the player's Shadow DOM. Always extract `iframeElement` first, or use `resolveIframe` from `@pentovideo/studio` which handles both iframe and web-component hosts transparently.

## Events

| Event                   | Detail                     | Fired when                                 |
| ----------------------- | -------------------------- | ------------------------------------------ |
| `ready`                 | `{ duration }`             | Composition loaded and duration determined |
| `play`                  | —                          | Playback started                           |
| `pause`                 | —                          | Playback paused                            |
| `timeupdate`            | `{ currentTime }`          | Playback position changed (~10 fps)        |
| `ended`                 | —                          | Reached the end (when not looping)         |
| `error`                 | `{ message }`              | Composition failed to load                 |
| `shadertransitionstate` | `{ compositionId, state }` | Shader transition cache/capture progress   |

```js
player.addEventListener("ready", (e) => {
  console.log(`Duration: ${e.detail.duration}s`);
});

player.addEventListener("ended", () => {
  console.log("Done!");
});
```

## Sizing

The player fills its container and scales the composition to fit while preserving aspect ratio. Set a size on the element or its parent:

```css
pentovideo-player {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
}
```

The `width` and `height` attributes define the composition's native resolution for aspect ratio calculation — they don't set the player's display size.

## How it works

The player renders compositions in a sandboxed `<iframe>` inside a Shadow DOM. It communicates with the PentoVideo runtime via `postMessage`. If the composition has GSAP timelines (`window.__timelines`) but no runtime, the player auto-injects it from CDN.

## Distribution

| Format | File                           | Use case                       |
| ------ | ------------------------------ | ------------------------------ |
| ESM    | `pentovideo-player.js`        | Bundlers (Vite, webpack, etc.) |
| CJS    | `pentovideo-player.cjs`       | Node.js / require()            |
| IIFE   | `pentovideo-player.global.js` | `<script>` tag, CDN            |

All formats are minified with source maps. TypeScript definitions included.

## License

MIT
