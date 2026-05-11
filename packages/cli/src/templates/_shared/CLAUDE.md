# PentoVideo Composition Project

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

| Skill                      | Command                   | When to use                                                                                       |
| -------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| **pentovideo**            | `/pentovideo`            | Creating or editing HTML compositions, captions, TTS, audio-reactive animation, marker highlights |
| **pentovideo-cli**        | `/pentovideo-cli`        | Dev-loop CLI: init, lint, inspect, preview, render, doctor                                        |
| **pentovideo-media**      | `/pentovideo-media`      | Asset preprocessing: tts (Kokoro), transcribe (Whisper), remove-background (u2net)                |
| **pentovideo-registry**   | `/pentovideo-registry`   | Installing blocks and components via `pentovideo add`                                            |
| **website-to-pentovideo** | `/website-to-pentovideo` | Capturing a URL and turning it into a video — full website-to-video pipeline                      |
| **tailwind**               | `/tailwind`               | Tailwind v4 browser-runtime styles for projects created with `pentovideo init --tailwind`        |
| **gsap**                   | `/gsap`                   | GSAP animations for PentoVideo — tweens, timelines, easing, performance                          |
| **animejs**                | `/animejs`                | Anime.js animations registered on `window.__hfAnime`                                              |
| **css-animations**         | `/css-animations`         | CSS keyframes that PentoVideo can pause and seek                                                 |
| **lottie**                 | `/lottie`                 | `lottie-web` and dotLottie players registered on `window.__hfLottie`                              |
| **three**                  | `/three`                  | Three.js scenes rendered from PentoVideo `hf-seek` events                                        |
| **waapi**                  | `/waapi`                  | Web Animations API motion driven through `document.getAnimations()`                               |

> **Skills not available?** Ask the user to run `npx pentovideo skills` and restart their
> agent session, or install manually: `npx skills add heygen-com/pentovideo`.

## Commands

```bash
npm run dev          # preview in browser (studio editor)
npm run check        # lint + validate + inspect
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx pentovideo lint --verbose  # include info-level findings
npx pentovideo lint --json     # machine-readable output for CI
npx pentovideo docs <topic> # reference docs in terminal
```

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx pentovideo docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://pentovideo.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Inspect warnings should be reviewed before rendering.

## Key Rules

1. Every timed element needs `data-start`, `data-duration`, and `data-track-index`
2. Elements with timing **MUST** have `class="clip"` — the framework uses this for visibility control
3. Timelines must be paused and registered on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches
