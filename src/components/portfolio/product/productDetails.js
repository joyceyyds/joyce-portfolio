export const PRODUCT_DETAILS = {
    '01': {
        heading: '01｜PPT VIDEO AGENT',
        subtitle: 'AI 视频生成工作流',
        meta: 'POLLO.AI · PRODUCT DESIGN',
        intro: '将长文本旁白转化为完整 AI 视频的自动化生成工作流。',
        background: '整合文本理解、视觉生成与动态生成能力，搭建从旁白输入到视频成片的完整 AI 生成链路。',
        responsibilities: [
            ['生成链路设计', '梳理各环节输入、输出与模型调用关系。'],
            ['Prompt 设计', '设计内容拆分、画面生成与转场 Prompt。'],
            ['效果优化', '通过生成测试优化画面连续性与镜头衔接。'],
        ],
        workflows: [
            {title: '理解内容', flow: '旁白 → TTS → 内容拆分'},
            {title: '生成画面', flow: '视觉 Prompt → 图片生成'},
            {title: '生成视频', flow: '动态 / 转场 Prompt → 视频生成 → 拼接 · BGM · 字幕 → 成片'},
        ],
        outputs: [
            {text: '完成 AI 视频生成方案，沉淀 ', emphasis: 'Workflow、Prompt 模板与需求文档', suffix: '。'},
        ],
    },
    '02': {
        heading: '02｜王者荣耀 · 灵宝日记',
        subtitle: 'AI 内容策划与质量评估',
        meta: 'TENCENT · AI PRODUCT',
        intro: '参与 AIGC 图像质量评估、Bad Case 分析，并参与「农场日记」内容策划与 AI 生图。',
        background: '围绕游戏内 AIGC 图像生成，建立质量评估与问题反馈机制，持续发现并反馈生成问题。',
        responsibilities: [
            ['质量评估', '审核与标注 AI 生成图像，识别生成异常。'],
            ['Bad Case 分析', '整理典型问题，通过 Prompt 实验辅助问题定位。'],
            ['内容策划', '完成农场事件创意、画面策划与 AI 生图。'],
        ],
        workflows: [
            {title: '生成质量评估', flow: 'AI 生图 → 质量评估 → Bad Case → 问题归因 → Prompt 实验 → 模型反馈'},
            {title: '农场日记策划', flow: '事件需求 → 创意发散 → 画面策划 → AI 生图 → 筛选反馈'},
        ],
        outputs: [
            {parts: ['沉淀 ', {emphasis: '20+ 项核心优化需求'}, '，反馈生成问题并协同推进效果优化；', {emphasis: '部分参与策划的农场日记画面最终出现在实际玩家内容中'}, '。']},
        ],
    },
};
