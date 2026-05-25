import { PenSquare, Plus, Sparkles, TextQuote } from 'lucide-react'
import { Panel } from '@/components/Panel'
import type { GenerationForm } from '@/types/comfyui'

type PromptEditorProps = {
  form: GenerationForm
  promptFragments: string[]
  onChange: <K extends keyof GenerationForm>(field: K, value: GenerationForm[K]) => void
  onAppendFragment: (fragment: string) => void
}

export function PromptEditor({ form, promptFragments, onChange, onAppendFragment }: PromptEditorProps) {
  return (
    <Panel
      title="提示词输入"
      subtitle="保留正向与反向提示词分区，并支持常用片段快速追加。"
      icon={<TextQuote className="h-5 w-5" />}
      action={<span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">字符数 {form.prompt.length}</span>}
    >
      <div className="space-y-5">
        <div className="rounded-[24px] border border-white/8 bg-slate-950/45 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-100">
            <PenSquare className="h-4 w-4 text-cyan-200" />
            正向提示词
          </div>
          <textarea
            value={form.prompt}
            onChange={(event) => onChange('prompt', event.target.value)}
            rows={5}
            className="min-h-[144px] w-full resize-none rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/7"
            placeholder="输入画面主体、镜头语言、材质氛围和光效关键词。"
          />
        </div>

        <div className="rounded-[24px] border border-white/8 bg-slate-950/45 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-100">
            <Sparkles className="h-4 w-4 text-amber-200" />
            反向提示词
          </div>
          <textarea
            value={form.negativePrompt}
            onChange={(event) => onChange('negativePrompt', event.target.value)}
            rows={3}
            className="min-h-[108px] w-full resize-none rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/7"
            placeholder="尽量描述不希望出现的噪点、畸变、错误结构或低质量细节。"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-100">
            <Plus className="h-4 w-4 text-cyan-200" />
            快速片段
          </div>
          <div className="flex flex-wrap gap-2">
            {promptFragments.map((fragment) => (
              <button
                key={fragment}
                type="button"
                onClick={() => onAppendFragment(fragment)}
                className="rounded-full bg-white/6 px-3 py-2 text-xs text-slate-100 ring-1 ring-white/10 transition hover:bg-cyan-400/14"
              >
                {fragment}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}
