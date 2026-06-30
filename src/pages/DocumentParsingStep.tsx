import { BadgeCheck, Calculator, FileSearch } from 'lucide-react';
import { FieldTable } from '../components/FieldTable';
import { NavigationButtons } from '../components/NavigationButtons';
import { TemplateActions } from '../components/TemplateActions';
import { ComputedField, ParsedField } from '../types';

interface DocumentParsingStepProps {
  documentType: string;
  typeConfidence: number;
  fields: ParsedField[];
  computedFields: ComputedField[];
  onFieldChange: (fieldId: string, value: string) => void;
  onToast: (message: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function DocumentParsingStep({
  documentType,
  typeConfidence,
  fields,
  computedFields,
  onFieldChange,
  onToast,
  onPrev,
  onNext
}: DocumentParsingStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">AI 单据解析</h2>
          <p className="mt-2 text-sm text-slate-600">模拟 OCR + 文档理解结果，低置信度字段可直接人工确认。</p>
        </div>
        <TemplateActions onToast={onToast} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileSearch className="h-5 w-5 text-brand-600" />
            单据类型识别
          </div>
          <div className="text-2xl font-semibold text-slate-900">{documentType}</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <BadgeCheck className="h-5 w-5 text-emerald-600" />
            单据类型置信度
          </div>
          <div className="text-2xl font-semibold text-emerald-700">{typeConfidence}%</div>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-5 shadow-soft">
          <div className="text-sm font-semibold text-amber-800">字段提醒</div>
          <div className="mt-2 text-2xl font-semibold text-amber-900">
            {fields.filter((field) => field.confidence < 85 && field.status !== '已确认').length} 个建议确认
          </div>
        </div>
      </div>

      <FieldTable fields={fields} onFieldChange={onFieldChange} />

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-brand-600" />
          <h3 className="font-semibold text-slate-900">可计算字段</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {computedFields.map((field) => (
            <div key={field.standardName} className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">{field.label}</div>
              <div className="mt-1 font-mono text-xs text-brand-700">{field.standardName}</div>
              <div className="mt-3 text-lg font-semibold text-slate-900">{field.value}</div>
              <div className="mt-2 text-xs text-slate-500">{field.formula}</div>
            </div>
          ))}
        </div>
      </section>

      <NavigationButtons canPrev canNext onPrev={onPrev} onNext={onNext} />
    </div>
  );
}
