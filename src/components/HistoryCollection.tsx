import { ArrowUpRight, Heart, History, RotateCcw, Search } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { cn } from '@/lib/utils'
import type { GeneratedAsset } from '@/types/comfyui'

type HistoryCollectionProps = {
  assets: GeneratedAsset[]
  selectedAssetId: string | null
  onSelect: (assetId: string) => void
  onToggleFavorite: (assetId: string) => void
  onReuse: (assetId: string) => void
}

export function HistoryCollection({
  assets,
  selectedAssetId,
  onSelect,
  onToggleFavorite,
  onReuse,
}: HistoryCollectionProps) {
  const selectedAsset = assets.find((item) => item.id === selectedAssetId) ?? assets[0]
  const favoriteCount = assets.filter((item) => item.favorite).length

  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <Panel
        title="历史结果"
        subtitle="按时间沉淀创作资产，随时回看提示词与参数组合。"
        icon={<History className="h-5 w-5" />}
        action={<span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">收藏 {favoriteCount} 项</span>}
      >
        <div className="mb-4 flex items-center gap-3 rounded-[22px] border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-300">
          <Search className="h-4 w-4 text-slate-400" />
          <span>支持按工作流、提示词和状态筛选，可继续扩展为真实搜索。</span>
        </div>
        <div className="space-y-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={cn(
                'flex flex-col gap-4 rounded-[24px] border p-4 transition md:flex-row',
                selectedAssetId === asset.id
                  ? 'border-cyan-300/35 bg-cyan-300/8'
                  : 'border-white/8 bg-white/4 hover:border-white/16'
              )}
            >
              <button type="button" onClick={() => onSelect(asset.id)} className="overflow-hidden rounded-[20px] md:w-44">
                <img src={asset.imageUrl} alt={asset.workflowName} className="h-32 w-full object-cover md:h-full" />
              </button>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium text-white">{asset.workflowName}</p>
                    <p className="mt-1 text-xs text-slate-400">{asset.createdAt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(asset.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
                  >
                    <Heart className={cn('h-4 w-4', asset.favorite && 'fill-rose-400 text-rose-300')} />
                    {asset.favorite ? '已收藏' : '收藏'}
                  </button>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-slate-300">{asset.prompt}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full bg-slate-950/55 px-3 py-1.5 ring-1 ring-white/10">{asset.sampler}</span>
                  <span className="rounded-full bg-slate-950/55 px-3 py-1.5 ring-1 ring-white/10">步数 {asset.steps}</span>
                  <span className="rounded-full bg-slate-950/55 px-3 py-1.5 ring-1 ring-white/10">种子 {asset.seed}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onReuse(asset.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-xs font-medium text-slate-950 transition hover:bg-cyan-200"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    载入工作台
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(asset.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    查看大图
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {selectedAsset ? (
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 shadow-[0_20px_80px_rgba(15,23,42,0.42)]">
          <img src={selectedAsset.imageUrl} alt={selectedAsset.workflowName} className="h-[420px] w-full object-cover" />
          <div className="space-y-4 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">焦点预览</p>
              <h2 className="mt-2 font-serif text-3xl text-white">{selectedAsset.workflowName}</h2>
            </div>
            <p className="text-sm leading-7 text-slate-300">{selectedAsset.prompt}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">可继续作为 base image</span>
              <span className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">支持回填提示词</span>
              <span className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">参数可二次微调</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
