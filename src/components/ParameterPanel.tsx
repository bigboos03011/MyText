import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { formatResolution } from '@/utils/comfyui'
import type { GenerationForm } from '@/types/comfyui'

type ParameterPanelProps = {
  form: GenerationForm
  models: string[]
  samplers: string[]
  onChange: <K extends keyof GenerationForm>(field: K, value: GenerationForm[K]) => void
  onReset: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

const rangeClassName =
  'h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300'

export function ParameterPanel({
  form,
  models,
  samplers,
  onChange,
  onReset,
  onSubmit,
  isSubmitting,
}: ParameterPanelProps) {
  return (
    <Panel
      title="参数控制"
      subtitle="将常用节点输入映射为更容易理解的表单控件，同时保留关键参数的精细调节。"
      icon={<SlidersHorizontal className="h-5 w-5" />}
      action={
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          恢复默认
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span>模型</span>
          <select
            value={form.model}
            onChange={(event) => onChange('model', event.target.value)}
            className="field-input"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>采样器</span>
          <select
            value={form.sampler}
            onChange={(event) => onChange('sampler', event.target.value)}
            className="field-input"
          >
            {samplers.map((sampler) => (
              <option key={sampler} value={sampler}>
                {sampler}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>宽度</span>
          <input
            type="number"
            min={512}
            step={64}
            value={form.width}
            onChange={(event) => onChange('width', Number(event.target.value) || 512)}
            className="field-input"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>高度</span>
          <input
            type="number"
            min={512}
            step={64}
            value={form.height}
            onChange={(event) => onChange('height', Number(event.target.value) || 512)}
            className="field-input"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>步数</span>
            <span>{form.steps}</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            value={form.steps}
            onChange={(event) => onChange('steps', Number(event.target.value))}
            className={rangeClassName}
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>CFG</span>
            <span>{form.cfg.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={form.cfg}
            onChange={(event) => onChange('cfg', Number(event.target.value))}
            className={rangeClassName}
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>批量</span>
            <span>{form.batchSize}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={form.batchSize}
            onChange={(event) => onChange('batchSize', Number(event.target.value))}
            className={rangeClassName}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="space-y-2 text-sm text-slate-300">
          <span>种子</span>
          <input
            type="number"
            value={form.seed ?? ''}
            onChange={(event) => onChange('seed', Number(event.target.value) || 0)}
            className="field-input"
          />
        </label>
        <div className="rounded-[24px] border border-white/8 bg-white/4 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">输出规格</p>
          <p className="mt-3 font-serif text-xl text-white">{formatResolution(form.width, form.height)}</p>
          <p className="mt-2 text-xs text-slate-400">当前配置可直接映射到 ComfyUI 的分辨率与采样控制节点。</p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : '开始生成'}
        </button>
      </div>
    </Panel>
  )
}
