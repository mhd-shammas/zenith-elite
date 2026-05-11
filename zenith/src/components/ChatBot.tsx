import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: 'Welcome to the Zenith Strategist. How can I assist your luxury automotive journey today?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are the Zenith AI Strategist, a sophisticated, professional, and highly knowledgeable assistant for a premium luxury car marketplace. You specialize in high-end automotive specs, market valuations for brands like Porsche, Ferrari, and Lamborghini, and guiding users through the selling and buying process at Zenith. Keep your tone elite, concise, and helpful. If asked about price, provide estimated ranges but recommend a professional appraisal for finality.",
        },
      });

      const aiText = response.text || "I apologize, I'm experiencing a temporary connectivity issue with the vault. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Our neural link is experiencing high latency. Please attempt your inquiry again shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-surface-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-primary-navy text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                  <Bot size={20} className="text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest italic leading-none mb-1">Zenith AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Concierge Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/30"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-accent-blue text-white" : "bg-white border border-surface-border text-primary-navy"
                  )}>
                    {msg.role === 'user' ? <User size={14} /> : <Zap size={14} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary-navy text-white rounded-tr-none" 
                      : "bg-white border border-surface-border text-slate-700 rounded-tl-none shadow-sm"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-white border border-surface-border text-primary-navy flex items-center justify-center shadow-sm">
                    <Sparkles size={14} className="animate-pulse" />
                  </div>
                  <div className="bg-white border border-surface-border p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-surface-border">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire with the Concierge..."
                  className="w-full pl-4 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-navy/10 focus:bg-white transition-all text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-navy text-white rounded-xl hover:bg-accent-blue transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[9px] font-black uppercase text-secondary-slate tracking-widest">End-to-End Encrypted</p>
                <div className="flex items-center gap-1">
                   <span className="text-[9px] font-black uppercase text-secondary-slate tracking-widest">Powered by</span>
                   <span className="text-[9px] font-black uppercase text-primary-navy tracking-tight italic">Gemini 3 Flash</span>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden relative group",
          isOpen ? "bg-white text-primary-navy rotate-90" : "bg-primary-navy text-white"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-blue rounded-full border-4 border-primary-navy group-hover:scale-125 transition-transform" />
        )}
      </motion.button>
    </div>
  );
};
