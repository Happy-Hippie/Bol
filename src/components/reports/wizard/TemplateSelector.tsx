import { useState } from 'react';
import { FileText, X, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface TemplateSelectorProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  error?: string;
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with focus on visuals and metrics',
    preview: '/templates/modern.jpg'
  },
  {
    id: 'classic',
    name: 'Classic Formal',
    description: 'Traditional layout ideal for government and corporate funders',
    preview: '/templates/classic.jpg'
  },
  {
    id: 'impact',
    name: 'Impact Focused',
    description: 'Story-driven template highlighting outcomes and beneficiaries',
    preview: '/templates/impact.jpg'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, elegant design with maximum readability',
    preview: '/templates/minimal.jpg'
  }
];

export function TemplateSelector({ selectedId, onSelect, error }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-bol-purple mb-2">Choose Report Template</h3>
        <p className="text-gray-600">Select a template that best fits your reporting style</p>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative rounded-xl border-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              selectedId === template.id
                ? 'border-bol-pink shadow-lg'
                : 'border-gray-200 hover:border-bol-purple'
            }`}
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={64} className="text-gray-400" />
              </div>
              {selectedId === template.id && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-bol-pink rounded-full flex items-center justify-center">
                  <Check className="text-white" size={20} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-bol-purple mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template);
                }}
                className="text-sm text-bol-blue hover:underline"
              >
                Preview Template →
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-bol-purple to-bol-blue text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{previewTemplate.name}</h2>
                <p className="text-white/90">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText size={120} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Template Preview</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 flex justify-between">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelect(previewTemplate.id);
                  setPreviewTemplate(null);
                }}
                className="px-8 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
