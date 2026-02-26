import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Shield, Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '@/contexts/SecurityContext'; // Import Security Context
import { db } from '@/lib/database'; // Import Database for RAG

const quickReplies = [
  'What products do you offer?',
  'How do I book a service?',
  'Tell me about pricing',
  'Security tips',
];

export function Chatbot() {
  const { detectThreat } = useSecurity(); // Use Security Context
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m the Whitelines AI Security Assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Settings State
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_LLM_API_KEY || '');
  const [endpoint, setEndpoint] = useState(import.meta.env.VITE_LLM_ENDPOINT || 'http://localhost:11434/v1');
  const [model, setModel] = useState(import.meta.env.VITE_LLM_MODEL || 'huihui_ai/qwen3-abliterated');

  useEffect(() => {
    // Load settings from localStorage if available
    const savedKey = localStorage.getItem('whitelines_llm_key');
    const savedEndpoint = localStorage.getItem('whitelines_llm_endpoint');
    const savedModel = localStorage.getItem('whitelines_llm_model');

    if (savedKey) setApiKey(savedKey);
    if (savedEndpoint) setEndpoint(savedEndpoint);
    if (savedModel) setModel(savedModel);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('whitelines_llm_key', apiKey);
    localStorage.setItem('whitelines_llm_endpoint', endpoint);
    localStorage.setItem('whitelines_llm_model', model);
    setIsSettingsOpen(false);

    // Add system message confirming update
    setMessages(prev => [...prev, {
      id: `sys-${Date.now()}`,
      role: 'assistant',
      content: `Settings updated! Connected to: ${model}`,
      timestamp: new Date()
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMsg = userMessage.toLowerCase();

    // 1. SECURITY CHECK: Detect "Hacking" attempts in chat
    if (detectThreat(userMessage, 'Chatbot Input')) {
      return "⚠️ SECURITY ALERT: Malicious input detected. Your IP has been logged and reported to the Security Operations Center.";
    }

    // 2. CONTEXTUAL AWARENESS (RAG-lite)
    let systemContext = "";
    if (lowerMsg.includes('product') || lowerMsg.includes('usb') || lowerMsg.includes('drive') || lowerMsg.includes('course')) {
      const products = db.getProducts();
      systemContext += `\nAVAILABLE PRODUCTS:\n${products.map(p => `- ${p.name}: $${p.price} (${p.description})`).join('\n')}`;
    }
    if (lowerMsg.includes('service') || lowerMsg.includes('audit')) {
      const services = db.getServices();
      systemContext += `\nAVAILABLE SERVICES:\n${services.map(s => `- ${s.name}: $${s.price} (${s.description})`).join('\n')}`;
    }

    try {
      // Use configured settings OR env vars
      const currentKey = apiKey || import.meta.env.VITE_LLM_API_KEY;

      if (currentKey) {
        const { llmService } = await import('@/services/LLMService');
        // Pass dynamic config to chat
        return await llmService.chat(messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        })), systemContext, { apiKey, endpoint, model });
      }
      throw new Error("No LLM Key");
    } catch (e) {
      console.warn("LLM Fallback:", e);

      // Fallback Logic (Simple Keyword Responses)
      if (lowerMsg.includes('product') || lowerMsg.includes('usb') || lowerMsg.includes('drive')) {
        const products = db.getProducts();
        return `We have the following products:\n${products.map(p => `• ${p.name} ($${p.price}): ${p.description}`).join('\n')}`;
      }

      if (lowerMsg.includes('service') || lowerMsg.includes('audit') || lowerMsg.includes('consult')) {
        const services = db.getServices();
        return `Our services include:\n${services.map(s => `• ${s.name} ($${s.price}): ${s.description}`).join('\n')}`;
      }

      if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('pricing')) {
        const products = db.getProducts();
        const services = db.getServices();
        return `Here is our pricing list:\n\n**Products:**\n${products.map(p => `• ${p.name}: $${p.price}`).join('\n')}\n\n**Services:**\n${services.map(s => `• ${s.name}: $${s.price}`).join('\n')}`;
      }

      if (lowerMsg.includes('book') || lowerMsg.includes('contact') || lowerMsg.includes('hire')) {
        return "To book a service or purchase a product, please contact us at:\n• Email: sales@whitelines.com\n• Phone: +1 (555) 0199-SAFE";
      }

      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return 'Hello! I am the Whitelines AI (Offline Mode). I can help you with information about our **Products**, **Services**, and **Pricing**.';
      }

      return "I am currently in offline mode. I can answer questions about our **Products**, **Services**, and **Pricing**. For complex security inquiries, please contact our SOC team.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    const response = await generateResponse(userMessage.content);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      <AnimatePresence>
        {/* Chat Button */}
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-white text-[#050B14] px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 btn-shadow"
          >
            <Bot className="h-5 w-5" />
            <span className="font-medium text-sm">Whitelines AI Assistant</span>
          </motion.button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-[#0B1628]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden card-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#050B14]/80 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[#050B14]" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Whitelines AI</h3>
                  <p className="text-xs text-[#A7B1C6]">Security Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-1 text-[#A7B1C6] hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#A7B1C6] hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {isSettingsOpen ? (
              <div className="p-4 space-y-4 bg-[#050B14] h-80 overflow-y-auto">
                <h4 className="text-white font-semibold text-sm mb-4">AI Configuration</h4>
                <div className="space-y-2">
                  <Label className="text-[#A7B1C6] text-xs">API Key</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-xs h-8"
                    placeholder="sk-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A7B1C6] text-xs">Endpoint URL</Label>
                  <Input
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-xs h-8"
                    placeholder="http://localhost:11434/v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A7B1C6] text-xs">Model Name</Label>
                  <Input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-xs h-8"
                    placeholder="llama3"
                  />
                </div>
                <Button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs mt-4">
                  <Save className="w-3 h-3 mr-2" />
                  Save Settings
                </Button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.map((message) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.role === 'user'
                          ? 'bg-white text-[#050B14]'
                          : 'bg-[#050B14]/60 text-[#E2E8F0] border border-white/10'
                          }`}
                      >
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className={line.startsWith('•') || line.startsWith('**') ? 'font-medium' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#050B14]/60 border border-white/10 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-[#A7B1C6] rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-[#A7B1C6] rounded-full animate-bounce delay-100" />
                          <div className="h-2 w-2 bg-[#A7B1C6] rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-white/5 text-[#A7B1C6] px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-[#050B14]/80 border-t border-white/10">
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-[#A7B1C6]/50 focus:border-white/20"
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="bg-white text-[#050B14] hover:bg-white/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
