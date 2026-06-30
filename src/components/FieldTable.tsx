import { Check, Pencil, TriangleAlert } from 'lucide-react';
import { ParsedField } from '../types';

interface FieldTableProps {
  fields: ParsedField[];
  onFieldChange: (fieldId: string, value: string) => void;
}

function statusClass(status: ParsedField['status']) {
  if (status === '已确认') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === '建议确认') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === '异常') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export function FieldTable({ fields, onFieldChange }: FieldTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">原始字段名</th>
            <th className="px-4 py-3">标准字段名</th>
            <th className="px-4 py-3">识别值</th>
            <th className="px-4 py-3">置信度</th>
            <th className="px-4 py-3">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {fields.map((field) => {
            const lowConfidence = field.confidence < 85;
            const needsAttention = lowConfidence && field.status !== '已确认';
            return (
              <tr key={field.id} className={needsAttention ? 'bg-amber-50/60' : 'bg-white'}>
                <td className="px-4 py-3 font-medium text-slate-900">{field.originalName}</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-700">{field.standardName}</td>
                <td className="px-4 py-3">
                  {lowConfidence ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={field.value}
                        onChange={(event) => onFieldChange(field.id, event.target.value)}
                        className="w-full rounded-md border border-amber-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      />
                      <Pencil className="h-4 w-4 text-amber-600" />
                    </div>
                  ) : (
                    <span className="text-slate-800">{field.value}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${needsAttention ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${field.confidence}%` }}
                      />
                    </div>
                    <span className="font-semibold text-slate-700">{field.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold ${statusClass(
                      field.status
                    )}`}
                  >
                    {field.status === '建议确认' ? <TriangleAlert className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    {field.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
