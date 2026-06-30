import { CheckCircle2, Loader2 } from 'lucide-react';

const processingSteps = ['正在识别单据类型', '正在抽取字段', '正在理解看板需求', '正在匹配字段', '正在生成看板'];

interface ProcessingTimelineProps {
  activeIndex: number;
}

export function ProcessingTimeline({ activeIndex }: ProcessingTimelineProps) {
  return (
    <div className="rounded-md border border-brand-100 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">模拟 AI 处理流程</h3>
          <p className="text-sm text-slate-500">用可解释步骤展示 OCR、LLM 与字段匹配链路。</p>
        </div>
        <span className="rounded-md bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          处理中
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {processingSteps.map((step, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          return (
            <div
              key={step}
              className={`rounded-md border p-4 ${
                done
                  ? 'border-emerald-200 bg-emerald-50'
                  : active
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="mb-3 text-sm font-semibold text-slate-900">{step}</div>
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : active ? (
                <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-slate-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
