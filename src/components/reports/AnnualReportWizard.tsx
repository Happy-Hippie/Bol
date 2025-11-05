import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AnnualReportSetup } from './AnnualReportSetup';
import { ContentInput } from './ContentInput';

interface WizardProps {
  onClose: () => void;
}

export function AnnualReportWizard({ onClose }: WizardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<'setup' | 'content' | 'images' | 'review' | 'generate'>('setup');
  const [reportData, setReportData] = useState<any>({});
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/setup')) {
      setCurrentStep('setup');
    } else if (path.includes('/content')) {
      setCurrentStep('content');
    } else if (path.includes('/images')) {
      setCurrentStep('images');
    } else if (path.includes('/review')) {
      setCurrentStep('review');
    } else if (path.includes('/generate')) {
      setCurrentStep('generate');
    }
  }, [location.pathname]);

  const handleSetupComplete = async (setupData: any) => {
    setReportData({ ...reportData, setup: setupData });

    if (!reportId && user) {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          org_id: user.id,
          title: setupData.title,
          report_type: 'annual',
          status: 'draft',
          content: { setup: setupData },
        })
        .select()
        .single();

      if (data && !error) {
        setReportId(data.id);
      }
    } else if (reportId) {
      await supabase
        .from('reports')
        .update({
          title: setupData.title,
          content: { ...reportData, setup: setupData },
        })
        .eq('id', reportId);
    }

    navigate('/reports/annual/content');
  };

  const handleSaveDraft = async (data: any) => {
    if (!user) return;

    if (reportId) {
      await supabase
        .from('reports')
        .update({
          content: { ...reportData, [currentStep]: data },
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);
    } else {
      const { data: newReport, error } = await supabase
        .from('reports')
        .insert({
          org_id: user.id,
          title: data.title || 'Untitled Report',
          report_type: 'annual',
          status: 'draft',
          content: { [currentStep]: data },
        })
        .select()
        .single();

      if (newReport && !error) {
        setReportId(newReport.id);
      }
    }

    alert('Draft saved successfully!');
  };

  const handleContentNext = async (contentData: any) => {
    setReportData({ ...reportData, content: contentData });

    if (reportId) {
      await supabase
        .from('reports')
        .update({
          content: { ...reportData, content: contentData },
        })
        .eq('id', reportId);
    }

    navigate('/reports/annual/images');
  };

  const handleContentBack = () => {
    navigate('/reports/annual/setup');
  };

  return (
    <div className="min-h-screen bg-[#FDF8FC]">
      <div className="sticky top-0 bg-white shadow-sm z-10 px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-[#4A1A5C]">Create Annual Report</h2>
          <p className="text-sm text-gray-600">Build your comprehensive annual impact report</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <div className="py-8 px-8">
        {currentStep === 'setup' && (
          <AnnualReportSetup
            onNext={handleSetupComplete}
            onSaveDraft={handleSaveDraft}
            initialData={reportData.setup}
          />
        )}

        {currentStep === 'content' && (
          <ContentInput
            onNext={handleContentNext}
            onBack={handleContentBack}
            reportData={reportData}
            onUpdate={(data) => setReportData({ ...reportData, content: data })}
          />
        )}

        {currentStep === 'images' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-[#4A1A5C] mb-4">Images Step</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
