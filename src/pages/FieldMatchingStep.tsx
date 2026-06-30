import { ArrowRight, Boxes, CheckCircle2 } from 'lucide-react';
import { FieldMatchingTable } from '../components/FieldMatchingTable';
import { NavigationButtons } from '../components/NavigationButtons';
import { TemplateActions } from '../components/TemplateActions';
import { platformLineage } from '../data/mockFieldMapping';
import { FieldMatchingItem, ParsedField } from '../types';

interface FieldMatchingStepProps {
  items: FieldMatchingItem[];
  fields: ParsedField[];
  onToast: (message: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function FieldMatchingStep({ items, fields, onToast, onPrev, onNext }: FieldMatchingStepProps) {
  const generatableCount = items.filter((item) => item.canGenerate).length;
  const missingCount = items.filter((item) => !item.canGenerate).length;
  const lowConfidenceCount = fields.filter((field) => field.confidence < 85 && field.status !== '已确认').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">字段匹配与数据建模</h2>
          <p className="mt-2 text-sm text-slate-600">把客户字段映射到标准字段，再校验能否支撑每个看板组件。</p>
        </div>
        <TemplateActions onToast={onToast} />
      </div>

      <section className="rounded-md border border-emerald-200 bg-emerald-50 p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
          <div>
            <h3 className="font-semibold text-emerald-950">建模结论</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900">
              当前数据可生成 {generatableCount} 个看板组件，{missingCount} 个组件因缺少上月数据暂不生成，
              {lowConfidenceCount} 个字段建议人工确认。
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Boxes className="h-5 w-5 text-brand-600" />
          <h3 className="font-semibold text-slate-900">平台化链路</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {platformLineage.map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <div className="rounded-md border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
                {item}
              </div>
              {index < platformLineage.length - 1 && <ArrowRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>
      </section>

      <FieldMatchingTable items={items} />
      <NavigationButtons canPrev canNext nextLabel="生成财务看板" onPrev={onPrev} onNext={onNext} />
    </div>
  );
}
