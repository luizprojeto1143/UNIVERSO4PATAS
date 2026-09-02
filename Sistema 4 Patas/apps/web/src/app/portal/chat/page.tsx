'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Bot, User, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PortalChatPage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
  const [messages, setMessages] = useState([
    { id: 1, text: 'Olá! Como posso ajudar você hoje?', sender: 'bot', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        text: 'Nossa equipe receberá sua mensagem e retornará em breve. Se for uma emergência, por favor, ligue para nós.',
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      showToast('Mensagem enviada! Um atendente irá responder logo mais.');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
        <Link href="/portal">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-800">Atendimento</h1>
          <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Online agora
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Bot className="w-12 h-12 mb-2 opacity-50" />
            <p>Nenhuma mensagem ainda.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                <p className="text-sm font-medium">{msg.text}</p>
                <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative z-50">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-50 border-slate-200 rounded-full h-12 px-4 focus-visible:ring-indigo-500"
          />
          <Button type="submit" disabled={!newMessage.trim() || isTyping} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md shrink-0">
            <Send className="w-5 h-5 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}

