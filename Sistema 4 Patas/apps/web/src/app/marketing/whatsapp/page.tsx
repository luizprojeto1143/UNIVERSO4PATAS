"use client";

import React, { useState } from 'react';
import { 
  Send, Phone, Video, MoreVertical, Check, CheckCheck, 
  Smile, Paperclip, Mic, User, ArrowLeft, Sparkles, MessageSquare, 
  Calendar, Clock, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'client' | 'me';
  time: string;
}

interface ChatContact {
  id: string;
  name: string;
  pet: string;
  lastMessage: string;
  time: string;
  avatarColor: string;
  messages: Message[];
}

export default function WhatsAppMarketingPage() {
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'João Silva',
      pet: 'Rex (Cão)',
      lastMessage: 'Quero agendar a vacina sim!',
      time: '14:05',
      avatarColor: 'bg-indigo-500',
      messages: [
        { id: 1, text: "Olá, João! Tudo bem? Aqui é da Clínica Veterinária Universo 4 Patas. 🐾", sender: "bot", time: "14:00" },
        { id: 2, text: "Passando para lembrar que a vacina V10 do Rex está vencendo esta semana. Deseja agendar a renovação para garantirmos a saúde dele? 💉", sender: "bot", time: "14:00" },
        { id: 3, text: "Oi! Tudo bem. Quero agendar sim.", sender: "client", time: "14:03" },
        { id: 4, text: "Ótimo! Temos horários disponíveis amanhã às 14h ou sexta às 10h com a Dra. Fernanda. Qual prefere?", sender: "bot", time: "14:05" },
      ]
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      pet: 'Bolinha (Bulldog)',
      lastMessage: 'Ele dormiu bem hoje, obrigado!',
      time: '11:30',
      avatarColor: 'bg-rose-500',
      messages: [
        { id: 1, text: "Olá, Maria! Tudo bem? Boletim do Bolinha: ele está estável e aceitou bem o patê renal hoje cedo! 💙", sender: "bot", time: "10:15" },
        { id: 2, text: "Ai que notícia maravilhosa! Ele dormiu bem hoje, obrigado!", sender: "client", time: "11:30" }
      ]
    },
    {
      id: '3',
      name: 'Carlos Mendes',
      pet: 'Thor (SRD)',
      lastMessage: 'Pode agendar o banho para sábado?',
      time: '09:45',
      avatarColor: 'bg-emerald-500',
      messages: [
        { id: 1, text: "Parabéns ao Thor pelo aniversário este mês! 🎂 Ganhe 15% de desconto no Banho & Tosa!", sender: "bot", time: "09:00" },
        { id: 2, text: "Pode agendar o banho para sábado às 10h?", sender: "client", time: "09:45" }
      ]
    }
  ]);

  const [selectedContactId, setSelectedContactId] = useState('1');
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setIsSending(true);

    const newMsgText = inputText;
    setInputText("");

    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now(),
        text: newMsgText,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setContacts(prev => prev.map(c => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: newMsgText,
            time: newMessage.time,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      }));

      setIsSending(false);
      showToast("Mensagem enviada com sucesso via WhatsApp!");
    }, 400);
  };

  const handleQuickTemplate = (text: string) => {
    setInputText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans p-2 md:p-6">
      
      {/* Top Controls */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex justify-between items-center">
        <Link 
          href="/marketing" 
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel de Marketing
        </Link>
        <span className="text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
          WhatsApp Business API Oficial • Online
        </span>
      </div>

      {/* Main WhatsApp Window */}
      <div className="flex w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 flex-1 min-h-0">
        
        {/* Sidebar Contacts */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
          {/* Header */}
          <div className="h-16 bg-slate-100 flex items-center px-4 justify-between border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md">
                4P
              </div>
              <span className="font-black text-slate-800 text-sm">Central de Disparos</span>
            </div>
            <div className="flex gap-2 text-slate-500">
              <MoreVertical className="w-5 h-5 cursor-pointer hover:text-slate-700" />
            </div>
          </div>
          
          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {contacts.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedContactId(c.id)}
                className={`flex items-center px-4 py-3.5 cursor-pointer transition-all ${
                  selectedContactId === c.id ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100'
                }`}
              >
                <div className={`w-11 h-11 ${c.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                  {c.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{c.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{c.time}</span>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-semibold block">{c.pet}</span>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#efeae2]">
          {/* Chat Header */}
          <div className="h-16 bg-slate-100 flex items-center px-6 justify-between border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${activeContact.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                {activeContact.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-sm leading-tight flex items-center gap-2">
                  {activeContact.name}
                  <span className="text-xs font-semibold text-slate-500">• {activeContact.pet}</span>
                </h2>
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> online via WhatsApp
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Video className="w-5 h-5 cursor-pointer hover:text-slate-700" />
              <Phone className="w-5 h-5 cursor-pointer hover:text-slate-700" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 flex flex-col">
            <div className="flex justify-center mb-4">
              <span className="bg-white/80 backdrop-blur-md text-slate-600 text-[11px] px-3.5 py-1 rounded-full shadow-sm font-bold border border-slate-200/50">
                HOJE • MENSAGENS CRIPTOGRAFADAS
              </span>
            </div>

            {activeContact.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'bot' || msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`${
                  msg.sender === 'bot' || msg.sender === 'me' ? 'bg-[#d9fdd3] text-slate-900' : 'bg-white text-slate-800'
                } px-4 py-3 rounded-2xl ${
                  msg.sender === 'bot' || msg.sender === 'me' ? 'rounded-tr-none' : 'rounded-tl-none'
                } shadow-sm max-w-[80%] relative`}>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex justify-end items-center mt-1.5 gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">{msg.time}</span>
                    {(msg.sender === 'bot' || msg.sender === 'me') && (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Response Chips */}
          <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Respostas Rápidas:</span>
            <button 
              onClick={() => handleQuickTemplate("Olá! Podemos confirmar o agendamento para amanhã às 14h?")}
              className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shrink-0 font-medium text-slate-700 transition-colors shadow-sm"
            >
              📅 Confirmar Horário
            </button>
            <button 
              onClick={() => handleQuickTemplate("Olá! Como o pet está passando hoje? Precisa de alguma orientação?")}
              className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shrink-0 font-medium text-slate-700 transition-colors shadow-sm"
            >
              💙 Checagem Pós-Atendimento
            </button>
            <button 
              onClick={() => handleQuickTemplate("Segue a chave PIX da clínica para pagamento: universo4patas@clinica.com")}
              className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shrink-0 font-medium text-slate-700 transition-colors shadow-sm"
            >
              💳 Enviar Chave PIX
            </button>
          </div>

          {/* Chat Input */}
          <div className="h-20 bg-slate-100 flex items-center px-4 md:px-6 gap-3 border-t border-slate-200">
            <div className="flex-1 bg-white rounded-2xl px-4 py-3 flex items-center shadow-sm border border-slate-200">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma mensagem ou resposta rápida..." 
                className="w-full text-sm outline-none bg-transparent font-medium"
              />
            </div>
            
            <button 
              onClick={handleSend} 
              disabled={isSending || !inputText.trim()} 
              className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 shrink-0"
            >
              {isSending ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[60]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
