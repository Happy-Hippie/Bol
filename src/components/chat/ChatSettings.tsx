import { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../Modal';
import { Button } from '../Button';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    responseLength: 'concise' | 'detailed' | 'comprehensive';
    showSources: boolean;
    includeVisuals: boolean;
    saveHistory: boolean;
  };
  onSave: (settings: any) => void;
}

export function ChatSettings({ isOpen, onClose, settings, onSave }: ChatSettingsProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'privacy' | 'about'>('preferences');
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all conversation history? This cannot be undone.')) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Assistant Settings" size="lg">
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'preferences'
              ? 'text-bol-purple border-b-2 border-bol-purple'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'privacy'
              ? 'text-bol-purple border-b-2 border-bol-purple'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'about'
              ? 'text-bol-purple border-b-2 border-bol-purple'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          About
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'preferences' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Length
              </label>
              <select
                value={localSettings.responseLength}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, responseLength: e.target.value as any })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none bg-white"
              >
                <option value="concise">Concise - Brief, direct answers</option>
                <option value="detailed">Detailed - Balanced responses</option>
                <option value="comprehensive">Comprehensive - In-depth explanations</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Show Source Citations</p>
                <p className="text-xs text-gray-500">Display references to documents and data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showSources}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, showSources: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bol-purple"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Include Visual Content</p>
                <p className="text-xs text-gray-500">Show images, charts, and visualizations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.includeVisuals}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, includeVisuals: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bol-purple"></div>
              </label>
            </div>
          </>
        )}

        {activeTab === 'privacy' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Save Chat History</p>
                <p className="text-xs text-gray-500">Store conversations for future reference</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.saveHistory}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, saveHistory: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bol-purple"></div>
              </label>
            </div>

            <div className="bg-blue-50 border-l-4 border-bol-blue p-4 rounded">
              <p className="text-sm text-gray-700">
                Your conversations are stored securely and are only accessible to you. We do not
                share your data with third parties.
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                Clear All Conversations
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This will permanently delete all your conversation history
              </p>
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <>
            <div>
              <h3 className="text-lg font-bold text-bol-purple mb-2">BOL AI Assistant</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your intelligent assistant for exploring organizational knowledge and generating
                insights.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-bol-purple mb-2">Capabilities</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Search and retrieve information from your knowledge base</li>
                <li>Summarize documents and generate insights</li>
                <li>Answer questions about projects, budgets, and activities</li>
                <li>Draft content for reports and communications</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-bol-orange mb-2">Limitations</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Responses are generated based on available data only</li>
                <li>May occasionally provide incomplete or inaccurate information</li>
                <li>Cannot access real-time external data</li>
                <li>Always verify critical information independently</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>Version: 1.0.0 (Beta)</p>
              <p>Last Updated: October 2025</p>
              <p className="mt-2">
                <a href="#" className="text-bol-blue hover:underline">
                  Send Feedback
                </a>
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="gradient" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Modal>
  );
}
