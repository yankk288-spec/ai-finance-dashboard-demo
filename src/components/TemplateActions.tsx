import { FileCheck2, GitBranch, LayoutTemplate } from 'lucide-react';

interface TemplateActionsProps {
  onToast: (message: string) => void;
}

export function TemplateActions({ onToast }: TemplateActionsProps) {
  const actions = [
    {
      label: '保存为单据模板',
      icon: FileCheck2,
      message: '单据模板已保存，下次同类单据可自动识别。'
    },
    {
      label: '保存字段映射规则',
      icon: GitBranch,
      message: '字段映射规则已保存，下次同客户字段可自动映射。'
    },
    {
      label: '保存为看板模板',
      icon: LayoutTemplate,
      message: '看板模板已保存，可复用于其他客户。'
    }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onToast(action.message)}
            className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50"
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
