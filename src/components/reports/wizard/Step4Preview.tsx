import { useState } from 'react';
import { FileText, Download, Check, AlertTriangle } from 'lucide-react';

interface Step4Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

export function Step4Preview({ data, onNext, onPrevious, onSaveDraft }: Step4Props) {
  const [checklistItems, setChecklistItems] = useState([
    { id: 'sections', label: 'All required sections completed', checked: true },
    { id: 'images', label: 'Images assigned to sections', checked: data.selectedImages?.length > 0 },
    { id: 'budget', label: 'Budget figures in INR format (Lakhs/Crores)', checked: true },
    { id: 'dates', label: 'Dates in DD/MM/YYYY format', checked: true },
    { id: 'spell', label: 'Spell check passed', checked: true },
    { id: 'grammar', label: 'Grammar check passed', checked: true }
  ]);

  const allChecked = checklistItems.every(item => item.checked);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-bol-purple mb-2">Preview & Review</h2>
        <p className="text-gray-600">Review your report before generating the final version</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-bol-purple mb-4">Report Sections</h3>
            <div className="space-y-2">
              {(data.sections || []).map((section: any, index: number) => (
                <div
                  key={section.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{section.title}</span>
                    <span className="text-xs text-gray-500">{section.content?.length || 0} chars</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-bol-purple mb-4">Formatting Options</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Style
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple">
                  <option>Professional Sans</option>
                  <option>Classic Serif</option>
                  <option>Modern Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Scheme
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="colorScheme"
                      defaultChecked
                      className="w-4 h-4 text-bol-purple focus:ring-2 focus:ring-bol-purple"
                    />
                    <span className="ml-2 text-sm text-gray-700">Brand Colors</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="colorScheme"
                      className="w-4 h-4 text-bol-purple focus:ring-2 focus:ring-bol-purple"
                    />
                    <span className="ml-2 text-sm text-gray-700">Monochrome</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Page Numbers</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-bol-purple rounded" />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Organization Logo</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-bol-purple rounded" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-bol-purple">Live Preview</h3>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={20} />
                </button>
              </div>
            </div>

            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-8 overflow-auto">
              <div className="bg-white shadow-lg rounded-lg p-8 h-full">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-bol-purple mb-2">{data.title || 'Report Title'}</h1>
                  <p className="text-gray-600">{data.financialYear || 'Report Period'}</p>
                </div>

                <div className="space-y-6">
                  {(data.sections || []).slice(0, 3).map((section: any) => (
                    <div key={section.id}>
                      <h2 className="text-xl font-bold text-bol-purple mb-2">{section.title}</h2>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {section.content || 'Content will appear here...'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                  Page 1
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-bol-purple mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-bol-orange" />
              Pre-Generation Checklist
            </h3>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:shadow transition-all"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => {
                      setChecklistItems(prev =>
                        prev.map(i => (i.id === item.id ? { ...i, checked: e.target.checked } : i))
                      );
                    }}
                    className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-bol-purple"
                  />
                  <span className={`text-sm ${item.checked ? 'text-gray-700' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {item.checked && <Check size={16} className="ml-auto text-green-500" />}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={onSaveDraft}
            className="px-6 py-3 border border-bol-blue text-bol-blue rounded-lg font-medium hover:bg-bol-blue/10 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={onPrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ← Previous Step
          </button>
        </div>
        <button
          onClick={onNext}
          disabled={!allChecked}
          className="px-8 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={!allChecked ? 'Complete all checklist items to continue' : ''}
        >
          Generate Final Report →
        </button>
      </div>
    </div>
  );
}
