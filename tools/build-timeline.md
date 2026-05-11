# 时间轴系统 — Build Timeline

将口播稿和转录结果结合，生成每页精确时间轴，驱动 GSAP 时间线。

## 命令

```bash
python3 scripts/build_timeline.py \
  --script project/scripts/voiceover.md \
  --transcript project/audio/transcript.json \
  --output project/state.json
```

## 三层联动

### 第1层：页级时间轴
从 transcript.json 中找每页口播的首词和尾词时间 → `page_timeline`：
```json
[
  {"page": 1, "start": 0.0, "end": 5.2},
  {"page": 2, "start": 5.2, "end": 12.8}
]
```

### 第2层：词级时间轴
transcript.json → 逐词 start/end：
```json
[
  {"id": "w0", "text": "Hello", "start": 0.0, "end": 0.5},
  {"id": "w1", "text": "world", "start": 0.6, "end": 1.2}
]
```

### 第3层：GSAP 驱动
page_timeline + transcript → 生成 GSAP 关键帧时间点

## 页间过渡

重叠 0.5s：
- 第N页视觉持续到 `page_timeline[N].end`
- 第N+1页在 `page_timeline[N+1].start - 0.5` 开始过渡
- 过渡类名：fade/slide/zoom/flip

## 使用场景

所有四条线（A/B/C/D）都需要时间轴系统。在 TTS 配音 + Whisper 转录之后调用。

## 资源

- Python 3 脚本
- 依赖：json（标准库）
- 无额外依赖
