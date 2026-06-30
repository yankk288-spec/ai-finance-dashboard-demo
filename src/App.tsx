import { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { SourceModal } from './components/SourceModal';
import { Toast } from './components/Toast';
import { chartSources } from './data/mockDashboard';
import { defaultRequirement, mockDocumentParsing, mockExpenseRecords } from './data/mockDocuments';
import { mockFieldMatching, mockIntentUnderstanding } from './data/mockFieldMapping';
import { DashboardStep } from './pages/DashboardStep';
import { DocumentParsingStep } from './pages/DocumentParsingStep';
import { FieldMatchingStep } from './pages/FieldMatchingStep';
import { InputStep } from './pages/InputStep';
import { IntentUnderstandingStep } from './pages/IntentUnderstandingStep';
import { ChartSource, ParsedField, StepId, ToastState } from './types';

const orderedSteps: StepId[] = ['input', 'parsing', 'intent', 'mapping', 'dashboard'];

function getStepIndex(step: StepId) {
  return orderedSteps.indexOf(step);
}

function updateRecordsWithConfirmedFields(fields: ParsedField[]) {
  const department = fields.find((field) => field.id === 'department')?.value;
  const category = fields.find((field) => field.id === 'expense_category')?.value;

  return mockExpenseRecords.map((record, index) => {
    if (index !== 0) return record;
    return {
      ...record,
      department: department || record.department,
      expense_category: category || record.expense_category
    };
  });
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('input');
  const [unlockedStepIndex, setUnlockedStepIndex] = useState(0);
  const [requirement, setRequirement] = useState(defaultRequirement);
  const [scenario, setScenario] = useState('费用分析');
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [fields, setFields] = useState<ParsedField[]>(mockDocumentParsing.fields);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeSource, setActiveSource] = useState<ChartSource | null>(null);

  const dashboardRecords = useMemo(() => updateRecordsWithConfirmedFields(fields), [fields]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => {
    setToast({ message, tone: 'success' });
  };

  const goToStep = (step: StepId) => {
    const nextIndex = getStepIndex(step);
    if (nextIndex <= unlockedStepIndex) {
      setCurrentStep(step);
    }
  };

  const goNext = () => {
    const nextIndex = Math.min(getStepIndex(currentStep) + 1, orderedSteps.length - 1);
    setUnlockedStepIndex((value) => Math.max(value, nextIndex));
    setCurrentStep(orderedSteps[nextIndex]);
  };

  const goPrev = () => {
    const prevIndex = Math.max(getStepIndex(currentStep) - 1, 0);
    setCurrentStep(orderedSteps[prevIndex]);
  };

  const handleGenerate = () => {
    setProcessing(true);
    setProcessingIndex(0);
    setUnlockedStepIndex(0);
    setCurrentStep('input');

    const timers = [0, 650, 1300, 1950, 2600].map((delay, index) =>
      window.setTimeout(() => setProcessingIndex(index), delay)
    );

    window.setTimeout(() => {
      timers.forEach((timer) => window.clearTimeout(timer));
      setProcessing(false);
      setUnlockedStepIndex(4);
      setCurrentStep('parsing');
      showToast('AI 处理完成，已生成可解释的财务看板草稿。');
    }, 3350);
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFields((current) =>
      current.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              value,
              status: field.confidence < 85 ? '已确认' : field.status
            }
          : field
      )
    );
  };

  const handleViewSource = (chartId: string) => {
    setActiveSource(chartSources.find((source) => source.chartId === chartId) ?? null);
  };

  const intent = {
    ...mockIntentUnderstanding,
    originalPrompt: requirement,
    topic: scenario
  };

  return (
    <Layout
      currentStep={currentStep}
      unlockedStepIndex={unlockedStepIndex}
      processing={processing}
      onStepClick={goToStep}
    >
      {currentStep === 'input' && (
        <InputStep
          requirement={requirement}
          scenario={scenario}
          fileName={fileName}
          processing={processing}
          processingIndex={processingIndex}
          onRequirementChange={setRequirement}
          onScenarioChange={setScenario}
          onFileChange={setFileName}
          onGenerate={handleGenerate}
        />
      )}

      {currentStep === 'parsing' && (
        <DocumentParsingStep
          documentType={mockDocumentParsing.documentType}
          typeConfidence={mockDocumentParsing.typeConfidence}
          fields={fields}
          computedFields={mockDocumentParsing.computedFields}
          onFieldChange={handleFieldChange}
          onToast={showToast}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {currentStep === 'intent' && <IntentUnderstandingStep intent={intent} onPrev={goPrev} onNext={goNext} />}

      {currentStep === 'mapping' && (
        <FieldMatchingStep
          items={mockFieldMatching}
          fields={fields}
          onToast={showToast}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {currentStep === 'dashboard' && (
        <DashboardStep records={dashboardRecords} onToast={showToast} onViewSource={handleViewSource} onPrev={goPrev} />
      )}

      <SourceModal source={activeSource} onClose={() => setActiveSource(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </Layout>
  );
}
