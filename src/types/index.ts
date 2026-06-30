export type StepId = 'input' | 'parsing' | 'intent' | 'mapping' | 'dashboard';

export type FieldStatus = '通过' | '建议确认' | '异常' | '已确认';

export interface ParsedField {
  id: string;
  originalName: string;
  standardName: string;
  value: string;
  confidence: number;
  status: FieldStatus;
}

export interface ComputedField {
  label: string;
  standardName: string;
  value: string;
  formula: string;
}

export interface DocumentParsingResult {
  documentType: string;
  typeConfidence: number;
  fields: ParsedField[];
  computedFields: ComputedField[];
}

export interface IntentUnderstanding {
  originalPrompt: string;
  topic: string;
  timeRange: string;
  metrics: string[];
  dimensions: string[];
  recommendedCharts: string[];
}

export type MatchStatus = '已匹配' | '字段缺失' | '建议确认';

export interface FieldMatchingItem {
  component: string;
  requiredFields: string[];
  matchedFields: string[];
  status: MatchStatus;
  description: string;
  canGenerate: boolean;
}

export interface SourceField {
  label: string;
  customerField: string;
  standardField: string;
  usage: string;
}

export interface ExpenseRecord {
  id: string;
  expense_date: string;
  department: string;
  expense_category: string;
  expense_amount: number;
  vendor: string;
  tax_amount: number;
  payment_status: string;
  confidence: number;
  document_type: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
  tone: 'blue' | 'green' | 'orange' | 'slate';
}

export interface ChartSource {
  chartId: string;
  title: string;
  sourceFields: SourceField[];
  explanation: string;
}

export interface ToastState {
  message: string;
  tone?: 'success' | 'warning' | 'info';
}
