import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PanelProps = {
  title: string
  subtitle: string
  icon: ReactNode
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function Panel({ title, subtitle, icon, action, className, children }: PanelProps) {
  return (
    <section className={cn('glass-panel rounded-[28px] p-5 md:p-6', className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-cyan-100 ring-1 ring-white/10">
            {icon}
          </div>
          <div>
            <h2 className="text-base font-semibold text-white md:text-lg">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-300">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
