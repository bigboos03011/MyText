import type { GenerationForm, QueueTask, TaskStatus, WorkflowTemplate } from '@/types/comfyui'

export const statusMap: Record<TaskStatus, { label: string; tone: string }> = {
  queued: { label: '排队中', tone: 'text-amber-200 bg-amber-500/10 ring-amber-400/30' },
  running: { label: '生成中', tone: 'text-cyan-100 bg-cyan-500/10 ring-cyan-400/30' },
  success: { label: '已完成', tone: 'text-emerald-100 bg-emerald-500/10 ring-emerald-400/30' },
  error: { label: '异常', tone: 'text-rose-100 bg-rose-500/10 ring-rose-400/30' },
}

export function buildComfyPayload(workflow: WorkflowTemplate, form: GenerationForm) {
  return {
    client_id: 'comfy-console-demo',
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
