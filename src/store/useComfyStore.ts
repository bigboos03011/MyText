import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialHistory, insightMetrics, promptFragments, qualityHighlights, workflowTemplates } from '@/data/mockData'
import { buildComfyPayload, buildViewUrl, buildWsEndpoint, createTaskId, fetchJson, normalizeEndpoint } from '@/utils/comfyui'
import type { ConnectionSettings, GeneratedAsset, GenerationForm, InsightMetric, QueueTask, ThemeMode, WorkflowTemplate } from '@/types/comfyui'

type ComfyState = {
  workflows: WorkflowTemplate[]
  metrics: InsightMetric[]
  promptFragments: string[]
  qualityHighlights: string[]
  activeWorkflowId: string
  form: GenerationForm
  connection: ConnectionSettings
  isConnected: boolean
  connectionMessage: string
  queue: QueueTask[]
  history: GeneratedAsset[]
  selectedAssetId: string | null
  favoriteWorkflowIds: string[]
  theme: ThemeMode
  isConfigOpen: boolean
  isSubmitting: boolean
  selectWorkflow: (workflowId: string) => void
  updateForm: <K extends keyof GenerationForm>(field: K, value: GenerationForm[K]) => void
  appendPromptFragment: (fragment: string) => void
  toggleFavoriteWorkflow: (workflowId: string) => void
  submitTask: () => Promise<void>
  toggleFavoriteAsset: (assetId: string) => void
  selectAsset: (assetId: string) => void
  reuseHistoryAsset: (assetId: string) => void
  updateConnection: (payload: Partial<ConnectionSettings>) => void
  testConnection: () => Promise<void>
  setConfigOpen: (open: boolean) => void
  toggleTheme: () => void
}

const defaultConnection: ConnectionSettings = {
  endpoint: 'http://127.0.0.1:8187',
  websocket: 'ws://127.0.0.1:8187/ws',
  autoReconnect: true,
  envLabel: '本地 ComfyUI',
}

const getWorkflowById = (workflowId: string) =>
  workflowTemplates.find((item) => item.id === workflowId) ?? workflowTemplates[0]

const getInitialForm = () => getWorkflowById(workflowTemplates[0].id).defaultForm

type ComfyPromptResponse = {
  prompt_id: string
}

type ComfyHistoryItem = {
  outputs?: Record<
    string,
    {
      images?: Array<{
        filename: string
        subfolder?: string
        type?: string
      }>
    }
  >
}

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

async function pollHistoryForImages(endpoint: string, promptId: string, maxAttempts = 24) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const history = await fetchJson<Record<string, ComfyHistoryItem>>(
      `${normalizeEndpoint(endpoint)}/history/${promptId}`
    )
    const item = history[promptId]

    if (item?.outputs) {
      const images = Object.values(item.outputs).flatMap((output) => output.images ?? [])
      if (images.length > 0) {
        return images
      }
    }

    await sleep(1500)
  }

  return []
}

export const useComfyStore = create<ComfyState>()(
  persist(
    (set, get) => ({
      workflows: workflowTemplates,
      metrics: insightMetrics,
      promptFragments,
      qualityHighlights,
      activeWorkflowId: workflowTemplates[0].id,
      form: getInitialForm(),
      connection: defaultConnection,
      isConnected: true,
      connectionMessage: '连接稳定，可直接提交工作流。',
      queue: [
        {
          id: 'queue-1',
          workflowId: workflowTemplates[0].id,
          workflowName: workflowTemplates[0].name,
          status: 'running',
          progress: 68,
          eta: '预计 00:14',
          startedAt: '刚刚',
          promptPreview: '电影级人像，冷色边缘光，真实皮肤纹理',
          previewImages: workflowTemplates[0].gallery.slice(0, 2),
          results: [],
        },
      ],
      history: initialHistory,
      selectedAssetId: initialHistory[0]?.id ?? null,
      favoriteWorkflowIds: [workflowTemplates[0].id, workflowTemplates[2].id],
      theme: 'dark',
      isConfigOpen: false,
      isSubmitting: false,
      selectWorkflow: (workflowId) => {
        const workflow = getWorkflowById(workflowId)
        const currentPrompt = get().form.prompt
        const currentNegativePrompt = get().form.negativePrompt
        set({
          activeWorkflowId: workflowId,
          form: {
            ...workflow.defaultForm,
            prompt: currentPrompt || workflow.defaultForm.prompt,
            negativePrompt: currentNegativePrompt || workflow.defaultForm.negativePrompt,
          },
        })
      },
      updateForm: (field, value) =>
        set((state) => ({
          form: {
            ...state.form,
            [field]: value,
          },
        })),
      appendPromptFragment: (fragment) =>
        set((state) => ({
          form: {
            ...state.form,
            prompt: `${state.form.prompt}${state.form.prompt ? '，' : ''}${fragment}`,
          },
        })),
      toggleFavoriteWorkflow: (workflowId) =>
        set((state) => ({
          favoriteWorkflowIds: state.favoriteWorkflowIds.includes(workflowId)
            ? state.favoriteWorkflowIds.filter((id) => id !== workflowId)
            : [...state.favoriteWorkflowIds, workflowId],
        })),
      submitTask: async () => {
        const state = get()
        const workflow = getWorkflowById(state.activeWorkflowId)
        const id = createTaskId()
        const endpoint = normalizeEndpoint(state.connection.endpoint)

        if (!state.form.prompt.trim()) {
          set({
            isSubmitting: false,
            connectionMessage: '请先填写提示词后再提交。',
          })
          return
        }

        if (!workflow.apiPromptTemplate || !workflow.fieldMappings?.length) {
          set({
            isSubmitting: false,
            isConnected: false,
            connectionMessage: '当前前端还没有接入这份工作流的 API 模板，请提供完整工作流 JSON 或 API JSON。',
          })
          return
        }

        const payload = buildComfyPayload(workflow, state.form)

        const nextTask: QueueTask = {
          id,
          workflowId: workflow.id,
          workflowName: workflow.name,
          status: 'queued',
          progress: 12,
          eta: '已进入队列',
          startedAt: '刚刚',
          promptPreview: state.form.prompt.slice(0, 28),
          previewImages: workflow.gallery.slice(0, Math.max(1, state.form.batchSize)),
          results: [],
        }

        set((current) => ({
          queue: [nextTask, ...current.queue.slice(0, 3)],
          isSubmitting: true,
          selectedAssetId: current.selectedAssetId,
        }))

        try {
          const response = await fetchJson<ComfyPromptResponse>(`${endpoint}/prompt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })

          set((current) => ({
            queue: current.queue.map((task) =>
              task.id === id
                ? { ...task, id: response.prompt_id, status: 'running', progress: 55, eta: 'ComfyUI 执行中' }
                : task
            ),
            connectionMessage: '任务已提交到 ComfyUI。',
          }))

          const images = await pollHistoryForImages(endpoint, response.prompt_id)

          if (!images.length) {
            throw new Error('未在历史记录中获取到输出图片')
          }

          const resultUrls = images.map((image) =>
            buildViewUrl(endpoint, image.filename, image.subfolder ?? '', image.type ?? 'output')
          )

          const createdAsset: GeneratedAsset = {
            id: `asset-${Date.now()}`,
            workflowId: workflow.id,
            workflowName: workflow.name,
            imageUrl: resultUrls[0],
            prompt: state.form.prompt,
            createdAt: '刚刚生成',
            favorite: false,
            sampler: state.form.sampler,
            steps: state.form.steps,
            seed: state.form.seed,
          }

          set((current) => ({
            queue: current.queue.map((task) =>
              task.id === response.prompt_id
                ? {
                    ...task,
                    status: 'success',
                    progress: 100,
                    eta: '生成完成',
                    results: resultUrls,
                  }
                : task
            ),
            history: [createdAsset, ...current.history],
            selectedAssetId: createdAsset.id,
            isSubmitting: false,
            isConnected: true,
            connectionMessage: '生成完成，结果已写入历史记录。',
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '未知错误'
          set((current) => ({
            queue: current.queue.map((task) =>
              task.id === id
                ? {
                    ...task,
                    status: 'error',
                    progress: 0,
                    eta: '提交失败',
                    errorMessage,
                  }
                : task
            ),
            isSubmitting: false,
            isConnected: false,
            connectionMessage: `提交失败：${errorMessage}`,
          }))
        }
      },
      toggleFavoriteAsset: (assetId) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === assetId ? { ...item, favorite: !item.favorite } : item
          ),
        })),
      selectAsset: (assetId) => set({ selectedAssetId: assetId }),
      reuseHistoryAsset: (assetId) => {
        const asset = get().history.find((item) => item.id === assetId)
        if (!asset) {
          return
        }
        const workflow = getWorkflowById(asset.workflowId)
        set((state) => ({
          activeWorkflowId: asset.workflowId,
          selectedAssetId: asset.id,
          form: {
            ...workflow.defaultForm,
            prompt: asset.prompt,
            sampler: asset.sampler,
            steps: asset.steps,
            seed: asset.seed,
            negativePrompt: state.form.negativePrompt || workflow.defaultForm.negativePrompt,
          },
        }))
      },
      updateConnection: (payload) =>
        set((state) => {
          const nextConnection = {
            ...state.connection,
            ...payload,
          }

          if (payload.endpoint) {
            nextConnection.websocket = buildWsEndpoint(payload.endpoint)
          }

          return {
            connection: nextConnection,
          }
        }),
      testConnection: async () => {
        const endpoint = normalizeEndpoint(get().connection.endpoint)
        try {
          await fetchJson<Record<string, unknown>>(`${endpoint}/history`)
          set((state) => ({
            isConnected: true,
            connectionMessage: '连接检测成功，ComfyUI API 可用。',
            connection: {
              ...state.connection,
              endpoint,
              websocket: buildWsEndpoint(endpoint),
            },
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '未知错误'
          set({
            isConnected: false,
            connectionMessage: `连接失败：${errorMessage}`,
          })
        }
      },
      setConfigOpen: (open) => set({ isConfigOpen: open }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
    }),
    {
      name: 'comfy-console-store',
      partialize: (state) => ({
        activeWorkflowId: state.activeWorkflowId,
        connection: state.connection,
        history: state.history,
        selectedAssetId: state.selectedAssetId,
        favoriteWorkflowIds: state.favoriteWorkflowIds,
        theme: state.theme,
        form: state.form,
      }),
    }
  )
)
