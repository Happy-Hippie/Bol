import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, BookOpen, Lightbulb, FileStack, Megaphone, Newspaper, FileBarChart, Microscope, FolderOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { Card } from '../Card';

interface LibraryFile {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  category: string;
  created_at: string;
}

type CategoryType = 'reports' | 'resources' | 'iec' | 'press' | 'policy' | 'research' | 'other';

export function ContextLibrary() {
  const { user } = useAuth();
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('reports');

  const categories = [
    { id: 'reports' as CategoryType, label: 'Previous Reports', icon: FileText, color: 'blue' },
    { id: 'resources' as CategoryType, label: 'Resources', icon: BookOpen, color: 'purple' },
    { id: 'iec' as CategoryType, label: 'IEC Material', icon: Megaphone, color: 'orange' },
    { id: 'press' as CategoryType, label: 'Press Releases', icon: Newspaper, color: 'pink' },
    { id: 'policy' as CategoryType, label: 'Policy Briefs', icon: FileBarChart, color: 'green' },
    { id: 'research' as CategoryType, label: 'Research Papers', icon: Microscope, color: 'indigo' },
    { id: 'other' as CategoryType, label: 'Other Documents', icon: FolderOpen, color: 'gray' },
  ];

  useEffect(() => {
    loadFiles();
  }, [user]);

  const loadFiles = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('context_library')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setFiles(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: CategoryType) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fakeUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;

    const { error } = await supabase.from('context_library').insert({
      org_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_url: fakeUrl,
      file_size: file.size,
      category,
    });

    if (!error) {
      loadFiles();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;

    const { error } = await supabase
      .from('context_library')
      .delete()
      .eq('id', id);

    if (!error) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCategoryFiles = (category: CategoryType) => {
    return files.filter(f => f.category === category);
  };

  const getCategoryIcon = (categoryId: CategoryType) => {
    return categories.find(c => c.id === categoryId)?.icon || FileText;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 border-l-4 border-bol-blue">
        <div className="flex gap-4">
          <BookOpen className="text-bol-blue flex-shrink-0" size={32} />
          <div>
            <h2 className="text-lg font-bold text-bol-purple mb-2">
              Understanding the Context Library
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              The Context Library helps BOL understand your organization's areas of work and past activities.
              It enables the system to curate relevant content, templates, and recommendations tailored to your focus areas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold text-bol-purple mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const categoryFiles = getCategoryFiles(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-bol-purple text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                  {categoryFiles.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-bol-blue text-white'
                    }`}>
                      {categoryFiles.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-bol-purple">
                {categories.find(c => c.id === selectedCategory)?.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {getCategoryFiles(selectedCategory).length} document(s)
              </p>
            </div>
            <label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => handleFileUpload(e, selectedCategory)}
                className="hidden"
              />
              <Button variant="gradient" className="cursor-pointer">
                <Upload size={16} className="mr-2" />
                Upload to {categories.find(c => c.id === selectedCategory)?.label}
              </Button>
            </label>
          </div>

          <div className="bg-orange-50 border-l-4 border-bol-orange p-4 rounded-lg mb-4">
            <div className="flex gap-3">
              <div className="text-xs px-2 py-1 bg-bol-orange text-white rounded font-medium h-fit">
                PDF
              </div>
              <div className="text-xs px-2 py-1 bg-bol-orange text-white rounded font-medium h-fit">
                DOCX
              </div>
              <span className="text-sm text-gray-600 self-center">Accepted formats</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : getCategoryFiles(selectedCategory).length === 0 ? (
            <Card className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No documents in this category yet</p>
              <p className="text-sm text-gray-400">Upload your first document using the button above</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCategoryFiles(selectedCategory).map((file) => {
                const Icon = getCategoryIcon(file.category as CategoryType);
                return (
                  <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-bol-purple/10 to-bol-pink/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={32} className="text-bol-purple" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-bol-purple mb-1 truncate" title={file.file_name}>
                          {file.file_name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(file.created_at).toLocaleDateString('en-IN')}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-bol-blue text-white rounded">
                            {file.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </span>
                          <span className="text-xs text-gray-500">{formatFileSize(file.file_size)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="mt-3 w-full py-2 text-sm text-bol-pink hover:bg-bol-pink hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-bol-orange p-4 rounded-lg">
        <div className="flex gap-3">
          <Lightbulb className="text-bol-orange flex-shrink-0" size={24} />
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> Upload any documents that best represent your organization's or project's body of work.
            These files will help the CRM generate more context-aware content.
          </p>
        </div>
      </div>
    </div>
  );
}
