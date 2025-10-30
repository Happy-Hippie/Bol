import { useState, useEffect } from 'react';
import { FileText, Download, Mail, Link as LinkIcon, Check, Sparkles } from 'lucide-react';

interface Step5Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

export function Step5Generation({ data }: Step5Props) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Formatting content...');
  const [isComplete, setIsComplete] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  useEffect(() => {
    const phases = [
      { text: 'Formatting content...', duration: 2000 },
      { text: 'Applying brand guidelines...', duration: 2000 },
      { text: 'Inserting images...', duration: 1500 },
      { text: 'Generating PDF...', duration: 2000 },
      { text: 'Finalizing report...', duration: 1500 }
    ];

    let currentIndex = 0;
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += 2;
      setProgress(Math.min(progressValue, 100));

      const phaseIndex = Math.floor((progressValue / 100) * phases.length);
      if (phaseIndex < phases.length && phaseIndex !== currentIndex) {
        currentIndex = phaseIndex;
        setCurrentPhase(phases[phaseIndex].text);
      }

      if (progressValue >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isComplete) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold text-bol-purple mb-4">Generating Your Report</h2>
        <p className="text-gray-600 mb-12">Please wait while we create your professional report</p>

        <div className="mb-12">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D946A6" />
                  <stop offset="100%" stopColor="#F59E42" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-bol-purple">{progress}%</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-bol-purple animate-pulse" size={24} />
            <p className="text-lg font-medium text-bol-purple">
              {currentPhase}
            </p>
            <span className="inline-flex gap-1">
              <span className="inline-block w-2 h-2 bg-bol-purple rounded-full animate-bounce" />
              <span className="inline-block w-2 h-2 bg-bol-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="inline-block w-2 h-2 bg-bol-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Estimated time remaining: {Math.max(0, Math.ceil((100 - progress) / 10))} seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <Check className="text-green-600" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-bol-purple mb-4">
          Report Generated Successfully! 🎉
        </h1>
        <p className="text-xl text-gray-600">Your {data.reportType} Report is ready</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-40 bg-gradient-to-br from-bol-purple to-bol-blue rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={48} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-bol-purple mb-2">{data.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Format:</span> PDF
              </div>
              <div>
                <span className="font-medium">Pages:</span> 45
              </div>
              <div>
                <span className="font-medium">File Size:</span> 12.3 MB
              </div>
              <div>
                <span className="font-medium">Generated:</span>{' '}
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}, {new Date().toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              Completed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-bol-pink to-bol-orange rounded-xl p-6 text-white">
          <Download size={40} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Download PDF</h3>
          <p className="text-white/90 mb-4">Get the final PDF version of your report</p>
          <p className="text-sm text-white/80 mb-4">File size: 12.3 MB</p>
          <button className="w-full px-6 py-3 bg-white text-bol-purple rounded-lg font-semibold hover:bg-white/90 transition-colors">
            Download PDF
          </button>
        </div>

        <div className="bg-white border-2 border-bol-blue rounded-xl p-6">
          <FileText size={40} className="text-bol-blue mb-4" />
          <h3 className="text-xl font-bold text-bol-purple mb-2">Download DOCX</h3>
          <p className="text-gray-600 mb-4">Get the editable Word version</p>
          <p className="text-sm text-gray-500 mb-4">File size: 8.7 MB</p>
          <button className="w-full px-6 py-3 bg-bol-blue text-white rounded-lg font-semibold hover:bg-bol-blue/90 transition-colors">
            Download DOCX
          </button>
        </div>

        <div className="bg-white border-2 border-bol-purple rounded-xl p-6">
          <Mail size={40} className="text-bol-purple mb-4" />
          <h3 className="text-xl font-bold text-bol-purple mb-2">Share via Email</h3>
          <p className="text-gray-600 mb-4">Send the report to stakeholders</p>
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full px-6 py-3 border-2 border-bol-purple text-bol-purple rounded-lg font-semibold hover:bg-bol-purple/10 transition-colors"
          >
            Share via Email
          </button>
        </div>

        <div className="bg-white border-2 border-bol-orange rounded-xl p-6">
          <LinkIcon size={40} className="text-bol-orange mb-4" />
          <h3 className="text-xl font-bold text-bol-purple mb-2">Get Shareable Link</h3>
          <p className="text-gray-600 mb-4">Create a secure sharing link</p>
          <button
            onClick={() => setShowLinkModal(true)}
            className="w-full px-6 py-3 border-2 border-bol-orange text-bol-orange rounded-lg font-semibold hover:bg-bol-orange/10 transition-colors"
          >
            Generate Link
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button className="px-6 py-3 border border-bol-blue text-bol-blue rounded-lg font-medium hover:bg-bol-blue/10 transition-colors">
          Create Another Report
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          View Report in New Tab
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Go to Dashboard
        </button>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-bol-purple mb-4">Share via Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email addresses (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  placeholder="Add a message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Send Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-bol-purple mb-4">Shareable Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link expires in</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bol-purple">
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>No expiry</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password protect</label>
                <input type="checkbox" className="w-4 h-4 text-bol-purple rounded" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm text-gray-700 break-all">
                  https://bol.example.com/reports/share/abc123xyz
                </code>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-bol-pink to-bol-orange text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
