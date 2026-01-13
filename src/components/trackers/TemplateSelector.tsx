import type { TrackerTemplate } from '../../types';
import Card from '../common/Card';

interface TemplateSelectorProps {
  templates: TrackerTemplate[];
  onSelect: (template: TrackerTemplate) => void;
}

export default function TemplateSelector({
  templates,
  onSelect,
}: TemplateSelectorProps) {
  const getIcon = (iconName: string) => {
    return iconName.charAt(0).toUpperCase();
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect(template)}
        >
          <Card
            hover
            className="cursor-pointer"
          >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
              style={{ backgroundColor: template.color }}
            >
              {getIcon(template.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize mb-2">
                {template.frequency}
              </p>
              <p className="text-xs text-gray-400">{template.category}</p>
            </div>
          </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

