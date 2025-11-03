import { useState, useEffect } from 'react';
import { Compass, Upload, Eye, Edit2, Link, Trash2, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Card } from './Card';
import { Modal } from './Modal';

interface Perspective {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  linked_projects: string[];
  created_at: string;
}

interface Project {
  id: string;
  name: string;
}

export function Perspectives() {
  const { user } = useAuth();
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerspective, setSelectedPerspective] = useState<Perspective | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    linked_projects: [] as string[],
  });

  const categories = [
    { id: 'human-rights', label: 'Human Rights Frameworks', color: 'purple' },
    { id: 'sdg', label: 'Sustainable Development Goals', color: 'blue' },
    { id: 'sector', label: 'Sector-Specific Guidelines', color: 'green' },
    { id: 'organizational', label: 'Organizational Protocols', color: 'orange' },
    { id: 'policy', label: 'Policies & Standards', color: 'pink' },
    { id: 'other', label: 'Other Frameworks', color: 'gray' },
  ];

  useEffect(() => {
    loadPerspectives();
    loadProjects();
  }, [user]);

  const loadPerspectives = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('perspectives')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setPerspectives(data);
    }
    setLoading(false);
  };

  const loadProjects = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('projects')
      .select('id, name')
      .eq('org_id', user.id);

    if (data) {
      setProjects(data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fakeUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;

    const { error } = await supabase.from('perspectives').insert({
      org_id: user.id,
      title: file.name,
      category: 'other',
      description: '',
      tags: [],
      file_name: file.name,
      file_type: file.type,
      file_url: fakeUrl,
      file_size: file.size,
      linked_projects: [],
    });

    if (!error) {
      loadPerspectives();
    }
  };

  const handleOpenDetail = (perspective: Perspective) => {
    setSelectedPerspective(perspective);
    setEditFormData({
      title: perspective.title,
      category: perspective.category,
      description: perspective.description || '',
      tags: perspective.tags?.join(', ') || '',
      linked_projects: perspective.linked_projects || [],
    });
    setShowDetailModal(true);
  };

  const handleSaveDetails = async () => {
    if (!selectedPerspective) return;

    const { error } = await supabase
      .from('perspectives')
      .update({
        title: editFormData.title,
        category: editFormData.category,
        description: editFormData.description,
        tags: editFormData.tags.split(',').map(t => t.trim()).filter(t => t),
        linked_projects: editFormData.linked_projects,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedPerspective.id);

    if (!error) {
      setShowDetailModal(false);
      loadPerspectives();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this perspective document?')) return;

    const { error } = await supabase
      .from('perspectives')
      .delete()
      .eq('id', id);

    if (!error) {
      setPerspectives(perspectives.filter(p => p.id !== id));
      if (selectedPerspective?.id === id) {
        setShowDetailModal(false);
      }
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.color || 'gray';
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.label || 'Other Frameworks';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTagColor = (category: string) => {
    const colors: Record<string, string> = {
      'human-rights': 'bg-purple-100 text-purple-700',
      'sdg': 'bg-blue-100 text-blue-700',
      'sector': 'bg-green-100 text-green-700',
      'organizational': 'bg-orange-100 text-orange-700',
      'policy': 'bg-pink-100 text-pink-700',
      'other': 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.other;
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-bol-purple to-bol-blue rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Compass size={40} />
          <h1 className="text-4xl font-bold">Perspectives & Frameworks</h1>
        </div>
        <p className="text-white/90 text-lg">
          Manage guiding documents for your organization
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8">
        <p className="text-gray-700 text-center leading-relaxed">
          Upload frameworks, perspectives, or reference documents that guide your organization's work.
          These documents help ensure that all content generated by BOL aligns with your organization's principles and frameworks.
        </p>
      </div>

      <div className="mb-8">
        <label className="block">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-bol-purple/40 rounded-xl p-12 text-center cursor-pointer hover:border-bol-purple hover:bg-bol-purple/5 transition-all">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-bol-purple to-bol-pink rounded-full flex items-center justify-center">
              <Upload className="text-white" size={40} />
            </div>
            <h3 className="text-xl font-bold text-bol-purple mb-2">Upload Framework Documents</h3>
            <p className="text-gray-600 mb-4">Drag and drop or click to browse</p>
            <div className="flex gap-2 justify-center">
              <span className="text-xs px-3 py-1 bg-bol-blue text-white rounded">PDF</span>
              <span className="text-xs px-3 py-1 bg-bol-blue text-white rounded">DOCX</span>
              <span className="text-xs px-3 py-1 bg-bol-blue text-white rounded">TXT</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Supports multiple file upload</p>
          </div>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : perspectives.length === 0 ? (
        <div className="text-center py-12">
          <Compass size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Framework Documents Yet</h3>
          <p className="text-gray-500">Upload your first framework document using the area above</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-bol-purple mb-4">Uploaded Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {perspectives.map((perspective) => (
              <Card
                key={perspective.id}
                className="group hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleOpenDetail(perspective)}
              >
                <div className="flex gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    getCategoryColor(perspective.category) === 'purple' ? 'bg-purple-100' :
                    getCategoryColor(perspective.category) === 'blue' ? 'bg-blue-100' :
                    getCategoryColor(perspective.category) === 'green' ? 'bg-green-100' :
                    getCategoryColor(perspective.category) === 'orange' ? 'bg-orange-100' :
                    getCategoryColor(perspective.category) === 'pink' ? 'bg-pink-100' :
                    'bg-gray-100'
                  }`}>
                    <Compass className={`${
                      getCategoryColor(perspective.category) === 'purple' ? 'text-purple-600' :
                      getCategoryColor(perspective.category) === 'blue' ? 'text-blue-600' :
                      getCategoryColor(perspective.category) === 'green' ? 'text-green-600' :
                      getCategoryColor(perspective.category) === 'orange' ? 'text-orange-600' :
                      getCategoryColor(perspective.category) === 'pink' ? 'text-pink-600' :
                      'text-gray-600'
                    }`} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-bol-purple mb-1 truncate" title={perspective.title}>
                      {perspective.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${getTagColor(perspective.category)}`}>
                      {getCategoryLabel(perspective.category)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>Uploaded: {new Date(perspective.created_at).toLocaleDateString('en-IN')}</p>
                  <p>Size: {formatFileSize(perspective.file_size)}</p>
                </div>

                {perspective.linked_projects && perspective.linked_projects.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Linked to {perspective.linked_projects.length} project(s)
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(perspective);
                    }}
                    className="p-2 text-bol-blue hover:bg-bol-blue hover:text-white rounded transition-all"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(perspective);
                    }}
                    className="p-2 text-bol-orange hover:bg-bol-orange hover:text-white rounded transition-all"
                    title="Edit details"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(perspective);
                    }}
                    className="p-2 text-bol-purple hover:bg-bol-purple hover:text-white rounded transition-all"
                    title="Link to projects"
                  >
                    <Link size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(perspective.id);
                    }}
                    className="p-2 text-bol-pink hover:bg-bol-pink hover:text-white rounded transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-orange-50 border-l-4 border-bol-orange p-4 rounded-lg">
        <div className="flex gap-3">
          <ShieldCheck className="text-bol-orange flex-shrink-0" size={24} />
          <p className="text-sm text-gray-700">
            These documents help ensure that all content generated by BOL aligns with your organization's principles and frameworks.
          </p>
        </div>
      </div>

      {showDetailModal && selectedPerspective && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Document Details"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                rows={3}
                placeholder="Describe this framework document..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={editFormData.tags}
                onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Projects
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {projects.map((project) => (
                  <label key={project.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.linked_projects.includes(project.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditFormData({
                            ...editFormData,
                            linked_projects: [...editFormData.linked_projects, project.id],
                          });
                        } else {
                          setEditFormData({
                            ...editFormData,
                            linked_projects: editFormData.linked_projects.filter(id => id !== project.id),
                          });
                        }
                      }}
                      className="w-4 h-4 text-bol-purple"
                    />
                    <span className="text-sm">{project.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedPerspective.id)}
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
                <Button variant="gradient" onClick={handleSaveDetails}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
