# OCR 质检 — 生图文字准确性检查

用于线B流程，对商汤生图产出的图片进行文字准确性质检。双保险机制：Tesseract（结构层）+ LLM（语义层）。

## 场景判断

```
图文密集（教程/架构/数据报告）→ Tesseract + LLM 双保险
图片为主（绘本/故事/风景）   → 跳过OCR，只目检
不确定                       → 反问用户
```

## Tesseract 精确对比（结构层）

```bash
python3 scripts/check_images.py --dir project/images/ --expected project/scripts/expected_text.json
```

逐字对比 → 编辑距离 → 标出错字/漏字/多字。

## LLM 语义判断（语义层）

使用 Mistral / SensenovaFlashLite（系统已有）：
- OCR 结果语义正确性检查
- 表达式准确度评估
- 输出通过/不通过 + 理由

## 双保险互补

| 层 | 工具 | 检查 | 盲区 |
|----|------|------|------|
| 结构层 | Tesseract | 错别字、漏字、文字位置 | 语义对错 |
| 语义层 | LLM | 意思对不对、表达是否准确 | 精确拼写 |

## 重做策略

最多 3 次。调整 prompt 方向：
- 错别字 → prompt 加 "逐字校对，确保所有文字清晰可读"
- 模糊/小字 → 增大文字占比，简化背景
- 对比度低 → 深色背景 + 浅色文字
- 布局乱 → 明确指定文字位置

**3 次仍不过 → HTML 文字覆盖**（在视频中用 HTML 叠加正确文字覆盖图片）

## 资源

- Tesseract：系统 CLI 工具
- LLM：Mistral/SensenovaFlashLite（已配置）
- 无额外费用
