import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Mic, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { Card } from '../Card';
import { ContentInput } from './ContentInput';

interface ReportCreationProps {
  onClose: () => void;
}

export function ReportCreation({ onClose }: ReportCreationProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    content: '',
  });

  const reportTypes = [
    { id: 'annual', name: 'Annual Report', icon: '📊', color: 'pink' },
    { id: 'funder', name: 'Funder Report', icon: '💼', color: 'blue' },
    { id: 'project', name: 'Project Report', icon: '🎯', color: 'orange' },
    { id: 'custom', name: 'Custom Report', icon: '✨', color: 'purple' },
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setFormData({
          ...formData,
          content: formData.content + '\n\nOur community health initiative reached 500 families this quarter, providing essential healthcare services and education programs...',
        });
      }, 3000);
    }
  };

  const handleAIExpand = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        content: formData.content + '\n\nExpanded by AI: This initiative demonstrates our commitment to sustainable community development. Through collaborative partnerships with local healthcare providers, we have established a comprehensive healthcare ecosystem that not only addresses immediate medical needs but also focuses on preventive care and health education. Our culturally-sensitive approach ensures that services are accessible and relevant to diverse community members.',
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!user) return;
    setIsProcessing(true);

    const { error } = await supabase.from('reports').insert({
      org_id: user.id,
      title: formData.title,
      report_type: formData.type as any,
      status: 'draft',
      content: { text: formData.content, description: formData.description },
    });

    setTimeout(() => {
      setIsProcessing(false);
      if (!error) {
        alert('Report created successfully!');
        onClose();
      }
    }, 2000);
  };

  const toggleImage = (index: number) => {
    setSelectedImages(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col m-4">
        <div className="bg-bol-purple text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Create Report</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    s < step
                      ? 'bg-bol-orange'
                      : s === step
                      ? 'bg-bol-pink'
                      : 'bg-white/20'
                  }`}
                >
                  {s < step ? <Check size={16} /> : s}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-bol-purple mb-2">Select Report Type</h3>
                <p className="text-gray-600 mb-6">Choose the type of report you want to create</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {reportTypes.map((type) => (
                  <Card
                    key={type.id}
                    borderColor={formData.type === type.id ? type.color as any : 'none'}
                    className={`cursor-pointer transition-all duration-200 ${
                      formData.type === type.id ? 'ring-2 ring-bol-pink bg-gradient-to-br from-bol-pink/5 to-bol-orange/5' : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData({ ...formData, type: type.id })}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-3">{type.icon}</div>
                      <h4 className="text-xl font-bold text-bol-purple">{type.name}</h4>
                    </div>
                  </Card>
                ))}
              </div>

              <div>
                <label className="block text-bol-purple font-medium mb-2">Report Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                  placeholder="Q4 2024 Annual Impact Report"
                />
              </div>

              <div>
                <label className="block text-bol-purple font-medium mb-2">Brief Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                  rows={3}
                  placeholder="Overview of what this report covers..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <ContentInput
              onNext={handleNext}
              onBack={handleBack}
              reportData={formData}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-bol-purple mb-2">Select Images</h3>
                <p className="text-gray-600 mb-6">Choose images to include in your report</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {sampleImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => toggleImage(index)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                      selectedImages.includes(index) ? 'ring-4 ring-bol-pink' : 'hover:scale-105'
                    }`}
                  >
                    <img src={img} alt={`Sample ${index + 1}`} className="w-full aspect-video object-cover" />
                    {selectedImages.includes(index) && (
                      <div className="absolute inset-0 bg-bol-pink/30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-bol-pink rounded-full flex items-center justify-center">
                          <Check size={24} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Upload Custom Images
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-bol-purple mb-2">Preview & Generate</h3>
                <p className="text-gray-600 mb-6">Review your report before generating</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-bol-purple mb-4">Report Details</h4>
                  <Card borderColor="blue">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium text-bol-purple capitalize">{formData.type} Report</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium text-bol-purple">{formData.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-sm text-gray-700">{formData.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Content Length</p>
                        <p className="font-medium text-bol-purple">{formData.content.length} characters</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Images</p>
                        <p className="font-medium text-bol-purple">{selectedImages.length} selected</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h4 className="font-bold text-bol-purple mb-4">Preview</h4>
                  <Card className="max-h-96 overflow-y-auto">
                    <h3 className="text-xl font-bold text-bol-purple mb-3">{formData.title}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{formData.content}</p>
                  </Card>
                </div>
              </div>

              {isProcessing && (
                <Card gradient className="bg-gradient-pink-orange">
                  <div className="text-center py-6">
                    <Sparkles size={48} className="mx-auto mb-4 animate-spin" />
                    <p className="text-xl font-bold">AI is processing your report...</p>
                    <p className="text-white/90 mt-2">This may take a few moments</p>
                  </div>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1">
                  Export as PDF
                </Button>
                <Button variant="secondary" className="flex-1">
                  Export as Word
                </Button>
              </div>
            </div>
          )}
        </div>

        {step !== 2 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={step === 1 && (!formData.type || !formData.title)}
              >
                Next
                <ArrowRight size={20} className="ml-2" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleGenerate}
                disabled={isProcessing}
                className="min-w-[200px]"
              >
                {isProcessing ? 'Generating...' : 'Generate Final Report'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
