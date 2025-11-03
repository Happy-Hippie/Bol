import { useState, useEffect } from 'react';
import { Image as ImageIcon, Check, Upload, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface Step3Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

export function Step3Images({ data, onUpdate, onNext, onPrevious }: Step3Props) {
  const { user } = useAuth();
  const [images, setImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>(data.selectedImages || []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadImages();
  }, [user]);

  const loadImages = async () => {
    if (!user) return;
    const { data: imageData } = await supabase
      .from('image_library')
      .select('*')
      .eq('org_id', user.id);

    if (imageData) setImages(imageData);
  };

  const toggleImage = (id: string) => {
    const updated = selectedImages.includes(id)
      ? selectedImages.filter(i => i !== id)
      : [...selectedImages, id];
    setSelectedImages(updated);
    onUpdate({ selectedImages: updated });
  };

  const filteredImages = images.filter(img =>
    img.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-bol-purple mb-2">Select Images</h2>
        <p className="text-gray-600">Choose images to include in your report</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-bol-purple mb-4">Your Image Library</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search images..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                />
              </div>
            </div>

            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">No images available</h3>
                <p className="text-gray-500 mb-4">Upload images to your library to include them in reports</p>
                <button className="px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  <Upload size={20} className="inline mr-2" />
                  Upload Images
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => toggleImage(image.id)}
                    className={`relative aspect-square rounded-lg border-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedImages.includes(image.id)
                        ? 'border-bol-pink'
                        : 'border-gray-200 hover:border-bol-purple'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                      <ImageIcon size={40} className="text-gray-400" />
                    </div>
                    {selectedImages.includes(image.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-bol-pink rounded-full flex items-center justify-center">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-md">
                      <p className="text-xs truncate">{image.filename}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-bol-purple mb-4">Selected Images</h3>
            <div className="mb-6">
              <div className="text-center py-8">
                <p className="text-3xl font-bold text-bol-purple mb-2">{selectedImages.length}</p>
                <p className="text-sm text-gray-600">images selected</p>
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="space-y-3">
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Cover Image</h4>
                  <div className="aspect-video bg-gradient-to-br from-bol-purple to-bol-blue rounded-lg flex items-center justify-center">
                    <ImageIcon size={40} className="text-white" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    First selected image will be used as cover
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ← Previous Step
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Next: Preview & Review →
        </button>
      </div>
    </div>
  );
}
