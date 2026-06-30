import { X } from 'lucide-react';
import { ChartSource } from '../types';

interface SourceModalProps {
  source: ChartSource | null;
  onClose: () => void;
}

export function SourceModal({ source, onClose }: SourceModalProps) {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-2xl rounded-md bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="font-semibold text-slate-900">{source.title} · 数据来源</h3>
            <p className="mt-1 text-sm text-slate-500">{source.explanation}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">字段</th>
                <th className="px-3 py-2">客户字段</th>
                <th className="px-3 py-2">标准字段</th>
                <th className="px-3 py-2">用途</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {source.sourceFields.map((field) => (
                <tr key={`${field.standardField}-${field.usage}`}>
                  <td className="px-3 py-3 font-medium text-slate-900">{field.label}</td>
                  <td className="px-3 py-3 text-slate-600">{field.customerField}</td>
                  <td className="px-3 py-3 font-mono text-xs text-brand-700">{field.standardField}</td>
                  <td className="px-3 py-3 text-slate-600">{field.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
