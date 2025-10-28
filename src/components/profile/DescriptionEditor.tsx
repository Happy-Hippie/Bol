import { useState } from 'react';
import { FileText, Upload, Eye, X } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionEditor({ value, onChange }: DescriptionEditorProps) {
  const [mode, setMode] = useState<'type' | 'upload'>('type');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
    url: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [charCount, setCharCount] = useState(value.length);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      alert('Please upload PDF or DOCX files only.');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFile({
      name: file.name,
      type: file.type,
      url,
    });
  };

  const handleExtractText = () => {
    const extractedText = `[Extracted text from ${uploadedFile?.name}]\n\nThis is placeholder text that would normally be extracted from the uploaded document. In a production environment, this would use a document processing service to extract the actual text content.`;
    onChange(extractedText);
    setCharCount(extractedText.length);
    setMode('type');
    setUploadedFile(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleRemoveFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('type')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            mode === 'type'
              ? 'bg-bol-purple text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText size={18} />
          Type Description
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            mode === 'upload'
              ? 'bg-bol-purple text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Upload size={18} />
          Upload File
        </button>
      </div>

      {mode === 'type' ? (
        <div>
          <textarea
            value={value}
            onChange={handleTextChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
            placeholder="Enter your organization description..."
            rows={6}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              Basic formatting: **bold**, *italic*, • bullets
            </div>
            <div className="text-xs text-gray-500">
              {charCount} characters
            </div>
          </div>
        </div>
      ) : (
        <div>
          {!uploadedFile ? (
            <label className="block">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-bol-blue hover:bg-gray-50 transition-all">
                <Upload className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="text-gray-700 font-medium mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  DOCX or PDF files only
                </p>
                <div className="flex gap-2 justify-center">
                  <span className="text-xs px-3 py-1 bg-bol-blue text-white rounded">
                    DOCX
                  </span>
                  <span className="text-xs px-3 py-1 bg-bol-blue text-white rounded">
                    PDF
                  </span>
                </div>
              </div>
            </label>
          ) : (
            <div className="border-2 border-bol-blue rounded-lg p-4 bg-blue-50">
              <div className="flex items-start gap-3">
                <FileText className="text-bol-blue flex-shrink-0 mt-1" size={32} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-bol-purple mb-1 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {uploadedFile.name.endsWith('.pdf') ? 'PDF Document' : 'Word Document'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowPreview(true)}
                      className="text-sm py-1 px-3"
                    >
                      <Eye size={14} className="mr-1" />
                      Preview
                    </Button>
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={handleExtractText}
                      className="text-sm py-1 px-3"
                    >
                      Extract Text
                    </Button>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="text-xs text-bol-blue hover:text-bol-purple font-medium flex items-center py-1 px-3">
                        Replace
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showPreview && uploadedFile && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Document Preview"
        >
          <div className="p-4">
            <p className="text-center text-gray-500 py-8">
              Preview functionality would display the document content here.
              <br />
              <span className="text-sm">File: {uploadedFile.name}</span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
