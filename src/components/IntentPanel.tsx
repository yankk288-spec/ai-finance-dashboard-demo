import { BarChart3, CalendarClock, Gauge, Tags } from 'lucide-react';
import { IntentUnderstanding } from '../types';

interface IntentPanelProps {
  intent: IntentUnderstanding;
}

export function IntentPanel({ intent }: IntentPanelProps) {
  const groups = [
    { title: '指标', icon: Gauge, items: intent.metrics },
    { title: '分析维度', icon: Tags, items: intent.dimensions },
    { title: '推荐图表', icon: BarChart3, items: intent.recommendedCharts }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-slate-900">看板需求理解</h2>
        <p className="mt-2 text-sm text-slate-600">AI 先拆解业务意图，再决定应该生成哪些指标、维度和图表。</p>
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 text-xs font-semibold text-slate-500">用户原始需求</div>
          <p className="text-sm leading-6 text-slate-800">{intent.originalPrompt}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-brand-100 bg-brand-50 p-4">
            <div className="text-xs font-semibold text-brand-700">看板主题</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{intent.topic}</div>
          </div>
          <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CalendarClock className="h-4 w-4" />
              时间范围
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{intent.timeRange}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-brand-600" />
                <h3 className="font-semibold text-slate-900">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
