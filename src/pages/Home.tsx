import { useMemo } from 'react'
import { Cpu, Wand2 } from 'lucide-react'
import { MetricStrip } from '@/components/MetricStrip'
import { ParameterPanel } from '@/components/ParameterPanel'
import { PreviewGallery } from '@/components/PreviewGallery'
import { PromptEditor } from '@/components/PromptEditor'
import { QueueStatusPanel } from '@/components/QueueStatusPanel'
import { WorkflowPicker } from '@/components/WorkflowPicker'
import { Panel } from '@/components/Panel'
import { useComfyStore } from '@/store/useComfyStore'

const models = ['Juggernaut XL', 'RealVisXL 4.0', 'DreamShaper XL', 'SDXL Turbo']
const samplers = ['DPM++ 2M Karras', 'DPM++ SDE', 'Euler a', 'UniPC']

export default function Home() {
  const {
    workflows,
    metrics,
    qualityHighlights,
    activeWorkflowId,
    favoriteWorkflowIds,
    form,
    queue,
    history,
    selectedAssetId,
    promptFragments,
    isSubmitting,
    selectWorkflow,
    updateForm,
    appendPromptFragment,
    toggleFavoriteWorkflow,
    submitTask,
    selectAsset,
    toggleFavoriteAsset,
  } = useComfyStore()

  const activeWorkflow = useMemo(
    () => workflows.find((item) => item.id === activeWorkflowId) ?? workflows[0],
    [activeWorkflowId, workflows]
  )
  const selectedAsset = history.find((item) => item.id === selectedAssetId)

  return (
    <div className="space-y-6 pb-10">
      <MetricStrip metrics={metrics} workflow={activeWorkflow} highlights={qualityHighlights} />

      <div className="grid gap-6 xl:grid-cols-[1.06fr_1fr_0.92fr]">
        <div className="space-y-6">
          <WorkflowPicker
            workflows={workflows}
            activeWorkflowId={activeWorkflowId}
            favoriteWorkflowIds={favoriteWorkflowIds}
            onSelect={selectWorkflow}
            onToggleFavorite={toggleFavoriteWorkflow}
          />
          <QueueStatusPanel queue={queue} />
        </div>

        <div className="space-y-6">
          <PromptEditor
            form={form}
            promptFragments={promptFragments}
            onChange={updateForm}
            onAppendFragment={appendPromptFragment}
          />
          <ParameterPanel
            form={form}
            models={models}
            samplers={samplers}
            onChange={updateForm}
            onReset={() => selectWorkflow(activeWorkflow.id)}
            onSubmit={submitTask}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="space-y-6">
          <PreviewGallery
            selectedAsset={selectedAsset}
            activeWorkflow={activeWorkflow}
            history={history}
            onSelectAsset={selectAsset}
            onToggleFavorite={toggleFavoriteAsset}
          />
          <Panel
            title="节点映射摘要"
            subtitle="把复杂节点含义翻译为业务操作语言，方便团队成员快速理解。"
            icon={<Cpu className="h-5 w-5" />}
            action={<span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">高级面板</span>}
          >
            <div className="space-y-3">
              {activeWorkflow.nodeSummary.map((node, index) => (
                <div key={node} className="flex items-center justify-between rounded-[20px] border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300/12 text-cyan-100 ring-1 ring-cyan-300/20">
                      {index + 1}
                    </div>
                    <span>{node}</span>
                  </div>
                  <Wand2 className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
