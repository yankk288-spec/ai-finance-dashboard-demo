import { BrainCircuit, ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';
import { StepId } from '../types';
import { Stepper } from './Stepper';

interface LayoutProps {
  currentStep: StepId;
  unlockedStepIndex: number;
  processing?: boolean;
  onStepClick: (step: StepId) => void;
  children: ReactNode;
}

export function Layout({ currentStep, unlockedStepIndex, processing, onStepClick, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-finance-bg">
      <header className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI 财务单据解析与看板生成 Demo</h1>
              <p className="text-xs text-slate-300">低代码财务智能建模工作台</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 md:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            本地 Mock 数据 · 无真实 API Key
          </div>
        </div>
      </header>
      <Stepper
        currentStep={currentStep}
        unlockedStepIndex={unlockedStepIndex}
        processing={processing}
        onStepClick={onStepClick}
      />
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
