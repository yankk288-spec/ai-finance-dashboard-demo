import { FileSpreadsheet, UploadCloud } from 'lucide-react';

interface UploadPanelProps {
  requirement: string;
  scenario: string;
  fileName: string;
  onRequirementChange: (value: string) => void;
  onScenarioChange: (value: string) => void;
  onFileChange: (fileName: string) => void;
  onGenerate: () => void;
}

const scenarios = ['费用分析', '收入分析', '现金流分析', '应收应付分析'];

export function UploadPanel({
  requirement,
  scenario,
  fileName,
  onRequirementChange,
  onScenarioChange,
  onFileChange,
  onGenerate
}: UploadPanelProps) {
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
            示例单据包
          </div>
          <p className="text-sm text-slate-600">
            未上传真实文件时，系统会使用虚构的“2026 年 6 月费用单据包”作为演示输入。
          </p>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800">业务场景</span>
            <select
              value={scenario}
              onChange={(event) => onScenarioChange(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {scenarios.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800">自然语言看板需求</span>
            <textarea
              value={requirement}
              onChange={(event) => onRequirementChange(event.target.value)}
              rows={8}
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
            开始生成看板
          </button>
        </div>
      </section>
    </div>
  );
}
