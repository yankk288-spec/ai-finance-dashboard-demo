import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  canPrev: boolean;
  canNext: boolean;
  nextLabel?: string;
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationButtons({ canPrev, canNext, nextLabel = '下一步', onPrev, onNext }: NavigationButtonsProps) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
      <button
        type="button"
        disabled={!canPrev}
        onClick={onPrev}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        上一步
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={onNext}
        className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
