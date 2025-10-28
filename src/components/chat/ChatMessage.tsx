import { useState } from 'react';
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, FileText, FolderOpen, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '../Button';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    sources?: Array<{
      type: 'document' | 'project' | 'image';
      id: string;
      name: string;
    }>;
  };
  onRegenerate?: () => void;
  onFeedback?: (helpful: boolean) => void;
}

export function ChatMessage({ message, onRegenerate, onFeedback }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (helpful: boolean) => {
    setFeedback(helpful);
    onFeedback?.(helpful);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'project': return FolderOpen;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-end max-w-[70%]">
          <div className="bg-gradient-to-r from-bol-pink to-bol-orange text-white px-4 py-3 rounded-2xl rounded-br-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex gap-3 max-w-[75%]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bol-purple to-bol-pink flex items-center justify-center text-white font-bold flex-shrink-0">
          AI
        </div>
        <div className="flex flex-col">
          <div className="bg-white border border-purple-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
            <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>

            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {message.sources.map((source, idx) => {
                    const Icon = getSourceIcon(source.type);
                    return (
                      <button
                        key={idx}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-bol-blue rounded hover:bg-blue-100 transition-colors"
                      >
                        <Icon size={12} />
                        <span>{source.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1 text-gray-400 hover:text-bol-blue transition-colors"
                title="Copy message"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 text-gray-400 hover:text-bol-blue transition-colors"
                  title="Regenerate response"
                >
                  <RefreshCw size={14} />
                </button>
              )}
              <button
                onClick={() => handleFeedback(true)}
                className={`p-1 transition-colors ${
                  feedback === true ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                }`}
                title="Helpful"
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className={`p-1 transition-colors ${
                  feedback === false ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
                title="Not helpful"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
