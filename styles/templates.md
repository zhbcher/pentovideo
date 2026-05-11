# 模板速查

PentoVideo 内置视频模板，可直接套用或参考。

## CSS 模板

| 模板 | 文件 | 场景 |
|------|------|------|
| CSS幻灯片 | `templates/slide-css.html` | 线A纯CSS视频 |
| 图片幻灯片 | `templates/slide-image.html` | 线B/C/D图片背景视频 |
| Web演示 | `templates/web-video.html` | 交互式点击演示 |

## SPM 视频模板

`templates/SPM视频模板/` — 横版1920x1080深色科技风：
- `index.html` — 完整HTML合成
- `narrations.ts` — 逐页配音配置
- `generate-audio.py` — Edge TTS批量配音
- `pentovideos.json` — 合成配置

## 使用方式

1. 复制模板目录到项目
2. 修改 `index.html` 中的内容和风格
3. 替换音频/图片资源
4. 调整 `data-start/data-duration` 时间轴
5. 运行 `npx pentovideo render`

## 脚本速查

| 脚本 | 命令 |
|------|------|
| 环境检查 | `python3 scripts/env_check.py` |
| 生图 | `python3 scripts/generate_image.py --prompt "..." --size 2752x1536` |
| 质检 | `python3 scripts/check_images.py --dir images/ --expected expected.json` |
| TTS | `python3 scripts/tts_generate.py --file script.txt --voice zh-CN-YunyangNeural` |
| PPT转换 | `python3 scripts/ppt_convert.py input.pptx --output images/` |
| OCR | `python3 scripts/ppt_ocr.py --dir images/ --output result.json` |
| 对齐 | `python3 scripts/ppt_align.py --script voiceover.md --ocr result.json` |
| 时间轴 | `python3 scripts/build_timeline.py --script voiceover.md --transcript transcript.json` |
| 封面 | `python3 scripts/cover_add_text.py --bg bg.png --title "标题" --output cover.png` |
