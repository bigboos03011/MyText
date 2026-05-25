import { statusMap } from '@/utils/comfyui'
import type { TaskStatus } from '@/types/comfyui'

export function StatusBadge({ status }: { status: TaskStatus }) {
  const current = statusMap[status]

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${current.tone}`}>
      {current.label}
    </span>
  )
}
