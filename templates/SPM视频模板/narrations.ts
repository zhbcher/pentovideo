/*
 * SPM 视频口播稿
 * 每段对应一个 slide，时长精确到秒
 * 朗读速度参考：中文约 4-5 字/秒
 */

export interface Narration {
  text: string;
  duration: number; // seconds
}

export const narrations: Record<number, Narration> = {
  1: {
    // 5s, ~20-25 chars
    text: "AI 写代码总翻车？今天给你介绍 SPM。给 AI 装一个项目经理，让它按规矩干活。",
    duration: 5,
  },
  2: {
    // 8s, ~36-40 chars
    text: "你是不是也受够了？说加个搜索，它给你整出一套搜索引擎。中断三天回来，AI 全忘了刚才说到哪。一跑测试全红，它还说写完了。",
    duration: 8,
  },
  3: {
    // 7s, ~30-34 chars
    text: "为什么总翻车？三个原因：没有需求确认，AI 就过度设计；没有任务追踪，上下文说丢就丢；没有质量检验，交付全靠蒙。",
    duration: 7,
  },
  4: {
    // 7s, ~30-34 chars
    text: "解决问题的钥匙，就是给 AI 装一个项目经理。SPM——需求澄清、WBS 追踪、TDD 执行、质量门控，一套流程管到底。",
    duration: 7,
  },
  5: {
    // 8s, ~36-40 chars
    text: "SPM 有六个核心环节：需求澄清、WBS 计划、TDD 执行、并行调度、质量门控、交付摘要。从需求输入到最终交付，全程可控。",
    duration: 8,
  },
  6: {
    // 8s, ~36-40 chars
    text: "第一步，需求澄清。不确认需求，一行代码都不写。三个必答问题：搜什么？数据量多大？实时还是缓存？问清楚再动手。",
    duration: 8,
  },
  7: {
    // 7s, ~30-34 chars
    text: "第二步，WBS 计划。活还没干，清单先列好。每个任务精确到文件路径和验证命令。中断三天回来，直接说继续第 4 条，不用重复解释。",
    duration: 7,
  },
  8: {
    // 7s, ~30-34 chars
    text: "第三步，SPM 最硬的规矩：没写测试，不准写代码。先写测试，看到全红；再写功能，跑到全绿。没亲眼看到失败，不算测试通过。",
    duration: 7,
  },
  9: {
    // 7s, ~30-34 chars
    text: "第四步，并行调度。独立任务不排队，前端、后端、测试同时开工。谁先完谁交，WBS 台账自动打勾。",
    duration: 7,
  },
  10: {
    // 8s, ~36-40 chars
    text: "第五步，质量门控。三道门，全过才放行。查有没有偏离需求，查代码质量和安全性，查全量集成测试。三关过了才合并。",
    duration: 8,
  },
  11: {
    // 7s, ~30-34 chars
    text: "最后一步，交付摘要。完成了什么、测试通过率多少、还剩什么风险，一张卡片清清楚楚。领导问进度，直接转发。",
    duration: 7,
  },
  12: {
    // 8s, ~36-40 chars
    text: "WBS 任务台账是 SPM 的单一事实来源。每一条任务都有退出标准，每一条都有执行证据。不是 AI 说完成就算完成，必须有证据。",
    duration: 8,
  },
  13: {
    // 7s, ~30-34 chars
    text: "和 gstack 比，SPM 走的是轻量路线。gstack 给你 23 个角色、一家虚拟公司；SPM 只给你一个项目经理，聚焦编码交付。",
    duration: 7,
  },
  14: {
    // 6s, ~25-30 chars
    text: "轻、硬、通。轻——一套流程就够了。硬——TDD 加质量门控，代码真有保障。通——OpenClaw 无缝集成，即插即用。",
    duration: 6,
  },
  15: {
    // 5s, ~20-25 chars
    text: "不再裸用 AI。给它流程、给它规矩、给它一个项目经理。",
    duration: 5,
  },
};

export const totalDuration = Object.values(narrations).reduce((sum, n) => sum + n.duration, 0);
