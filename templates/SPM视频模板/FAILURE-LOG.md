# PPT 讲解视频 — 失败日志 (2026-05-10)

> 记录 10:00-12:49 之间所有踩过的坑，以免下次再犯。

---

## ❌ 错误 1: 项目不干净 + 混用记忆

**时间**: 10:00-11:30
**症状**: 项目 `spm-pentovideos-video/` 是基于之前 `spm-hf-video/` 的旧代码改的，背景、结构、内容都是旧的
**根因**: 没有 `pentovideos init` 新项目，直接在旧项目上改
**代价**: 修了 3 次，音频路径、scene 结构、duration 全修过
**教训**: 每次重新 init，不要想着"复用"省事

---

## ❌ 错误 2: 多 audio 标签

**时间**: 11:00-11:30
**症状**: `index.html` 里有 9 个 `<audio class="clip">`，各有独立的 data-start / data-duration
**后果**: 渲染器 `audioCount: 0`，最终视频无声
**原因**: 不知道 HyperFrames 只认单一 `id="narration"` 的 audio 标签
**教训**: 永远用一个 audio 标签 + `data-track-index="0"`

---

## ❌ 错误 3: 用 `.scene` 代替 `.slide`

**时间**: 11:00
**症状**: 容器、样式、动画全部基于 `.scene` 类
**后果**: 渲染器不识别，画面全黑（成功项目用的是 `.slide`）
**原因**: 没参考过成功案例的结构
**教训**: 页面容器用 `.slide` + `visibility:hidden`，不是自定义类名

---

## ❌ 错误 4: 纯色背景

**时间**: 11:00
**症状**: `background: #0a0a0a`
**后果**: 视频输出全黑
**根因**: HyperFrames 渲染器在纯色背景场景下，可能认为"无变化"而跳过捕获
**教训**: 必须加 `radial-gradient` + 网格纹理（`repeating-linear-gradient`）

---

## ❌ 错误 5: 违背用户需求做内容

**时间**: 11:00-11:30
**症状**: 做了 9 页纯文本排版场景，没有 PPT 图片内容
**后果**: 用户说"缺少PPT内容"，全部重做
**根因**: 没问清楚需求，按自己的理解先做了
**教训**: PPT 讲解视频的核心 = 用 PPT 图片或 PPT 风格页面 + 口播

---

## ❌ 错误 6: 重复踩坑 + 不主动 call out

**时间**: 多次
**症状**: 连续渲染 3-4 次都是全黑或无声，每次只改一两个参数就 rerun
**后果**: 浪费时间
**根因**: 没有系统性地对比成功案例和自己代码的差异
**教训**: 遇到渲染问题，先对比已知可工作的项目，逐行 diff

---

## ❌ 错误 7: 渲染前不 check

**时间**: 第一次渲染前
**症状**: 直接 `npm run render`，没跑 `npm run check`
后果: 渲染到一半才发现 CDN 失败 / 结构问题
**教训**: 先 `npm run check`，0 error 再 render

---

## ❌ 错误 8: 口播时长靠估算

**时间**: 12:00
**症状**: 写口播稿时每段按 5-6秒估算，总共估了 105s
**后果**: 实际 TTS 生成后 169s，差了 64 秒，所有 slide timing 全部重算
**根因**: 中文口语速率 ~3-4 字/秒，不是 4-5 字/秒
**教训**: 生成音频后必须用 `ffprobe` 实测每段精准时长再写入 HTML

---

## ❌ 错误 9: 背景只有一层

**时间**: 11:00
**症状**: 只用一个 `background: radial-gradient(...)`
**后果**: 虽然比纯色强，但还是不够丰富
**教训**: 至少 3 层：渐变底色 + 网格纹理 + glow 光晕

---

## ❌ 错误 10: 忘记 `.progress-bar`

**时间**: 11:00
**症状**: 完全没有 progress bar 元素
**后果**: 渲染器可能缺少一个识别标签
**原因**: 不知道它是必需元素
**教训**: 无论是否需要显示，HTML 中必须有 `.progress-bar`

---

## ❌ 错误 11: 结尾有违规引导

**时间**: 11:00
**症状**: 最后一个 scene 里写"评论区扣1"
**后果**: 抖音违规
**教训**: 纯 Logo 或黑屏，不加任何引导、互动文字

---

## ❌ 错误 12: 设置 data-duration 时复制粘贴错误

**时间**: 12:00
**症状**: 写 `data-duration="105"` 时用了上个项目的 `data-duration` 格式
**后果**: 更新时多次漏改，audio 和 root 的 duration 设了两次
**根因**: 批量改参数时遗漏

---

## ✅ 最终正确的做法（总结）

一个像素、一个属性都不要多、不要少：

```
root  → data-duration=实测音频总长, data-width=1080, data-height=1920
audio → id="narration", src="narration.mp3", data-track-index="0", data-duration=实测
背景  → 至少3层: gradient + grid + glow
进度  → .progress-bar 必须有
容器  → .slide + visibility:hidden
动画  → 统一 GSAP timeline
时长  → ffprobe 实测入 HTML
结尾  → Logo/黑屏，无违规
流程  → init → design → narrate → audio → html → check → render → verify
```
