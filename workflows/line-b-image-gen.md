# 线B：需求 → 生图 → OCR质检 → HTML → 视频（11阶段）

需要商汤生图。比线A多生图+OCR质检环节。

## 流程

```
阶段1：需求确认（§0门控已完成，含图片风格偏好）
阶段2：内容研究 + 分页大纲 → 每页图片主题描述 → ★ 用户确认
阶段3：写口播稿 → voiceover.md
阶段4：生图 → 按每页主题 → prompt模板 → 商汤U1 Fast → images/
阶段5：OCR质检判断 → 见下方场景判断 → 按需执行/跳过
阶段6：TTS配音 → Edge TTS → narration.mp3 → ffprobe实测
阶段7：语音转字幕 → Whisper → transcript.json
阶段8：时间轴构建 → build_timeline.py
阶段9：写HTML → 图片背景+标题+字幕+转场+进度条 → lint → validate
阶段10：预览确认 → npx pentovideo preview → ★ 用户确认
阶段11：渲染+交付 → npx pentovideo render → .mp4
```

## 生图要点

- Prompt ≥50字，描述布局+配色+内容密度
- 11种尺寸可选，默认 2752x1536 (16:9)
- 10类 prompt 模板：海报/信息图/UI样机/插画/产品/头像/学术图/技术图/文字排版/电商

## OCR 质检（非强制）

**先判断再决定是否执行：**

```
图文密集（教程/架构/数据报告）→ Tesseract + LLM双保险
图片为主（绘本/故事/风景）   → 跳过OCR，只目检
不确定                       → 反问用户
```

- 图文密集时：最多重试 3 次
- 3次不过 → HTML 文字覆盖

## 资源

- 商汤生图：SenseNova API（已配置）
- OCR：Tesseract CLI + Mistral/SensenovaFlashLite
- 全部系统已有
