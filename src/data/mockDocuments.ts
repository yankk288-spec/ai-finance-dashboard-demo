import { DocumentParsingResult, ExpenseRecord } from '../types';

export const defaultRequirement =
  '请帮我生成一个本月费用分析看板，展示部门费用、费用类型占比、每日费用趋势、异常大额支出，以及低置信度字段提醒。';

export const mockDocumentParsing: DocumentParsingResult = {
  documentType: '费用报销单 + 费用发票',
  typeConfidence: 96,
  fields: [
    {
      id: 'expense_date',
      originalName: '报销日期',
      standardName: 'expense_date',
      value: '2026-06-18',
      confidence: 94,
      status: '通过'
    },
    {
      id: 'department',
      originalName: '部门',
      standardName: 'department',
      value: '市场部',
      confidence: 82,
      status: '建议确认'
    },
    {
      id: 'expense_category',
      originalName: '费用类型',
      standardName: 'expense_category',
      value: '差旅交通',
      confidence: 79,
      status: '建议确认'
    },
    {
      id: 'expense_amount',
      originalName: '报销金额',
      standardName: 'expense_amount',
      value: '12860.00',
      confidence: 97,
      status: '通过'
    },
    {
      id: 'vendor',
      originalName: '供应商',
      standardName: 'vendor',
      value: '上海云翼会务服务有限公司',
      confidence: 88,
      status: '通过'
    },
    {
      id: 'tax_amount',
      originalName: '税额',
      standardName: 'tax_amount',
      value: '728.30',
      confidence: 91,
      status: '通过'
    },
    {
      id: 'payment_status',
      originalName: '付款状态',
      standardName: 'payment_status',
      value: '待付款',
      confidence: 86,
      status: '通过'
    }
  ],
  computedFields: [
    {
      label: '月份',
      standardName: 'month',
      value: '2026-06',
      formula: 'expense_date 截取年月'
    },
    {
      label: '是否大额费用',
      standardName: 'is_large_expense',
      value: '是',
      formula: 'expense_amount >= 10000'
    },
    {
      label: '不含税金额',
      standardName: 'amount_without_tax',
      value: '12131.70',
      formula: 'expense_amount - tax_amount'
    },
    {
      label: '税额占比',
      standardName: 'tax_ratio',
      value: '5.66%',
      formula: 'tax_amount / expense_amount'
    }
  ]
};

export const mockExpenseRecords: ExpenseRecord[] = [
  {
    id: 'EXP-202606-001',
    expense_date: '2026-06-01',
    department: '市场部',
    expense_category: '差旅交通',
    expense_amount: 12860,
    vendor: '上海云翼会务服务有限公司',
    tax_amount: 728.3,
    payment_status: '待付款',
    confidence: 82,
    document_type: '费用报销单'
  },
  {
    id: 'EXP-202606-002',
    expense_date: '2026-06-03',
    department: '研发部',
    expense_category: '云服务',
    expense_amount: 18600,
    vendor: '杭州星河云计算有限公司',
    tax_amount: 1116,
    payment_status: '已付款',
    confidence: 93,
    document_type: '费用发票'
  },
  {
    id: 'EXP-202606-003',
    expense_date: '2026-06-05',
    department: '销售部',
    expense_category: '客户招待',
    expense_amount: 7420,
    vendor: '北京融汇餐饮管理有限公司',
    tax_amount: 420,
    payment_status: '已付款',
    confidence: 88,
    document_type: '费用发票'
  },
  {
    id: 'EXP-202606-004',
    expense_date: '2026-06-08',
    department: '财务部',
    expense_category: '办公采购',
    expense_amount: 3680,
    vendor: '深圳联采办公用品有限公司',
    tax_amount: 208.3,
    payment_status: '已付款',
    confidence: 92,
    document_type: '费用发票'
  },
  {
    id: 'EXP-202606-005',
    expense_date: '2026-06-11',
    department: '研发部',
    expense_category: '测试设备',
    expense_amount: 21450,
    vendor: '苏州明测电子科技有限公司',
    tax_amount: 1287,
    payment_status: '待付款',
    confidence: 90,
    document_type: '费用发票'
  },
  {
    id: 'EXP-202606-006',
    expense_date: '2026-06-14',
    department: '市场部',
    expense_category: '市场活动',
    expense_amount: 15680,
    vendor: '广州启幕活动策划有限公司',
    tax_amount: 940.8,
    payment_status: '已付款',
    confidence: 84,
    document_type: '费用报销单'
  },
  {
    id: 'EXP-202606-007',
    expense_date: '2026-06-18',
    department: '销售部',
    expense_category: '差旅交通',
    expense_amount: 9360,
    vendor: '上海云翼会务服务有限公司',
    tax_amount: 530.2,
    payment_status: '待付款',
    confidence: 79,
    document_type: '费用报销单'
  },
  {
    id: 'EXP-202606-008',
    expense_date: '2026-06-22',
    department: '行政部',
    expense_category: '租赁物业',
    expense_amount: 24600,
    vendor: '北京恒泰物业服务有限公司',
    tax_amount: 1476,
    payment_status: '已付款',
    confidence: 95,
    document_type: '银行流水'
  },
  {
    id: 'EXP-202606-009',
    expense_date: '2026-06-25',
    department: '研发部',
    expense_category: '云服务',
    expense_amount: 11980,
    vendor: '杭州星河云计算有限公司',
    tax_amount: 718.8,
    payment_status: '已付款',
    confidence: 91,
    document_type: '费用发票'
  },
  {
    id: 'EXP-202606-010',
    expense_date: '2026-06-28',
    department: '市场部',
    expense_category: '广告投放',
    expense_amount: 17240,
    vendor: '上海数境广告有限公司',
    tax_amount: 1034.4,
    payment_status: '待付款',
    confidence: 87,
    document_type: '费用发票'
  }
];
