import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { StepId } from '../types';

const steps: Array<{ id: StepId; title: string; subtitle: string }> = [
  { id: 'input', title: '上传单据', subtitle: '输入需求' },
  { id: 'parsing', title: 'AI 单据解析', subtitle: '抽取字段' },
  { id: 'intent', title: '需求理解', subtitle: '结构化意图' },
  { id: 'mapping', title: '字段建模', subtitle: '匹配校验' },
  { id: 'dashboard', title: '财务看板', subtitle: '生成复用' }
];

interface StepperProps {
  currentStep: StepId;
  onStepClick: (step: StepId) => void;
  unlockedStepIndex: number;
  processing?: boolean;
}

export function Stepper({ currentStep, onStepClick, unlockedStepIndex, processing }: StepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="border-b border-finance-line bg-white">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-4">
        {steps.map((step, index) => {
          const active = step.id === currentStep;
          const done = index < currentIndex;
          const available = index <= unlockedStepIndex;
          const iconClass = active ? 'text-brand-600' : done ? 'text-emerald-600' : 'text-slate-400';

          return (
            <button
              key={step.id}
              type="button"
              disabled={!available}
              onClick={() => onStepClick(step.id)}
              className={`flex min-w-[172px] items-center gap-3 rounded-md border px-4 py-3 text-left transition ${
                active
                  ? 'border-brand-500 bg-brand-50 shadow-sm'
                  : available
                    ? 'border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50'
                    : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <span className={iconClass}>
                {processing && active ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{step.title}</span>
                <span className="block text-xs text-slate-500">{step.subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
