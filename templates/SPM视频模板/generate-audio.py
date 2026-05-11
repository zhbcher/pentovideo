#!/usr/bin/env python3
"""Generate narration.mp3 from narrations using Edge TTS."""
import edge_tts
import asyncio
import json
import subprocess
import os

# 15 narration segments
narrations = {
    1:  "AI 写代码总翻车？今天给你介绍 SPM。给 AI 装一个项目经理，让它按规矩干活。",
    2:  "你是不是也受够了？说加个搜索，它给你整出一套搜索引擎。中断三天回来，AI 全忘了刚才说到哪。一跑测试全红，它还说写完了。",
    3:  "为什么总翻车？三个原因：没有需求确认，AI 就过度设计；没有任务追踪，上下文说丢就丢；没有质量检验，交付全靠蒙。",
    4:  "解决问题的钥匙，就是给 AI 装一个项目经理。SPM——需求澄清、WBS 追踪、TDD 执行、质量门控，一套流程管到底。",
    5:  "SPM 有六个核心环节：需求澄清、WBS 计划、TDD 执行、并行调度、质量门控、交付摘要。从需求输入到最终交付，全程可控。",
    6:  "第一步，需求澄清。不确认需求，一行代码都不写。三个必答问题：搜什么？数据量多大？实时还是缓存？问清楚再动手。",
    7:  "第二步，WBS 计划。活还没干，清单先列好。每个任务精确到文件路径和验证命令。中断三天回来，直接说继续第 4 条，不用重复解释。",
    8:  "第三步，SPM 最硬的规矩：没写测试，不准写代码。先写测试，看到全红；再写功能，跑到全绿。没亲眼看到失败，不算测试通过。",
    9:  "第四步，并行调度。独立任务不排队，前端、后端、测试同时开工。谁先完谁交，WBS 台账自动打勾。",
    10: "第五步，质量门控。三道门，全过才放行。查有没有偏离需求，查代码质量和安全性，查全量集成测试。三关过了才合并。",
    11: "最后一步，交付摘要。完成了什么、测试通过率多少、还剩什么风险，一张卡片清清楚楚。领导问进度，直接转发。",
    12: "WBS 任务台账是 SPM 的单一事实来源。每一条任务都有退出标准，每一条都有执行证据。不是 AI 说完成就算完成，必须有证据。",
    13: "和 gstack 比，SPM 走的是轻量路线。gstack 给你 23 个角色、一家虚拟公司；SPM 只给你一个项目经理，聚焦编码交付。",
    14: "轻、硬、通。轻——一套流程就够了。硬——TDD 加质量门控，代码真有保障。通——OpenClaw 无缝集成，即插即用。",
    15: "不再裸用 AI。给它流程、给它规矩、给它一个项目经理。",
}

VOICE = "zh-CN-YunyangNeural"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(PROJECT_DIR, "temp_audio")

async def generate_all():
    os.makedirs(TEMP_DIR, exist_ok=True)
    mp3_files = []

    for idx in sorted(narrations.keys()):
        text = narrations[idx]
        out_file = os.path.join(TEMP_DIR, f"seg_{idx:02d}.mp3")
        print(f"[{idx}/15] Generating segment {idx}...")
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(out_file)
        mp3_files.append(out_file)

    # Concatenate all segments into one narration.mp3
    concat_file = os.path.join(PROJECT_DIR, "narration.mp3")
    
    # Use FFmpeg concat for reliable joining
    file_list = os.path.join(TEMP_DIR, "files.txt")
    with open(file_list, "w") as f:
        for m in mp3_files:
            f.write(f"file '{m}'\n")

    print("Merging segments into narration.mp3...")
    result = subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
         "-i", file_list,
         "-c", "copy",
         concat_file],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print("FFmpeg error:", result.stderr)
        return

    # Get final duration
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", concat_file],
        capture_output=True, text=True
    )
    duration = result.stdout.strip()
    print(f"\n✅ narration.mp3 generated ({concat_file})")
    print(f"   Duration: {duration}s")
    print(f"   Size: {os.path.getsize(concat_file)} bytes")

    # Cleanup temp
    import shutil
    shutil.rmtree(TEMP_DIR)

if __name__ == "__main__":
    asyncio.run(generate_all())
