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
import { ExpenseRecord } from '../types';

interface DashboardStepProps {
  records: ExpenseRecord[];
  onToast: (message: string) => void;
  onViewSource: (chartId: string) => void;
  onPrev: () => void;
}

const palette = ['#2563eb', '#10b981', '#f59e0b', '#64748b', '#06b6d4', '#ef4444', '#8b5cf6'];

function formatCurrency(value: number) {
  return `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
}

function sumBy(records: ExpenseRecord[], key: 'department' | 'expense_category') {
  const result = records.reduce<Record<string, number>>((acc, record) => {
    acc[record[key]] = (acc[record[key]] ?? 0) + record.expense_amount;
    return acc;
  }, {});

  return Object.entries(result)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function DashboardStep({ records, onToast, onViewSource, onPrev }: DashboardStepProps) {
  const total = records.reduce((sum, record) => sum + record.expense_amount, 0);
  const abnormal = records.filter((record) => record.expense_amount >= 15000);
  const lowConfidence = records.filter((record) => record.confidence < 85);
  const departmentRankData = sumBy(records, 'department');
  const categoryShareData = sumBy(records, 'expense_category');
  const dailyTrendData = records.map((record) => ({
    date: record.expense_date.slice(5),
    amount: record.expense_amount
  }));

  const metricCards = [
    { label: '本月费用总额', value: formatCurrency(total), helper: '来自虚构单据包', tone: 'text-brand-700 bg-brand-50' },
    { label: '单据数量', value: String(records.length), helper: '覆盖报销单、发票、流水', tone: 'text-slate-700 bg-slate-50' },
    {
      label: '平均单据金额',
      value: formatCurrency(total / records.length),
      helper: '自动聚合 expense_amount',
      tone: 'text-emerald-700 bg-emerald-50'
    },
    { label: '异常费用数量', value: String(abnormal.length), helper: '金额 >= ¥15,000', tone: 'text-amber-700 bg-amber-50' }
  ];

  const chartActionToast = (action: string) => {
    onToast(`${action}：已进入低代码配置模式，本 Demo 使用模拟提示。`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">财务看板</h2>
          <p className="mt-2 text-sm text-slate-600">聚焦费用分析场景，所有指标与图表均可追溯到标准字段。</p>
        </div>
        <TemplateActions onToast={onToast} />
      </div>

      <DashboardCard
        title="核心指标"
        onViewSource={() => onViewSource('metrics')}
        onModify={() => chartActionToast('修改指标卡')}
        onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
      >
        <div className="grid gap-4 md:grid-cols-4">
          {metricCards.map((metric) => (
            <div key={metric.label} className={`rounded-md border border-slate-200 p-4 ${metric.tone}`}>
              <div className="text-sm font-semibold">{metric.label}</div>
              <div className="mt-3 text-2xl font-semibold text-slate-950">{metric.value}</div>
              <div className="mt-2 text-xs text-slate-500">{metric.helper}</div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard
          title="部门费用排行"
          onViewSource={() => onViewSource('department')}
          onModify={() => chartActionToast('修改部门费用排行')}
          onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRankData} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 10000}万`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" name="费用金额" radius={[4, 4, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard
          title="费用类型占比"
          onViewSource={() => onViewSource('category')}
          onModify={() => chartActionToast('修改费用类型占比')}
          onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShareData}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={102}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryShareData.map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="每日费用趋势"
        onViewSource={() => onViewSource('trend')}
        onModify={() => chartActionToast('修改每日费用趋势')}
        onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrendData} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 10000}万`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="amount" name="费用金额" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard
          title="异常费用明细表"
          onViewSource={() => onViewSource('abnormal')}
          onModify={() => chartActionToast('修改异常费用明细表')}
          onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">供应商</th>
                  <th className="px-3 py-2">部门</th>
                  <th className="px-3 py-2">费用类型</th>
                  <th className="px-3 py-2">金额</th>
                  <th className="px-3 py-2">日期</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {abnormal.map((record) => (
                  <tr key={record.id}>
                    <td className="px-3 py-3 font-medium text-slate-900">{record.vendor}</td>
                    <td className="px-3 py-3 text-slate-600">{record.department}</td>
                    <td className="px-3 py-3 text-slate-600">{record.expense_category}</td>
                    <td className="px-3 py-3 font-semibold text-amber-700">{formatCurrency(record.expense_amount)}</td>
                    <td className="px-3 py-3 text-slate-600">{record.expense_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard
          title="低置信度字段提醒"
          onViewSource={() => onViewSource('confidence')}
          onModify={() => chartActionToast('修改提醒规则')}
          onSaveTemplate={() => onToast('看板模板已保存，可复用于其他客户。')}
        >
          <div className="space-y-3">
            {lowConfidence.map((record) => (
              <div key={record.id} className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{record.id}</div>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-amber-700">
                    {record.confidence}% 置信度
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {record.department} · {record.expense_category} · {formatCurrency(record.expense_amount)}
                </div>
                <div className="mt-1 text-xs text-slate-500">建议复核 department、expense_category 等字段。</div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <NavigationButtons canPrev canNext={false} nextLabel="已完成" onPrev={onPrev} onNext={() => undefined} />
    </div>
  );
}
