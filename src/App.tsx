import { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { SourceModal } from './components/SourceModal';
import { Toast } from './components/Toast';
import { defaultScenarioId, scenarios } from './data/scenarios';
import { DashboardStep } from './pages/DashboardStep';
import { DocumentParsingStep } from './pages/DocumentParsingStep';
import { FieldMatchingStep } from './pages/FieldMatchingStep';
import { InputStep } from './pages/InputStep';
import { IntentUnderstandingStep } from './pages/IntentUnderstandingStep';
import { ChartSource, OutputMode, ParsedField, ScenarioId, StepId, ToastState } from './types';

const orderedSteps: StepId[] = ['input', 'parsing', 'intent', 'mapping', 'dashboard'];

function getStepIndex(step: StepId) {
  return orderedSteps.indexOf(step);
}

function cloneFields(fields: ParsedField[]) {
  return fields.map((field) => ({ ...field }));
}

function getScenario(scenarioId: ScenarioId) {
  return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
}

export default function App() {
  const initialScenario = getScenario(defaultScenarioId);
  const [currentStep, setCurrentStep] = useState<StepId>('input');
  const [unlockedStepIndex, setUnlockedStepIndex] = useState(0);
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenario.id);
  const [outputMode, setOutputMode] = useState<OutputMode>('dashboard');
  const [requirement, setRequirement] = useState(initialScenario.defaultPrompt);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [fields, setFields] = useState<ParsedField[]>(cloneFields(initialScenario.parsingResult.fields));
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeSource, setActiveSource] = useState<ChartSource | null>(null);

  const selectedScenario = getScenario(scenarioId);
  const dashboard = useMemo(() => selectedScenario.buildDashboard(fields), [selectedScenario, fields]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => {
    setToast({ message, tone: 'success' });
  };

  const handleScenarioChange = (nextScenarioId: ScenarioId) => {
    const nextScenario = getScenario(nextScenarioId);
    setScenarioId(nextScenario.id);
    setRequirement(nextScenario.defaultPrompt);
    setFields(cloneFields(nextScenario.parsingResult.fields));
    setUnlockedStepIndex(0);
    setCurrentStep('input');
    setActiveSource(null);
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
      showToast(`${selectedScenario.shortName} 场景处理完成，已生成${outputMode === 'ppt' ? 'PPT 汇报草稿' : '可解释的财务看板草稿'}。`);
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
    setActiveSource(selectedScenario.chartSources.find((source) => source.chartId === chartId) ?? null);
  };

  const intent = {
    ...selectedScenario.intentUnderstanding,
    originalPrompt: requirement,
    topic: selectedScenario.name
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
          scenario={scenarioId}
          outputMode={outputMode}
          scenarioOptions={scenarios}
          fileName={fileName}
          processing={processing}
          processingIndex={processingIndex}
          onRequirementChange={setRequirement}
          onScenarioChange={handleScenarioChange}
          onOutputModeChange={setOutputMode}
          onFileChange={setFileName}
          onGenerate={handleGenerate}
        />
      )}

      {currentStep === 'parsing' && (
        <DocumentParsingStep
          documentType={selectedScenario.parsingResult.documentType}
          typeConfidence={selectedScenario.parsingResult.typeConfidence}
          fields={fields}
          computedFields={selectedScenario.parsingResult.computedFields}
          onFieldChange={handleFieldChange}
          onToast={showToast}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {currentStep === 'intent' && <IntentUnderstandingStep intent={intent} onPrev={goPrev} onNext={goNext} />}

      {currentStep === 'mapping' && (
        <FieldMatchingStep
          items={selectedScenario.fieldMatching}
          fields={fields}
          onToast={showToast}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {currentStep === 'dashboard' && (
        <DashboardStep
          scenarioName={selectedScenario.name}
          scenarioDescription={selectedScenario.description}
          outputMode={outputMode}
          dashboard={dashboard}
          onOutputModeChange={setOutputMode}
          onToast={showToast}
          onViewSource={handleViewSource}
          onPrev={goPrev}
        />
      )}

      <SourceModal source={activeSource} onClose={() => setActiveSource(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </Layout>
  );
}
