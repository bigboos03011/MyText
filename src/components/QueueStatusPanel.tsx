import { ActivitySquare, Clock3, RefreshCw } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { StatusBadge } from '@/components/StatusBadge'
import { getTaskSummary } from '@/utils/comfyui'
import type { QueueTask } from '@/types/comfyui'

type QueueStatusPanelProps = {
  queue: QueueTask[]
}

export function QueueStatusPanel({ queue }: QueueStatusPanelProps) {
  return (
    <Panel
      title="队列状态"
      subtitle="前端以时间线方式展示任务状态，便于在多个工作流之间切换查看。"
      icon={<ActivitySquare className="h-5 w-5" />}
      action={<span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">最近 {queue.length} 条</span>}
    >
      <div className="space-y-4">
        {queue.map((task) => (
          <div key={task.id} className="rounded-[24px] border border-white/8 bg-white/4 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{task.workflowName}</p>
                  <StatusBadge status={task.status} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{task.promptPreview}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/65 px-3 py-2 text-xs text-slate-400 ring-1 ring-white/10">
                {getTaskSummary(task)}
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900/80">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300" style={{ width: `${task.progress}%` }} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {task.eta}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                {task.startedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
