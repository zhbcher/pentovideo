# PentoVideo 优化方案

> 基于 2026-05-13 NVIDIA视频制作实战发现的问题
> 
> 核心矛盾：**技能文档很全面，但实战中我们绕过了它。**

---

## 问题 1：§0 门控太僵化，挡住了"明确需求"

**现象**：今天老板直接给了口播稿、6张图片、风格（劲爆），所有信息齐全。按 §0 门控应该直接走线D，但我们没有用 PentoVideo，而是直接手写 HyperFrames HTML。

**根因**：§0 要求 7 项检查，3 项必填。当用户**已提供完整信息**时，反问 "给谁看？用哪条线？" 显得多余且拖慢节奏。

**建议**：

```diff
- §0 硬性规则：缺任何必填项，禁止进入后续步骤
+ §0 快速通道：如果口播稿+图片/PPT+风格 三者齐全，直接进入 §1 路由，跳过反问
+ §0 门控仅在信息不足（≤1项明确）时激活反问流程
```

---

## 问题 2：口播稿驱动的"快速模式"缺失

**现象**：今天的流程是：口播稿 + 6张图片 + 生图 → 直接写 HTML。线D 的 8 阶段流程（OCR→分配→配音→字幕→时间轴→HTML→预览→渲染）全被跳过。我们实际走的是：

```
口播稿 → Edge TTS → 音频时长 -> 按语音节奏分场景 → 写HTML → 渲染
```

**根因**：线D 假设"图片需要通过OCR提取文字"，但多数场景下用户**直接给口播稿**，不需要 OCR。

**建议**：新增 **线D-Fast**（图片+口播稿快速模式，4阶段）：

```
阶段1：Edge TTS 配音 → narration.mp3 (检查音频时长)
阶段2：按口播自然段落 → 图片分配 (一句一段，图片循环)
阶段3：生图（可选）→ 写HTML → lint → validate
阶段4：渲染+压缩+交付
```

---

## 问题 3：TTS 工具不统一

**现象**：PentoVideo 有 `tools/edge-tts.md`，但我们实际用的是独立安装的 `edge_tts` Python 包。HyperFrames 自带的 Kokoro TTS 对中文支持差。

**建议**：在 SKILL.md 的 TTS 部分明确：
- 英文 → Kokoro (`npx hyperframes tts`)
- 中文 → Edge TTS (`edge_tts` Python 包，命令模板固化)

```
# 中文 TTS 标准命令（固化到 tools/edge-tts.md）
python3 -c "
import asyncio, edge_tts
async def main():
    c = edge_tts.Communicate(open('script.txt').read(), 'zh-CN-YunyangNeural', rate='+15%')
    await c.save('narration.mp3')
asyncio.run(main())
"
```

---

## 问题 4：图片与场景节奏不匹配

**现象**：我们 6 张截图 + 3 张生图，口播稿 8 个自然段，每段配一个场景。但线D 的分配逻辑是"均分"，不考虑口播的自然停顿。

**建议**：口播稿按自然段落拆分场景，每段口播时长 = 场景时长，图片不够循环使用或生图补充。

---

## 问题 5：文档太过庞大

**现象**：PentoVideo SKILL.md 540 行，20+ 子文件，9 个调色板，4 条工作流线，6 个动画适配器，30+ 个 CSS 转场。Agent 读完这些再开始干活，已经烧了大量 context。

**建议**：在 SKILL.md 开头增加 **Quick Jump** 锚点：

```markdown
## 🚀 Quick Jump

| 你的情况 | 直接跳转 |
|---------|---------|
| 有口播稿+图片，做视频 | → [线D-Fast](#线d-fast快速模式) |
| 有PPT，做讲解视频 | → [线C](workflows/line-c-ppt.md) |
| 有主题，需要生图 | → [线B](workflows/line-b-image-gen.md) |
| 只有纯文本主题 | → [线A](workflows/line-a-pure-css.md) |
| 已经有完整 design.md | → 跳过§2，直接 §3 |
| 只要配音 | → [Edge TTS](tools/edge-tts.md) |
| 只要生图 | → [商汤生图](tools/sensenova-image-gen.md) |
```

---

## 问题 6：渲染后缺少压缩步骤

**现象**：NVIDIA 视频 30MB，老板要求压缩。FFmpeg 压缩是标准流程但未内置到技能中。

**建议**：在渲染步骤后增加可选的压缩命令：

```bash
# 压缩到 ~5MB（720p, 2Mbps）
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -b:v 2M -c:a aac -b:a 128k output-compressed.mp4
```

---

## 优先级排序

| 优先级 | 改动 | 工作量 |
|--------|------|--------|
| **P0** | 新增 Quick Jump 锚点 | 5 分钟 |
| **P0** | 新增线D-Fast（口播+图片快速模式） | 20 分钟 |
| **P0** | §0 门控增加快速通道 | 5 分钟 |
| **P1** | TTS 命令模板固化 | 5 分钟 |
| **P1** | 渲染后压缩命令 | 1 行 |
| **P2** | Edge TTS 中文语音偏好预设 | 配置项 |

---

## 不需要改的（意外之喜）

| 保留项 | 原因 |
|--------|------|
| 9 调色板系统 | 虽然今天没用到，但风格选择有实际价值 |
| CSS 转场系统 | 视频效果确实好 |
| GSAP 动画模式 | "劲爆"风格的核心保障 |
| 渲染管线 | 工作完美 |
