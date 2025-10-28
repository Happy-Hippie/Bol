import { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Eye, Edit2, Trash2, Download, Search, Grid3x3, List, Maximize2, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Card } from './Card';
import { Modal } from './Modal';

interface ImageFile {
  id: string;
  file_name: string;
  alt_text: string;
  caption: string;
  image_type: string;
  copyright_info: string;
  tags: string[];
  width: number;
  height: number;
  file_size: number;
  file_url: string;
  linked_projects: string[];
  created_at: string;
}

interface Project {
  id: string;
  name: string;
}

type ViewMode = 'grid' | 'list';

export function ImageLibrary() {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editFormData, setEditFormData] = useState({
    file_name: '',
    alt_text: '',
    caption: '',
    image_type: '',
    copyright_info: '',
    tags: '',
    linked_projects: [] as string[],
  });

  useEffect(() => {
    loadImages();
    loadProjects();
  }, [user]);

  const loadImages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('image_library')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setImages(data);
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
    const files = e.target.files;
    if (!files || !user) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const fakeUrl = event.target?.result as string;

          await supabase.from('image_library').insert({
            org_id: user.id,
            file_name: file.name,
            alt_text: '',
            caption: '',
            image_type: 'general',
            copyright_info: '',
            tags: [],
            width: img.width,
            height: img.height,
            file_size: file.size,
            file_url: fakeUrl,
            linked_projects: [],
          });

          loadImages();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDetail = (image: ImageFile) => {
    setSelectedImage(image);
    setEditFormData({
      file_name: image.file_name,
      alt_text: image.alt_text || '',
      caption: image.caption || '',
      image_type: image.image_type || 'general',
      copyright_info: image.copyright_info || '',
      tags: image.tags?.join(', ') || '',
      linked_projects: image.linked_projects || [],
    });
    setShowDetailModal(true);
  };

  const handleSaveDetails = async () => {
    if (!selectedImage) return;

    const { error } = await supabase
      .from('image_library')
      .update({
        file_name: editFormData.file_name,
        alt_text: editFormData.alt_text,
        caption: editFormData.caption,
        image_type: editFormData.image_type,
        copyright_info: editFormData.copyright_info,
        tags: editFormData.tags.split(',').map(t => t.trim()).filter(t => t),
        linked_projects: editFormData.linked_projects,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedImage.id);

    if (!error) {
      setShowDetailModal(false);
      loadImages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;

    const { error } = await supabase
      .from('image_library')
      .delete()
      .eq('id', id);

    if (!error) {
      setImages(images.filter(img => img.id !== id));
      if (selectedImage?.id === id) {
        setShowDetailModal(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedImages.length} selected images?`)) return;

    const { error } = await supabase
      .from('image_library')
      .delete()
      .in('id', selectedImages);

    if (!error) {
      setImages(images.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    }
  };

  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imgId => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTotalStorage = () => {
    const total = images.reduce((sum, img) => sum + img.file_size, 0);
    const maxStorage = 5 * 1024 * 1024 * 1024;
    return {
      used: total,
      max: maxStorage,
      percentage: (total / maxStorage) * 100,
    };
  };

  const filteredImages = images.filter(img =>
    img.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const storage = getTotalStorage();

  return (
    <div>
      <div className="bg-gradient-to-r from-bol-pink to-bol-orange rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon size={40} />
          <h1 className="text-4xl font-bold">Image Library</h1>
        </div>
        <p className="text-white/90 text-lg">
          Manage visual assets for your communications
        </p>
      </div>

      <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl p-6 mb-8">
        <p className="text-gray-700 text-center leading-relaxed">
          Upload and manage images for use in CRM-generated materials such as reports, event collaterals, and social media content.
        </p>
      </div>

      <div className="mb-6">
        <label className="block">
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-bol-pink/40 rounded-xl p-12 text-center cursor-pointer hover:border-bol-pink hover:bg-bol-pink/5 transition-all">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-bol-pink to-bol-orange rounded-full flex items-center justify-center">
              <Upload className="text-white" size={40} />
            </div>
            <h3 className="text-xl font-bold text-bol-purple mb-2">Upload Images</h3>
            <p className="text-gray-600 mb-4">or drag and drop</p>
            <div className="flex gap-2 justify-center">
              <span className="text-xs px-3 py-1 bg-bol-pink text-white rounded">JPEG</span>
              <span className="text-xs px-3 py-1 bg-bol-pink text-white rounded">PNG</span>
            </div>
          </div>
        </label>
      </div>

      <div className="bg-blue-50 border-l-4 border-bol-blue p-4 rounded-lg mb-6">
        <div className="flex gap-3">
          <AlertCircle className="text-bol-blue flex-shrink-0" size={20} />
          <div className="text-sm text-gray-700">
            <p className="font-bold mb-2">Recommended Image Sizes:</p>
            <ul className="space-y-1 ml-4">
              <li>• Profile/Logo Images: 1000 × 1000 px</li>
              <li>• Banner/Hero Images: 1920 × 1080 px</li>
              <li>• Event/Contextual Images: Minimum 1200 × 800 px</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-bol-orange p-4 rounded-lg mb-6">
        <div className="flex gap-3">
          <AlertCircle className="text-bol-orange flex-shrink-0" size={20} />
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> Please upload high-quality, copyright-cleared images only. These images may be automatically used in CRM-generated materials.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none bg-white">
            <option>All Images</option>
            <option>By Project</option>
            <option>By Type</option>
            <option>By Date</option>
          </select>

          <div className="flex gap-1 border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-bol-purple text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-bol-purple text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Your Image Library is Empty</h3>
          <p className="text-gray-500 mb-4">Upload high-quality images to use in reports, social media, and other communication materials.</p>
          <label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="gradient" className="cursor-pointer">
              <Upload size={20} className="mr-2" />
              Upload Your First Images
            </Button>
          </label>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="group relative cursor-pointer overflow-hidden"
                  onClick={() => handleOpenDetail(image)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden relative">
                    <img
                      src={image.file_url}
                      alt={image.alt_text || image.file_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="text-white" size={32} />
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleImageSelection(image.id);
                      }}
                      className="absolute top-2 left-2 w-5 h-5 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <p className="text-sm font-medium text-bol-purple truncate" title={image.file_name}>
                    {image.file_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {image.width} × {image.height}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.file_size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(image.created_at).toLocaleDateString('en-IN')}
                  </p>
                  {image.linked_projects && image.linked_projects.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-bol-blue text-white rounded">
                        {image.linked_projects.length} project{image.linked_projects.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="group cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenDetail(image)}
                >
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleImageSelection(image.id);
                      }}
                      className="w-5 h-5 cursor-pointer self-center"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={image.file_url}
                        alt={image.alt_text || image.file_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-bol-purple mb-1">{image.file_name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {image.width} × {image.height} • {formatFileSize(image.file_size)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(image.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(image);
                        }}
                        className="p-2 text-bol-blue hover:bg-bol-blue hover:text-white rounded transition-all"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image.id);
                        }}
                        className="p-2 text-bol-pink hover:bg-bol-pink hover:text-white rounded transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedImages.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bol-purple text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50">
          <span className="font-medium">{selectedImages.length} images selected</span>
          <Button
            variant="secondary"
            onClick={handleBulkDelete}
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
          <button
            onClick={() => setSelectedImages([])}
            className="text-white/80 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg p-4 border-2 border-gray-200">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-full border-4 flex items-center justify-center ${
            storage.percentage < 50 ? 'border-green-500 text-green-600' :
            storage.percentage < 80 ? 'border-orange-500 text-orange-600' :
            'border-pink-500 text-pink-600'
          }`}>
            <span className="text-xs font-bold">{storage.percentage.toFixed(0)}%</span>
          </div>
          <p className="text-xs text-gray-600">
            {formatFileSize(storage.used)} / {formatFileSize(storage.max)}
          </p>
        </div>
      </div>

      {showDetailModal && selectedImage && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Image Details"
          size="xl"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage.file_url}
                  alt={selectedImage.alt_text || selectedImage.file_name}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filename
                </label>
                <input
                  type="text"
                  value={editFormData.file_name}
                  onChange={(e) => setEditFormData({ ...editFormData, file_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (for accessibility)
                </label>
                <input
                  type="text"
                  value={editFormData.alt_text}
                  onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                  placeholder="Describe this image..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={`${selectedImage.width} × ${selectedImage.height} px`}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formatFileSize(selectedImage.file_size)}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Date
                </label>
                <input
                  type="text"
                  value={new Date(selectedImage.created_at).toLocaleDateString('en-IN')}
                  disabled
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Type
                </label>
                <select
                  value={editFormData.image_type}
                  onChange={(e) => setEditFormData({ ...editFormData, image_type: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none bg-white"
                >
                  <option value="profile">Profile</option>
                  <option value="banner">Banner</option>
                  <option value="event">Event</option>
                  <option value="general">General</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={editFormData.caption}
                  onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                  rows={2}
                  placeholder="Add a caption..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copyright Info
                </label>
                <input
                  type="text"
                  value={editFormData.copyright_info}
                  onChange={(e) => setEditFormData({ ...editFormData, copyright_info: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
                  placeholder="Copyright information..."
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
                  Associated Projects
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
                  onClick={() => handleDelete(selectedImage.id)}
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
          </div>
        </Modal>
      )}
    </div>
  );
}
