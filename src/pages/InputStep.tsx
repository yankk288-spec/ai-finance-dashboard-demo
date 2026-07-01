import { ProcessingTimeline } from '../components/ProcessingTimeline';
import { UploadPanel } from '../components/UploadPanel';
import { OutputMode, ScenarioConfig, ScenarioId } from '../types';

interface InputStepProps {
  requirement: string;
  scenario: ScenarioId;
  outputMode: OutputMode;
  scenarioOptions: ScenarioConfig[];
  fileName: string;
  processing: boolean;
  processingIndex: number;
  onRequirementChange: (value: string) => void;
  onScenarioChange: (value: ScenarioId) => void;
  onOutputModeChange: (value: OutputMode) => void;
  onFileChange: (fileName: string) => void;
  onGenerate: () => void;
}

export function InputStep({
  requirement,
  scenario,
  outputMode,
  scenarioOptions,
  fileName,
  processing,
  processingIndex,
  onRequirementChange,
  onScenarioChange,
  onOutputModeChange,
  onFileChange,
  onGenerate
}: InputStepProps) {
  return (
    <div className="space-y-6">
      <UploadPanel
        requirement={requirement}
        scenario={scenario}
        outputMode={outputMode}
        scenarioOptions={scenarioOptions}
        fileName={fileName}
        onRequirementChange={onRequirementChange}
        onScenarioChange={onScenarioChange}
        onOutputModeChange={onOutputModeChange}
        onFileChange={onFileChange}
        onGenerate={onGenerate}
      />
      {processing && <ProcessingTimeline activeIndex={processingIndex} />}
    </div>
  );
}
