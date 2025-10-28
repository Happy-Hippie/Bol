import { useState, useEffect, useCallback } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ProgressIndicator } from './wizard/ProgressIndicator';
import { Step1Setup } from './wizard/Step1Setup';
import { Step2Content } from './wizard/Step2Content';
import { Step3Images } from './wizard/Step3Images';
import { Step4Preview } from './wizard/Step4Preview';
import { Step5Generation } from './wizard/Step5Generation';

interface WizardData {
  reportType: 'annual' | 'funder' | 'project' | 'custom';
  title: string;
  startDate: string;
  endDate: string;
  projectId: string | null;
  funderId: string | null;
  language: 'english' | 'hindi' | 'both';
  templateId: string;
  sections: Record<string, any>;
  images: Record<string, string[]>;
  coverImageId: string | null;
}

interface ReportWizardProps {
  onClose: () => void;
  reportType?: 'annual' | 'funder' | 'project' | 'custom';
}

export function ReportWizard({ onClose, reportType = 'annual' }: ReportWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<Partial<WizardData>>({
    reportType,
    language: 'english'
  });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveDraft = useCallback(async () => {
    if (!user || !wizardData.title) return;

    setIsSaving(true);
    try {
      const draftData = {
        org_id: user.id,
        title: wizardData.title,
        report_type: wizardData.reportType,
        status: 'draft' as const,
        data: wizardData,
        current_step: currentStep
      };

      if (draftId) {
        await supabase
          .from('reports')
          .update({ ...draftData, updated_at: new Date().toISOString() })
          .eq('id', draftId);
      } else {
        const { data } = await supabase
          .from('reports')
          .insert(draftData)
          .select()
          .single();

        if (data) setDraftId(data.id);
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, wizardData, currentStep, draftId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && wizardData.title) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, wizardData.title, saveDraft]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveDraft]);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setHasUnsavedChanges(true);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSaveAndExit = async () => {
    await saveDraft();
    onClose();
  };

  const handleDiscardAndExit = () => {
    onClose();
  };

  const steps = [
    { number: 1, label: 'Setup', component: Step1Setup },
    { number: 2, label: 'Content', component: Step2Content },
    { number: 3, label: 'Images', component: Step3Images },
    { number: 4, label: 'Review', component: Step4Preview },
    { number: 5, label: 'Generate', component: Step5Generation }
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-bol-purple">
              Create {wizardData.reportType?.charAt(0).toUpperCase() + wizardData.reportType?.slice(1)} Report
            </h1>
            {lastSaved && (
              <p className="text-sm text-gray-500 mt-1">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 border-2 border-bol-blue border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  `Last saved: ${lastSaved.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                )}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close wizard"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <ProgressIndicator
            steps={steps.map((s, i) => ({
              number: s.number,
              label: s.label,
              status: i + 1 < currentStep ? 'completed' : i + 1 === currentStep ? 'current' : 'upcoming'
            }))}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <CurrentStepComponent
              data={wizardData}
              onUpdate={updateWizardData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSaveDraft={saveDraft}
            />
          </div>
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="text-bol-orange" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-bol-purple mb-2">Save your progress?</h2>
                <p className="text-gray-600">
                  You have unsaved changes. Would you like to save as draft?
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSaveAndExit}
                className="w-full px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Save Draft
              </button>
              <button
                onClick={handleDiscardAndExit}
                className="w-full px-6 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
