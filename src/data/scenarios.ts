import { ChartSource, ExpenseRecord, ParsedField, ScenarioConfig, ScenarioDashboard } from '../types';

const money = (value: number) => `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;

const fieldValue = (fields: ParsedField[], id: string, fallback: string) =>
  fields.find((field) => field.id === id)?.value || fallback;

const source = (chartId: string, title: string, explanation: string, fields: string[]): ChartSource => ({
  chartId,
  title,
  explanation,
  sourceFields: fields.map((field) => ({
    label: field,
    customerField: field,
    standardField: field,
    usage: `${title} 的字段来源`
  }))
});

const sumBy = <T>(records: T[], groupKey: keyof T, valueKey: keyof T) => {
  const result = records.reduce<Record<string, number>>((acc, record) => {
    const name = String(record[groupKey]);
    acc[name] = (acc[name] ?? 0) + Number(record[valueKey]);
    return acc;
  }, {});
  return Object.entries(result).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
};

const expenseRecords: ExpenseRecord[] = [
  { id: 'EXP-001', expense_date: '2026-06-01', department: '市场部', expense_category: '差旅交通', expense_amount: 12860, vendor: '上海云翼会务服务有限公司', tax_amount: 728.3, payment_status: '待付款', confidence: 82, document_type: '费用报销单' },
  { id: 'EXP-002', expense_date: '2026-06-03', department: '研发部', expense_category: '云服务', expense_amount: 18600, vendor: '杭州星河云计算有限公司', tax_amount: 1116, payment_status: '已付款', confidence: 93, document_type: '费用发票' },
  { id: 'EXP-003', expense_date: '2026-06-05', department: '销售部', expense_category: '客户招待', expense_amount: 7420, vendor: '北京融汇餐饮管理有限公司', tax_amount: 420, payment_status: '已付款', confidence: 88, document_type: '费用发票' },
  { id: 'EXP-004', expense_date: '2026-06-08', department: '财务部', expense_category: '办公采购', expense_amount: 3680, vendor: '深圳联采办公用品有限公司', tax_amount: 208.3, payment_status: '已付款', confidence: 92, document_type: '费用发票' },
  { id: 'EXP-005', expense_date: '2026-06-11', department: '研发部', expense_category: '测试设备', expense_amount: 21450, vendor: '苏州明测电子科技有限公司', tax_amount: 1287, payment_status: '待付款', confidence: 90, document_type: '费用发票' },
  { id: 'EXP-006', expense_date: '2026-06-14', department: '市场部', expense_category: '市场活动', expense_amount: 15680, vendor: '广州启幕活动策划有限公司', tax_amount: 940.8, payment_status: '已付款', confidence: 84, document_type: '费用报销单' },
  { id: 'EXP-007', expense_date: '2026-06-18', department: '销售部', expense_category: '差旅交通', expense_amount: 9360, vendor: '上海云翼会务服务有限公司', tax_amount: 530.2, payment_status: '待付款', confidence: 79, document_type: '费用报销单' },
  { id: 'EXP-008', expense_date: '2026-06-22', department: '行政部', expense_category: '租赁物业', expense_amount: 24600, vendor: '北京恒泰物业服务有限公司', tax_amount: 1476, payment_status: '已付款', confidence: 95, document_type: '银行流水' },
  { id: 'EXP-009', expense_date: '2026-06-25', department: '研发部', expense_category: '云服务', expense_amount: 11980, vendor: '杭州星河云计算有限公司', tax_amount: 718.8, payment_status: '已付款', confidence: 91, document_type: '费用发票' },
  { id: 'EXP-010', expense_date: '2026-06-28', department: '市场部', expense_category: '广告投放', expense_amount: 17240, vendor: '上海数境广告有限公司', tax_amount: 1034.4, payment_status: '待付款', confidence: 87, document_type: '费用发票' }
];

const buildExpenseDashboard = (fields: ParsedField[]): ScenarioDashboard => {
  const department = fieldValue(fields, 'department', '市场部');
  const category = fieldValue(fields, 'expense_category', '差旅交通');
  const records = expenseRecords.map((record, index) => (index === 0 ? { ...record, department, expense_category: category } : record));
  const total = records.reduce((sum, record) => sum + record.expense_amount, 0);
  const abnormal = records.filter((record) => record.expense_amount >= 15000);
  const lowConfidence = records.filter((record) => record.confidence < 85);

  return {
    metrics: [
      { label: '本月费用总额', value: money(total), helper: '来自 10 张虚构单据', tone: 'blue' },
      { label: '单据数量', value: String(records.length), helper: '费用报销单 / 发票 / 流水', tone: 'slate' },
      { label: '平均单据金额', value: money(total / records.length), helper: '自动聚合 expense_amount', tone: 'green' },
      { label: '异常费用数量', value: String(abnormal.length), helper: '金额 >= ¥15,000', tone: 'orange' }
    ],
    charts: [
      { id: 'department', title: '部门费用排行', type: 'bar', xKey: 'name', data: sumBy(records, 'department', 'expense_amount'), series: [{ key: 'amount', name: '费用金额', color: '#2563eb' }] },
      { id: 'category', title: '费用类型占比', type: 'pie', xKey: 'name', data: sumBy(records, 'expense_category', 'expense_amount'), series: [{ key: 'amount', name: '费用金额', color: '#10b981' }] },
      { id: 'trend', title: '每日费用趋势', type: 'line', xKey: 'name', data: records.map((record) => ({ name: record.expense_date.slice(5), amount: record.expense_amount })), series: [{ key: 'amount', name: '费用金额', color: '#10b981' }] }
    ],
    tables: [
      { id: 'abnormal', title: '异常费用明细表', columns: [{ key: 'vendor', label: '供应商' }, { key: 'department', label: '部门' }, { key: 'expense_category', label: '费用类型' }, { key: 'amount', label: '金额' }, { key: 'date', label: '日期' }], rows: abnormal.map((record) => ({ vendor: record.vendor, department: record.department, expense_category: record.expense_category, amount: money(record.expense_amount), date: record.expense_date })) },
      { id: 'confidence', title: '低置信度字段提醒', columns: [{ key: 'id', label: '单据' }, { key: 'field', label: '建议复核字段' }, { key: 'value', label: '识别值' }, { key: 'confidence', label: '置信度' }], rows: lowConfidence.map((record) => ({ id: record.id, field: 'department / expense_category', value: `${record.department} / ${record.expense_category}`, confidence: `${record.confidence}%` })) }
    ]
  };
};

const pnlData = [
  { name: '1月', revenue: 7200000, cogs: 4020000, opex: 1810000, net_profit: 910000, budget: 980000 },
  { name: '2月', revenue: 7600000, cogs: 4210000, opex: 1880000, net_profit: 1040000, budget: 1020000 },
  { name: '3月', revenue: 8200000, cogs: 4490000, opex: 1970000, net_profit: 1230000, budget: 1180000 },
  { name: '4月', revenue: 7900000, cogs: 4380000, opex: 2060000, net_profit: 1010000, budget: 1210000 },
  { name: '5月', revenue: 8450000, cogs: 4630000, opex: 2090000, net_profit: 1280000, budget: 1260000 },
  { name: '6月', revenue: 8800000, cogs: 4840000, opex: 2180000, net_profit: 1360000, budget: 1320000 }
];

const buildPnlDashboard = (fields: ParsedField[]): ScenarioDashboard => {
  const department = fieldValue(fields, 'department', '华东销售中心');
  const latest = pnlData[pnlData.length - 1];
  const grossProfit = latest.revenue - latest.cogs;
  const contribution = [
    { name: department, actual: 1360000, budget: 1320000 },
    { name: '华北销售中心', actual: 980000, budget: 1080000 },
    { name: '线上业务部', actual: 1220000, budget: 1150000 },
    { name: '企业服务部', actual: 760000, budget: 830000 }
  ];

  return {
    metrics: [
      { label: '营业收入', value: money(latest.revenue), helper: '本月收入科目汇总', tone: 'blue' },
      { label: '毛利额', value: money(grossProfit), helper: `毛利率 ${(grossProfit / latest.revenue * 100).toFixed(1)}%`, tone: 'green' },
      { label: '期间费用', value: money(latest.opex), helper: '销售 / 管理 / 研发费用', tone: 'orange' },
      { label: '净利润', value: money(latest.net_profit), helper: `较预算 ${money(latest.net_profit - latest.budget)}`, tone: 'slate' }
    ],
    charts: [
      { id: 'pnl-waterfall', title: 'P&L 分层瀑布图', type: 'waterfall', xKey: 'name', data: [{ name: '营业收入', amount: latest.revenue }, { name: '主营成本', amount: -latest.cogs }, { name: '期间费用', amount: -latest.opex }, { name: '其他损益', amount: -420000 }, { name: '净利润', amount: latest.net_profit }], series: [{ key: 'amount', name: '金额', color: '#2563eb' }] },
      { id: 'pnl-trend', title: '收入成本费用趋势', type: 'line', xKey: 'name', data: pnlData, series: [{ key: 'revenue', name: '收入', color: '#2563eb' }, { key: 'cogs', name: '成本', color: '#f59e0b' }, { key: 'opex', name: '费用', color: '#ef4444' }, { key: 'net_profit', name: '净利润', color: '#10b981' }] },
      { id: 'pnl-budget', title: '部门利润实际 vs 预算', type: 'bar', xKey: 'name', data: contribution, series: [{ key: 'actual', name: '实际利润', color: '#2563eb' }, { key: 'budget', name: '预算利润', color: '#94a3b8' }] }
    ],
    tables: [
      { id: 'pnl-anomaly', title: '异常科目波动提醒', columns: [{ key: 'account', label: '科目' }, { key: 'variance', label: '波动' }, { key: 'reason', label: '解释' }, { key: 'action', label: '建议动作' }], rows: [{ account: '销售费用-市场推广', variance: '+18.6%', reason: '6 月线下活动集中投放', action: '复核活动预算归集口径' }, { account: '主营业务成本-云资源', variance: '+12.4%', reason: '企业客户交付资源扩容', action: '联动项目毛利复盘' }, { account: '管理费用-外包服务', variance: '-9.1%', reason: '部分费用延后入账', action: '检查暂估和跨期' }] }
    ]
  };
};

const p2pPayments = [
  { id: 'PAY-001', vendor: '杭州星河云计算有限公司', amount: 186000, anomaly: '重复付款疑似', risk: 92, status: '高风险', po: 'PO-202606-018', invoice: 'INV-8842', match: '金额重复' },
  { id: 'PAY-002', vendor: '苏州明测电子科技有限公司', amount: 214500, anomaly: '超 PO 金额', risk: 88, status: '高风险', po: 'PO-202606-026', invoice: 'INV-9021', match: '超 PO 14%' },
  { id: 'PAY-003', vendor: '广州启幕活动策划有限公司', amount: 156800, anomaly: '无合同付款', risk: 81, status: '中风险', po: 'PO-202606-031', invoice: 'INV-9108', match: '合同缺失' },
  { id: 'PAY-004', vendor: '北京恒泰物业服务有限公司', amount: 246000, anomaly: '提前付款', risk: 76, status: '中风险', po: 'PO-202606-044', invoice: 'INV-9210', match: '提前 12 天' },
  { id: 'PAY-005', vendor: '上海数境广告有限公司', amount: 172400, anomaly: '银行账户变更', risk: 84, status: '中风险', po: 'PO-202606-047', invoice: 'INV-9336', match: '付款前 3 天变更' }
];

const buildP2pDashboard = (fields: ParsedField[]): ScenarioDashboard => {
  const vendor = fieldValue(fields, 'vendor_name', '杭州星河云计算有限公司');
  const records = p2pPayments.map((record, index) => (index === 0 ? { ...record, vendor } : record));
  const total = records.reduce((sum, record) => sum + record.amount, 0);
  const highRisk = records.filter((record) => record.risk >= 85);
  const anomalyData = sumBy(records.map((record) => ({ name: record.anomaly, amount: record.amount })), 'name', 'amount');

  return {
    metrics: [
      { label: '付款总额', value: money(total), helper: '本月 P2P 付款样本', tone: 'blue' },
      { label: '异常付款金额', value: money(total), helper: '命中至少一条风险规则', tone: 'red' },
      { label: '异常单据数', value: String(records.length), helper: '重复 / 超额 / 无合同 / 提前', tone: 'orange' },
      { label: '高风险供应商', value: String(highRisk.length), helper: '风险评分 >= 85', tone: 'slate' }
    ],
    charts: [
      { id: 'p2p-anomaly', title: '异常类型分布', type: 'pie', xKey: 'name', data: anomalyData, series: [{ key: 'amount', name: '异常金额', color: '#ef4444' }] },
      { id: 'p2p-risk', title: '供应商风险评分', type: 'bar', xKey: 'vendor', data: records, series: [{ key: 'risk', name: '风险评分', color: '#f59e0b' }] },
      { id: 'p2p-trend', title: '异常付款金额趋势', type: 'line', xKey: 'name', data: [{ name: '第1周', amount: 168000 }, { name: '第2周', amount: 214500 }, { name: '第3周', amount: 246000 }, { name: '第4周', amount: 347200 }], series: [{ key: 'amount', name: '异常金额', color: '#ef4444' }] }
    ],
    tables: [
      { id: 'p2p-detail', title: '高风险付款明细', columns: [{ key: 'id', label: '付款单' }, { key: 'vendor', label: '供应商' }, { key: 'amount', label: '付款金额' }, { key: 'anomaly', label: '异常类型' }, { key: 'status', label: '风险等级' }], rows: records.map((record) => ({ id: record.id, vendor: record.vendor, amount: money(record.amount), anomaly: record.anomaly, status: record.status })) },
      { id: 'p2p-match', title: 'PO-发票-付款三单匹配结果', columns: [{ key: 'po', label: 'PO' }, { key: 'invoice', label: '发票' }, { key: 'payment', label: '付款单' }, { key: 'match', label: '匹配结论' }], rows: records.map((record) => ({ po: record.po, invoice: record.invoice, payment: record.id, match: record.match })) }
    ]
  };
};

export const scenarios: ScenarioConfig[] = [
  {
    id: 'expense',
    name: '费用分析',
    shortName: '费用分析',
    description: '围绕部门、费用类型、日期和异常支出生成费用分析看板。',
    uploadHint: '未上传真实文件时，系统会使用虚构的“2026 年 6 月费用单据包”作为演示输入。',
    defaultPrompt: '请帮我生成一个本月费用分析看板，展示部门费用、费用类型占比、每日费用趋势、异常大额支出，以及低置信度字段提醒。',
    parsingResult: {
      documentType: '费用报销单 + 费用发票',
      typeConfidence: 96,
      fields: [
        { id: 'expense_date', originalName: '报销日期', standardName: 'expense_date', value: '2026-06-18', confidence: 94, status: '通过' },
        { id: 'department', originalName: '部门', standardName: 'department', value: '市场部', confidence: 82, status: '建议确认' },
        { id: 'expense_category', originalName: '费用类型', standardName: 'expense_category', value: '差旅交通', confidence: 79, status: '建议确认' },
        { id: 'expense_amount', originalName: '报销金额', standardName: 'expense_amount', value: '12860.00', confidence: 97, status: '通过' },
        { id: 'vendor', originalName: '供应商', standardName: 'vendor', value: '上海云翼会务服务有限公司', confidence: 88, status: '通过' },
        { id: 'tax_amount', originalName: '税额', standardName: 'tax_amount', value: '728.30', confidence: 91, status: '通过' },
        { id: 'payment_status', originalName: '付款状态', standardName: 'payment_status', value: '待付款', confidence: 86, status: '通过' }
      ],
      computedFields: [
        { label: '月份', standardName: 'month', value: '2026-06', formula: 'expense_date 截取年月' },
        { label: '是否大额费用', standardName: 'is_large_expense', value: '是', formula: 'expense_amount >= 10000' },
        { label: '不含税金额', standardName: 'amount_without_tax', value: '12131.70', formula: 'expense_amount - tax_amount' },
        { label: '税额占比', standardName: 'tax_ratio', value: '5.66%', formula: 'tax_amount / expense_amount' }
      ]
    },
    intentUnderstanding: {
      originalPrompt: '',
      topic: '费用分析',
      timeRange: '本月',
      metrics: ['费用总额', '单据数量', '平均单据金额', '异常大额费用', '费用环比'],
      dimensions: ['部门', '费用类型', '日期', '供应商'],
      recommendedCharts: ['指标卡', '部门费用柱状图', '费用类型占比图', '每日费用趋势图', '异常费用明细表', '低置信度字段提醒表']
    },
    fieldMatching: [
      { component: '费用总额', requiredFields: ['expense_amount'], matchedFields: ['expense_amount'], status: '已匹配', description: '金额字段置信度高，可生成指标卡。', canGenerate: true },
      { component: '部门费用排行', requiredFields: ['department', 'expense_amount'], matchedFields: ['department', 'expense_amount'], status: '建议确认', description: 'department 置信度较低，建议确认后生成。', canGenerate: true },
      { component: '费用类型占比', requiredFields: ['expense_category', 'expense_amount'], matchedFields: ['expense_category', 'expense_amount'], status: '建议确认', description: 'expense_category 置信度较低，建议确认后生成。', canGenerate: true },
      { component: '每日费用趋势', requiredFields: ['expense_date', 'expense_amount'], matchedFields: ['expense_date', 'expense_amount'], status: '已匹配', description: '日期与金额字段完整，可生成趋势分析。', canGenerate: true },
      { component: '异常费用明细', requiredFields: ['vendor', 'department', 'expense_category', 'expense_amount', 'expense_date'], matchedFields: ['vendor', 'department', 'expense_category', 'expense_amount', 'expense_date'], status: '已匹配', description: '可按金额阈值筛选异常大额支出。', canGenerate: true },
      { component: '费用环比分析', requiredFields: ['last_month_expense_amount'], matchedFields: [], status: '字段缺失', description: '缺少上月费用数据，暂不生成。', canGenerate: false }
    ],
    chartSources: [
      source('metrics', '核心指标', '指标卡由标准金额字段聚合，并结合单据数量与异常金额阈值计算。', ['expense_amount', 'document_type']),
      source('department', '部门费用排行', '按部门维度汇总报销金额。', ['department', 'expense_amount']),
      source('category', '费用类型占比', '按费用类型聚合金额并计算占比。', ['expense_category', 'expense_amount']),
      source('trend', '每日费用趋势', '按报销日期展示每日费用发生趋势。', ['expense_date', 'expense_amount']),
      source('abnormal', '异常费用明细表', '按金额阈值筛选异常支出。', ['vendor', 'department', 'expense_category', 'expense_amount', 'expense_date']),
      source('confidence', '低置信度字段提醒', '展示置信度低于 85% 的字段。', ['confidence', 'department', 'expense_category'])
    ],
    buildDashboard: buildExpenseDashboard
  },
  {
    id: 'pnl',
    name: 'P&L 利润损益分析',
    shortName: 'P&L',
    description: '围绕收入、成本、费用、毛利和净利润生成经营结果分析看板。',
    uploadHint: '未上传真实文件时，系统会使用虚构的“2026 年上半年 P&L 科目明细包”作为演示输入。',
    defaultPrompt: '请帮我生成本月 P&L 利润损益分析看板，展示收入、成本、毛利、期间费用、净利润、预算差异、部门利润贡献和异常科目波动。',
    parsingResult: {
      documentType: '科目余额表 + 管理报表',
      typeConfidence: 94,
      fields: [
        { id: 'period', originalName: '期间', standardName: 'period', value: '2026-06', confidence: 97, status: '通过' },
        { id: 'account_code', originalName: '科目编码', standardName: 'account_code', value: '6001', confidence: 96, status: '通过' },
        { id: 'account_name', originalName: '科目名称', standardName: 'account_name', value: '主营业务收入', confidence: 95, status: '通过' },
        { id: 'account_type', originalName: '科目类型', standardName: 'account_type', value: '收入', confidence: 84, status: '建议确认' },
        { id: 'department', originalName: '利润中心', standardName: 'department', value: '华东销售中心', confidence: 83, status: '建议确认' },
        { id: 'business_unit', originalName: '业务线', standardName: 'business_unit', value: '企业服务', confidence: 90, status: '通过' },
        { id: 'revenue_amount', originalName: '收入金额', standardName: 'revenue_amount', value: '8800000', confidence: 96, status: '通过' },
        { id: 'cogs_amount', originalName: '主营成本', standardName: 'cogs_amount', value: '4840000', confidence: 94, status: '通过' },
        { id: 'opex_amount', originalName: '期间费用', standardName: 'opex_amount', value: '2180000', confidence: 91, status: '通过' },
        { id: 'net_profit', originalName: '净利润', standardName: 'net_profit', value: '1360000', confidence: 92, status: '通过' },
        { id: 'budget_amount', originalName: '预算金额', standardName: 'budget_amount', value: '1320000', confidence: 89, status: '通过' },
        { id: 'last_period_amount', originalName: '上期金额', standardName: 'last_period_amount', value: '1280000', confidence: 87, status: '通过' }
      ],
      computedFields: [
        { label: '毛利额', standardName: 'gross_profit', value: '3960000', formula: 'revenue_amount - cogs_amount' },
        { label: '毛利率', standardName: 'gross_margin_rate', value: '45.0%', formula: 'gross_profit / revenue_amount' },
        { label: '费用率', standardName: 'opex_rate', value: '24.8%', formula: 'opex_amount / revenue_amount' },
        { label: '预算差异', standardName: 'budget_variance', value: '+40000', formula: 'net_profit - budget_amount' }
      ]
    },
    intentUnderstanding: {
      originalPrompt: '',
      topic: 'P&L 利润损益分析',
      timeRange: '本月及上半年趋势',
      metrics: ['营业收入', '主营成本', '毛利额', '期间费用', '净利润', '预算差异', '毛利率', '费用率'],
      dimensions: ['期间', '科目', '部门', '业务线'],
      recommendedCharts: ['利润指标卡', 'P&L 瀑布图', '收入成本费用趋势', '实际 vs 预算', '部门利润贡献', '异常科目波动表']
    },
    fieldMatching: [
      { component: '利润指标卡', requiredFields: ['revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit'], matchedFields: ['revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit'], status: '已匹配', description: '核心损益字段完整，可生成指标卡。', canGenerate: true },
      { component: 'P&L 瀑布图', requiredFields: ['revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit'], matchedFields: ['revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit'], status: '已匹配', description: '收入、成本、费用到净利润链路完整。', canGenerate: true },
      { component: '部门利润贡献', requiredFields: ['department', 'net_profit'], matchedFields: ['department', 'net_profit'], status: '建议确认', description: 'department 置信度较低，建议确认利润中心口径。', canGenerate: true },
      { component: '实际 vs 预算', requiredFields: ['budget_amount', 'net_profit'], matchedFields: ['budget_amount', 'net_profit'], status: '已匹配', description: '可展示预算差异。', canGenerate: true },
      { component: '同比分析', requiredFields: ['last_year_same_period_amount'], matchedFields: [], status: '字段缺失', description: '缺少年同期数据，暂不生成同比。', canGenerate: false }
    ],
    chartSources: [
      source('metrics', '利润指标卡', '由收入、成本、费用和净利润字段计算经营结果。', ['revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit']),
      source('pnl-waterfall', 'P&L 分层瀑布图', '展示收入到净利润的分层扣减过程。', ['revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit']),
      source('pnl-trend', '收入成本费用趋势', '按期间展示收入、成本、费用和净利润趋势。', ['period', 'revenue_amount', 'cogs_amount', 'opex_amount', 'net_profit']),
      source('pnl-budget', '部门利润实际 vs 预算', '对比不同部门实际利润和预算利润。', ['department', 'budget_amount', 'net_profit']),
      source('pnl-anomaly', '异常科目波动提醒', '按科目波动率识别需复核项目。', ['account_code', 'account_name', 'last_period_amount'])
    ],
    buildDashboard: buildPnlDashboard
  },
  {
    id: 'p2p',
    name: 'P2P 异常付款检测',
    shortName: 'P2P',
    description: '围绕采购订单、发票、付款和供应商主数据识别异常付款风险。',
    uploadHint: '未上传真实文件时，系统会使用虚构的“2026 年 6 月 P2P 付款与发票样本”作为演示输入。',
    defaultPrompt: '请帮我生成 P2P 异常付款检测看板，展示重复付款、无 PO 发票、三单匹配、超 PO 或合同付款、提前付款和供应商银行账户变更风险。',
    parsingResult: {
      documentType: '采购订单 + 发票 + 付款记录',
      typeConfidence: 93,
      fields: [
        { id: 'po_number', originalName: '采购订单号', standardName: 'po_number', value: 'PO-202606-018', confidence: 96, status: '通过' },
        { id: 'invoice_number', originalName: '发票号', standardName: 'invoice_number', value: 'INV-8842', confidence: 95, status: '通过' },
        { id: 'payment_id', originalName: '付款单号', standardName: 'payment_id', value: 'PAY-001', confidence: 94, status: '通过' },
        { id: 'vendor_id', originalName: '供应商编码', standardName: 'vendor_id', value: 'V-10288', confidence: 92, status: '通过' },
        { id: 'vendor_name', originalName: '供应商名称', standardName: 'vendor_name', value: '杭州星河云计算有限公司', confidence: 83, status: '建议确认' },
        { id: 'invoice_amount', originalName: '发票金额', standardName: 'invoice_amount', value: '186000', confidence: 96, status: '通过' },
        { id: 'payment_amount', originalName: '付款金额', standardName: 'payment_amount', value: '186000', confidence: 97, status: '通过' },
        { id: 'po_amount', originalName: 'PO 金额', standardName: 'po_amount', value: '186000', confidence: 93, status: '通过' },
        { id: 'received_amount', originalName: '收货金额', standardName: 'received_amount', value: '172000', confidence: 87, status: '通过' },
        { id: 'payment_date', originalName: '付款日期', standardName: 'payment_date', value: '2026-06-18', confidence: 90, status: '通过' },
        { id: 'due_date', originalName: '到期日', standardName: 'due_date', value: '2026-06-30', confidence: 88, status: '通过' },
        { id: 'approval_status', originalName: '审批状态', standardName: 'approval_status', value: '已审批', confidence: 86, status: '通过' },
        { id: 'bank_account', originalName: '银行账号', standardName: 'bank_account', value: '6222 **** 9188', confidence: 78, status: '建议确认' },
        { id: 'contract_number', originalName: '合同号', standardName: 'contract_number', value: 'CT-2026-118', confidence: 85, status: '通过' },
        { id: 'currency', originalName: '币种', standardName: 'currency', value: 'CNY', confidence: 99, status: '通过' }
      ],
      computedFields: [
        { label: '三单匹配结果', standardName: 'three_way_match_result', value: '金额重复疑似', formula: 'PO / 发票 / 付款金额匹配 + 重复键校验' },
        { label: '风险等级', standardName: 'risk_level', value: '高风险', formula: 'risk_score >= 85' },
        { label: '重复付款键', standardName: 'duplicate_key', value: 'vendor + invoice_amount + invoice_number', formula: '供应商 + 发票号 + 金额' },
        { label: '提前付款天数', standardName: 'early_payment_days', value: '12', formula: 'due_date - payment_date' }
      ]
    },
    intentUnderstanding: {
      originalPrompt: '',
      topic: 'P2P 异常付款检测',
      timeRange: '本月付款批次',
      metrics: ['付款总额', '异常付款金额', '异常单据数', '风险供应商数', '风险评分'],
      dimensions: ['供应商', '异常类型', '付款日期', 'PO', '发票', '审批状态'],
      recommendedCharts: ['风险指标卡', '异常类型分布', '供应商风险评分', '异常付款趋势', '高风险付款明细', '三单匹配结果表']
    },
    fieldMatching: [
      { component: '付款风险指标卡', requiredFields: ['payment_amount', 'vendor_id', 'payment_id'], matchedFields: ['payment_amount', 'vendor_id', 'payment_id'], status: '已匹配', description: '付款金额、供应商与付款单字段完整。', canGenerate: true },
      { component: '重复付款检测', requiredFields: ['vendor_id', 'invoice_number', 'payment_amount'], matchedFields: ['vendor_id', 'invoice_number', 'payment_amount'], status: '已匹配', description: '可构造重复付款键并识别疑似重复。', canGenerate: true },
      { component: '三单匹配结果', requiredFields: ['po_number', 'invoice_number', 'payment_id', 'po_amount', 'invoice_amount', 'payment_amount'], matchedFields: ['po_number', 'invoice_number', 'payment_id', 'po_amount', 'invoice_amount', 'payment_amount'], status: '已匹配', description: 'PO、发票、付款链路完整。', canGenerate: true },
      { component: '供应商账户变更风险', requiredFields: ['vendor_id', 'bank_account'], matchedFields: ['vendor_id', 'bank_account'], status: '建议确认', description: 'bank_account 置信度较低，建议人工复核。', canGenerate: true },
      { component: '合同付款校验', requiredFields: ['contract_number', 'payment_amount'], matchedFields: ['contract_number', 'payment_amount'], status: '已匹配', description: '可识别无合同或超合同付款。', canGenerate: true },
      { component: '审批流穿透分析', requiredFields: ['approval_chain_detail'], matchedFields: [], status: '字段缺失', description: '缺少详细审批节点，暂不生成审批穿透图。', canGenerate: false }
    ],
    chartSources: [
      source('metrics', '付款风险指标卡', '由付款金额、供应商和风险规则命中结果聚合。', ['payment_amount', 'vendor_id', 'payment_id']),
      source('p2p-anomaly', '异常类型分布', '按异常类型聚合风险付款金额。', ['payment_amount', 'anomaly_type']),
      source('p2p-risk', '供应商风险评分', '按供应商维度展示规则评分。', ['vendor_id', 'vendor_name', 'risk_score']),
      source('p2p-trend', '异常付款金额趋势', '按付款日期聚合异常付款金额。', ['payment_date', 'payment_amount']),
      source('p2p-detail', '高风险付款明细', '展示高风险付款单与命中原因。', ['payment_id', 'vendor_name', 'payment_amount', 'approval_status']),
      source('p2p-match', 'PO-发票-付款三单匹配结果', '展示采购订单、发票和付款之间的匹配结论。', ['po_number', 'invoice_number', 'payment_id'])
    ],
    buildDashboard: buildP2pDashboard
  }
];

export const defaultScenarioId = 'expense';

