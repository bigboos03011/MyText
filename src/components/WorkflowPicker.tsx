import { Heart, Layers3, WandSparkles } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { cn } from '@/lib/utils'
import type { WorkflowTemplate } from '@/types/comfyui'

type WorkflowPickerProps = {
  workflows: WorkflowTemplate[]
  activeWorkflowId: string
  favoriteWorkflowIds: string[]
  onSelect: (workflowId: string) => void
  onToggleFavorite: (workflowId: string) => void
}

export function WorkflowPicker({
  workflows,
  activeWorkflowId,
  favoriteWorkflowIds,
  onSelect,
  onToggleFavorite,
}: WorkflowPickerProps) {
  return (
    <Panel
      title="工作流模板"
      subtitle="优先展示常用模板，方便在不同创作场景之间快速切换。"
      icon={<Layers3 className="h-5 w-5" />}
      action={<span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">拖拽排序可扩展</span>}
    >
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const isActive = workflow.id === activeWorkflowId
          const isFavorite = favoriteWorkflowIds.includes(workflow.id)

          return (
            <div
              key={workflow.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(workflow.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(workflow.id)
                }
              }}
              className={cn(
                'group w-full overflow-hidden rounded-[26px] border text-left transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/40',
                isActive
                  ? 'border-cyan-300/40 bg-white/8 shadow-[0_18px_50px_rgba(34,211,238,0.12)]'
                  : 'border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/6'
              )}
            >
              <div className={`relative h-36 bg-gradient-to-br ${workflow.accent}`}>
                <img src={workflow.coverImage} alt={workflow.name} className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                <button
                  type="button"
                  aria-label={`收藏 ${workflow.name}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    onToggleFavorite(workflow.id)
                  }}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/55 text-white ring-1 ring-white/10 transition hover:bg-slate-900/75"
                >
                  <Heart className={cn('h-4 w-4', isFavorite && 'fill-rose-400 text-rose-300')} />
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-white">{workflow.name}</p>
                    <p className="mt-1 text-xs text-slate-200">{workflow.subtitle}</p>
                  </div>
                  {isActive ? (
                    <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-medium text-slate-950">当前使用</span>
                  ) : null}
                </div>
              </div>
              <div className="space-y-4 p-4">
                <p className="text-sm leading-6 text-slate-300">{workflow.description}</p>
                <div className="flex flex-wrap gap-2">
                  {workflow.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <WandSparkles className="h-4 w-4 text-cyan-200" />
                    推荐质量 {workflow.qualityScore}
                  </span>
                  <span>{workflow.nodeSummary.length} 个关键节点</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
