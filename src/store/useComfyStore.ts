import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialHistory, insightMetrics, promptFragments, qualityHighlights, workflowTemplates } from '@/data/mockData'
import { buildComfyPayload, createTaskId } from '@/utils/comfyui'
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
  submitTask: () => void
  toggleFavoriteAsset: (assetId: string) => void
  selectAsset: (assetId: string) => void
  reuseHistoryAsset: (assetId: string) => void
  updateConnection: (payload: Partial<ConnectionSettings>) => void
  testConnection: () => void
  setConfigOpen: (open: boolean) => void
  toggleTheme: () => void
}

const defaultConnection: ConnectionSettings = {
  endpoint: 'http://127.0.0.1:8188',
  websocket: 'ws://127.0.0.1:8188/ws',
  autoReconnect: true,
  envLabel: '本地 ComfyUI',
}

const getWorkflowById = (workflowId: string) =>
  workflowTemplates.find((item) => item.id === workflowId) ?? workflowTemplates[0]

const getInitialForm = () => getWorkflowById(workflowTemplates[0].id).defaultForm

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
      submitTask: () => {
        const state = get()
        const workflow = getWorkflowById(state.activeWorkflowId)
        const payload = buildComfyPayload(workflow, state.form)
        const id = createTaskId()
        const nextTask: QueueTask = {
          id,
          workflowId: workflow.id,
          workflowName: workflow.name,
          status: 'queued',
          progress: 12,
          eta: '已进入队列',
          startedAt: '刚刚',
          promptPreview: String(payload.prompt.positive).slice(0, 28),
          previewImages: workflow.gallery.slice(0, Math.max(1, state.form.batchSize)),
          results: [],
        }

        set((current) => ({
          queue: [nextTask, ...current.queue.slice(0, 3)],
          isSubmitting: true,
          selectedAssetId: current.selectedAssetId,
        }))

        window.setTimeout(() => {
          set((current) => ({
            queue: current.queue.map((task) =>
              task.id === id
                ? { ...task, status: 'running', progress: 57, eta: '预计 00:21' }
                : task
            ),
          }))
        }, 900)

        window.setTimeout(() => {
          const outputImage = workflow.gallery[(state.history.length + workflow.gallery.length) % workflow.gallery.length]
          const createdAsset: GeneratedAsset = {
            id: `asset-${Date.now()}`,
            workflowId: workflow.id,
            workflowName: workflow.name,
            imageUrl: outputImage,
            prompt: state.form.prompt,
            createdAt: '刚刚生成',
            favorite: false,
            sampler: state.form.sampler,
            steps: state.form.steps,
            seed: state.form.seed,
          }

          set((current) => ({
            queue: current.queue.map((task) =>
              task.id === id
                ? {
                    ...task,
                    status: 'success',
                    progress: 100,
                    eta: '生成完成',
                    results: [outputImage],
                  }
                : task
            ),
            history: [createdAsset, ...current.history],
            selectedAssetId: createdAsset.id,
            isSubmitting: false,
          }))
        }, 2200)
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
        set((state) => ({
          connection: {
            ...state.connection,
            ...payload,
          },
        })),
      testConnection: () => {
        const endpoint = get().connection.endpoint
        const isValid = endpoint.startsWith('http')
        set({
          isConnected: isValid,
          connectionMessage: isValid
            ? '连接检测成功，ComfyUI API 可用。'
            : '地址格式不正确，请检查 ComfyUI 服务地址。',
        })
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
