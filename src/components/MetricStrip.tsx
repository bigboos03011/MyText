import { BarChart3, Gauge, Layers3 } from 'lucide-react'
import { Panel } from '@/components/Panel'
import type { InsightMetric, WorkflowTemplate } from '@/types/comfyui'

const icons = [Layers3, Gauge, BarChart3]

type MetricStripProps = {
  metrics: InsightMetric[]
  workflow: WorkflowTemplate
  highlights: string[]
}

export function MetricStrip({ metrics, workflow, highlights }: MetricStripProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
      <Panel
        title="控制台总览"
        subtitle="将 ComfyUI 的复杂节点流转压缩成更直观的决策面板。"
        icon={<Gauge className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((item, index) => {
            const Icon = icons[index] ?? Gauge
            return (
              <div key={item.id} className="rounded-3xl border border-white/8 bg-white/4 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/70 text-cyan-100 ring-1 ring-white/10">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.helper}</p>
              </div>
            )
          })}
        </div>
      </Panel>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 shadow-[0_20px_70px_rgba(15,23,42,0.4)]">
        <div className={`h-40 bg-gradient-to-br ${workflow.accent}`}>
          <img src={workflow.coverImage} alt={workflow.name} className="h-full w-full object-cover mix-blend-screen opacity-80" />
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">当前推荐</p>
            <h2 className="mt-2 font-serif text-2xl text-white">{workflow.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{workflow.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span key={item} className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
