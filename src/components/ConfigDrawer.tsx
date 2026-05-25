import { Settings2, ShieldCheck, Wifi } from 'lucide-react'
import { Panel } from '@/components/Panel'
import type { ConnectionSettings } from '@/types/comfyui'

type ConfigDrawerProps = {
  open: boolean
  connection: ConnectionSettings
  isConnected: boolean
  onClose: () => void
  onChange: (payload: Partial<ConnectionSettings>) => void
  onTest: () => void
}

export function ConfigDrawer({ open, connection, isConnected, onClose, onChange, onTest }: ConfigDrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 transition">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55 transition"
        aria-label="关闭设置"
      />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-xl transform p-4 transition duration-300"
      >
        <Panel
          title="系统配置"
          subtitle="配置 ComfyUI 服务地址、WebSocket 通道和连接策略。"
          icon={<Settings2 className="h-5 w-5" />}
          className="h-full overflow-y-auto bg-slate-950/92"
          action={
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/6 px-4 py-2 text-xs text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              收起
            </button>
          }
        >
          <div className="space-y-5">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
                <Wifi className="h-4 w-4 text-cyan-200" />
                服务连接
              </div>
              <div className="space-y-4">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>HTTP Endpoint</span>
                  <input
                    value={connection.endpoint}
                    onChange={(event) => onChange({ endpoint: event.target.value })}
                    className="field-input"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>WebSocket Endpoint</span>
                  <input
                    value={connection.websocket}
                    onChange={(event) => onChange({ websocket: event.target.value })}
                    className="field-input"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>环境标签</span>
                  <input
                    value={connection.envLabel}
                    onChange={(event) => onChange({ envLabel: event.target.value })}
                    className="field-input"
                  />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/55 px-4 py-3 text-sm text-slate-200">
                  <span>自动重连</span>
                  <input
                    type="checkbox"
                    checked={connection.autoReconnect}
                    onChange={(event) => onChange({ autoReconnect: event.target.checked })}
                    className="h-4 w-4 rounded border-white/15 bg-transparent text-cyan-300"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[24px] border border-dashed border-cyan-300/20 bg-cyan-300/8 p-4 text-sm leading-6 text-cyan-50">
              <div className="flex items-center gap-2 font-medium text-white">
                <ShieldCheck className="h-4 w-4 text-cyan-200" />
                当前状态
              </div>
              <p className="mt-2">{isConnected ? '连接有效，可立即提交工作流。' : '尚未验证，请先检查服务地址。'}</p>
            </div>

            <button
              type="button"
              onClick={onTest}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              检测连接
            </button>
          </div>
        </Panel>
      </aside>
    </div>
  )
}
