# 封面生成

为视频项目生成竖版和横版封面图，用于抖音/B站/视频号等平台。

## 命令

```bash
python3 scripts/cover_add_text.py \
  --bg background.png \
  --title "标题文本" \
  --subtitle "副标题文本" \
  --output cover.png \
  --mode portrait
```

## 模式

| 模式 | 尺寸 | 用途 |
|------|------|------|
| `portrait` | 1080x1920 | 抖音/快手/视频号竖版封面 |
| `landscape` | 1920x1080 | B站/YouTube横版封面 |

## 实现

使用 Pillow (PIL)：
- 背景图叠加
- 文字渲染（支持中文）
- 渐变遮罩（底部/顶部渐变黑）
- 可选 Logo 叠加

## 使用场景

所有四条线（A/B/C/D）完成后，自动生成封面到 `project/covers/`。

## 产出

```
project/covers/
├── cover-portrait.png    # 竖版封面
└── cover-landscape.png   # 横版封面
```

## 资源

- Python 3 + Pillow
- 系统已有
- 无额外费用
