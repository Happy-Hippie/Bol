import { useState } from 'react';
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '../Button';

interface LogoUploadSlotProps {
  label: string;
  required?: boolean;
  isPrimary?: boolean;
  onFileSelect: (file: File) => void;
  currentFile?: {
    name: string;
    url: string;
    width: number;
    height: number;
  } | null;
  onDelete?: () => void;
}

export function LogoUploadSlot({
  label,
  required = false,
  isPrimary = false,
  onFileSelect,
  currentFile,
  onDelete,
}: LogoUploadSlotProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'image/png' || file.type === 'image/svg+xml') {
        onFileSelect(file);
      } else {
        alert('Please upload PNG or SVG files only.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'image/png' || file.type === 'image/svg+xml') {
        onFileSelect(file);
      } else {
        alert('Please upload PNG or SVG files only.');
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-bol-purple">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isPrimary && <Star size={16} className="text-bol-orange fill-bol-orange" />}
      </div>

      {!currentFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragActive
              ? 'border-bol-purple bg-bol-purple/5'
              : 'border-bol-purple/40 hover:border-bol-purple bg-gray-50'
          }`}
        >
          <input
            type="file"
            onChange={handleChange}
            accept=".png,.svg"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pointer-events-none">
            <Upload className="mx-auto mb-2 text-bol-purple" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Drag & drop or <span className="text-bol-blue font-medium">browse</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-bol-blue text-white rounded">PNG/SVG</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: 1000 × 1000 px (square)</p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-bol-purple/40 rounded-lg p-4 bg-white">
          <div className="flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
              {currentFile.url ? (
                <img
                  src={currentFile.url}
                  alt={currentFile.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="text-gray-400" size={32} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-bol-purple truncate mb-1">
                {currentFile.name}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                {currentFile.name.toLowerCase().endsWith('.svg') ? 'SVG' : 'PNG'}
              </p>
              <p className="text-xs text-gray-500">
                {currentFile.width} × {currentFile.height} px
              </p>
              <div className="flex gap-2 mt-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleChange}
                    accept=".png,.svg"
                    className="hidden"
                  />
                  <span className="text-xs text-bol-blue hover:text-bol-purple font-medium">
                    Replace
                  </span>
                </label>
                {onDelete && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={onDelete}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
