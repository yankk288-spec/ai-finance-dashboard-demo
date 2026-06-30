import { CheckCircle2, Info, X } from 'lucide-react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  const Icon = toast.tone === 'info' ? Info : CheckCircle2;

  return (
    <div className="fixed right-6 top-6 z-50 flex max-w-md items-start gap-3 rounded-md border border-emerald-200 bg-white p-4 shadow-soft">
      <Icon className="mt-0.5 h-5 w-5 text-emerald-600" />
      <div className="text-sm font-medium text-slate-800">{toast.message}</div>
      <button type="button" onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
