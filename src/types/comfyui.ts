export type ThemeMode = 'dark' | 'light'
export type TaskStatus = 'queued' | 'running' | 'success' | 'error'

export type GenerationForm = {
  prompt: string
  negativePrompt: string
  model: string
  width: number
  height: number
  steps: number
  cfg: number
  sampler: string
  seed: number | null
  batchSize: number
}

export type WorkflowTemplate = {
  id: string
  name: string
  subtitle: string
  description: string
  tags: string[]
  accent: string
  coverImage: string
  gallery: string[]
  nodeSummary: string[]
  qualityScore: string
  defaultForm: GenerationForm
  apiPromptTemplate?: Record<string, unknown>
  fieldMappings?: Array<{
    field: keyof GenerationForm | 'prompt' | 'negativePrompt'
    nodeId: string
    inputKey: string
  }>
}

export type GeneratedAsset = {
  id: string
  workflowId: string
  workflowName: string
  imageUrl: string
  prompt: string
  createdAt: string
  favorite: boolean
  sampler: string
  steps: number
  seed: number | null
}

export type QueueTask = {
  id: string
  workflowId: string
  workflowName: string
  status: TaskStatus
  progress: number
  eta: string
  startedAt: string
  promptPreview: string
  previewImages: string[]
  results: string[]
  errorMessage?: string
}

export type InsightMetric = {
  id: string
  label: string
  value: string
  helper: string
}

export type ConnectionSettings = {
  endpoint: string
  websocket: string
  autoReconnect: boolean
  envLabel: string
}
