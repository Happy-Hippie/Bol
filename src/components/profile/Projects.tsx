import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { Card } from '../Card';
import { Modal } from '../Modal';
import { formatINR, getINRDescription } from '../../utils/indianStates';

interface Project {
  id: string;
  name: string;
  description: string;
  context: string | null;
  status: 'active' | 'completed' | 'on-hold';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
}

export function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    context: '',
    status: 'active' as 'active' | 'completed' | 'on-hold',
    start_date: '',
    end_date: '',
    budget: '',
  });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      const contextText = project.context || '';
      setFormData({
        name: project.name,
        description: project.description,
        context: contextText,
        status: project.status,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        budget: project.budget?.toString() || '',
      });
      setCharCount(contextText.length);
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        context: '',
        status: 'active',
        start_date: '',
        end_date: '',
        budget: '',
      });
      setCharCount(0);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!user) return;

    const projectData = {
      org_id: user.id,
      name: formData.name,
      description: formData.description,
      context: formData.context || null,
      status: formData.status,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      budget: formData.budget ? parseFloat(formData.budget.replace(/,/g, '')) : null,
    };

    if (editingProject) {
      await supabase
        .from('projects')
        .update({ ...projectData, updated_at: new Date().toISOString() })
        .eq('id', editingProject.id);
    } else {
      await supabase.from('projects').insert(projectData);
    }

    setShowModal(false);
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-bol-orange text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'on-hold': return 'bg-gray-400 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your organization's projects</p>
        <Button variant="gradient" onClick={() => handleOpenModal()}>
          <Plus size={20} className="inline mr-2" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} borderColor="purple" className="transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-bol-purple">{project.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>

                  {expandedId === project.id && (
                    <div className="border-l-4 border-bol-blue pl-4 py-2 space-y-2 bg-bol-blue/5 rounded-r">
                      {project.start_date && (
                        <p className="text-sm">
                          <span className="font-medium text-bol-purple">Start:</span>{' '}
                          {new Date(project.start_date).toLocaleDateString()}
                        </p>
                      )}
                      {project.end_date && (
                        <p className="text-sm">
                          <span className="font-medium text-bol-purple">End:</span>{' '}
                          {new Date(project.end_date).toLocaleDateString()}
                        </p>
                      )}
                      {project.budget && (
                        <p className="text-sm">
                          <span className="font-medium text-bol-purple">Budget:</span>{' '}
                          {getINRDescription(project.budget)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                    className="p-2 text-bol-blue hover:bg-bol-blue hover:text-white rounded-lg transition-all duration-200"
                  >
                    {expandedId === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(project)}
                    className="p-2 text-bol-blue hover:bg-bol-blue hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-bol-pink hover:bg-bol-pink hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-bol-purple font-medium mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              placeholder="Project name"
            />
          </div>

          <div>
            <label className="block text-bol-purple font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              rows={3}
              placeholder="Project description"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-bol-purple font-medium">Project Context</label>
              <Info
                size={16}
                className="text-bol-blue cursor-help"
                title="Describe the thematic background, goals, and relevance"
              />
            </div>
            <textarea
              value={formData.context}
              onChange={(e) => {
                setFormData({ ...formData, context: e.target.value });
                setCharCount(e.target.value.length);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              rows={4}
              placeholder="Describe the thematic background, goals, and relevance of this project. Example: This project addresses the gap in digital literacy among rural women by providing..."
            />
            <div className="flex justify-between items-start mt-2">
              <p className="text-xs text-bol-purple">
                Project context helps the system link your project to the right frameworks, visuals, and templates for communication outputs.
              </p>
              <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {charCount} characters {charCount >= 200 && charCount <= 500 ? '✓' : '(recommended: 200-500)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-bol-purple font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-bol-purple font-medium mb-2">
                Budget <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                  ₹
                </span>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value) {
                      setFormData({ ...formData, budget: formatINR(parseInt(value)) });
                    } else {
                      setFormData({ ...formData, budget: '' });
                    }
                  }}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                  placeholder="Enter project budget"
                />
              </div>
              {formData.budget && (
                <p className="text-xs text-bol-orange mt-1">
                  {getINRDescription(parseInt(formData.budget.replace(/,/g, '')))}
                </p>
              )}
            </div>

            <div>
              <label className="block text-bol-purple font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-bol-purple font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
