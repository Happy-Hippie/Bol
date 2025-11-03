import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { TemplateSelector } from './TemplateSelector';

interface Step1Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

export function Step1Setup({ data, onUpdate, onNext }: Step1Props) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [funders, setFunders] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [periodType, setPeriodType] = useState<'date-range' | 'financial-year'>('financial-year');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [projectsRes, fundersRes] = await Promise.all([
      supabase.from('projects').select('*').eq('org_id', user.id),
      supabase.from('funders').select('*').eq('org_id', user.id)
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (fundersRes.data) setFunders(fundersRes.data);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.title?.trim()) {
      newErrors.title = 'Report title is required';
    }

    if (periodType === 'date-range') {
      if (!data.startDate) newErrors.startDate = 'Start date is required';
      if (!data.endDate) newErrors.endDate = 'End date is required';
      if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    } else {
      if (!data.financialYear) newErrors.financialYear = 'Financial year is required';
    }

    if (data.reportType === 'funder' && !data.funderId) {
      newErrors.funderId = 'Funder selection is required for funder reports';
    }

    if (!data.templateId) {
      newErrors.templateId = 'Please select a report template';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const reportTypes = [
    { id: 'annual', label: 'Annual Report', icon: FileText, color: 'blue' },
    { id: 'funder', label: 'Funder Report', icon: DollarSign, color: 'green' },
    { id: 'project', label: 'Project Report', icon: FileText, color: 'purple' },
    { id: 'custom', label: 'Custom Report', icon: FileText, color: 'orange' }
  ];

  const currentType = reportTypes.find(t => t.id === data.reportType);

  const financialYears = [
    'FY 2024-25',
    'FY 2023-24',
    'FY 2022-23',
    'FY 2021-22',
    'FY 2020-21'
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-bol-purple mb-2">Report Setup</h2>
        <p className="text-gray-600">Let's set up the basic information for your report</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-bol-purple mb-4">Report Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={data.reportType}
                onChange={(e) => onUpdate({ reportType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="e.g., Annual Report 2024-25"
                maxLength={100}
                className={`w-full px-4 py-3 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
                <span className="text-sm text-gray-500 ml-auto">
                  {(data.title || '').length}/100
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Period <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setPeriodType('financial-year')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    periodType === 'financial-year'
                      ? 'bg-bol-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Financial Year
                </button>
                <button
                  onClick={() => setPeriodType('date-range')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    periodType === 'date-range'
                      ? 'bg-bol-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Date Range
                </button>
              </div>

              {periodType === 'financial-year' ? (
                <div>
                  <select
                    value={data.financialYear || ''}
                    onChange={(e) => onUpdate({ financialYear: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.financialYear ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple`}
                  >
                    <option value="">Select Financial Year</option>
                    {financialYears.map(fy => (
                      <option key={fy} value={fy}>{fy}</option>
                    ))}
                  </select>
                  {errors.financialYear && (
                    <span className="text-sm text-red-500 mt-1">{errors.financialYear}</span>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={data.startDate || ''}
                      onChange={(e) => onUpdate({ startDate: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple`}
                    />
                    {errors.startDate && (
                      <span className="text-sm text-red-500 mt-1">{errors.startDate}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={data.endDate || ''}
                      onChange={(e) => onUpdate({ endDate: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple`}
                    />
                    {errors.endDate && (
                      <span className="text-sm text-red-500 mt-1">{errors.endDate}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {data.reportType !== 'annual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Project {data.reportType === 'project' && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={data.projectId || ''}
                  onChange={(e) => onUpdate({ projectId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                {data.projectId && projects.find(p => p.id === data.projectId) && (
                  <p className="text-sm text-gray-600 mt-2">
                    Budget: ₹{projects.find(p => p.id === data.projectId)?.budget?.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            )}

            {data.reportType === 'funder' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Funder <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.funderId || ''}
                  onChange={(e) => onUpdate({ funderId: e.target.value })}
                  className={`w-full px-4 py-3 border ${
                    errors.funderId ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple`}
                >
                  <option value="">Select a funder</option>
                  {funders.map(funder => (
                    <option key={funder.id} value={funder.id}>{funder.name}</option>
                  ))}
                </select>
                {errors.funderId && (
                  <span className="text-sm text-red-500 mt-1">{errors.funderId}</span>
                )}
                {data.funderId && (
                  <p className="text-sm text-blue-600 mt-2">
                    This report will follow {funders.find(f => f.id === data.funderId)?.name}'s reporting guidelines
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Language <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {['english', 'hindi', 'both'].map(lang => (
                  <label key={lang} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value={lang}
                      checked={data.language === lang}
                      onChange={(e) => onUpdate({ language: e.target.value })}
                      className="w-4 h-4 text-bol-purple focus:ring-2 focus:ring-bol-purple"
                    />
                    <span className="ml-2 text-gray-700 capitalize">
                      {lang === 'both' ? 'Both (English & Hindi)' : lang}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <DollarSign className="text-gray-500" size={20} />
                <span className="font-medium text-gray-700">₹ INR (Indian Rupee)</span>
                <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Default
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                All financial figures will use Indian numbering system (Lakhs/Crores)
              </p>
            </div>
          </div>
        </div>

        <TemplateSelector
          selectedId={data.templateId}
          onSelect={(templateId) => onUpdate({ templateId })}
          error={errors.templateId}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Next: Add Content →
        </button>
      </div>
    </div>
  );
}
