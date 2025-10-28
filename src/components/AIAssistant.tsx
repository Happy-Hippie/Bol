import { useState, useEffect, useRef } from 'react';
import { Bot, Plus, Settings as SettingsIcon, Trash2, Database, MessageSquare, BarChart3, Lightbulb, Search, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Card } from './Card';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { ChatSettings } from './chat/ChatSettings';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    type: 'document' | 'project' | 'image';
    id: string;
    name: string;
  }>;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  lastMessageAt: string;
}

export function AIAssistant() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    responseLength: 'detailed' as 'concise' | 'detailed' | 'comprehensive',
    showSources: true,
    includeVisuals: true,
    saveHistory: true,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Summarize our annual impact',
    'What are our active projects?',
    'Show our mission and vision',
    'List documents about education',
  ];

  const exampleQuestions = [
    'What is our total project budget for this year?',
    'Summarize our work in education sector',
    'Show me all documents related to women empowerment',
    'What frameworks guide our organization?',
    'List all images from the Girls Education project',
  ];

  const sampleConversations: Conversation[] = [
    {
      id: '1',
      title: 'Organization Overview',
      preview: 'Tell me about our organization',
      messageCount: 4,
      lastMessageAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Project Budget Query',
      preview: "What's the budget for girls education project?",
      messageCount: 2,
      lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  useEffect(() => {
    setConversations(sampleConversations);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  const handleSendMessage = async (content: string, attachments: any[]) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date().toISOString(),
        sources: [
          { type: 'document', id: '1', name: 'Annual Report 2024.pdf' },
          { type: 'project', id: '2', name: 'Girls Education Initiative' },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('organization') || lowerQuery.includes('about')) {
      return "Based on your profile, your organization works on education and women empowerment. You have 2 active projects with a total budget of ₹43,50,000. Your work focuses on rural areas, particularly in Bihar.\n\nWould you like to know more about any specific project or area of work?";
    }

    if (lowerQuery.includes('budget') || lowerQuery.includes('project')) {
      return "Here's an overview of your project budgets:\n\n• Girls Education Initiative - Rural Bihar: ₹25,00,000 (25 Lakhs)\n• Women's Livelihood Program: ₹18,50,000 (18.5 Lakhs)\n\nTotal: ₹43,50,000 (43.5 Lakhs)\n\nThe Girls Education Initiative is your largest active project. Would you like more details about budget allocation?";
    }

    if (lowerQuery.includes('document') || lowerQuery.includes('education')) {
      return "I found 3 documents related to education:\n\n1. Policy Brief - Girls Education.docx\n2. Annual Report 2023-24.pdf (Education section)\n3. Research Paper - Rural Education.pdf\n\nWould you like me to summarize any of these documents?";
    }

    if (lowerQuery.includes('framework') || lowerQuery.includes('guide')) {
      return "Your organization follows these guiding frameworks:\n\n• UN Sustainable Development Goals (SDG 4 - Quality Education, SDG 5 - Gender Equality)\n• National Education Policy 2020\n• Women's Empowerment Framework\n\nThese frameworks inform all your project activities. Would you like details on how specific frameworks apply to your projects?";
    }

    return "I understand you're asking about: " + query + "\n\nBased on the information in your knowledge base, I can help you explore:\n• Your organization's profile and mission\n• Active and completed projects\n• Budget information\n• Uploaded documents and resources\n• Framework documents\n\nWhat specific aspect would you like to know more about?";
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt, []);
  };

  const handleDeleteConversation = (id: string) => {
    if (confirm('Delete this conversation?')) {
      setConversations(conversations.filter((c) => c.id !== id));
      if (activeConversation === id) {
        handleNewConversation();
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="bg-gradient-to-r from-bol-purple to-bol-blue rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">BOL AI Assistant</h1>
                <p className="text-white/90">Chat with your organizational knowledge</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Online</span>
            </div>
            <Button
              variant="secondary"
              onClick={handleNewConversation}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              <Plus size={18} className="mr-2" />
              New Chat
            </Button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 h-[calc(100%-11rem)]">
        <div className="col-span-1 bg-white rounded-xl border-2 border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-bol-purple mb-3">Recent Conversations</h3>
            <Button
              variant="gradient"
              onClick={handleNewConversation}
              className="w-full"
            >
              <Plus size={18} className="mr-2" />
              Start New Conversation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className={`cursor-pointer transition-all ${
                  activeConversation === conv.id
                    ? 'border-l-4 border-bol-pink bg-pink-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveConversation(conv.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-bol-purple truncate flex-1">
                    {conv.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 truncate mb-2">{conv.preview}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(conv.lastMessageAt).toLocaleDateString('en-IN')}</span>
                  <span className="bg-gray-200 px-2 py-0.5 rounded">{conv.messageCount} msgs</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-600 mb-2">Try asking about...</p>
            <div className="space-y-1">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full text-left text-xs text-bol-blue hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-xl border-2 border-gray-200 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-2xl text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-bol-purple to-bol-pink rounded-full flex items-center justify-center animate-bounce">
                  <Bot size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-bol-purple mb-3">
                  Hello! I'm your BOL AI Assistant
                </h2>
                <p className="text-gray-600 mb-8">
                  I can help you explore your organization's knowledge base
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Card className="text-left hover:shadow-lg transition-shadow cursor-pointer">
                    <FileText className="text-bol-blue mb-3" size={32} />
                    <h3 className="font-bold text-bol-purple mb-2">Find Information</h3>
                    <p className="text-sm text-gray-600">
                      Search through reports, documents, and project data
                    </p>
                  </Card>
                  <Card className="text-left hover:shadow-lg transition-shadow cursor-pointer">
                    <Lightbulb className="text-bol-orange mb-3" size={32} />
                    <h3 className="font-bold text-bol-purple mb-2">Generate Insights</h3>
                    <p className="text-sm text-gray-600">
                      Get summaries and analysis of your work
                    </p>
                  </Card>
                  <Card className="text-left hover:shadow-lg transition-shadow cursor-pointer">
                    <Search className="text-bol-pink mb-3" size={32} />
                    <h3 className="font-bold text-bol-purple mb-2">Answer Questions</h3>
                    <p className="text-sm text-gray-600">
                      Ask about projects, budgets, frameworks, or activities
                    </p>
                  </Card>
                  <Card className="text-left hover:shadow-lg transition-shadow cursor-pointer">
                    <MessageSquare className="text-green-600 mb-3" size={32} />
                    <h3 className="font-bold text-bol-purple mb-2">Draft Content</h3>
                    <p className="text-sm text-gray-600">
                      Create drafts for reports, press releases, or updates
                    </p>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <p className="text-sm font-bold text-bol-purple mb-3">
                    Example questions you can ask:
                  </p>
                  <div className="space-y-2">
                    {exampleQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptClick(question)}
                        className="block w-full text-left text-sm text-gray-700 hover:text-bol-blue hover:bg-white px-4 py-2 rounded-lg transition-colors"
                      >
                        • {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Database className="text-bol-blue" size={18} />
                  <span className="text-gray-700">
                    Connected to: Organization Profile, 2 Projects, 23 Documents, 45 Images, 4 Frameworks
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onRegenerate={() => {}}
                    onFeedback={() => {}}
                  />
                ))}
                {loading && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bol-purple to-bol-pink flex items-center justify-center animate-pulse">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-bol-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-bol-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-bol-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">BOL is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}

          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>

      <ChatSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
