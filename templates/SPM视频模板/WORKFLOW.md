---
name: SPM-HyperFrames-PPT-Video
description: 用 HyperFrames 制作 PPT 讲解视频的标准化流程
---

# PPT 讲解视频 — 标准化工作流

> 按这个流程，以后每次都能稳定出片。

> ⚠️ 先读 [[FAILURE-LOG.md]] —— 里面记录了 12 个踩过的坑，每个都标了根因和代价。

---

## Step 1: 新项目初始化

```bash
cd workspace/帧工/
mkdir -p <项目名> && cd <项目名>
npx pentovideos init
```

**项目命名规则**: `{日期}_{内容}`，如 `2026-05-10_OpenMAIC介绍`

**⚠️ 铁规**: 所有帧工项目必须放在 `workspace/帧工/` 下，禁止在 workspace 根目录创建

调整 `package.json` 的 `name` 字段。

## Step 2: 设计方案

写 `ppt-design.md`，确定：
- 总页数（通常 12-18 页）
- 每页核心要点（一句话说清）
- 视觉风格（颜色、字体、动画类型）
- 结尾：只放 Logo，无引导语

## Step 3: 写口播稿

写 `narrations.ts`，格式：

```typescript
export const narrations: Record<number, Narration> = {
  1: { text: "口播文本...", duration: 8 },
  2: { text: "...", duration: 12 },
  // ...
};
```

**原则**：口播文字是唯一真相源，页面内容围绕口播设计。

## Step 4: 生成音频

写 `generate-audio.py`：

```python
import edge_tts, asyncio, subprocess, os

narrations = { 1: "...", 2: "...", ... }

async def gen():
    for idx, text in narrations.items():
        communicate = edge_tts.Communicate(text, "zh-CN-YunyangNeural")
        await communicate.save(f"temp/seg_{idx:02d}.mp3")
    # concat with ffmpeg into narration.mp3
    # measure per-segment duration with ffprobe
```

**关键**：生成 15 段独立 MP3 → 用 `ffmpeg concat` 合并 → 用 `ffprobe` 测量每段精准时长。

## Step 5: 更新 HTML 时间轴

在 `index.html` 中完成：

### 5.1 根元素
```html
<div id="root" data-composition-id="main" data-start="0"
     data-duration="<total_seconds>" data-width="1080" data-height="1920">
```

### 5.2 音频标签（单一！一个就够）
```html
<audio id="narration" src="narration.mp3"
       data-start="0" data-duration="<total_seconds>" data-track-index="0"></audio>
```

### 5.3 背景层
```html
<div class="bg-layer" style="background:radial-gradient(...)"></div>
<div class="grid-layer"></div>
<div class="glow"></div>
```

### 5.4 进度条（即使隐藏也必须有）
```html
<div class="progress-bar" id="progress" style="width:0%"></div>
```

### 5.5 Slide 结构
```html
<div id="s1" class="slide">
  <div class="slide-title">...</div>
  <div class="slide-sub">...</div>
</div>
<!-- s2..s15... -->
```

### 5.6 时间轴（精确到实际音频时长）
```javascript
const timings = [
  { start: 0, dur: 8.4 },     // S1（实测值）
  { start: 8.4, dur: 12.0 },  // S2
  // ...
];
```

## Step 6: 检查与渲染

```bash
npm run check   # 0 errors 才继续
npm run render
```

## Step 7: 验证

```bash
ffprobe -v error -show_entries stream=codec_type -of json renders/*.mp4
# 必须同时看到 h264 + aac
```

---

## ⚠️ 红线（别再犯的错）

| 错误 | 后果 | 正确做法 |
|------|------|---------|
| 多个 `<audio>` 标签 | 渲染器 ignore，无声 | 单一 `id="narration"` + `data-track-index="0"` |
| 纯色背景 | 画面可能全黑 | 加 `radial-gradient` + 网格纹理 |
| 用估计时长 | 口播被截断或画面提前结束 | 生成音频后 `ffprobe` 实测 |
| 结尾引导语 | 抖音违规 | 纯 Logo 或黑屏 |
| GitHub/下载链接 | 抖音限流 | 只说项目名，不提下载地址 |
| 用的项目 | 新旧混淆，找不到文件 | 每做一个新的，`pentovideos init` |

---

## 🎯 一句话心法

> 单一音频 + 渐变背景 + ffprobe 实测时长 + slide 显隐 + 进度条。
