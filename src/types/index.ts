export type StepId = 'input' | 'parsing' | 'intent' | 'mapping' | 'dashboard';

export type ScenarioId = 'expense' | 'pnl' | 'p2p';

export type OutputMode = 'dashboard' | 'ppt';

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
  tone: 'blue' | 'green' | 'orange' | 'slate' | 'red';
}

export interface ChartSource {
  chartId: string;
  title: string;
  sourceFields: SourceField[];
  explanation: string;
}

export interface ChartSeries {
  key: string;
  name: string;
  color: string;
}

export interface ChartDefinition {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'waterfall';
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface DashboardTable {
  id: string;
  title: string;
  columns: TableColumn[];
  rows: Array<Record<string, string | number>>;
}

export interface ScenarioDashboard {
  metrics: DashboardMetric[];
  charts: ChartDefinition[];
  tables: DashboardTable[];
}

export interface ScenarioConfig {
  id: ScenarioId;
  name: string;
  shortName: string;
  description: string;
  uploadHint: string;
  defaultPrompt: string;
  parsingResult: DocumentParsingResult;
  intentUnderstanding: IntentUnderstanding;
  fieldMatching: FieldMatchingItem[];
  chartSources: ChartSource[];
  buildDashboard: (fields: ParsedField[]) => ScenarioDashboard;
}

export interface ToastState {
  message: string;
  tone?: 'success' | 'warning' | 'info';
}
