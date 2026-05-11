import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, Image as ImageIcon, MoreVertical, ShieldCheck, CheckCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_CARS } from '../constants';

const CHATS = [
  {
    id: '1',
    user: 'Julian Rossi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    lastMessage: 'Is the Porsche still available for inspection tomorrow?',
    time: '2m ago',
    unread: true,
    online: true,
    car: MOCK_CARS[0]
  },
  {
    id: '2',
    user: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    lastMessage: 'Thank you for the detailed condition report.',
    time: '1h ago',
    unread: false,
    online: false,
    car: MOCK_CARS[1]
  }
];

export const Messages = () => {
  const [activeChat, setActiveChat] = React.useState(CHATS[0]);
  const [message, setMessage] = React.useState('');

  return (
    <div className="bg-surface-bg min-h-[calc(100vh-80px)] flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex py-8 gap-8">
        
        {/* Chat List */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden shrink-0">
          <div className="p-6 border-b border-surface-border">
            <h2 className="text-xl font-extrabold text-primary-navy uppercase tracking-tight mb-4">Secure Inbox</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-slate" size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-navy transition-all"
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto divide-y divide-surface-border">
            {CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "w-full p-6 text-left flex gap-4 transition-all hover:bg-slate-50 relative",
                  activeChat.id === chat.id ? "bg-slate-50" : ""
                )}
              >
                {activeChat.id === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-navy" />}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-border">
                    <img src={chat.avatar} className="w-full h-full object-cover" />
                  </div>
                  {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-primary-navy truncate">{chat.user}</p>
                    <span className="text-[10px] font-bold text-secondary-slate uppercase shrink-0">{chat.time}</span>
                  </div>
                  <p className={cn(
                    "text-xs truncate",
                    chat.unread ? "text-primary-navy font-bold" : "text-secondary-slate"
                  )}>
                    {chat.lastMessage}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 grayscale opacity-50">
                    <p className="text-[9px] font-black uppercase text-secondary-slate">{chat.car.make} {chat.car.model}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex flex-grow flex-col bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 border-b border-surface-border flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-surface-border">
                 <img src={activeChat.avatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-primary-navy">{activeChat.user}</p>
                  <ShieldCheck size={14} className="text-emerald-500" />
                </div>
                <p className="text-[10px] text-secondary-slate font-bold uppercase tracking-widest">Regarding {activeChat.car.year} {activeChat.car.make} {activeChat.car.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-secondary-slate hover:text-primary-navy transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-slate-50/20">
            {/* System Info */}
            <div className="flex justify-center">
              <div className="px-4 py-1.5 bg-white rounded-full border border-surface-border shadow-sm text-[10px] font-bold text-secondary-slate uppercase tracking-widest">
                Conversation Securely Encrypted
              </div>
            </div>

            {/* Received Message */}
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-surface-border">
                <img src={activeChat.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="bg-white p-5 rounded-2xl rounded-bl-none border border-surface-border shadow-sm">
                <p className="text-sm text-primary-navy leading-relaxed">
                  {activeChat.lastMessage}
                </p>
                <p className="text-[9px] font-bold text-secondary-slate mt-2 uppercase">11:42 AM</p>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
              <div className="bg-primary-navy p-5 rounded-2xl rounded-br-none shadow-lg text-white">
                <p className="text-sm leading-relaxed">
                  Hello Julian. Yes, the Porsche is available. We can schedule an inspection for 10:00 AM at our Beverly Hills facility. Does that work for you?
                </p>
                <div className="flex justify-end items-center gap-1 mt-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">11:45 AM</p>
                  <CheckCheck size={12} className="text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-surface-border">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-transparent focus-within:border-surface-border focus-within:bg-white transition-all">
              <button className="p-2 text-secondary-slate hover:text-primary-navy transition-colors">
                <ImageIcon size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-grow bg-transparent outline-none text-sm px-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                className={cn(
                  "p-2.5 rounded-lg transition-all",
                  message.length > 0 ? "bg-primary-navy text-white shadow-lg scale-105" : "text-secondary-slate opacity-50"
                )}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
