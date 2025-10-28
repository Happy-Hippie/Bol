import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '../Button';

interface Attachment {
  type: 'project' | 'document' | 'perspective' | 'image';
  id: string;
  name: string;
}

interface ChatInputProps {
  onSendMessage: (message: string, attachments: Attachment[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 2000;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {attachments.length > 0 && (
        <div className="px-6 pt-3 flex flex-wrap gap-2">
          {attachments.map((attachment, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-bol-blue rounded-full text-sm"
            >
              <span>{attachment.name}</span>
              <button
                onClick={() => removeAttachment(idx)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-end gap-3 bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-bol-blue transition-colors">
          <button
            className="p-2 text-bol-blue hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
            title="Attach reference"
            disabled={disabled}
          >
            <Paperclip size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your organization..."
              className="w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400"
              rows={1}
              disabled={disabled}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">
                {message.length} / {maxChars}
              </span>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && attachments.length === 0)}
            variant="gradient"
            className="flex-shrink-0 rounded-lg"
          >
            <Send size={18} />
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          BOL AI may occasionally make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
