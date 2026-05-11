import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, Send, X, Zap, ChevronRight, MessageSquare, Info } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface SellAIAssistantProps {
  onFill: (data: Partial<{
    vin: string;
    make: string;
    model: string;
    year: string;
    mileage: string;
    price: string;
    location: string;
    transmission: string;
    fuelType: string;
    vehicleType: string;
  }>) => void;
}

export const SellAIAssistant = ({ onFill }: SellAIAssistantProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm your Zenith Listing Strategist. Tell me about your car in plain English, and I'll help you fill out the documentation. Or, ask me anything about our selling process!" }
  ]);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      // First, try to extract structured data if it looks like a vehicle description
      const extractionPrompt = `
        You are a vehicle data extractor for Zenith Elite Automotive Exchange.
        Extract any vehicle details from this text: "${userQuery}"
        If no vehicle details are found, return an empty object.
        Supported fields: vin, make, model, year, mileage, price, location, transmission ('Automatic' or 'Manual'), fuelType ('Gas', 'Electric', 'Hybrid'), vehicleType ('Sedan', 'SUV', 'Coupe', 'Truck', 'Lux').
      `;

      const extractionResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: extractionPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vin: { type: Type.STRING },
              make: { type: Type.STRING },
              model: { type: Type.STRING },
              year: { type: Type.STRING },
              mileage: { type: Type.STRING },
              price: { type: Type.STRING },
              location: { type: Type.STRING },
              transmission: { type: Type.STRING },
              fuelType: { type: Type.STRING },
              vehicleType: { type: Type.STRING },
            }
          }
        }
      });

      const extractedData = JSON.parse(extractionResponse.text || "{}");
      const hasData = Object.values(extractedData).some(v => v !== undefined && v !== null && v !== '');

      if (hasData) {
        onFill(extractedData);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Excellent. I've populated the form with the details detected. Is there anything else you'd like to adjust or any questions about the Zenith Managed certification?" 
        }]);
      } else {
        // Just answer the question normally
        const chatResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userQuery,
          config: {
            systemInstruction: "You are the Zenith AI Listing Assistant. Help users list their cars. Explain that 'Zenith Managed' means our team handles the entire sale: professional photography, detailing, secure storage, and active marketing. Verification takes 48-72 hours generally. You are elite, professional, and helpful.",
          },
        });
        setMessages(prev => [...prev, { role: 'assistant', content: chatResponse.text || "I apologize, I'm having trouble connecting to the Zenith mainframes." }]);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Our neural link is experiencing high latency. Please continue the manual entry if urgent." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[110]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-3xl shadow-2xl border border-surface-border overflow-hidden flex flex-col"
          >
            <div className="p-5 bg-primary-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Bot size={18} className="text-accent-blue" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zenith Specialist</h4>
                  <p className="text-xs font-black uppercase italic tracking-tight">Listing Strategist</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed max-w-[80%]",
                    msg.role === 'user' 
                      ? "bg-primary-navy text-white rounded-tr-none" 
                      : "bg-white border border-surface-border text-slate-700 rounded-tl-none shadow-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            <form onSubmit={handleProcess} className="p-4 bg-white border-t border-surface-border">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your car (e.g. '2022 Porsche 911...')"
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:border-primary-navy/10 focus:bg-white transition-all text-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-navy text-white rounded-lg hover:bg-accent-blue transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
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
          "h-14 px-6 rounded-2xl flex items-center gap-3 shadow-xl border-2 transition-all duration-300",
          isOpen 
            ? "bg-white border-primary-navy text-primary-navy shadow-primary-navy/5" 
            : "bg-primary-navy border-primary-navy text-white shadow-primary-navy/20"
        )}
      >
        <Sparkles size={20} className={cn(isOpen ? "text-accent-blue" : "text-white")} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Listing Assistant</span>
      </motion.button>
    </div>
  );
};
