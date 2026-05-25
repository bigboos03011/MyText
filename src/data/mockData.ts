import type { GeneratedAsset, InsightMetric, WorkflowTemplate } from '@/types/comfyui'

const image = (prompt: string, imageSize: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'portrait-lab',
    name: '电影人像实验室',
    subtitle: '适合角色海报、封面视觉与高氛围出图',
    description:
      '将提示词、镜头语言和材质控制收敛到单页交互中，适合快速打磨高完成度人物图像。',
    tags: ['人像', '电影感', '高细节'],
    accent: 'from-cyan-400/70 via-sky-500/30 to-transparent',
    coverImage: image('cinematic portrait of an asian fashion model in a dark studio with teal rim light, luxury editorial photography, realistic skin details, dramatic shadows, premium ui showcase', 'landscape_16_9'),
    gallery: [
      image('asian actress portrait in graphite black studio, teal edge light, realistic skin, cinematic, premium editorial', 'portrait_4_3'),
      image('close-up cinematic beauty portrait with cool blue lighting, luxury fashion magazine, hyper detailed', 'portrait_4_3'),
      image('stylish portrait poster with moody cyan highlights and premium studio atmosphere, realistic', 'portrait_4_3'),
    ],
    nodeSummary: ['Checkpoint Loader', 'CLIP Text Encode', 'KSampler', 'VAE Decode'],
    qualityScore: '92 / 100',
    defaultForm: {
      prompt: '电影级人像，冷色边缘光，真实皮肤纹理，杂志封面构图',
      negativePrompt: '低清晰度，面部畸变，多余肢体，模糊背景噪点',
      model: 'Juggernaut XL',
      width: 832,
      height: 1216,
      steps: 32,
      cfg: 7.5,
      sampler: 'DPM++ 2M Karras',
      seed: 24018,
      batchSize: 2,
    },
  },
  {
    id: 'product-polish',
    name: '产品质感增强',
    subtitle: '适合电商主图、材质特写和商业静物布光',
    description:
      '强化材质、倒影和台面氛围，通过更清晰的参数组织帮助团队快速出电商素材。',
    tags: ['电商', '产品摄影', '商业图'],
    accent: 'from-amber-300/70 via-orange-500/30 to-transparent',
    coverImage: image('premium product photography of a matte black perfume bottle on a warm stone pedestal, amber rim light, elegant studio set, realistic, commercial ad', 'landscape_16_9'),
    gallery: [
      image('premium skincare bottle on travertine platform with warm amber shadows, commercial product photography', 'square_hd'),
      image('sleek wireless headphones on dark stone with orange glow, luxury commercial advertising, ultra realistic', 'landscape_4_3'),
      image('minimal watch product shot with bronze reflections and premium shadows, realistic product photo', 'landscape_4_3'),
    ],
    nodeSummary: ['Checkpoint Loader', 'ControlNet Apply', 'KSampler', 'Upscaler'],
    qualityScore: '88 / 100',
    defaultForm: {
      prompt: '极简商业静物，产品主体清晰，台面反射自然，品牌级布光',
      negativePrompt: '杂乱背景，文字水印，曝光过度，材质糊化',
      model: 'RealVisXL 4.0',
      width: 1216,
      height: 832,
      steps: 28,
      cfg: 6.5,
      sampler: 'Euler a',
      seed: 8102,
      batchSize: 1,
    },
  },
  {
    id: 'poster-forge',
    name: '霓虹海报工坊',
    subtitle: '适合封面 KV、活动海报与概念主视觉',
    description:
      '将版式感、光效和高对比配色作为默认风格，适合快速产出具有传播力的视觉海报。',
    tags: ['海报', 'KV', '霓虹风格'],
    accent: 'from-fuchsia-400/70 via-violet-500/30 to-transparent',
    coverImage: image('fashion campaign poster with neon magenta and cobalt lights, high contrast editorial layout, futuristic premium visual', 'landscape_16_9'),
    gallery: [
      image('neon campaign poster with cobalt and magenta lighting, dramatic model pose, high fashion visual', 'portrait_16_9'),
      image('futuristic event key visual with bold typography space and electric pink blue atmosphere, realistic poster art', 'portrait_16_9'),
      image('concept poster scene with glossy reflections and cyber editorial glow, premium art direction', 'portrait_16_9'),
    ],
    nodeSummary: ['Checkpoint Loader', 'IPAdapter', 'KSampler Advanced', 'Color Match'],
    qualityScore: '95 / 100',
    defaultForm: {
      prompt: '高对比霓虹海报，主视觉强烈，光影层次丰富，适合品牌发布会',
      negativePrompt: '构图拥挤，主体缺失，边缘锯齿，杂色过多',
      model: 'DreamShaper XL',
      width: 1024,
      height: 1536,
      steps: 36,
      cfg: 8,
      sampler: 'DPM++ SDE',
      seed: 55271,
      batchSize: 3,
    },
  },
]

export const insightMetrics: InsightMetric[] = [
  { id: 'workflow', label: '常用工作流', value: '12 个', helper: '覆盖人像、电商、海报与局部重绘' },
  { id: 'queue', label: '平均排队', value: '18 秒', helper: '支持实时状态同步与自动刷新' },
  { id: 'history', label: '可复用历史', value: '64 条', helper: '提示词、种子与模型参数都可回填' },
]

export const promptFragments = [
  '电影级光效',
  '高级材质反射',
  '偏冷色调',
  '超清细节',
  '留白构图',
  '柔和环境雾气',
]

export const qualityHighlights = [
  '节点映射表单化',
  '队列状态实时反馈',
  '历史参数一键复用',
  '暗色高质感工作台',
]

export const initialHistory: GeneratedAsset[] = [
  {
    id: 'asset-1',
    workflowId: 'portrait-lab',
    workflowName: '电影人像实验室',
    imageUrl: workflowTemplates[0].gallery[0],
    prompt: '电影级人像，冷色边缘光，真实皮肤纹理，杂志封面构图',
    createdAt: '10 分钟前',
    favorite: true,
    sampler: 'DPM++ 2M Karras',
    steps: 32,
    seed: 24018,
  },
  {
    id: 'asset-2',
    workflowId: 'product-polish',
    workflowName: '产品质感增强',
    imageUrl: workflowTemplates[1].gallery[1],
    prompt: '极简商业静物，产品主体清晰，台面反射自然，品牌级布光',
    createdAt: '32 分钟前',
    favorite: false,
    sampler: 'Euler a',
    steps: 28,
    seed: 8102,
  },
  {
    id: 'asset-3',
    workflowId: 'poster-forge',
    workflowName: '霓虹海报工坊',
    imageUrl: workflowTemplates[2].gallery[1],
    prompt: '高对比霓虹海报，主视觉强烈，光影层次丰富，适合品牌发布会',
    createdAt: '1 小时前',
    favorite: true,
    sampler: 'DPM++ SDE',
    steps: 36,
    seed: 55271,
  },
]
