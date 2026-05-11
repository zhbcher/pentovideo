# PentoVideo — 设计规格书（最终版）

> **SPM Phase 1：需求阶段**  
> **日期：** 2026-05-11  
> **项目性质：全新全栈项目**（借鉴 HyperFrames 架构和算法，代码全部重写）  
> **目标：** HyperFrames 有的全有且更优 + HyperFrames 没有的也要有 = PentoVideo

---

## §1 项目目标

### 必须覆盖（HyperFrames 现有功能 ≥ 全部保留）

PentoVideo 目标不是"替代 HyperFrames"，而是**全面超越**：

1. HyperFrames 全部功能 → PentoVideo 全部支持 + 更优
2. PentoVideo_old 全部增强 → PentoVideo 集成
3. 新增功能 → 持续扩展

---

## §2 完整功能对照表

### §2.1 核心工作流方法（HyperFrames → PentoVideo）

| # | HyperFrames 功能 | HyperFrames 位置 | PentoVideo 处理 | 状态 |
|---|-----------------|-----------------|----------------|------|
| 1 | Step 1: Design System（硬门控） | SKILL.md | 保留，融合到 SKILL.md | ✅ |
| 2 | Step 2: Prompt Expansion | SKILL.md + references/prompt-expansion.md | 保留 | ✅ |
| 3 | Step 3: Plan（6子步） | SKILL.md | 保留 | ✅ |
| 4 | Layout Before Animation | SKILL.md | 保留 | ✅ |
| 5 | Data Attributes 系统 | SKILL.md | 保留 | ✅ |
| 6 | Composition Structure | SKILL.md | 保留 | ✅ |
| 7 | Variables 参数化系统 | SKILL.md | 保留 | ✅ |
| 8 | Video & Audio 约定 | SKILL.md | 保留 | ✅ |
| 9 | Timeline Contract | SKILL.md | 保留 | ✅ |
| 10 | Scene Transitions 硬规则 | SKILL.md | 保留 | ✅ |
| 11 | Animation Guardrails | SKILL.md | 保留 | ✅ |
| 12 | Never Do 清单（11条） | SKILL.md | 保留 | ✅ |
| 13 | Typography & Assets | SKILL.md | 保留 | ✅ |
| 14 | Editing Compositions | SKILL.md | 保留 | ✅ |
| 15 | Output Checklist | SKILL.md | 保留 | ✅ |

### §2.2 设计方法论（references/）

| # | 参考文件 | 来源 | 处理 |
|---|---------|------|------|
| 1 | prompt-expansion.md | HyperFrames | 保留，升级支持四条线 |
| 2 | motion-principles.md | HyperFrames | 保留 |
| 3 | beat-direction.md | HyperFrames | 保留 |
| 4 | narration.md | HyperFrames | 保留 |
| 5 | video-composition.md | HyperFrames | 保留 |
| 6 | captions.md | HyperFrames | 保留 |
| 7 | audio-reactive.md | HyperFrames | 保留 |
| 8 | dynamic-techniques.md | HyperFrames | 保留 |
| 9 | techniques.md | HyperFrames | 保留 |
| 10 | transcript-guide.md | HyperFrames | 保留 |
| 11 | typography.md | HyperFrames | 保留 |
| 12 | design-picker.md | HyperFrames | 保留 |
| 13 | css-patterns.md | HyperFrames | 保留 |
| 14 | transitions.md | HyperFrames | 保留 |
| 15 | transitions/catalog.md + 13 转场实现 | HyperFrames | 保留 |
| 16 | house-style.md | HyperFrames | 保留 |
| 17 | data-in-motion.md | HyperFrames | 保留 |
| 18 | patterns.md | HyperFrames | 保留 |
| 19 | visual-styles.md | HyperFrames | 保留 |
| 20 | palettes/ (8个) | HyperFrames | 保留 |
| 21 | internal/ (animation-map/contrast/package-loader/design-picker) | HyperFrames | 保留 |

### §2.3 动画适配器（完全保留）

| # | 适配器 | 文件 | 处理 |
|---|-------|------|------|
| 1 | GSAP | SKILL.md + references/effects.md + scripts/extract-audio-data.py | 移到 animations/gsap/ |
| 2 | WAAPI | SKILL.md | 移到 animations/waapi/ |
| 3 | CSS Animations | SKILL.md | 移到 animations/css-animations/ |
| 4 | Anime.js | SKILL.md | 移到 animations/animejs/ |
| 5 | Three.js | SKILL.md | 移到 animations/three/ |
| 6 | Lottie | SKILL.md | 移到 animations/lottie/ |

### §2.4 子技能（完全保留）

| # | 子技能 | 文件数 | 处理 |
|---|-------|--------|------|
| 1 | pentovideo-cli → cli.md | 1 | 压缩为根 cli.md |
| 2 | pentovideo-media → media.md | 1 | 压缩为根 media.md |
| 3 | pentovideo-registry | 8 | 保留在 skills/ |
| 4 | remotion-to-pentovideo | 70 | 保留在 skills/ |
| 5 | website-to-pentovideo | 8 | 保留在 skills/ |
| 6 | contribute-catalog | 2 | 保留在 skills/ |
| 7 | tailwind | 1 | 保留在 skills/ |

### §2.5 质量检查（完全保留）

| # | 检查项 | 来源 | 处理 |
|---|-------|------|------|
| 1 | lint（结构校验） | HyperFrames | 保留 |
| 2 | validate（无头Chrome + WCAG对比度） | HyperFrames | 保留 |
| 3 | inspect（布局溢出） | HyperFrames | 保留 |
| 4 | contrast（对比度） | HyperFrames | 保留 |
| 5 | design adherence（设计一致性） | HyperFrames | 保留 |
| 6 | animation-map（动画编排验证） | HyperFrames | 保留 |

### §2.6 转场系统（完全保留 + 增强）

| 类别 | 数量 | 来源 |
|------|------|------|
| CSS Push/Slide | 4 种 | HyperFrames |
| CSS Scale/Zoom | 4 种 | HyperFrames |
| CSS Reveal/Mask | 5 种 | HyperFrames |
| CSS Dissolve | 4 种 | HyperFrames |
| CSS Cover | 2 种 | HyperFrames |
| Shader(WebGL) | 12 种 | HyperFrames |
| 转场能量匹配表 | 6 级 | HyperFrames |
| 转场情绪映射表 | 7 种 | HyperFrames |
| 叙事位置指南 | 5 位置 | HyperFrames |
| 预设 | 6 预置 | HyperFrames |

### §2.7 视觉技巧（完全保留）

| 类别 | 内容 | 来源 |
|------|------|------|
| CSS 文字高亮 | Marker sweep/圈画/爆发线/涂鸦/划线 | HyperFrames |
| 动态技巧 | Karaoke填充/Clip-path揭示/Slam/Scatter/3D旋转 | HyperFrames |
| Canvas 2D | 粒子系统/程序化纹理/路径绘制 | HyperFrames |
| SVG | 描边动画/路径变形/滤镜 | HyperFrames |

---

## §3 PentoVideo_old 全部功能迁移清单

以下功能是 HyperFrames 没有、PentoVideo_old 添加的，全部必须保留并升级：

### §3.1 入口控制

| # | 功能 | PentoVideo_old 章节 | 处理 |
|---|------|-------------------|------|
| 1 | §0 前置门控（7项检查） | §0 | 新增到 SKILL.md 最前面 |
| 2 | §1 路由决策树（线A/B/C/D） | §1 | 新增到 SKILL.md |
| 3 | §2 探索性请求覆盖 | §2 | 合并到门控 |

### §3.2 四条线全流程（核心业务）

| # | 线 | PentoVideo_old 章节 | 阶段数 | 关键差异 |
|---|----|-------------------|--------|---------|
| 4 | 线A：主题→CSS动画→视频 | §42 | 10 阶段 | 纯CSS，不生图 |
| 5 | 线B：主题→生图→OCR→视频 | §39 | 11 阶段 | 商汤生图+OCR质检 |
| 6 | 线C：PPT→识图→视频 | §40 | 9 阶段 | 有稿/无稿双分支 |
| 7 | 线D：图片→识图→视频 | §41 | 8 阶段 | 有稿/无稿双分支 |

### §3.3 视频生产工具

| # | 功能 | PentoVideo_old 章节 | 资源约束 |
|---|------|-------------------|---------|
| 8 | 商汤生图 | §43 | ✅ 已有 SenseNova API |
| 9 | OCR 质检（Tesseract + LLM双保险） | §44 | ✅ Tesseract CLI + 现有 Mistral/Sensenova |
| 10 | Edge TTS 集成 | §38 | ✅ 免费 Edge TTS |
| 11 | Kokoro TTS（fallback） | §26 | ✅ npx pentovideos 自带 |
| 12 | Whisper 转录 | §27 | ✅ npx pentovideos 自带 |
| 13 | Remove Background | §28 | ✅ npx pentovideos 自带 |
| 14 | 时间轴系统（build_timeline.py） | §45 | ✅ Python 脚本 |
| 15 | 封面生成 | §46 | ✅ 新增 |

### §3.4 字幕系统

| # | 功能 | PentoVideo_old 章节 | 
|---|------|-------------------|
| 16 | 字幕转录（Whisper） | §15 |
| 17 | 字幕风格检测（5种） | §15 |
| 18 | 逐词样式映射（5种语调） | §15 |
| 19 | 词组分组规则 | §15 |
| 20 | 字幕位置（横版/竖版） | §15 |
| 21 | 防溢出（fitTextFontSize） | §15 |
| 22 | 字幕退出保证（硬kill） | §15 |
| 23 | 字幕系统集成（§47全流程） | §47 |
| 24 | HTML字幕组件 | §47 |
| 25 | GSAP字幕同步 | §47 |

### §3.5 风格与模板

| # | 功能 | PentoVideo_old 章节 |
|---|------|-------------------|
| 26 | 风格库（§48，18套风格+26种布局） | §48 |
| 27 | 帧工风格匹配指南 | §36 |
| 28 | 模板速查 | §49 |
| 29 | SPM 视频模板 | §37 |
| 30 | 脚本速查 | §50 |

### §3.6 项目管理

| # | 功能 | PentoVideo_old 章节 |
|---|------|-------------------|
| 31 | 产出物规范 | §51 |
| 32 | 环境依赖 + env_check | §52 |
| 33 | 常见问题（6大FAQ） | §53 |
| 34 | 快速检查清单 | §56 |

### §3.7 动画与转场汇总

| # | 功能 | PentoVideo_old 章节 |
|---|------|-------------------|
| 35 | 所有动画适配器摘要 | §54 |
| 36 | 所有转场实现规则 | §55 |
| 37 | GSAP/WAAPI/CSS/Anime/Three/Lottie 6种适配器 | §29-§34 |

---

## §4 资源约束声明

**原则：只使用系统已安装的工具和 API，不新增任何外部依赖。**

| 资源 | 状态 | 用途 |
|------|------|------|
| Node.js v24 | ✅ 已安装 | 运行环境 |
| TypeScript | ✅ 已安装 | 所有 packages/ |
| bun | ✅ 已安装 | 包管理 |
| FFmpeg | ✅ 已安装 | 视频编码 |
| Chrome | ✅ 已安装 | Puppeteer 渲染 |
| Edge TTS | ✅ 免费无限 | 中文语音合成 |
| Kokoro TTS | ✅ npx 自带 | fallback TTS |
| Whisper | ✅ npx 自带 | 语音转录 |
| SenseNova API | ✅ 已配置 | 商汤生图 |
| Mistral API | ✅ 已配置 | OCR 语义检查 |
| Git | ✅ 已安装 | 版本控制 |

**禁止项**：GPT API、Claude API、其他新大模型 API、新的 npm 包（非 HyperFrames 已有依赖）

---

## §5 目标架构

```
skills/PentoVideo/
│
├── SKILL.md                          # ★ 主入口（§0门控+§1路由+完整工作流）
├── house-style.md / patterns.md / visual-styles.md / data-in-motion.md
│
├── references/                       # 15个设计方法论 + 14个转场文件
├── palettes/                         # 8个调色板
├── internal/                         # animation-map等4个内部脚本
│
├── cli.md                            # CLI命令速查
├── media.md                          # 媒体处理（TTS/transcribe/remove-bg）
│
├── animations/                       # 6个动画适配器（保留子目录结构）
│   ├── gsap/                         # SKILL.md + references/ + scripts/
│   ├── animejs/  three/  lottie/
│   └── waapi/  css-animations/
│
├── tools/                            # PentoVideo 特有工具
│   ├── sensenova-image-gen.md        # 商汤生图（11种尺寸+10类prompt）
│   ├── ocr-check.md                  # OCR质检（Tesseract+LLM双保险）
│   ├── edge-tts.md                   # Edge TTS集成
│   ├── build-timeline.md             # 时间轴系统
│   └── cover-generation.md           # 封面生成
│
├── styles/                           # 风格库（从 PentoVideo_old）
│   ├── match-guide.md                # 18套风格+26种布局匹配
│   └── templates.md                  # 模板速查
│
├── workflows/                        # 四条线完整流程
│   ├── line-a-pure-css.md            # 线A：10阶段
│   ├── line-b-image-gen.md           # 线B：11阶段
│   ├── line-c-ppt.md                 # 线C：9阶段
│   └── line-d-images.md              # 线D：8阶段
│
├── skills/                           # 独立子技能
│   ├── remotion-to-pentovideo/       # 70文件
│   ├── website-to-pentovideo/        # 8文件
│   ├── pentovideo-registry/          # 8文件
│   ├── contribute-catalog/           # 2文件
│   └── tailwind/                     # 1文件
│
├── templates/                        # SPM视频模板
│   └── SPM视频模板/                 # index.html + narrations.ts + generate-audio.py + pentovideos.json
│
├── packages/                         # ★ 引擎源码（全部重写，7个包）
│   ├── cli/                          # @pentovideo/cli
│   ├── core/                         # @pentovideo/core
│   ├── engine/                       # @pentovideo/engine
│   ├── player/                       # @pentovideo/player
│   ├── producer/                     # @pentovideo/producer
│   ├── shader-transitions/           # @pentovideo/shader
│   └── studio/                       # @pentovideo/studio
│
├── docs/  assets/  scripts/          # 不变
```

---

## §6 主 SKILL.md 内容结构

```
§0  前置门控（7项检查，硬规则）
§1  路由决策（线A/B/C/D分发）
§2  Step 1: Design System（硬门控）
§3  Step 2: Prompt Expansion
§4  Step 3: Plan（叙事弧→结构→节奏→时机→布局→动画）
§5  Layout Before Animation
§6  Data Attributes
§7  Composition Structure
§8  Variables
§9  Video & Audio
§10 Timeline Contract
§11 Scene Transitions（硬规则）
§12 Animation Guardrails
§13 Never Do 清单
§14 Typography & Assets
§15 字幕系统（转录+风格+位置+防溢出）
§16 口播指南
§17 转场目录（CSS + Shader + 能量匹配）
§18 视觉技巧（文字高亮+动态+Canvas+SVG）
§19 音频响应
§20 运动原则
§21 节拍方向
§22 Quality Checks
§23 CLI Commands
§24 环境依赖
§25 产出物规范
§26 常见问题
```

---

## §7 验收标准

### 功能完整性
- [ ] HyperFrames 全部 33 个功能模块 → PentoVideo 全部支持
- [ ] PentoVideo_old 全部 56 个模块 → PentoVideo 全部迁移
- [ ] 四条线（A/B/C/D）完整工作流文档化
- [ ] 商汤生图 + OCR 质检 + Edge TTS 配置完整
- [ ] 时间轴系统 + 封面生成完整

### 引擎层
- [ ] `npx pentovideo init/render/lint/preview/inspect` 可运行
- [ ] 渲染引擎 HTML→MP4 工作正常
- [ ] 播放器 Web Component 可嵌入使用
- [ ] WebGL 转场库 ≥12 种着色器
- [ ] Studio 可视化编辑器可拖拽

### 架构质量
- [ ] 主 SKILL.md 在根目录入口
- [ ] 核心内容（references/palettes/house-style）在根
- [ ] animations/ 子目录结构保留
- [ ] skills/ 保留复杂子技能
- [ ] 全项目无 `pentovideos` 字样
- [ ] 使用系统现有资源，无新增外部依赖

---

## §8 假设

```
ASSUMPTIONS:
1. TypeScript monorepo + bun 管理
2. CLI 命令对标 HyperFrames（init/render/preview/lint/validate/inspect/doctor/transcribe/tts）
3. 引擎 Puppeteer + FFmpeg 管道渲染
4. Studio 使用 React SPA + GSAP 时间轴
5. 技能文档手动编写，不依赖代码生成
6. 所有外部服务（SenseNova/Mistral）已配置完毕
7. 开发完成后不再需要人工介入，直接安装+制作讲解视频
→ 老板确认后进入 Phase 2（Planning — WBS 任务分解），后续全程自动化
```
