---
name: PentoVideo
description: AI Video Factory — Topic→Video, ImageGen→Video, PPT→Video, Images→Video. Four production lines via HyperFrames HTML rendering. AI Video Factory 四条线全走HTML渲染：主题→视频、生图→视频、PPT→视频、图片→视频。Includes pre-flight gate, prompt expansion, SenseNova image gen, OCR QA, Edge TTS, Whisper captions, GSAP/WAAPI/CSS/Anime.js/Three.js/Lottie animations, CSS+WebGL transitions, quality gates (lint/validate/inspect/contrast/design/animation-map).
---

# PentoVideo

HTML is the source of truth for video. A composition is an HTML file with `data-*` attributes for timing, a GSAP timeline for animation, and CSS for appearance. PentoVideo handles clip visibility, media playback, and timeline sync.

## 🚀 Quick Jump

| 你的情况 | 直接跳转 |
|---------|----------|
| 有口播稿+图片，做视频 | → [线D-Fast](#线d-fast快速模式-图片口播稿) |
| 有PPT，做讲解视频 | → [§1 线C](workflows/line-c-ppt.md) |
| 有主题，需要生图 | → [§1 线B](workflows/line-b-image-gen.md) |
| 有图片，无口播稿 | → [§1 线D](workflows/line-d-images.md) |
| 只有纯文本主题 | → [§1 线A](workflows/line-a-pure-css.md) |
| 只要配音 | → [Edge TTS](tools/edge-tts.md) |
| 只要生图 | → [商汤生图](tools/sensenova-image-gen.md) |
| 只要封面 | → [封面生成](tools/cover-generation.md) |

---

## §0 前置门控（Pre-Flight Gate）🛑 硬性规则

**接到任何视频制作请求后，立即检查以下 7 项。缺任何必填项，禁止进入后续步骤，必须先反问补齐。**

| # | 字段 | 类型 | 缺失时的行为 | 默认值 |
|---|------|------|-------------|--------|
| 1 | **主题** | 必填 | 🛑 反问：要做什么主题的视频？ | — |
| 2 | **受众** | 必填 | 🛑 反问：给谁看？开发者/高管/消费者/学生？ | — |
| 3 | **路线** | 必填 | 🛑 反问：用哪条线？A纯CSS / B生图 / C PPT / D图片？ | — |
| 4 | **平台** | 选填 | 使用默认值，告知用户 | 默认：B站/YouTube风格，横版1920x1080，时长≤10分钟 |
| 5 | **时长目标** | 推荐 | 按平台推断默认值，告知用户 | 抖音 30-90s / B站 3-8min / 项目介绍 60-120s |
| 6 | **风格偏好** | 推荐 | 按受众推断默认风格，告知用户 | 开发者→tech-dark / 消费者→neon-gradient / 高管→business-green |
| 7 | **底线/禁止** | 推荐 | 使用默认值，告知用户 | 无特殊限制；自动排除安装命令、GitHub地址、下载链接 |

### 🔴 三大默认铁律（Iron Defaults）

| # | 规则 | 说明 |
|---|------|------|
| 1 | **默认横版** | 无特殊说明一律 1920×1080（16:9 横版），非竖版 |
| 2 | **默认配音** | 无特殊说明一律生成口播配音。中文→Edge TTS(`zh-CN-YunyangNeural`)，英文→Kokoro |
| 3 | **默认精确对齐** | 口播必须按自然段落拆分场景。每段口播时长=场景时长。禁止用估算时长，必须用 `ffprobe` 实测音频时长后设置 `data-duration` |
| 4 | **默认动画效果** | PPT/讲解类视频：每个页面元素必须有入场动画（`gsap.from`），页间必须有转场动画。禁止纯静态页面切换 |

**对齐操作流程**：
```
1. 口播稿按自然段拆为 N 段
2. 逐段生成 TTS → 用 ffprobe 测每段精确时长
3. 场景 data-duration = 该段音频时长（取整秒）
4. 合并音频 → 写 HTML → 时间线自动对齐
```

### 默认行为规则
- **格式默认**：无特殊说明时一律横版 1920×1080（非竖版）
- **配音默认**：无特殊说明时一律生成口播配音（Edge TTS 中文 / Kokoro 英文）
- **字幕默认**：无特殊说明时一律不加字幕（除非用户要求或抖音竖版）
- **对齐默认**：口播与画面必须精确对齐，禁止估算
- **动画默认**：PPT/讲解类视频每个页面的元素必须有入场动画（`gsap.from`），页与页之间必须有转场动画（opacity + visibility hard kill）。禁止纯静态页面切换

### §0.5 方向确认（Direction Picker）🆕

**在 §0 门控通过后、§1 路由前执行。** 锁定视觉方向，不让 Agent 乱发挥。

```
§0 门控通过 →
  §0.5 方向确认：
    ├─ 用户明确指定风格 → 直接锁定，跳过
    ├─ 用户只说了大概（"科技风""高级感"）→ 从 design-systems/ 推3个候选 → 用户选1个
    └─ 用户完全没提 → 按受众默认推（开发者→tech-dark，消费者→neon-gradient，高管→business-green）
  §1 路由 →
```

**推选格式（不超过3行）**：
```
根据你的需求，推荐 3 个视觉方向：
1. tech-dark（深色科技风，适合开发者）
2. neon-electric（霓虹电光，适合劲爆内容）
3. clean-corporate（简洁商务，适合正式场合）
选哪个？不需要就回"直接做"。
```

**锁死后**：Agent 从 `design-systems/{name}.md` 读取配色+字体，全片使用，禁止中途切换。

### 门控执行流程

```
用户说"做视频" →
  Step 0: 提取已有信息，检查 7 项
  Step 0.5: 快速通道？口播稿+图片/PPT+风格 三者齐全？
    ├─ YES → 跳过反问，直接进入 §1 路由
    └─ NO  → 继续 Step 1
  Step 1: 必填项全齐？
    ├─ YES → 进入 §1 路由
    └─ NO  → 反问缺失项（只问缺的，不重复已提供的），等待用户回复后重新走 §0
```

**快速通道触发条件**（满足任意一组即可跳过反问）：
1. 口播稿/脚本 + 图片/PPT + 风格偏好 → 直接进线C或线D
2. 主题 + 风格 + 平台 → 直接进线A或线B

### 反问格式（简洁，不超过 5 行）

```
收到。还差几项信息确认一下：
1. 给谁看？（开发者/高管/消费者/学生）
2. 用哪条线？（A纯CSS / B需要生图 / C有PPT / D有图片）
3. 平台和时长？（默认抖音横版10分钟内）
```

**⚠️ 门控未通过，禁止跳入 §1 及之后任何步骤。**

---

## §1 路由决策树

**仅在 §0 门控通过后执行。** 根据确定的路线分发到对应工作流。

```
根据 §0 确定的路线 →
├─ 线A → workflows/line-a-pure-css.md     # 主题 + HTML+CSS动画 → 视频
├─ 线B → workflows/line-b-image-gen.md    # 主题 + 商汤生图→OCR质检 → HTML → 视频
├─ 线C → workflows/line-c-ppt.md          # PPT → 识图 → HTML → 视频（有/无口播稿）
├─ 线D → workflows/line-d-images.md       # 图片 → 识图 → HTML → 视频（有/无口播稿）
├─ 线D-Fast → workflows/line-d-fast.md    # ★ 图片+口播稿快速模式（跳过OCR，4阶段）
├─ "只生图" → tools/sensenova-image-gen.md
├─ "只要配音" → tools/edge-tts.md
├─ "生成封面" → tools/cover-generation.md
└─ "录网站做视频" → skills/website-to-pentovideo/
```

产出一律到 `workspace/PentoVideo/{YYYY-MM-DD}_{项目名}/`。

---

## §2 Design System（Step 1）

硬门控：写HTML前必须确定视觉身份。禁止用 `#333`/`#3b82f6`/`Roboto` 等默认值。

If `design.md` or `DESIGN.md` exists in the project, read it first. It's the source of truth for brand colors, fonts, and constraints.

If no `design.md` exists, offer the user a choice:

1. **User named a specific brand?** → 读 `design-systems/{name}.md` 直接用现成配色（Stripe/Apple/Notion/Linear 等 10 套）
2. **User named a style or mood?** → 读 [styles/match-guide.md](styles/match-guide.md) 从18套风格中匹配
3. **Want to browse options?** → 读 [references/design-picker.md](references/design-picker.md) 可视化选色
3. **Want to go fast?** → 问mood/light or dark/品牌色，从 [house-style.md](house-style.md) 选

---

## §3 Prompt Expansion（Step 2）

每做合成前跑。将用户意图 + design.md + house-style 统一为中间产物。

读 [references/prompt-expansion.md](references/prompt-expansion.md) 全流程。输出到 `.pentovideo/expanded-prompt.md`。

---

## §4 Plan（Step 3）

Before writing HTML:

1. **What** — narrative arc, key moments, emotional beats
2. **Structure** — how many compositions, tracks
3. **Rhythm** — 读 [references/beat-direction.md](references/beat-direction.md)
4. **Timing** — which clips drive duration, where transitions land
5. **Layout** — build end-state first（见 §5）
6. **Animate** — then add motion

**Build what was asked.** Every element earns its place.

<HARD-GATE>
Before writing ANY composition HTML — verify visual identity from §2. If reaching for `#333`, `#3b82f6`, or `Roboto`, you skipped it.
</HARD-GATE>

---
Before writing ANY composition HTML — verify you have a visual identity from Step 1. If you're reaching for `#333`, `#3b82f6`, or `Roboto`, you skipped it.
</HARD-GATE>

## Layout Before Animation

Position every element where it should be at its **most visible moment** — the frame where it's fully entered, correctly placed, and not yet exiting. Write this as static HTML+CSS first. No GSAP yet.

**Why this matters:** If you position elements at their animated start state (offscreen, scaled to 0, opacity 0) and tween them to where you think they should land, you're guessing the final layout. Overlaps are invisible until the video renders. By building the end state first, you can see and fix layout problems before adding any motion.

### The process

1. **Identify the hero frame** for each scene — the moment when the most elements are simultaneously visible. This is the layout you build.
2. **Write static CSS** for that frame. The `.scene-content` container MUST fill the full scene using `width: 100%; height: 100%; padding: Npx;` with `display: flex; flex-direction: column; gap: Npx; box-sizing: border-box`. Use padding to push content inward — NEVER `position: absolute; top: Npx` on a content container. Absolute-positioned content containers overflow when content is taller than the remaining space. Reserve `position: absolute` for decoratives only.
3. **Add entrances with `gsap.from()`** — animate FROM offscreen/invisible TO the CSS position. The CSS position is the ground truth; the tween describes the journey to get there. (In sub-compositions loaded via `data-composition-src`, prefer `gsap.fromTo()` — see load-bearing GSAP rules in [references/motion-principles.md](references/motion-principles.md).)
4. **Add exits with `gsap.to()`** — animate TO offscreen/invisible FROM the CSS position.

### Example

```css
/* scene-content fills the scene, padding positions content */
.scene-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 120px 160px;
  gap: 24px;
  box-sizing: border-box;
}
.title {
  font-size: 120px;
}
.subtitle {
  font-size: 42px;
}
/* Container fills any scene size (1920x1080, 1080x1920, etc).
   Padding positions content. Flex + gap handles spacing. */
```

**WRONG — hardcoded dimensions and absolute positioning:**

```css
.scene-content {
  position: absolute;
  top: 200px;
  left: 160px;
  width: 1920px;
  height: 1080px;
  display: flex; /* ... */
}
```

```js
// Step 3: Animate INTO those positions
tl.from(".title", { y: 60, opacity: 0, duration: 0.6, ease: "power3.out" }, 0);
tl.from(".subtitle", { y: 40, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.2);
tl.from(".logo", { scale: 0.8, opacity: 0, duration: 0.4, ease: "power2.out" }, 0.3);

// Step 4: Animate OUT from those positions
tl.to(".title", { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" }, 3);
tl.to(".subtitle", { y: -30, opacity: 0, duration: 0.3, ease: "power2.in" }, 3.1);
tl.to(".logo", { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" }, 3.2);
```

### When elements share space across time

If element A exits before element B enters in the same area, both should have correct CSS positions for their respective hero frames. The timeline ordering guarantees they never visually coexist — but if you skip the layout step, you won't catch the case where they accidentally overlap due to a timing error.

### What counts as intentional overlap

Layered effects (glow behind text, shadow elements, background patterns) and z-stacked designs (card stacks, depth layers) are intentional. The layout step is about catching **unintentional** overlap — two headlines landing on top of each other, a stat covering a label, content bleeding off-frame.

## Data Attributes

### All Clips

| Attribute          | Required                          | Values                                                 |
| ------------------ | --------------------------------- | ------------------------------------------------------ |
| `id`               | Yes                               | Unique identifier                                      |
| `data-start`       | Yes                               | Seconds or clip ID reference (`"el-1"`, `"intro + 2"`) |
| `data-duration`    | Required for img/div/compositions | Seconds. Video/audio defaults to media duration.       |
| `data-track-index` | Yes                               | Integer. Same-track clips cannot overlap.              |
| `data-media-start` | No                                | Trim offset into source (seconds)                      |
| `data-volume`      | No                                | 0-1 (default 1)                                        |

`data-track-index` does **not** affect visual layering — use CSS `z-index`.

### Composition Clips

| Attribute                    | Required | Values                                                            |
| ---------------------------- | -------- | ----------------------------------------------------------------- |
| `data-composition-id`        | Yes      | Unique composition ID                                             |
| `data-start`                 | Yes      | Start time (root composition: use `"0"`)                          |
| `data-duration`              | Yes      | Takes precedence over GSAP timeline duration                      |
| `data-width` / `data-height` | Yes      | Pixel dimensions (1920x1080 or 1080x1920)                         |
| `data-composition-src`       | No       | Path to external HTML file                                        |
| `data-variable-values`       | No       | JSON object of per-instance variable overrides on a sub-comp host |

On the root `<html>` element:

| Attribute                    | Required | Values                                                                                                                         |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-composition-variables` | No       | JSON array of declared variables (id/type/label/default) — drives Studio editing UI and provides defaults for `getVariables()` |

## Composition Structure

Sub-compositions loaded via `data-composition-src` use a `<template>` wrapper. **Standalone compositions (the main index.html) do NOT use `<template>`** — they put the `data-composition-id` div directly in `<body>`. Using `<template>` on a standalone file hides all content from the browser and breaks rendering.

Sub-composition structure:

```html
<template id="my-comp-template">
  <div data-composition-id="my-comp" data-width="1920" data-height="1080">
    <!-- content -->
    <style>
      [data-composition-id="my-comp"] {
        /* scoped styles */
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      // tweens...
      window.__timelines["my-comp"] = tl;
    </script>
  </div>
</template>
```

Load in root: `<div id="el-1" data-composition-id="my-comp" data-composition-src="compositions/my-comp.html" data-start="0" data-duration="10" data-track-index="1"></div>`

## Variables (Parametrized Compositions)

Render the same composition with different content — title, theme color, prices, captions — without editing the source HTML.

**Three-step pattern:**

1. **Declare** variables on the composition's `<html>` root with `data-composition-variables`. Each entry needs `id`, `type` (one of `string`, `number`, `color`, `boolean`, `enum`), `label`, and `default`. Enum entries also need `options: [{value, label}, ...]`.
2. **Read** the resolved values inside the composition's script with `window.__pentovideo.getVariables()`. Returns the merged result of declared defaults + per-instance overrides + CLI overrides.
3. **Override** at render time with `npx pentovideo render --variables '{...}'` (top-level) or with `data-variable-values='{...}'` on the host element (per-instance for sub-comps).

```html
<!doctype html>
<html
  data-composition-variables='[
  {"id":"title","type":"string","label":"Title","default":"Hello"},
  {"id":"theme","type":"enum","label":"Theme","default":"light","options":[
    {"value":"light","label":"Light"},
    {"value":"dark","label":"Dark"}
  ]}
]'
>
  <body>
    <div data-composition-id="root" data-width="1920" data-height="1080">
      <h1 id="hero" class="clip" data-start="0" data-duration="3"></h1>
      <script>
        const { title, theme } = window.__pentovideo.getVariables();
        document.getElementById("hero").textContent = title;
        document.body.dataset.theme = theme;
      </script>
    </div>
  </body>
</html>
```

```bash
# Dev preview uses declared defaults
npx pentovideo preview

# Render with overrides
npx pentovideo render --variables '{"title":"Q4 Report","theme":"dark"}' --output q4.mp4

# Or from a JSON file
npx pentovideo render --variables-file ./vars.json
```

**Sub-composition per-instance values:** the same `getVariables()` works inside sub-comps loaded via `data-composition-src`. Each host element passes its own values:

```html
<div
  data-composition-id="card-pro"
  data-composition-src="compositions/card.html"
  data-variable-values='{"title":"Pro","price":"$29"}'
></div>
<div
  data-composition-id="card-enterprise"
  data-composition-src="compositions/card.html"
  data-variable-values='{"title":"Enterprise","price":"Custom"}'
></div>
```

The runtime layers each host's `data-variable-values` over the sub-comp's declared defaults on a per-instance basis, so the same source can be embedded multiple times with different content.

**Rules of thumb:**

- Always provide a sensible `default` for every declared variable. Dev preview uses defaults — without them, the composition won't render correctly until `--variables` is provided.
- Read variables once at the top of the script (`const { title } = ...`), not inside frame loops or event handlers — `getVariables()` allocates a fresh object per call.
- Use `--strict-variables` in CI to fail fast on undeclared keys or type mismatches.
- Variable types are validated at render time. `string`, `number`, `boolean`, and `color` (hex string) check `typeof`; `enum` checks the value is in the declared `options`.

## Video and Audio

Video must be `muted playsinline`. Audio is always a separate `<audio>` element:

```html
<video
  id="el-v"
  data-start="0"
  data-duration="30"
  data-track-index="0"
  src="video.mp4"
  muted
  playsinline
></video>
<audio
  id="el-a"
  data-start="0"
  data-duration="30"
  data-track-index="2"
  src="video.mp4"
  data-volume="1"
></audio>
```

## Timeline Contract

- All timelines start `{ paused: true }` — the player controls playback
- Register every timeline: `window.__timelines["<composition-id>"] = tl`
- Framework auto-nests sub-timelines — do NOT manually add them
- Duration comes from `data-duration`, not from GSAP timeline length
- Never create empty tweens to set duration

## Rules (Non-Negotiable)

**Deterministic:** No `Math.random()`, `Date.now()`, or time-based logic. Use a seeded PRNG if you need pseudo-random values (e.g. mulberry32).

**GSAP:** Only animate visual properties (`opacity`, `x`, `y`, `scale`, `rotation`, `color`, `backgroundColor`, `borderRadius`, transforms). Do NOT animate `visibility`, `display`, or call `video.play()`/`audio.play()`.

**Animation conflicts:** Never animate the same property on the same element from multiple timelines simultaneously.

**No `repeat: -1`:** Infinite-repeat timelines break the capture engine. Calculate the exact repeat count from composition duration: `repeat: Math.ceil(duration / cycleDuration) - 1`.

**Synchronous timeline construction:** Never build timelines inside `async`/`await`, `setTimeout`, or Promises. The capture engine reads `window.__timelines` synchronously after page load. Fonts are embedded by the compiler, so they're available immediately — no need to wait for font loading.

**Never do:**

1. Forget `window.__timelines` registration
2. Use video for audio — always muted video + separate `<audio>`
3. Nest video inside a timed div — use a non-timed wrapper
4. Use `data-layer` (use `data-track-index`) or `data-end` (use `data-duration`)
5. Animate video element dimensions — animate a wrapper div
6. Call play/pause/seek on media — framework owns playback
7. Create a top-level container without `data-composition-id`
8. Use `repeat: -1` on any timeline or tween — always finite repeats
9. Build timelines asynchronously (inside `async`, `setTimeout`, `Promise`)
10. Use `gsap.set()` on clip elements from later scenes — they don't exist in the DOM at page load. Use `tl.set(selector, vars, timePosition)` inside the timeline at or after the clip's `data-start` time instead.
11. Use `<br>` in content text — forced line breaks don't account for actual rendered font width. Text that wraps naturally + a `<br>` produces an extra unwanted break, causing overlap. Let text wrap via `max-width` instead. Exception: short display titles where each word is deliberately on its own line (e.g., "THE\nIMMORTAL\nGAME" at 130px).

## Scene Transitions (Non-Negotiable)

Every multi-scene composition MUST follow ALL of these rules. Violating any one of them is a broken composition.

1. **ALWAYS use transitions between scenes.** No jump cuts. No exceptions.
2. **ALWAYS use entrance animations on every scene.** Every element animates IN via `gsap.from()`. No element may appear fully-formed. If a scene has 5 elements, it needs 5 entrance tweens.
3. **NEVER use exit animations** except on the final scene. This means: NO `gsap.to()` that animates opacity to 0, y offscreen, scale to 0, or any other "out" animation before a transition fires. The transition IS the exit. The outgoing scene's content MUST be fully visible at the moment the transition starts.
4. **Final scene only:** The last scene may fade elements out (e.g., fade to black). This is the ONLY scene where `gsap.to(..., { opacity: 0 })` is allowed.

**WRONG — exit animation before transition:**

```js
// BANNED — this empties the scene before the transition can use it
tl.to("#s1-title", { opacity: 0, y: -40, duration: 0.4 }, 6.5);
tl.to("#s1-subtitle", { opacity: 0, duration: 0.3 }, 6.7);
// transition fires on empty frame
```

**RIGHT — entrance only, transition handles exit:**

```js
// Scene 1 entrance animations
tl.from("#s1-title", { y: 50, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.3);
tl.from("#s1-subtitle", { y: 30, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.6);
// NO exit tweens — transition at 7.2s handles the scene change
// Scene 2 entrance animations
tl.from("#s2-heading", { x: -40, opacity: 0, duration: 0.6, ease: "expo.out" }, 8.0);
```

## Animation Guardrails

- Offset first animation 0.1-0.3s (not t=0)
- Vary eases across entrance tweens — use at least 3 different eases per scene
- Don't repeat an entrance pattern within a scene
- Avoid full-screen linear gradients on dark backgrounds (H.264 banding — use radial or solid + localized glow)
- 60px+ headlines, 20px+ body, 16px+ data labels for rendered video
- `font-variant-numeric: tabular-nums` on number columns

If no `design.md` exists, follow [house-style.md](./house-style.md) for aesthetic defaults.

## Typography and Assets

- **Built-in fonts:** Write the `font-family` you want in CSS — the compiler embeds supported fonts automatically.
- **Custom fonts:** If design.md names a font that isn't built-in, the user must provide `.woff2` files in a `fonts/` directory. If missing, warn before writing HTML. When files exist, add `@font-face` declarations pointing to the local files.
- Add `crossorigin="anonymous"` to external media
- For dynamic text overflow, use `window.__pentovideo.fitTextFontSize(text, { maxWidth, fontFamily, fontWeight })`
- All files live at the project root alongside `index.html`; sub-compositions use `../`

## Editing Existing Compositions

- **Read actual files, don't guess.** When editing, extending, or creating companion compositions, read the existing source. Don't reconstruct hex codes from memory. Don't guess GSAP easing patterns. The composition IS the spec — extract exact values from it.
- Match existing fonts, colors, animation patterns from what you read
- Only change what was requested
- Preserve timing of unrelated clips

## Output Checklist

**Fast (run immediately, block on results):**

- [ ] `npx pentovideo lint` and `npx pentovideo validate` both pass
- [ ] Design adherence verified if design.md exists

**Slow (run in parallel while presenting the preview to the user):**

- [ ] `npx pentovideo inspect` passes, or every reported overflow is intentionally marked
- [ ] Contrast warnings addressed (see Quality Checks below)
- [ ] Animation choreography verified (see Quality Checks below)

## Quality Checks

### Visual Inspect

`pentovideo inspect` runs the composition in headless Chrome, seeks through the timeline, and maps visual layout issues with timestamps, selectors, bounding boxes, and fix hints. Run it after `lint` and `validate`:

```bash
npx pentovideo inspect
npx pentovideo inspect --json
```

Failures usually mean text is spilling out of a bubble/card, a fixed-size label is clipping dynamic copy, or text has moved off the canvas. Fix by increasing container size or padding, reducing font size or letter spacing, adding a real `max-width` so text wraps inside the container, or using `window.__pentovideo.fitTextFontSize(...)` for dynamic copy.

Use `--samples 15` for dense videos and `--at 1.5,4,7.25` for specific hero frames. Repeated static issues are collapsed by default to avoid flooding agent context. If overflow is intentional for an entrance/exit animation, mark the element or ancestor with `data-layout-allow-overflow`. If a decorative element should never be audited, mark it with `data-layout-ignore`.

`pentovideo layout` is the compatibility alias for the same check.

### Contrast

`pentovideo validate` runs a WCAG contrast audit by default. It seeks to 5 timestamps, screenshots the page, samples background pixels behind every text element, and computes contrast ratios. Failures appear as warnings:

```
⚠ WCAG AA contrast warnings (3):
  · .subtitle "secondary text" — 2.67:1 (need 4.5:1, t=5.3s)
```

If warnings appear:

- On dark backgrounds: brighten the failing color until it clears 4.5:1 (normal text) or 3:1 (large text, 24px+ or 19px+ bold)
- On light backgrounds: darken it
- Stay within the palette family — don't invent a new color, adjust the existing one
- Re-run `pentovideo validate` until clean

Use `--no-contrast` to skip if iterating rapidly and you'll check later.

### Design Adherence

If a `design.md` exists, verify the composition follows it after authoring. Read the HTML and check:

1. **Colors** — every hex value in the composition appears in design.md's palette section (however the user labeled it: Colors, Palette, Theme, etc.). Flag any invented colors.
2. **Typography** — font families and weights match design.md's type spec. No substitutions.
3. **Corners** — border-radius values match the declared corner style, if specified.
4. **Spacing** — padding and gap values fall within the declared density range, if specified.
5. **Depth** — shadow usage matches the declared depth level, if specified (flat = none, subtle = light, layered = glows).
6. **Avoidance rules** — if design.md has a section listing things to avoid (commonly "What NOT to Do", "Don'ts", "Anti-patterns", or "Do's and Don'ts"), verify none are present.

Report violations as a checklist. Fix each one before serving.

If no `design.md` exists (house-style-only path), verify:

1. **Palette consistency** — the same bg, fg, and accent colors are used across all scenes. No per-scene color invention.
2. **No lazy defaults** — check the composition against house-style.md's "Lazy Defaults to Question" list. If any appear, they must be a deliberate choice for the content, not a default.

### Animation Map

After authoring animations, run the animation map to verify choreography:

```bash
node skills/pentovideo/scripts/animation-map.mjs <composition-dir> \
  --out <composition-dir>/.pentovideo/anim-map
```

Outputs a single `animation-map.json` with:

- **Per-tween summaries**: `"#card1 animates opacity+y over 0.50s. moves 23px up. fades in. ends at (120, 200)"`
- **ASCII timeline**: Gantt chart of all tweens across the composition duration
- **Stagger detection**: reports actual intervals (`"3 elements stagger at 120ms"`)
- **Dead zones**: periods over 1s with no animation — intentional hold or missing entrance?
- **Element lifecycles**: first/last animation time, final visibility
- **Scene snapshots**: visible element state at 5 key timestamps
- **Flags**: `offscreen`, `collision`, `invisible`, `paced-fast` (under 0.2s), `paced-slow` (over 2s)

Read the JSON. Scan summaries for anything unexpected. Check every flag — fix or justify. Verify the timeline shows the intended choreography rhythm. Re-run after fixes.

Skip on small edits (fixing a color, adjusting one duration). Run on new compositions and significant animation changes.

---

## References (loaded on demand)

- **[references/captions.md](references/captions.md)** — Captions, subtitles, lyrics, karaoke synced to audio. Tone-adaptive style detection, per-word styling, text overflow prevention, caption exit guarantees, word grouping. Read when adding any text synced to audio timing.
- **[references/audio-reactive.md](references/audio-reactive.md)** — Audio-reactive animation: map frequency bands and amplitude to GSAP properties. Read when visuals should respond to music, voice, or sound.
- **[references/css-patterns.md](references/css-patterns.md)** — CSS+GSAP marker highlighting: highlight, circle, burst, scribble, sketchout. Deterministic, fully seekable. Read when adding visual emphasis to text.
- **[references/video-composition.md](references/video-composition.md)** — Video-medium rules: density, color presence, scale, frame composition, design.md as brand not layout. **Always read** — these override web instincts.
- **[references/beat-direction.md](references/beat-direction.md)** — Beat planning: concept, mood, choreography verbs, rhythm templates, transition decisions, depth layers. **Always read for multi-scene compositions.**
- **[references/typography.md](references/typography.md)** — Typography: font pairing, OpenType features, dark-background adjustments, font discovery script. **Always read** — every composition has text.
- **[references/motion-principles.md](references/motion-principles.md)** — Motion design principles, image motion treatment, load-bearing GSAP rules. **Always read** — every composition has motion.
- **[references/techniques.md](references/techniques.md)** — 11 visual techniques with code patterns: SVG drawing, Canvas 2D, CSS 3D, kinetic type, Lottie, video compositing, typing effect, variable fonts, MotionPath, velocity transitions, audio-reactive. Read when planning techniques per beat.
- **[references/narration.md](references/narration.md)** — Pacing, tone, script structure, number pronunciation, opening line patterns. Read when the composition includes voiceover or TTS.
- **[references/design-picker.md](references/design-picker.md)** — Create a design.md via visual picker. Read when no design.md exists and the user wants to create one.
- **[visual-styles.md](visual-styles.md)** — 8 named visual styles with hex palettes, GSAP easing signatures, and shader pairings. Read when user names a style or when generating design.md.
- **[house-style.md](house-style.md)** — Default motion, sizing, and color palettes when no design.md is specified.
- **[patterns.md](patterns.md)** — PiP, title cards, slide show patterns.
- **[data-in-motion.md](data-in-motion.md)** — Data, stats, and infographic patterns.
- **[references/transcript-guide.md](references/transcript-guide.md)** — Caption-side transcript handling: input formats, mandatory quality check, cleaning JS, OpenAI/Groq API fallback, "if no transcript exists" flow. (For the `transcribe` CLI invocation, model selection rules, and the `.en` gotcha, see the `pentovideo-media` skill.)
- **[references/dynamic-techniques.md](references/dynamic-techniques.md)** — Dynamic caption animation techniques (karaoke, clip-path, slam, scatter, elastic, 3D).

- **[references/transitions.md](references/transitions.md)** — Scene transitions: crossfades, wipes, reveals, shader transitions. Energy/mood selection, CSS vs WebGL guidance. **Always read for multi-scene compositions** — scenes without transitions feel like jump cuts.
  - [transitions/catalog.md](references/transitions/catalog.md) — Hard rules, scene template, and routing to per-type implementation code.
  - Shader transitions are in `@pentovideo/shader-transitions` (`packages/shader-transitions/`) — read package source, not skill files.

GSAP patterns and effects are in the `/gsap` skill.
