import { ProcessingTimeline } from '../components/ProcessingTimeline';
import { UploadPanel } from '../components/UploadPanel';

interface InputStepProps {
  requirement: string;
  scenario: string;
  fileName: string;
  processing: boolean;
  processingIndex: number;
  onRequirementChange: (value: string) => void;
  onScenarioChange: (value: string) => void;
  onFileChange: (fileName: string) => void;
  onGenerate: () => void;
}

export function InputStep({
  requirement,
  scenario,
  fileName,
  processing,
  processingIndex,
  onRequirementChange,
  onScenarioChange,
  onFileChange,
  onGenerate
}: InputStepProps) {
  return (
    <div className="space-y-6">
      <UploadPanel
        requirement={requirement}
        scenario={scenario}
        fileName={fileName}
        onRequirementChange={onRequirementChange}
        onScenarioChange={onScenarioChange}
        onFileChange={onFileChange}
        onGenerate={onGenerate}
      />
      {processing && <ProcessingTimeline activeIndex={processingIndex} />}
    </div>
  );
}
