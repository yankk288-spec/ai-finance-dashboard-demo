import { CheckCircle2, CircleSlash, TriangleAlert } from 'lucide-react';
import { FieldMatchingItem } from '../types';

interface FieldMatchingTableProps {
  items: FieldMatchingItem[];
}

export function FieldMatchingTable({ items }: FieldMatchingTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">看板组件</th>
            <th className="px-4 py-3">需要字段</th>
            <th className="px-4 py-3">已匹配字段</th>
            <th className="px-4 py-3">匹配状态</th>
            <th className="px-4 py-3">说明</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const missing = item.status === '字段缺失';
            const warning = item.status === '建议确认';
            return (
              <tr key={item.component} className={missing ? 'bg-red-50/50' : warning ? 'bg-amber-50/50' : 'bg-white'}>
                <td className="px-4 py-3 font-semibold text-slate-900">{item.component}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.requiredFields.map((field) => (
                      <span key={field} className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                        {field}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.matchedFields.length > 0 ? (
                      item.matchedFields.map((field) => (
                        <span key={field} className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs text-brand-700">
                          {field}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">暂无</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold ${
                      missing
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : warning
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {missing ? (
                      <CircleSlash className="h-3.5 w-3.5" />
                    ) : warning ? (
                      <TriangleAlert className="h-3.5 w-3.5" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{item.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
