import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Mic,
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Save,
  ChevronsDown,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../Card';

interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  status: 'active' | 'completed' | 'on-hold';
}

interface Section {
  id: string;
  title: string;
  content: string;
  status: 'empty' | 'draft' | 'complete';
  isCustom?: boolean;
  projects?: Project[];
}

interface ContentInputProps {
  onNext: () => void;
  onBack: () => void;
  reportData: any;
  onUpdate: (data: any) => void;
}

export function ContentInput({ onNext, onBack, reportData, onUpdate }: ContentInputProps) {
  const [sections, setSections] = useState<Section[]>([
    { id: '1', title: 'Executive Summary', content: '', status: 'empty' },
    { id: '2', title: 'Mission, Vision & Values', content: '', status: 'empty' },
    { id: '3', title: 'Leadership Message', content: '', status: 'empty' },
    { id: '4', title: 'Annual Achievements', content: '', status: 'empty' },
    { id: '5', title: 'Program Details', content: '', status: 'empty', projects: [] },
    { id: '6', title: 'Financial Overview', content: '', status: 'empty' },
    { id: '7', title: 'Partnerships', content: '', status: 'empty' },
    { id: '8', title: 'Future Plans', content: '', status: 'empty' },
  ]);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['1', '2', '5'])
  );
  const [activeTab, setActiveTab] = useState<Record<string, 'text' | 'voice' | 'upload'>>({});
  const [isRecording, setIsRecording] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllSections = (expand: boolean) => {
    if (expand) {
      setExpandedSections(new Set(sections.map((s) => s.id)));
    } else {
      setExpandedSections(new Set());
    }
  };

  const updateSectionContent = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const status = content.trim() === '' ? 'empty' : content.length < 50 ? 'draft' : 'complete';
          return { ...s, content, status };
        }
        return s;
      })
    );
  };

  const addCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    setSections((prev) => [
      ...prev,
      {
        id: newId,
        title: 'Custom Section',
        content: '',
        status: 'empty',
        isCustom: true,
      },
    ]);
    setExpandedSections((prev) => new Set([...prev, newId]));
  };

  const deleteCustomSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addProject = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const newProject: Project = {
            id: `project-${Date.now()}`,
            name: '',
            description: '',
            budget: 0,
            status: 'active',
          };
          return { ...s, projects: [...(s.projects || []), newProject] };
        }
        return s;
      })
    );
  };

  const updateProject = (sectionId: string, projectId: string, updates: Partial<Project>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId && s.projects) {
          return {
            ...s,
            projects: s.projects.map((p) =>
              p.id === projectId ? { ...p, ...updates } : p
            ),
          };
        }
        return s;
      })
    );
  };

  const deleteProject = (sectionId: string, projectId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId && s.projects) {
          return {
            ...s,
            projects: s.projects.filter((p) => p.id !== projectId),
          };
        }
        return s;
      })
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleVoiceInput = (sectionId: string) => {
    setIsRecording(sectionId);
    setTimeout(() => {
      setIsRecording(null);
      const section = sections.find((s) => s.id === sectionId);
      const demoText = `${section?.content || ''}\n\nOur programs have positively impacted over 5,000 beneficiaries this year, with a focus on sustainable development and community empowerment.`;
      updateSectionContent(sectionId, demoText);
    }, 3000);
  };

  const handleAIExpand = (sectionId: string) => {
    setIsProcessing(sectionId);
    setTimeout(() => {
      setIsProcessing(null);
      const section = sections.find((s) => s.id === sectionId);
      const expanded = `${section?.content || ''}\n\nThrough strategic partnerships and innovative approaches, we have developed comprehensive solutions that address root causes while delivering immediate impact. Our data-driven methodology ensures accountability and measurable outcomes, demonstrating our commitment to transparency and excellence in social impact.`;
      updateSectionContent(sectionId, expanded);
    }, 2000);
  };

  const handleFileUpload = (sectionId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const demoContent = `Uploaded content from ${file.name}:\n\nExtracted text content will appear here after processing. This feature supports PDF and Word documents.`;
        updateSectionContent(sectionId, demoContent);
      }
    };
    input.click();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      empty: { bg: 'bg-gray-200', text: 'text-gray-600', label: 'Empty' },
      draft: { bg: 'bg-[#E6B84D]', text: 'text-white', label: 'Draft' },
      complete: { bg: 'bg-green-500', text: 'text-white', label: 'Complete' },
    };
    return badges[status as keyof typeof badges];
  };

  const getTabForSection = (sectionId: string): 'text' | 'voice' | 'upload' => {
    return activeTab[sectionId] || 'text';
  };

  const setTabForSection = (sectionId: string, tab: 'text' | 'voice' | 'upload') => {
    setActiveTab((prev) => ({ ...prev, [sectionId]: tab }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#3D4F3B] mb-2">Content Input</h3>
          <p className="text-gray-600">Add content to each section of your report</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#E6B84D]">Saved {getTimeSince(lastSaved)}</span>
          <div className="flex gap-2">
            <button
              onClick={() => toggleAllSections(false)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-[#3D4F3B] transition-colors"
            >
              <ChevronsRight size={16} />
              Collapse All
            </button>
            <button
              onClick={() => toggleAllSections(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-[#3D4F3B] transition-colors"
            >
              <ChevronsDown size={16} />
              Expand All
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const currentTab = getTabForSection(section.id);
          const badge = getStatusBadge(section.status);

          return (
            <Card key={section.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={20} className="text-gray-400 cursor-move" />
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-[#3D4F3B]" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                  <h4 className="text-lg font-bold text-[#3D4F3B]">{section.title}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                  {section.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomSection(section.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  {section.title === 'Program Details' && (
                    <div className="space-y-4 mb-6">
                      {section.projects?.map((project) => (
                        <Card key={project.id} borderColor="blue" className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-bold text-[#3D4F3B]">Project</h5>
                            <button
                              onClick={() => deleteProject(section.id, project.id)}
                              className="p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) =>
                                updateProject(section.id, project.id, { name: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#7B9CA8] focus:outline-none"
                              placeholder="Project name"
                            />
                            <textarea
                              value={project.description}
                              onChange={(e) =>
                                updateProject(section.id, project.id, { description: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#7B9CA8] focus:outline-none"
                              rows={2}
                              placeholder="Project description"
                            />
                            <div className="flex gap-3">
                              <input
                                type="number"
                                value={project.budget || ''}
                                onChange={(e) =>
                                  updateProject(section.id, project.id, {
                                    budget: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#7B9CA8] focus:outline-none"
                                placeholder="Budget (₹)"
                              />
                              <select
                                value={project.status}
                                onChange={(e) =>
                                  updateProject(section.id, project.id, {
                                    status: e.target.value as any,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#7B9CA8] focus:outline-none"
                              >
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                              </select>
                            </div>
                            {project.budget > 0 && (
                              <p className="text-sm text-gray-600">
                                Budget: <span className="font-bold text-[#3D4F3B]">{formatCurrency(project.budget)}</span>
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => addProject(section.id)}
                        className="w-full border-[#7B9CA8] text-[#7B9CA8] hover:bg-[#7B9CA8]/5"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Project
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2 border-b border-gray-200">
                    <button
                      onClick={() => setTabForSection(section.id, 'text')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        currentTab === 'text'
                          ? 'text-[#3D4F3B] border-b-2 border-[#C85F3D]'
                          : 'text-gray-500 hover:text-[#3D4F3B]'
                      }`}
                    >
                      Text
                    </button>
                    <button
                      onClick={() => setTabForSection(section.id, 'voice')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        currentTab === 'voice'
                          ? 'text-[#3D4F3B] border-b-2 border-[#C85F3D]'
                          : 'text-gray-500 hover:text-[#3D4F3B]'
                      }`}
                    >
                      Voice
                    </button>
                    <button
                      onClick={() => setTabForSection(section.id, 'upload')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        currentTab === 'upload'
                          ? 'text-[#3D4F3B] border-b-2 border-[#C85F3D]'
                          : 'text-gray-500 hover:text-[#3D4F3B]'
                      }`}
                    >
                      Upload
                    </button>
                  </div>

                  {currentTab === 'text' && (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAIExpand(section.id)}
                          disabled={isProcessing === section.id || !section.content}
                          className="flex items-center gap-2 px-4 py-2 bg-[#7B9CA8] text-white rounded-lg hover:bg-[#7B9CA8]/90 transition-all disabled:opacity-50"
                        >
                          <Sparkles size={16} />
                          {isProcessing === section.id ? 'Expanding...' : 'AI Expand'}
                        </button>
                      </div>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSectionContent(section.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#3D4F3B] focus:outline-none resize-none"
                        rows={8}
                        placeholder="Start typing your content here..."
                      />
                      <p className="text-sm text-gray-500">{section.content.length} characters</p>
                    </div>
                  )}

                  {currentTab === 'voice' && (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center py-8">
                        <button
                          onClick={() => handleVoiceInput(section.id)}
                          className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ${
                            isRecording === section.id
                              ? 'bg-gradient-to-br from-[#C85F3D] to-[#E6B84D] animate-pulse'
                              : 'bg-gradient-to-br from-[#C85F3D] to-[#E6B84D] hover:opacity-90'
                          }`}
                        >
                          <Mic size={32} className="text-white" />
                        </button>
                        {isRecording === section.id && (
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-[#C85F3D] rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 30 + 10}px`,
                                  animationDelay: `${i * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-gray-600 mt-2">
                          {isRecording === section.id ? 'Recording...' : 'Click to record'}
                        </p>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-[#3D4F3B] mb-2">
                          Or upload audio file
                        </label>
                        <input
                          type="file"
                          accept="audio/*"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      {section.content && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-[#3D4F3B] mb-2">Transcribed Text:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{section.content}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === 'upload' && (
                    <div className="space-y-4">
                      <div
                        onClick={() => handleFileUpload(section.id)}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#7B9CA8] hover:bg-[#7B9CA8]/5 transition-colors"
                      >
                        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-[#3D4F3B] font-medium mb-2">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">Supports PDF and Word documents</p>
                      </div>
                      {section.content && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-[#3D4F3B] mb-2">Extracted Content:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{section.content}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={addCustomSection}
        className="w-full border-2 border-[#C85F3D] text-[#C85F3D] hover:bg-[#C85F3D]/5 py-3 font-medium"
      >
        <Plus size={20} className="mr-2" />
        Add Custom Section
      </Button>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-gray-300 text-gray-600"
          >
            Previous Step
          </Button>
          <Button
            variant="secondary"
            className="border-[#7B9CA8] text-[#7B9CA8] hover:bg-[#7B9CA8]/5"
          >
            <Save size={16} className="mr-2" />
            Save Draft
          </Button>
        </div>
        <Button
          variant="gradient"
          onClick={onNext}
          className="bg-gradient-to-br from-[#C85F3D] to-[#E6B84D] text-white px-8 py-3 text-lg"
        >
          Next: Select Images
        </Button>
      </div>
    </div>
  );
}
