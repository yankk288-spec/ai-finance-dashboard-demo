import { BarChart3, FileSpreadsheet, Presentation, UploadCloud } from 'lucide-react';
import { OutputMode, ScenarioId } from '../types';

interface UploadPanelProps {
  requirement: string;
  scenario: ScenarioId;
  outputMode: OutputMode;
  scenarioOptions: Array<{ id: ScenarioId; name: string; description: string; uploadHint: string }>;
  fileName: string;
  onRequirementChange: (value: string) => void;
  onScenarioChange: (value: ScenarioId) => void;
  onOutputModeChange: (value: OutputMode) => void;
  onFileChange: (fileName: string) => void;
  onGenerate: () => void;
}

const outputModes: Array<{ id: OutputMode; label: string; description: string; icon: typeof BarChart3 }> = [
  { id: 'dashboard', label: '图表看板', description: '生成可交互图表和明细表', icon: BarChart3 },
  { id: 'ppt', label: 'PPT 汇报', description: '生成汇报型幻灯片预览', icon: Presentation }
];

export function UploadPanel({
  requirement,
  scenario,
  outputMode,
  scenarioOptions,
  fileName,
  onRequirementChange,
  onScenarioChange,
  onOutputModeChange,
  onFileChange,
  onGenerate
}: UploadPanelProps) {
  const selectedScenario = scenarioOptions.find((item) => item.id === scenario) ?? scenarioOptions[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">上传单据与描述需求</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            上传财务单据并描述分析需求，AI 自动完成单据解析、字段匹配、数据建模和财务看板生成。
          </p>
        </div>

        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-brand-300 bg-brand-50 px-6 py-8 text-center transition hover:bg-brand-100">
          <UploadCloud className="mb-3 h-10 w-10 text-brand-600" />
          <span className="text-sm font-semibold text-slate-900">
            {fileName || '点击上传或拖拽财务单据'}
          </span>
          <span className="mt-2 text-xs text-slate-500">模拟支持 PDF、图片、Excel、CSV</span>
          <input
            className="hidden"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
            onChange={(event) => onFileChange(event.target.files?.[0]?.name ?? '')}
          />
        </label>

        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            示例数据包
          </div>
          <p className="text-sm text-slate-600">{selectedScenario.uploadHint}</p>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800">场景选择</span>
            <select
              value={scenario}
              onChange={(event) => onScenarioChange(event.target.value as ScenarioId)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {scenarioOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-md border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-900">
            {selectedScenario.description}
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-800">输出形式</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {outputModes.map((mode) => {
                const Icon = mode.icon;
                const active = outputMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onOutputModeChange(mode.id)}
                    className={`flex items-start gap-3 rounded-md border p-4 text-left transition ${
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`mt-0.5 h-5 w-5 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span>
                      <span className="block text-sm font-semibold">{mode.label}</span>
                      <span className="mt-1 block text-xs text-slate-500">{mode.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800">自然语言看板需求</span>
            <textarea
              value={requirement}
              onChange={(event) => onRequirementChange(event.target.value)}
              rows={7}
              className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>

          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            系统将按“单据解析 → 需求理解 → 字段匹配 → 看板生成 → 模板沉淀”的平台链路执行。
          </div>

          <button
            type="button"
            onClick={onGenerate}
            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            开始生成{outputMode === 'ppt' ? 'PPT汇报' : '看板'}
          </button>
        </div>
      </section>
    </div>
  );
}
