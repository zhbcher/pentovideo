<p align="center">
  <h1>🎬 PentoVideo</h1>
  <p><strong>AI Video Factory — Write HTML. Render video. Built for agents.</strong></p>
  <p>AI 视频工厂 — 写 HTML，出视频。为 AI Agent 而生。</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PentoVideo-Skill-76B900?style=for-the-badge" alt="Skill" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Node-%3E%3D22-brightgreen?style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/OpenClaw-Plugin-6366f1?style=for-the-badge" alt="OpenClaw" />
</p>

---

## What is PentoVideo? | 这是什么？

PentoVideo is an AI-powered video factory that turns text, images, PPTs, and prompts into professional videos via HyperFrames HTML rendering. Four production lines, one engine. Forked from and built upon the open-source PentoVideo framework.

PentoVideo 是一个 AI 视频工厂，通过 HyperFrames HTML 渲染将主题、图片、PPT、口播稿转化为专业视频。四条生产线，一个引擎。基于开源 PentoVideo 框架构建。

| Line 生产线 | Input 输入 | Output 输出 |
|-----------|---------|----------|
| **A — Pure CSS** | Topic / Script | HTML + CSS animation → MP4 |
| **B — Image Gen** | Topic + SenseNova | AI images + HTML → MP4 |
| **C — PPT** | PPTX file | OCR → HTML → MP4 |
| **D — Images** | Images + Script | OCR/align → HTML → MP4 |
| **D-Fast** ⚡ | Images + Script (ready) | TTS → HTML → MP4 (4 steps) |

---

## Quick Start | 快速开始

```bash
# Clone the skill
git clone https://github.com/zhbcher/pentovideo.git

# Install dependencies
pnpm install

# Start video production
# Agent auto-triggers: §0 gate → route → produce
```

### Fastest Path | 最快路径

Have images + script + style? Jump straight to **Line D-Fast**:

```
Images + Script → Edge TTS → Scene split → HTML → Render → MP4
```

See [workflows/line-d-fast.md](workflows/line-d-fast.md) for the 4-step workflow.

---

## Architecture | 架构

```
                    §0 Pre-Flight Gate (7-field check)
                              │
                    §1 Routing Decision Tree
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   Line A (CSS)          Line B (Gen)          Line C/D (PPT/Img)
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    §2 Design System
                    §3 Prompt Expansion
                    §4 Build Timeline
                    §5 HTML Authoring
                    §6 Quality Gates (lint/validate)
                    §7 Preview → Render → Deliver
```

---

## Key Features | 核心功能

- **🛑 Pre-Flight Gate (§0)** — 7-field check before any work starts. Prevents context-losing rework.
- **🚀 Quick Jump** — 8 scenario-based entry points. Find your path in one click.
- **⚡ Line D-Fast** — Images + script → video in 4 steps. Our fastest production line.
- **🎨 18 Style Presets** — Tech-dark, neon-gradient, business-green, and more.
- **🎙️ Edge TTS** — Free unlimited Chinese TTS. Inline Python command, no script dependency.
- **🖼️ SenseNova Gen** — AI image generation via SenseNova U1 Fast. 11 sizes, 16:9 ready.
- **✅ Quality Gates** — lint/validate/inspect/contrast/design/animation-map. 6 checks before render.
- **🌐 Bilingual** — Chinese + English throughout. Built for Chinese-speaking developers.

---

## Production Lines | 生产线详情

| Line | Workflow | When to Use |
|------|----------|-------------|
| **A** | [line-a-pure-css.md](workflows/line-a-pure-css.md) | Topic → HTML+CSS animation |
| **B** | [line-b-image-gen.md](workflows/line-b-image-gen.md) | Topic → SenseNova gen → OCR → HTML |
| **C** | [line-c-ppt.md](workflows/line-c-ppt.md) | PPT → OCR → HTML |
| **D** | [line-d-images.md](workflows/line-d-images.md) | Images → OCR → HTML |
| **D-Fast** ⚡ | [line-d-fast.md](workflows/line-d-fast.md) | Images + Script → 4-step fast track |

---

## Tools & Integration | 工具集成

| Tool | Description | File |
|------|-------------|------|
| **Edge TTS** | Free Chinese text-to-speech | [tools/edge-tts.md](tools/edge-tts.md) |
| **SenseNova Gen** | AI image generation | [tools/sensenova-image-gen.md](tools/sensenova-image-gen.md) |
| **OCR Check** | Image text extraction QA | [tools/ocr-check.md](tools/ocr-check.md) |
| **Cover Gen** | Video cover/thumbnail | [tools/cover-generation.md](tools/cover-generation.md) |
| **Build Timeline** | Scene timing construction | [tools/build-timeline.md](tools/build-timeline.md) |

---

## Animations & Transitions | 动画与转场

Full animation adapter support: GSAP, WAAPI, CSS, Anime.js, Three.js, Lottie. CSS + WebGL transition system.

| Adapter | Coverage |
|---------|----------|
| GSAP | Full timeline, easing, stagger |
| CSS Animations | Keyframes, delays, fill modes |
| WAAPI | element.animate(), deterministic seeking |
| Anime.js | Timelines, seek-driven rendering |
| Three.js | WebGL scenes, camera motion |
| Lottie | JSON + dotLottie, paused playback |

---

## Project Structure | 项目结构

```
PentoVideo/
├── SKILL.md                 # Skill definition (bilingual)
├── README.md                # This file
├── workflows/               # 4 production lines + line-d-fast
├── tools/                   # TTS, image gen, OCR, cover, timeline
├── references/              # Design system, transitions, captions
├── styles/                  # 18 style presets
├── animations/              # 6 animation adapters
├── packages/                # CLI, core, engine, producer
├── docs/                    # Optimization plans, guides
└── templates/               # Project templates
```

---

## Requirements | 环境要求

- Node.js >= 22
- FFmpeg
- pnpm
- OpenClaw (for skill integration)

---

## License | 许可证

Apache 2.0 — see [LICENSE](LICENSE).

Forked from the open-source PentoVideo framework. Built with ❤️ for the OpenClaw community.
