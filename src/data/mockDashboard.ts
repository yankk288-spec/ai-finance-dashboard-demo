import { ChartSource, DashboardMetric } from '../types';
import { mockExpenseRecords } from './mockDocuments';

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: '本月费用总额',
    value: '¥142,870',
    helper: '来自 10 张虚构单据',
    tone: 'blue'
  },
  {
    label: '单据数量',
    value: '10',
    helper: '费用报销单 / 发票 / 流水',
    tone: 'slate'
  },
  {
    label: '平均单据金额',
    value: '¥14,287',
    helper: '高于平台建议阈值 18%',
    tone: 'green'
  },
  {
    label: '异常费用数量',
    value: '5',
    helper: '金额 >= ¥15,000',
    tone: 'orange'
  }
];

const sumBy = (key: 'department' | 'expense_category') => {
  const result = mockExpenseRecords.reduce<Record<string, number>>((acc, record) => {
    acc[record[key]] = (acc[record[key]] ?? 0) + record.expense_amount;
    return acc;
  }, {});

  return Object.entries(result)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const departmentRankData = sumBy('department');

export const categoryShareData = sumBy('expense_category');

export const dailyTrendData = mockExpenseRecords.map((record) => ({
  date: record.expense_date.slice(5),
  amount: record.expense_amount
}));

export const abnormalExpenses = mockExpenseRecords.filter((record) => record.expense_amount >= 15000);

export const lowConfidenceRecords = mockExpenseRecords.filter((record) => record.confidence < 85);

export const chartSources: ChartSource[] = [
  {
    chartId: 'metrics',
    title: '指标卡',
    explanation: '指标卡由标准金额字段聚合，并结合单据数量与异常金额阈值计算。',
    sourceFields: [
      {
        label: '报销金额',
        customerField: '报销金额',
        standardField: 'expense_amount',
        usage: '费用总额、平均金额、异常金额判断'
      },
      {
        label: '单据类型',
        customerField: '单据类型识别',
        standardField: 'document_type',
        usage: '单据数量与来源说明'
      }
    ]
  },
  {
    chartId: 'department',
    title: '部门费用排行',
    explanation: '按部门维度汇总报销金额，低置信度部门会在提醒表中同步出现。',
    sourceFields: [
      {
        label: '部门',
        customerField: '部门',
        standardField: 'department',
        usage: '柱状图维度'
      },
      {
        label: '报销金额',
        customerField: '报销金额',
        standardField: 'expense_amount',
        usage: '柱状图度量'
      }
    ]
  },
  {
    chartId: 'category',
    title: '费用类型占比',
    explanation: '按费用类型聚合金额并计算各类型占比。',
    sourceFields: [
      {
        label: '费用类型',
        customerField: '费用类型',
        standardField: 'expense_category',
        usage: '饼图分类'
      },
      {
        label: '报销金额',
        customerField: '报销金额',
        standardField: 'expense_amount',
        usage: '饼图数值'
      }
    ]
  },
  {
    chartId: 'trend',
    title: '每日费用趋势',
    explanation: '按报销日期展示每日费用发生趋势。',
    sourceFields: [
      {
        label: '报销日期',
        customerField: '报销日期',
        standardField: 'expense_date',
        usage: '折线图时间轴'
      },
      {
        label: '报销金额',
        customerField: '报销金额',
        standardField: 'expense_amount',
        usage: '折线图数值'
      }
    ]
  },
  {
    chartId: 'abnormal',
    title: '异常费用明细表',
    explanation: '按金额阈值筛选异常支出，并展示供应商、部门、类型与日期。',
    sourceFields: [
      {
        label: '供应商',
        customerField: '供应商',
        standardField: 'vendor',
        usage: '异常明细展示'
      },
      {
        label: '付款状态',
        customerField: '付款状态',
        standardField: 'payment_status',
        usage: '付款风险辅助判断'
      }
    ]
  },
  {
    chartId: 'confidence',
    title: '低置信度字段提醒',
    explanation: '聚合 OCR 与文档理解置信度低于 85% 的字段和单据。',
    sourceFields: [
      {
        label: '置信度',
        customerField: '字段识别置信度',
        standardField: 'confidence',
        usage: '人工确认提醒'
      }
    ]
  }
];
