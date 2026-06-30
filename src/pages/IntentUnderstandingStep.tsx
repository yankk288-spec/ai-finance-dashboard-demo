import { IntentPanel } from '../components/IntentPanel';
import { NavigationButtons } from '../components/NavigationButtons';
import { IntentUnderstanding } from '../types';

interface IntentUnderstandingStepProps {
  intent: IntentUnderstanding;
  onPrev: () => void;
  onNext: () => void;
}

export function IntentUnderstandingStep({ intent, onPrev, onNext }: IntentUnderstandingStepProps) {
  return (
    <div className="space-y-6">
      <IntentPanel intent={intent} />
      <div className="rounded-md border border-brand-100 bg-brand-50 p-5">
        <h3 className="font-semibold text-brand-900">可解释生成逻辑</h3>
        <p className="mt-2 text-sm leading-6 text-brand-800">
          系统不会直接黑盒生成页面，而是先把自然语言拆成主题、时间范围、指标、维度和图表建议，
          再进入字段匹配校验，判断哪些组件具备可靠数据基础。
        </p>
      </div>
      <NavigationButtons canPrev canNext onPrev={onPrev} onNext={onNext} />
    </div>
  );
}
