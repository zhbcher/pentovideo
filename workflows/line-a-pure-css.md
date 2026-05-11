# 线A：需求 → HTML+CSS动画 → 视频（10阶段）

纯CSS实现，不生图。所有视觉通过 CSS 渐变、网格、动画、转场实现。

## 流程

```
阶段1：需求确认（§0门控已完成）
阶段2：内容研究 → 读目标技能文档 → 3-5关键点
阶段3：框架设计 → 分页大纲 → ★ 用户确认
阶段4：写口播稿 → voiceover.md
阶段5：TTS配音 → Edge TTS → narration.mp3 → ffprobe实测时长
阶段6：语音转字幕 → Whisper → transcript.json
阶段7：时间轴构建 → build_timeline.py
阶段8：写HTML → CSS渐变+网格+动画+转场+字幕 → lint → validate
阶段9：预览确认 → npx pentovideo preview → ★ 用户确认
阶段10：渲染+交付 → npx pentovideo render → .mp4
```

## 关键约束

- CSS背景：radial-gradient + 网格纹理，禁止纯色
- 单一 `<audio>` 标签
- 用 ffprobe 实测音频时长，禁止估算
- 结尾纯Logo/黑屏，无引导语（平台合规）
- 不出现下载链接/GitHub/安装命令（平台限流）

## 产出

```
PentoVideo/{YYYY-MM-DD}_{项目名}/
├── audio/narration.mp3 + transcript.json
├── scripts/voiceover.md + storyboard.md
├── index.html
├── renders/{项目名}.mp4
├── covers/cover-portrait.png + cover-landscape.png
└── state.json
```
