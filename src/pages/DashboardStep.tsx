import { BarChart3, Download, FilePlus2, Presentation, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { DashboardCard } from '../components/DashboardCard';
import { NavigationButtons } from '../components/NavigationButtons';
import { TemplateActions } from '../components/TemplateActions';
import { ChartDefinition, DashboardTable, OutputMode, ScenarioDashboard } from '../types';

interface DashboardStepProps {
  scenarioName: string;
  scenarioDescription: string;
  outputMode: OutputMode;
  dashboard: ScenarioDashboard;
  onOutputModeChange: (mode: OutputMode) => void;
  onToast: (message: string) => void;
  onViewSource: (chartId: string) => void;
  onPrev: () => void;
}

interface PptSlide {
  title: string;
  subtitle: string;
  bullets: string[];
  footnote: string;
}

const palette = ['#2563eb', '#10b981', '#f59e0b', '#64748b', '#06b6d4', '#ef4444', '#8b5cf6'];

function formatNumber(value: unknown) {
  if (typeof value !== 'number') return String(value ?? '');
  if (Math.abs(value) >= 10000) return `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
  return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
}

function metricTone(tone: string) {
  const tones: Record<string, string> = {
    blue: 'border-brand-100 bg-brand-50 text-brand-700',
    green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-amber-100 bg-amber-50 text-amber-700',
    red: 'border-red-100 bg-red-50 text-red-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700'
  };
  return tones[tone] ?? tones.slate;
}

function OutputSwitcher({ outputMode, onOutputModeChange }: { outputMode: OutputMode; onOutputModeChange: (mode: OutputMode) => void }) {
  const modes = [
    { id: 'dashboard' as const, label: '图表看板', icon: BarChart3 },
    { id: 'ppt' as const, label: 'PPT 汇报', icon: Presentation }
  ];

  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = outputMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onOutputModeChange(mode.id)}
            className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${
              active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

function ChartRenderer({ chart }: { chart: ChartDefinition }) {
  if (chart.type === 'pie') {
    const series = chart.series[0];
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chart.data}
            dataKey={series.key}
            nameKey={chart.xKey}
            innerRadius={58}
            outerRadius={102}
            paddingAngle={2}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chart.data.map((entry, index) => (
              <Cell key={String(entry[chart.xKey])} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.data} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatNumber(Number(value))} />
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Legend />
          {chart.series.map((series) => (
            <Line key={series.key} type="monotone" dataKey={series.key} name={series.name} stroke={series.color} strokeWidth={3} dot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chart.data} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatNumber(Number(value))} />
        <Tooltip formatter={(value) => formatNumber(value)} />
        <Legend />
        {chart.series.map((series) => (
          <Bar key={series.key} dataKey={series.key} name={series.name} radius={[4, 4, 0, 0]} fill={series.color}>
            {chart.type === 'waterfall' &&
              chart.data.map((entry, index) => (
                <Cell key={`${series.key}-${index}`} fill={Number(entry[series.key]) >= 0 ? '#2563eb' : '#ef4444'} />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function TableRenderer({ table }: { table: DashboardTable }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {table.columns.map((column) => (
              <th key={column.key} className="px-3 py-2">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.rows.map((row, index) => (
            <tr key={`${table.id}-${index}`}>
              {table.columns.map((column, columnIndex) => (
                <td
                  key={column.key}
                  className={`px-3 py-3 ${columnIndex === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}
                >
                  {String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildPptSlides(scenarioName: string, scenarioDescription: string, dashboard: ScenarioDashboard): PptSlide[] {
  const metricBullets = dashboard.metrics.map((metric) => `${metric.label}：${metric.value}，${metric.helper}`);
  const chartBullets = dashboard.charts.slice(0, 3).map((chart) => `${chart.title}：基于 ${chart.series.map((item) => item.name).join('、')} 展示`);
  const tableBullets = dashboard.tables.slice(0, 2).map((table) => `${table.title}：包含 ${table.rows.length} 条重点记录`);

  return [
    {
      title: `${scenarioName}报告`,
      subtitle: 'AI 生成的财务分析汇报草稿',
      bullets: [scenarioDescription, '输出形式：PPT 汇报', '数据来源：本地虚构 Mock 数据'],
      footnote: '封面页 · 可替换为企业模板'
    },
    {
      title: '管理层摘要',
      subtitle: '核心指标与业务结论',
      bullets: metricBullets.slice(0, 4),
      footnote: '摘要页 · 来自统一看板指标模型'
    },
    {
      title: '关键图表建议',
      subtitle: '把看板组件转换为汇报页结构',
      bullets: chartBullets,
      footnote: '图表页 · 第一阶段为 PPT 预览，后续可生成可编辑 PPTX'
    },
    {
      title: '异常与明细说明',
      subtitle: '沉淀可追溯的业务解释',
      bullets: tableBullets.length > 0 ? tableBullets : ['暂无异常明细，建议保留数据来源页。'],
      footnote: '明细页 · 保留可追溯字段与规则说明'
    },
    {
      title: '字段口径与复用建议',
      subtitle: '用于模板化和跨客户复用',
      bullets: ['单据模板：沉淀同类输入文件识别规则', '字段映射：沉淀客户字段到标准字段的映射', 'PPT 模板：沉淀场景化汇报结构与版式'],
      footnote: '模板页 · 支持后续接入真实 PPT 生成引擎'
    }
  ];
}

function PptPreview({ scenarioName, scenarioDescription, dashboard, onToast }: { scenarioName: string; scenarioDescription: string; dashboard: ScenarioDashboard; onToast: (message: string) => void }) {
  const slides = useMemo(() => buildPptSlides(scenarioName, scenarioDescription, dashboard), [scenarioName, scenarioDescription, dashboard]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">PPT 汇报预览</h3>
            <p className="mt-1 text-sm text-slate-500">第一阶段展示汇报结构、页序和内容草稿，后续可接入真实 PPTX 生成。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToast('PPT 汇报已生成预览，后续可接入真实 PPTX 生成引擎。')}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <FilePlus2 className="h-4 w-4" />
              生成 PPT
            </button>
            <button
              type="button"
              onClick={() => onToast('下载 PPT 功能已预留，下一阶段可生成可编辑 .pptx 文件。')}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              下载 PPT
            </button>
            <button
              type="button"
              onClick={() => onToast('PPT 模板已保存，可复用于同类财务汇报。')}
              className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
            >
              <Save className="h-4 w-4" />
              保存为 PPT 模板
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-full rounded-md border p-3 text-left transition ${
                activeIndex === index ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Slide {index + 1}</span>
                <Presentation className="h-4 w-4" />
              </div>
              <div className="text-sm font-semibold text-slate-900">{slide.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-slate-500">{slide.subtitle}</div>
            </button>
          ))}
        </aside>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="aspect-video rounded-md border border-slate-200 bg-slate-950 p-8 text-white shadow-inner">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-5 inline-flex rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {scenarioName}
                </div>
                <h3 className="max-w-3xl text-4xl font-semibold leading-tight">{activeSlide.title}</h3>
                <p className="mt-3 max-w-2xl text-lg text-slate-300">{activeSlide.subtitle}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {activeSlide.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-md border border-white/10 bg-white/10 p-4 text-sm leading-6 text-slate-100">
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>{activeSlide.footnote}</span>
                <span>{activeIndex + 1} / {slides.length}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function DashboardStep({ scenarioName, scenarioDescription, outputMode, dashboard, onOutputModeChange, onToast, onViewSource, onPrev }: DashboardStepProps) {
  const chartActionToast = (action: string) => {
    onToast(`${action}：已进入低代码配置模式，本 Demo 使用模拟提示。`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{outputMode === 'ppt' ? 'PPT 汇报' : '财务看板'} · {scenarioName}</h2>
          <p className="mt-2 text-sm text-slate-600">{scenarioDescription}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <OutputSwitcher outputMode={outputMode} onOutputModeChange={onOutputModeChange} />
          {outputMode === 'dashboard' && <TemplateActions onToast={onToast} />}
        </div>
      </div>

      {outputMode === 'ppt' ? (
        <PptPreview scenarioName={scenarioName} scenarioDescription={scenarioDescription} dashboard={dashboard} onToast={onToast} />
      ) : (
        <>
          <DashboardCard
            title="核心指标"
            onViewSource={() => onViewSource('metrics')}
            onModify={() => chartActionToast('修改核心指标')}
            onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
          >
            <div className="grid gap-4 md:grid-cols-4">
              {dashboard.metrics.map((metric) => (
                <div key={metric.label} className={`rounded-md border p-4 ${metricTone(metric.tone)}`}>
                  <div className="text-sm font-semibold">{metric.label}</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">{metric.value}</div>
                  <div className="mt-2 text-xs text-slate-500">{metric.helper}</div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <div className="grid gap-6 lg:grid-cols-2">
            {dashboard.charts.map((chart) => (
              <DashboardCard
                key={chart.id}
                title={chart.title}
                onViewSource={() => onViewSource(chart.id)}
                onModify={() => chartActionToast(`修改${chart.title}`)}
                onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
              >
                <div className="h-80">
                  <ChartRenderer chart={chart} />
                </div>
              </DashboardCard>
            ))}

            {dashboard.tables.map((table) => (
              <DashboardCard
                key={table.id}
                title={table.title}
                onViewSource={() => onViewSource(table.id)}
                onModify={() => chartActionToast(`修改${table.title}`)}
                onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
              >
                <TableRenderer table={table} />
              </DashboardCard>
            ))}
          </div>
        </>
      )}

      <NavigationButtons canPrev canNext={false} nextLabel="已完成" onPrev={onPrev} onNext={() => undefined} />
    </div>
  );
}
