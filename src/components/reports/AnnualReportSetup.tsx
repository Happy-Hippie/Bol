import { useState } from 'react';
import { Calendar, FileText, Globe, ArrowRight, Save } from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../Card';

interface SetupData {
  title: string;
  periodType: 'dates' | 'financial';
  startDate: string;
  endDate: string;
  financialYear: string;
  language: 'english' | 'hindi' | 'both';
  template: 'professional' | 'modern' | 'classic';
}

interface AnnualReportSetupProps {
  onNext: (data: SetupData) => void;
  onSaveDraft: (data: SetupData) => void;
  initialData?: Partial<SetupData>;
}

export function AnnualReportSetup({ onNext, onSaveDraft, initialData }: AnnualReportSetupProps) {
  const [formData, setFormData] = useState<SetupData>({
    title: initialData?.title || '',
    periodType: initialData?.periodType || 'dates',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    financialYear: initialData?.financialYear || 'FY 2024-25',
    language: initialData?.language || 'english',
    template: initialData?.template || 'professional',
  });

  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const financialYears = [
    'FY 2024-25',
    'FY 2023-24',
    'FY 2022-23',
    'FY 2021-22',
  ];

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and formal design',
      preview: 'Linear layout with emphasis on data',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary and vibrant',
      preview: 'Dynamic layouts with bold visuals',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and elegant',
      preview: 'Timeless design with refined typography',
    },
  ];

  const isFormValid = () => {
    if (!formData.title.trim()) return false;
    if (formData.periodType === 'dates') {
      return formData.startDate && formData.endDate;
    }
    return true;
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };

  const formatDateForInput = (date: string) => {
    if (!date) return '';
    const parts = date.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return date;
  };

  const formatDateForDisplay = (date: string) => {
    if (!date) return '';
    const parts = date.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return date;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#4A1A5C] mb-2">Annual Report Setup</h1>
            <p className="text-gray-600">Step 1 of 5</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#D946A6] text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="ml-2 text-sm font-medium text-[#D946A6]">Setup</div>
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-400">Content</div>
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
              3
            </div>
            <div className="ml-2 text-sm font-medium text-gray-400">Images</div>
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
              4
            </div>
            <div className="ml-2 text-sm font-medium text-gray-400">Review</div>
          </div>
          <div className="w-16 h-1 bg-gray-200" />
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
              5
            </div>
            <div className="ml-2 text-sm font-medium text-gray-400">Generate</div>
          </div>
        </div>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-[#4A1A5C] font-bold mb-2 flex items-center gap-2">
              <FileText size={20} />
              Report Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D946A6] focus:outline-none transition-colors"
              placeholder="e.g., Annual Impact Report 2024"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A1A5C] font-bold mb-3 flex items-center gap-2">
              <Calendar size={20} />
              Report Period *
            </label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFormData({ ...formData, periodType: 'dates' })}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.periodType === 'dates'
                    ? 'bg-[#D946A6] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Date Range
              </button>
              <button
                onClick={() => setFormData({ ...formData, periodType: 'financial' })}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.periodType === 'financial'
                    ? 'bg-[#D946A6] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Financial Year
              </button>
            </div>

            {formData.periodType === 'dates' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(formData.startDate)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: formatDateForDisplay(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2563A5] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(formData.endDate)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: formatDateForDisplay(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2563A5] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <select
                value={formData.financialYear}
                onChange={(e) =>
                  setFormData({ ...formData, financialYear: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2563A5] focus:outline-none transition-colors"
              >
                {financialYears.map((fy) => (
                  <option key={fy} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-[#4A1A5C] font-bold mb-3 flex items-center gap-2">
              <Globe size={20} />
              Report Language
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="english"
                  checked={formData.language === 'english'}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value as any })
                  }
                  className="w-5 h-5 text-[#D946A6] focus:ring-[#D946A6]"
                />
                <span className="text-gray-700 font-medium">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="hindi"
                  checked={formData.language === 'hindi'}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value as any })
                  }
                  className="w-5 h-5 text-[#D946A6] focus:ring-[#D946A6]"
                />
                <span className="text-gray-700 font-medium">Hindi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="both"
                  checked={formData.language === 'both'}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value as any })
                  }
                  className="w-5 h-5 text-[#D946A6] focus:ring-[#D946A6]"
                />
                <span className="text-gray-700 font-medium">Both</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#4A1A5C] font-bold mb-3">
              Template Selection
            </label>
            <div className="grid grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  borderColor={formData.template === template.id ? 'pink' : 'none'}
                  className={`cursor-pointer transition-all duration-200 ${
                    formData.template === template.id
                      ? 'ring-2 ring-[#D946A6] bg-gradient-to-br from-[#D946A6]/5 to-[#F59E42]/5'
                      : 'hover:scale-105'
                  }`}
                  onClick={() => setFormData({ ...formData, template: template.id as any })}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="text-center">
                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      {hoveredTemplate === template.id ? (
                        <p className="text-xs text-gray-600 px-3">{template.preview}</p>
                      ) : (
                        <FileText size={48} className="text-gray-400" />
                      )}
                    </div>
                    <h4 className="font-bold text-[#4A1A5C] mb-1">{template.name}</h4>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="secondary"
          onClick={handleSaveDraft}
          className="border-[#2563A5] text-[#2563A5] hover:bg-[#2563A5]/5"
        >
          <Save size={16} className="mr-2" />
          Save Draft
        </Button>
        <Button
          variant="gradient"
          onClick={handleNext}
          disabled={!isFormValid()}
          className="bg-gradient-to-br from-[#D946A6] to-[#F59E42] text-white px-8 py-3"
        >
          Next: Add Content
          <ArrowRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
