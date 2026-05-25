import { Link, NavLink } from 'react-router-dom'
import { Bolt, History, MoonStar, Settings2, Sparkles, SunMedium, Workflow } from 'lucide-react'
import { cn } from '@/lib/utils'

type TopBarProps = {
  isConnected: boolean
  connectionMessage: string
  isDark: boolean
  onToggleTheme: () => void
  onOpenConfig: () => void
}

const navItems = [
  { to: '/', label: '生成工作台', icon: Workflow },
  { to: '/history', label: '历史与素材', icon: History },
]

export function TopBar({ isConnected, connectionMessage, isDark, onToggleTheme, onOpenConfig }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 mb-6 rounded-[32px] border border-white/10 bg-slate-950/65 px-4 py-4 shadow-[0_20px_80px_rgba(2,8,23,0.45)] backdrop-blur-xl md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-300/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-xl tracking-wide text-white">ComfyUI Studio Deck</p>
              <p className="text-xs text-slate-400">把节点流程变成顺手的创作台</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition',
                    isActive
                      ? 'bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.18)]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1',
              isConnected
                ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/30'
                : 'bg-rose-500/10 text-rose-100 ring-rose-400/30'
            )}
          >
            <Bolt className="h-4 w-4" />
            <span>{connectionMessage}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 transition hover:bg-white/12"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {isDark ? '浅色模式' : '深色模式'}
            </button>
            <button
              type="button"
              onClick={onOpenConfig}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400/14 px-4 py-2 text-sm text-cyan-100 ring-1 ring-cyan-300/20 transition hover:bg-cyan-400/24"
            >
              <Settings2 className="h-4 w-4" />
              系统配置
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
