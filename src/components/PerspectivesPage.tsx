import { useState, useEffect } from 'react';
import { Compass, Search, Grid, List, AlertTriangle, Target, Shield, FileText, Building2, DollarSign, Book, Folder, Download, Eye, Link as LinkIcon, Pencil, Trash2, Upload, X, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Perspective {
  id: string;
  org_id: string;
  title: string;
  category: string;
  description: string | null;
  tags: string[];
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  linked_projects: string[];
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  helperText: string;
}

const categories: Category[] = [
  { id: 'sdg', name: 'SDG Documents', icon: Target, color: '#2563A5', helperText: 'SDG alignment' },
  { id: 'human-rights', name: 'Human Rights Frameworks', icon: Shield, color: '#D946A6', helperText: 'human rights' },
  { id: 'protocols', name: 'Protocols & Guidelines', icon: FileText, color: '#4A1A5C', helperText: 'protocols and guidelines' },
  { id: 'sector', name: 'Sector-Specific Documentation', icon: Building2, color: '#F59E42', helperText: 'sector-specific' },
  { id: 'grant', name: 'Grant-Based Requirements', icon: DollarSign, color: '#2563A5', helperText: 'grant requirements' },
  { id: 'organizational', name: 'Organisational Policies', icon: Book, color: '#4A1A5C', helperText: 'organizational policies' },
  { id: 'other', name: 'Other Frameworks', icon: Folder, color: '#6B7280', helperText: 'other frameworks' },
];

export function PerspectivesPage() {
  const { user } = useAuth();
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'usage'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Perspective | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [perspectivesRes, projectsRes] = await Promise.all([
        supabase
          .from('perspectives')
          .select('*')
          .eq('org_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('projects')
          .select('*')
          .eq('org_id', user?.id)
      ]);

      if (perspectivesRes.data) setPerspectives(perspectivesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDocs = () => {
    let filtered = perspectives;

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'usage':
          return (b.linked_projects?.length || 0) - (a.linked_projects?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getDocsByCategory = (categoryId: string) => {
    return perspectives.filter(doc => doc.category === categoryId);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toLocaleString('en-IN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + ' MB';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this framework document?')) return;

    try {
      const { error } = await supabase
        .from('perspectives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPerspectives(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedDocs.length} documents?`)) return;

    try {
      const { error } = await supabase
        .from('perspectives')
        .delete()
        .in('id', selectedDocs);

      if (error) throw error;
      setPerspectives(prev => prev.filter(doc => !selectedDocs.includes(doc.id)));
      setSelectedDocs([]);
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bol-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading frameworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-bol-pink to-bol-orange p-3 rounded-xl">
            <Compass className="text-white" size={32} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">Profile / Perspectives & Frameworks</div>
            <h1 className="text-4xl font-bold text-bol-purple">Perspectives & Frameworks</h1>
            <p className="text-gray-600 mt-1">Guiding principles and frameworks for your organization's work</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-bol-blue to-bol-purple text-white p-6 rounded-xl">
          <p className="text-lg leading-relaxed">
            Upload frameworks, perspectives, or reference documents that guide your organization's work. These documents help ensure that all content generated by BOL aligns with your organization's principles and frameworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="name">Sort by: Name A-Z</option>
            <option value="usage">Sort by: Most Used</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-bol-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-bol-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {categories.map(category => {
            const docs = getDocsByCategory(category.id);
            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-bol-pink to-bol-orange p-2 rounded-lg">
                        <CategoryIcon className="text-white" size={24} />
                      </div>
                      <h2 className="text-xl font-semibold text-bol-purple">{category.name}</h2>
                      <span className="px-3 py-1 bg-bol-orange text-white text-sm font-bold rounded-full">
                        {docs.length} documents
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setUploadCategory(category.id);
                        setShowUploadModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      <Plus size={20} />
                      Upload to {category.name}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-bol-orange/10 text-bol-orange text-sm font-medium rounded-full">
                      PDF, DOCX, TXT
                    </span>
                    <span className="text-sm text-gray-600">
                      Upload frameworks that guide your {category.helperText} work
                    </span>
                  </div>
                </div>

                {docs.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="bg-gradient-to-br from-bol-purple to-bol-pink p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                      <CategoryIcon className="text-white" size={60} />
                    </div>
                    <h3 className="text-2xl font-semibold text-bol-purple mb-2">
                      No {category.name} Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Upload frameworks and guidelines to ensure your content aligns with {category.helperText} principles
                    </p>
                    <button
                      onClick={() => {
                        setUploadCategory(category.id);
                        setShowUploadModal(true);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Upload Your First Document
                    </button>
                  </div>
                ) : (
                  <div className={`p-6 ${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-4'
                  }`}>
                    {docs.map(doc => (
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        category={category}
                        viewMode={viewMode}
                        isSelected={selectedDocs.includes(doc.id)}
                        onToggleSelect={toggleSelection}
                        onEdit={(doc) => {
                          setSelectedDoc(doc);
                          setShowDetailModal(true);
                        }}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                        formatFileSize={formatFileSize}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-bol-orange/10 border-l-4 border-bol-orange p-5 rounded-lg flex gap-4">
          <AlertTriangle className="text-bol-orange flex-shrink-0" size={24} />
          <p className="text-gray-700">
            These framework documents help the AI assistant and report generator align all content with your organization's guiding principles. Documents are searchable and linkable to specific projects.
          </p>
        </div>
      </div>

      {selectedDocs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-bol-purple text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-semibold">{selectedDocs.length} documents selected</span>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-white text-bol-purple rounded-lg hover:bg-gray-100 transition-colors">
                Link to Projects
              </button>
              <button className="px-4 py-2 bg-white text-bol-purple rounded-lg hover:bg-gray-100 transition-colors">
                Download All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedDocs([])}
                className="px-4 py-2 border border-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <UploadModal
          category={uploadCategory}
          categories={categories}
          projects={projects}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={loadData}
          userId={user?.id || ''}
        />
      )}

      {showDetailModal && selectedDoc && (
        <DetailModal
          doc={selectedDoc}
          categories={categories}
          projects={projects}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedDoc(null);
          }}
          onUpdate={loadData}
          onDelete={(id) => {
            handleDelete(id);
            setShowDetailModal(false);
            setSelectedDoc(null);
          }}
        />
      )}
    </div>
  );
}

interface DocumentCardProps {
  doc: Perspective;
  category: Category;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (doc: Perspective) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  formatFileSize: (bytes: number) => string;
}

function DocumentCard({
  doc,
  category,
  viewMode,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  formatDate,
  formatFileSize
}: DocumentCardProps) {
  const CategoryIcon = category.icon;

  return (
    <div
      className={`bg-white rounded-xl border-l-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-bol-purple' : ''
      }`}
      style={{ borderLeftColor: category.color }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(doc.id)}
            className="mt-1 w-5 h-5 text-bol-purple rounded focus:ring-2 focus:ring-bol-purple"
          />
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <div style={{ color: category.color }}>
                <CategoryIcon size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-bol-purple truncate">{doc.title}</h3>
                <span
                  className="inline-block px-2 py-0.5 text-xs text-white rounded-full mt-1"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              </div>
            </div>
            {doc.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{doc.description}</p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
              <span>{formatDate(doc.created_at)}</span>
              <span>•</span>
              <span>{formatFileSize(doc.file_size)}</span>
              {doc.linked_projects && doc.linked_projects.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-bol-blue">
                    Used in {doc.linked_projects.length} {doc.linked_projects.length === 1 ? 'project' : 'projects'}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(doc)}
                className="p-2 text-bol-blue hover:bg-bol-blue/10 rounded-lg transition-colors"
                title="Preview"
              >
                <Eye size={16} />
              </button>
              <button
                className="p-2 text-bol-purple hover:bg-bol-purple/10 rounded-lg transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
              <button
                className="p-2 text-bol-orange hover:bg-bol-orange/10 rounded-lg transition-colors"
                title="Manage Project Links"
              >
                <LinkIcon size={16} />
              </button>
              <button
                onClick={() => onEdit(doc)}
                className="p-2 text-bol-pink hover:bg-bol-pink/10 rounded-lg transition-colors"
                title="Edit Details"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(doc.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UploadModalProps {
  category: string;
  categories: Category[];
  projects: any[];
  onClose: () => void;
  onUploadComplete: () => void;
  userId: string;
}

function UploadModal({ category: initialCategory, categories, projects, onClose, onUploadComplete, userId }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileDetails, setFileDetails] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setFileDetails(prev => [
        ...prev,
        ...newFiles.map(file => ({
          file,
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          tags: [],
          category: initialCategory,
          linkedProjects: []
        }))
      ]);
    }
  };

  const handleUpload = async () => {
    if (fileDetails.length === 0) return;

    setUploading(true);
    try {
      for (const detail of fileDetails) {
        const { error } = await supabase.from('perspectives').insert({
          org_id: userId,
          title: detail.title,
          category: detail.category,
          description: detail.description || null,
          tags: detail.tags,
          file_name: detail.file.name,
          file_type: detail.file.type,
          file_url: URL.createObjectURL(detail.file),
          file_size: detail.file.size,
          linked_projects: detail.linkedProjects
        });

        if (error) throw error;
      }

      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const categoryName = categories.find(c => c.id === initialCategory)?.name || 'Category';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-bol-purple to-bol-blue text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upload to {categoryName}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {files.length === 0 ? (
            <label className="block border-2 border-dashed border-bol-purple rounded-xl p-12 text-center cursor-pointer hover:bg-bol-purple/5 transition-colors">
              <Upload className="mx-auto mb-4 text-bol-purple" size={64} />
              <p className="text-xl font-semibold text-bol-purple mb-2">Drag and drop files here</p>
              <p className="text-gray-600 mb-4">or click to browse</p>
              <span className="inline-block px-4 py-2 bg-bol-orange/10 text-bol-orange text-sm font-medium rounded-full">
                PDF, DOCX, TXT
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              {fileDetails.map((detail, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-bol-purple mb-1">
                      Framework Name
                    </label>
                    <input
                      type="text"
                      value={detail.title}
                      onChange={(e) => {
                        const newDetails = [...fileDetails];
                        newDetails[index].title = e.target.value;
                        setFileDetails(newDetails);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bol-purple mb-1">
                      Description
                    </label>
                    <textarea
                      value={detail.description}
                      onChange={(e) => {
                        const newDetails = [...fileDetails];
                        newDetails[index].description = e.target.value;
                        setFileDetails(newDetails);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bol-purple mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        const newDetails = [...fileDetails];
                        newDetails[index].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        setFileDetails(newDetails);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                      placeholder="e.g., SDG 4, Education, Policy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bol-purple mb-1">
                      Category
                    </label>
                    <select
                      value={detail.category}
                      onChange={(e) => {
                        const newDetails = [...fileDetails];
                        newDetails[index].category = e.target.value;
                        setFileDetails(newDetails);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Plus className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">Add Another File</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Document${files.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailModalProps {
  doc: Perspective;
  categories: Category[];
  projects: any[];
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

function DetailModal({ doc, categories, projects, onClose, onUpdate, onDelete }: DetailModalProps) {
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState(doc.category);
  const [description, setDescription] = useState(doc.description || '');
  const [tags, setTags] = useState(doc.tags.join(', '));
  const [linkedProjects, setLinkedProjects] = useState<string[]>(doc.linked_projects || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('perspectives')
        .update({
          title,
          category,
          description: description || null,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          linked_projects: linkedProjects
        })
        .eq('id', doc.id);

      if (error) throw error;
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toLocaleString('en-IN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex">
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FileText size={120} className="text-bol-purple mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Preview not available</p>
            <button className="px-4 py-2 bg-bol-blue text-white rounded-lg hover:bg-bol-blue/90">
              <Download size={20} className="inline mr-2" />
              Download File
            </button>
          </div>
        </div>

        <div className="w-96 bg-white p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-bol-purple">Framework Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-bol-purple mb-1">
                Framework Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-bol-purple mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-bol-purple mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-bol-purple mb-1">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                placeholder="Comma-separated"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Upload Date
              </label>
              <input
                type="text"
                value={formatDate(doc.created_at)}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                File Size
              </label>
              <input
                type="text"
                value={formatFileSize(doc.file_size)}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-bol-purple mb-2">
                Associated Projects
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {projects.map(project => (
                  <label key={project.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkedProjects.includes(project.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLinkedProjects([...linkedProjects, project.id]);
                        } else {
                          setLinkedProjects(linkedProjects.filter(id => id !== project.id));
                        }
                      }}
                      className="w-4 h-4 text-bol-purple rounded focus:ring-2 focus:ring-bol-purple"
                    />
                    <span className="text-sm">{project.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Linked to {linkedProjects.length} of {projects.length} projects
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this framework document?')) {
                  onDelete(doc.id);
                }
              }}
              className="w-full px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete Framework
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
