# 线D-Fast：图片+口播稿快速模式（4阶段）

> 触发条件：用户已提供口播稿/脚本 + 图片/截图 + 风格偏好
> 跳过OCR识图和口播分配，直接配音→配图→HTML→渲染

---

## 阶段1：TTS 配音

**中文** → Edge TTS（推荐 `zh-CN-YunyangNeural`，语速 +15%）：

```bash
python3 -c "
import asyncio, edge_tts
text = open('script.txt').read()
async def main():
    c = edge_tts.Communicate(text, 'zh-CN-YunyangNeural', rate='+15%')
    await c.save('narration.mp3')
asyncio.run(main())
"
```

**英文** → Kokoro（`npx hyperframes tts`）。

**关键**：检查音频时长 → `ffprobe narration.mp3` → 音频时长 = 视频总时长。

---

## 阶段2：场景拆分 & 图片分配

按口播稿的**自然段落**拆分场景（不是均分，是跟语气走）：

```
口播稿 → 按标点+语义拆为N个自然段
每段时长 = 音频该段时长（不回拖）
图片不够 → 循环使用 / 生图补充
每段 = 一个场景（对应一个 clip）
```

**示例**（8段口播 + 6张图）：
| 场景 | 口播段 | 图片 | 时长 |
|------|--------|------|------|
| S0 | "英伟达踹开金库门！" | gen-vault.png | ~4s |
| S1 | "免费API整整一百年" | gen-100years.png | ~4s |
| S2 | "四种顶级API全免费" | 4张卡片布局 | ~6s |
| ... | ... | ... | ... |
| S7 | "上车通道" | CTA | ~2s |

**律动建议**（劲爆/快节奏风格）：
- 开场 2 秒内入画（`gsap.from` + `back.out`）
- 场景切换 ≤ 0.3s（`opacity` + `visibility: hidden` hard kill）
- 按钮/标签 `stagger: 0.2` 逐出
- 结尾弹性收尾（`elastic.out`）

---

## 阶段3：写HTML & 质量检查

### 3a. 写 HyperFrames HTML

模板：
```html
<div id="root" data-composition-id="main" data-start="0" data-duration="TOTAL_DURATION" data-width="1920" data-height="1080">
  <audio data-track-index="0" data-start="0" src="narration.mp3"></audio>
  
  <div id="s0" class="clip" data-start="0" data-duration="4" data-track-index="1">
    <!-- 场景内容 -->
  </div>
  <!-- ...更多场景... -->
</div>
```

**关键规则**：
- 每个 clip 必须带 `visibility: hidden` hard kill（`tl.set("#sN", {visibility:"hidden"}, endTime)`）
- 图片路径 `assets/xxx.png`（放在 `assets/` 目录）
- 字体用系统内置（`'Arial Black', 'Impact', 'PingFang SC'`）

### 3b. Lint & Validate

```bash
npx hyperframes lint
```

---

## 阶段4：渲染 & 压缩

```bash
# 渲染
npx hyperframes render --output video.mp4

# 压缩（720p, 2Mbps，约 5-8MB）
ffmpeg -i video.mp4 -vf scale=1280:720 -c:v libx264 -b:v 2M -c:a aac -b:a 128k video-compressed.mp4
```

---

## 与线D的区别

| | 线D（标准） | 线D-Fast（快速） |
|---|----------|----------|
| OCR识图 | ✅ 需要 | ❌ 跳过（图片已知） |
| 口播稿 | ❌ 需AI生成 | ✅ 用户提供 |
| 语义对齐 | ❌ 不需要 | ❌ 按自然段 |
| 阶段数 | 8 | 4 |
| 适用场景 | 只有图片，没口播 | 口播+图片齐全 |
