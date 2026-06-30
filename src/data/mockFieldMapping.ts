import { FieldMatchingItem, IntentUnderstanding } from '../types';
import { defaultRequirement } from './mockDocuments';

export const mockIntentUnderstanding: IntentUnderstanding = {
  originalPrompt: defaultRequirement,
  topic: '费用分析',
  timeRange: '本月',
  metrics: ['费用总额', '单据数量', '平均单据金额', '异常大额费用', '费用环比'],
  dimensions: ['部门', '费用类型', '日期', '供应商'],
  recommendedCharts: [
    '指标卡',
    '部门费用柱状图',
    '费用类型占比图',
    '每日费用趋势图',
    '异常费用明细表',
    '低置信度字段提醒表'
  ]
};

export const mockFieldMatching: FieldMatchingItem[] = [
  {
    component: '费用总额',
    requiredFields: ['expense_amount'],
    matchedFields: ['expense_amount'],
    status: '已匹配',
    description: '金额字段置信度高，可生成指标卡。',
    canGenerate: true
  },
  {
    component: '部门费用排行',
    requiredFields: ['department', 'expense_amount'],
    matchedFields: ['department', 'expense_amount'],
    status: '建议确认',
    description: 'department 置信度较低，建议确认后生成。',
    canGenerate: true
  },
  {
    component: '费用类型占比',
    requiredFields: ['expense_category', 'expense_amount'],
    matchedFields: ['expense_category', 'expense_amount'],
    status: '建议确认',
    description: 'expense_category 置信度较低，建议确认后生成。',
    canGenerate: true
  },
  {
    component: '每日费用趋势',
    requiredFields: ['expense_date', 'expense_amount'],
    matchedFields: ['expense_date', 'expense_amount'],
    status: '已匹配',
    description: '日期与金额字段完整，可生成趋势分析。',
    canGenerate: true
  },
  {
    component: '异常费用明细',
    requiredFields: ['vendor', 'department', 'expense_category', 'expense_amount', 'expense_date'],
    matchedFields: ['vendor', 'department', 'expense_category', 'expense_amount', 'expense_date'],
    status: '已匹配',
    description: '可按金额阈值筛选异常大额支出。',
    canGenerate: true
  },
  {
    component: '费用环比分析',
    requiredFields: ['last_month_expense_amount'],
    matchedFields: [],
    status: '字段缺失',
    description: '缺少上月费用数据，暂不生成。',
    canGenerate: false
  }
];

export const platformLineage = ['客户字段', '标准字段', '财务指标', '看板组件'];
