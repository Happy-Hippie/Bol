import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Plus, Sparkles, Mic, Upload as UploadIcon, GripVertical } from 'lucide-react';

interface Step2Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

interface Section {
  id: string;
  title: string;
  content: string;
  status: 'not-started' | 'draft' | 'complete';
  order: number;
}

const defaultSections = [
  'Executive Summary',
  'Mission, Vision & Values',
  'Leadership Message',
  'Highlights of the Year',
  'Program Updates',
  'Project Activities',
  'Key Metrics',
  'Success Stories',
  'Financial Overview',
  'Funding Breakdown',
  'Partner Acknowledgement',
  'Future Plans',
  'Challenges & Lessons',
  'Call to Action'
];

export function Step2Content({ data, onUpdate, onNext, onPrevious, onSaveDraft }: Step2Props) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Record<string, 'text' | 'voice' | 'upload'>>({});
  const [isExpanding, setIsExpanding] = useState<string | null>(null);

  const sections: Section[] = data.sections || defaultSections.map((title, index) => ({
    id: `section-${index}`,
    title,
    content: '',
    status: 'not-started' as const,
    order: index
  }));

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const updateSection = (id: string, content: string) => {
    const updated = sections.map(s =>
      s.id === id
        ? {
            ...s,
            content,
            status: (content.trim() ? 'draft' : 'not-started') as const
          }
        : s
    );
    onUpdate({ sections: updated });
  };

  const handleAIExpand = async (id: string) => {
    setIsExpanding(id);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const section = sections.find(s => s.id === id);
    if (section) {
      const expanded = section.content + '\n\n[AI-expanded content would appear here with detailed paragraphs based on your notes...]';
      updateSection(id, expanded);
    }
    setIsExpanding(null);
  };

  const completedCount = sections.filter(s => s.status !== 'not-started').length;
  const canProceed = completedCount >= 5;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-bol-purple mb-2">Add Content</h2>
          <p className="text-gray-600">Fill in your report sections with content</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Progress</p>
          <p className="text-2xl font-bold text-bol-purple">
            {completedCount} of {sections.length}
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setExpandedSections([])}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Collapse All
        </button>
        <button
          onClick={() => setExpandedSections(sections.map(s => s.id))}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={onSaveDraft}
          className="px-4 py-2 text-sm border border-bol-blue text-bol-blue rounded-lg hover:bg-bol-blue/10 transition-colors"
        >
          Save Draft
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const tab = activeTab[section.id] || 'text';

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <GripVertical className="text-gray-400" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-bol-purple">{section.title}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    section.status === 'complete'
                      ? 'bg-green-100 text-green-700'
                      : section.status === 'draft'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {section.status === 'complete' ? (
                    <span className="flex items-center gap-1">
                      <Check size={14} /> Complete
                    </span>
                  ) : section.status === 'draft' ? (
                    'Draft'
                  ) : (
                    'Not Started'
                  )}
                </span>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-6">
                  <div className="flex gap-2 mb-4 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [section.id]: 'text' })}
                      className={`px-4 py-2 font-medium transition-colors ${
                        tab === 'text'
                          ? 'text-bol-purple border-b-2 border-bol-purple'
                          : 'text-gray-600 hover:text-bol-purple'
                      }`}
                    >
                      Text Input
                    </button>
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [section.id]: 'voice' })}
                      className={`px-4 py-2 font-medium transition-colors ${
                        tab === 'voice'
                          ? 'text-bol-purple border-b-2 border-bol-purple'
                          : 'text-gray-600 hover:text-bol-purple'
                      }`}
                    >
                      <Mic size={16} className="inline mr-1" />
                      Voice Input
                    </button>
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [section.id]: 'upload' })}
                      className={`px-4 py-2 font-medium transition-colors ${
                        tab === 'upload'
                          ? 'text-bol-purple border-b-2 border-bol-purple'
                          : 'text-gray-600 hover:text-bol-purple'
                      }`}
                    >
                      <UploadIcon size={16} className="inline mr-1" />
                      Upload Document
                    </button>
                  </div>

                  {tab === 'text' && (
                    <div>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        placeholder="Enter key points or brief notes for this section..."
                        rows={8}
                        maxLength={5000}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          {section.content.length} / 5000
                        </span>
                        <button
                          onClick={() => handleAIExpand(section.id)}
                          disabled={!section.content.trim() || isExpanding === section.id}
                          className="flex items-center gap-2 px-4 py-2 bg-bol-blue text-white rounded-lg hover:bg-bol-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Sparkles size={16} />
                          {isExpanding === section.id ? (
                            <>
                              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" />
                              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </>
                          ) : (
                            'AI Expand'
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {tab === 'voice' && (
                    <div className="py-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-bol-pink to-bol-orange rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <Mic className="text-white" size={40} />
                      </div>
                      <p className="text-gray-600 mb-2">Click to start recording</p>
                      <p className="text-sm text-gray-500">00:00</p>
                    </div>
                  )}

                  {tab === 'upload' && (
                    <div className="border-2 border-dashed border-bol-purple rounded-xl p-12 text-center hover:bg-bol-purple/5 transition-colors cursor-pointer">
                      <UploadIcon className="mx-auto mb-4 text-bol-purple" size={48} />
                      <p className="text-xl font-semibold text-bol-purple mb-2">
                        Drag and drop a document here
                      </p>
                      <p className="text-gray-600 mb-4">or click to browse</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 bg-bol-orange text-white text-xs font-bold rounded-md">
                          PDF
                        </span>
                        <span className="px-3 py-1 bg-bol-orange text-white text-xs font-bold rounded-md">
                          DOCX
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Maximum 10 MB</p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const updated = sections.map(s =>
                        s.id === section.id ? { ...s, status: 'complete' as const } : s
                      );
                      onUpdate({ sections: updated });
                    }}
                    className="mt-4 px-6 py-2 bg-bol-blue text-white rounded-lg hover:bg-bol-blue/90 transition-colors"
                  >
                    Save Section
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="mb-4 w-full px-4 py-3 border-2 border-dashed border-bol-pink text-bol-pink rounded-lg hover:bg-bol-pink/10 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Custom Segment
      </button>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ← Previous Step
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={!canProceed ? 'Complete at least 5 sections to continue' : ''}
        >
          Next: Select Images →
        </button>
      </div>
    </div>
  );
}
