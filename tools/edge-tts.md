# Edge TTS 集成 — 免费中文语音合成

优先 Edge TTS（免费无限），Kokoro 作为 fallback。用于所有四条线的配音环节。

## 语音选择流程

1. 问：男声/女声？
2. 提供候选（5种）→ 用户选
3. 中文优先 Edge TTS，其他语言 Kokoro

## Edge TTS

```bash
python3 scripts/tts_generate.py --text "口播稿" --voice zh-CN-YunyangNeural --output narration.mp3
python3 scripts/tts_generate.py --file script.txt --voice zh-CN-YunyangNeural
```

### 可靠中文男声
- `zh-CN-YunyangNeural` — 云扬（沉稳商务）
- `zh-CN-YunxiaNeural` — 云侠（年轻有力）

### 可靠中文女声
- `zh-CN-XiaoxiaoNeural` — 晓晓（标准女声）
- `zh-CN-XiaoyiNeural` — 晓伊（温柔）

### 关键规则
- **生成前验证 voice 名称**：`edge-tts --list-voices | grep zh-CN`
- **禁止依赖 voices.json 配置列表**（可能与实际不符）
- **生成后检查文件大小**：0字节 = voice 名称错误，需更换

## Kokoro（fallback）

```bash
npx pentovideo tts script.txt --voice zf_xiaobei --output narration.wav
```

54种声音。语言编码：a=美式英语 b=英式英语 e=西班牙语 f=法语 h=印地语 i=意大利语 j=日语 p=巴西葡语 z=普通话

速度：0.7-0.8教程 / 1.0自然 / 1.1-1.2快节奏

## 资源

- Edge TTS：免费无限，无配额限制
- Kokoro：npx pentovideo 自带
- 无额外费用
