import { Database, Edit3, Save } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  onViewSource: () => void;
  onModify: () => void;
  onSaveTemplate: () => void;
}

export function DashboardCard({ title, children, onViewSource, onModify, onSaveTemplate }: DashboardCardProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewSource}
            title="查看数据来源"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Database className="h-3.5 w-3.5" />
            查看数据来源
          </button>
          <button
            type="button"
            onClick={onModify}
            title="修改图表"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Edit3 className="h-3.5 w-3.5" />
            修改图表
          </button>
          <button
            type="button"
            onClick={onSaveTemplate}
            title="保存为模板"
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
          >
            <Save className="h-3.5 w-3.5" />
            保存为模板
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}
