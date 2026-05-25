import type { GenerationForm, QueueTask, TaskStatus, WorkflowTemplate } from '@/types/comfyui'

export const statusMap: Record<TaskStatus, { label: string; tone: string }> = {
  queued: { label: '排队中', tone: 'text-amber-200 bg-amber-500/10 ring-amber-400/30' },
  running: { label: '生成中', tone: 'text-cyan-100 bg-cyan-500/10 ring-cyan-400/30' },
  success: { label: '已完成', tone: 'text-emerald-100 bg-emerald-500/10 ring-emerald-400/30' },
  error: { label: '异常', tone: 'text-rose-100 bg-rose-500/10 ring-rose-400/30' },
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function setNestedInputValue(
  prompt: Record<string, any>,
  nodeId: string,
  inputKey: string,
  value: unknown
) {
  if (!prompt[nodeId] || typeof prompt[nodeId] !== 'object') {
    return
  }

  if (!prompt[nodeId].inputs || typeof prompt[nodeId].inputs !== 'object') {
    prompt[nodeId].inputs = {}
  }

  prompt[nodeId].inputs[inputKey] = value
}

export function buildComfyPayload(workflow: WorkflowTemplate, form: GenerationForm) {
  if (workflow.apiPromptTemplate && workflow.fieldMappings?.length) {
    const prompt = deepClone(workflow.apiPromptTemplate) as Record<string, any>

    for (const mapping of workflow.fieldMappings) {
      const value =
        mapping.field === 'prompt'
          ? form.prompt.trim()
          : mapping.field === 'negativePrompt'
            ? form.negativePrompt.trim()
            : form[mapping.field]

      setNestedInputValue(prompt, mapping.nodeId, mapping.inputKey, value)
    }

    return {
      client_id: createTaskId(),
      prompt,
    }
  }

  return {
    client_id: createTaskId(),
    workflow_id: workflow.id,
    prompt: {
      positive: form.prompt.trim(),
      negative: form.negativePrompt.trim(),
      model: form.model,
      resolution: { width: form.width, height: form.height },
      sampler: form.sampler,
      steps: form.steps,
      cfg: form.cfg,
      seed: form.seed,
      batch_size: form.batchSize,
      node_mapping: workflow.nodeSummary.map((node, index) => ({
        node,
        input_key: `field_${index + 1}`,
      })),
    },
  }
}

export function formatResolution(width: number, height: number) {
  return `${width} x ${height}`
}

export function getTaskSummary(task: QueueTask) {
  return `${statusMap[task.status].label} · ${task.workflowName} · ${task.progress}%`
}

export function createTaskId() {
  return `task-${Date.now()}`
}

export function normalizeEndpoint(endpoint: string) {
  return endpoint.trim().replace(/\/+$/, '')
}

export function buildWsEndpoint(endpoint: string) {
  const normalized = normalizeEndpoint(endpoint)
  if (normalized.startsWith('https://')) {
    return normalized.replace('https://', 'wss://') + '/ws'
  }
  if (normalized.startsWith('http://')) {
    return normalized.replace('http://', 'ws://') + '/ws'
  }
  return normalized
}

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function buildViewUrl(
  endpoint: string,
  filename: string,
  subfolder = '',
  type = 'output'
) {
  const params = new URLSearchParams({
    filename,
    subfolder,
    type,
  })
  return `${normalizeEndpoint(endpoint)}/view?${params.toString()}`
}
