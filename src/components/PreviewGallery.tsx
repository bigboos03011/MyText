import { Download, Expand, Heart, Image as ImageIcon, Sparkles } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { cn } from '@/lib/utils'
import type { GeneratedAsset, WorkflowTemplate } from '@/types/comfyui'

type PreviewGalleryProps = {
  selectedAsset: GeneratedAsset | undefined
  activeWorkflow: WorkflowTemplate
  history: GeneratedAsset[]
  onSelectAsset: (assetId: string) => void
  onToggleFavorite: (assetId: string) => void
}

export function PreviewGallery({
  selectedAsset,
  activeWorkflow,
  history,
  onSelectAsset,
  onToggleFavorite,
}: PreviewGalleryProps) {
  const spotlightImage = selectedAsset?.imageUrl ?? activeWorkflow.gallery[0]
  const spotlightTitle = selectedAsset?.workflowName ?? activeWorkflow.name
  const spotlightPrompt = selectedAsset?.prompt ?? activeWorkflow.defaultForm.prompt

  return (
    <Panel
      title="结果预览"
      subtitle="支持大图查看、历史切换与收藏标记，让输出结果可以继续迭代。"
      icon={<ImageIcon className="h-5 w-5" />}
      action={<span className="rounded-full bg-cyan-300/12 px-3 py-1 text-xs text-cyan-100 ring-1 ring-cyan-300/20">自动预览</span>}
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/70">
          <img src={spotlightImage} alt={spotlightTitle} className="h-[340px] w-full object-cover" />
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Spotlight</p>
                <h3 className="mt-2 font-serif text-2xl text-white">{spotlightTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{spotlightPrompt}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="icon-button">
                  <Expand className="h-4 w-4" />
                </button>
                <button type="button" className="icon-button">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">{activeWorkflow.nodeSummary.join(' · ')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {history.slice(0, 6).map((asset) => (
            <div
              key={asset.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectAsset(asset.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectAsset(asset.id)
                }
              }}
              className={cn(
                'group relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 transition focus:outline-none focus:ring-2 focus:ring-cyan-300/40',
                selectedAsset?.id === asset.id && 'border-cyan-300/40 shadow-[0_12px_40px_rgba(34,211,238,0.12)]'
              )}
            >
              <img src={asset.imageUrl} alt={asset.workflowName} className="h-28 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950 to-transparent p-3">
                <div className="text-left">
                  <p className="text-xs font-medium text-white">{asset.workflowName}</p>
                  <p className="text-[11px] text-slate-300">{asset.createdAt}</p>
                </div>
                <button
                  type="button"
                  aria-label={`收藏 ${asset.workflowName}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    onToggleFavorite(asset.id)
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/60 text-white ring-1 ring-white/10"
                >
                  <Heart className={cn('h-4 w-4', asset.favorite && 'fill-rose-400 text-rose-300')} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-dashed border-cyan-300/20 bg-cyan-300/6 p-4 text-sm leading-6 text-cyan-50">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Sparkles className="h-4 w-4 text-cyan-200" />
            交互建议
          </div>
          <p className="mt-2">
            选择历史缩略图可立即对比不同参数结果；切回工作流模板后继续调节参数，再次提交即可形成连续迭代。
          </p>
        </div>
      </div>
    </Panel>
  )
}
