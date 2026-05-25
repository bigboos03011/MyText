import { describe, expect, it } from 'vitest'
import { workflowTemplates } from '@/data/mockData'
import { buildComfyPayload, formatResolution } from '@/utils/comfyui'

describe('comfyui payload helpers', () => {
  it('buildComfyPayload maps form fields into a predictable payload', () => {
    const workflow = workflowTemplates[0]
    const payload = buildComfyPayload(workflow, workflow.defaultForm)

    expect(payload.workflow_id).toBe(workflow.id)
    expect(payload.prompt.model).toBe(workflow.defaultForm.model)
    expect(payload.prompt.batch_size).toBe(workflow.defaultForm.batchSize)
    expect(payload.prompt.node_mapping).toHaveLength(workflow.nodeSummary.length)
  })

  it('formatResolution returns a readable output label', () => {
    expect(formatResolution(1024, 1536)).toBe('1024 x 1536')
  })
})
