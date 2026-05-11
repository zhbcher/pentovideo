# SPM 讲解视频模板

> 画面 + 音频都已验证通过，可直接渲染或 fork 改内容。

## 文件结构

```
spm-video-template/
├── index.html              # 15 页 PPT（HTML+CSS+GSAP）
├── narration.mp3           # 15 段合并后的语音（169s, YunyangNeural）
├── narrations.ts           # 每页口播稿源码
├── generate-audio.py       # Edge TTS 生成脚本
├── package.json            # HyperFrames 项目配置
├── pentovideos.json
├── meta.json
├── WORKFLOW.md             # 7 步标准化流程
├── FAILURE-LOG.md          # 今天踩过的 12 个坑
└── README.md
```

## 直接渲染

```bash
cd spm-video-template
npm run check     # 验证
npm run render    # 出片
```

输出在 `renders/` 目录下。

## 改成别的内容

1. 改 `narrations.ts` → 口播文本
2. 跑 `python3 generate-audio.py` → 重新生成 + 实测时长
3. 更新 `index.html` 里的 15 个 `.slide` 内容和 `timings` 数组
4. 改页面背景色、主色（CSS 变量）
5. `npm run check && npm run render`

## 规格

- 分辨率: 1080×1920（抖音竖屏）
- 时长: 169 秒
- 音频: Edge TTS zh-CN-YunyangNeural
- 页数: 15 页
- 结尾: 纯 Logo，无引导语
