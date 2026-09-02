"use client";
import React, { useState } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  Send,
  User,
  Activity,
  CheckCircle2,
  Plus
} from 'lucide-react';

export default function TelemedicineRoom() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá doutor, entraremos em um minuto.", time: "10:02 AM", sender: "patient" },
    { id: 2, text: "Sem problemas, estou pronto quando vocês estiverem.", time: "10:03", sender: "doctor" }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [consultationForm, setConsultationForm] = useState({ patientName: '', reason: '' });
  const [activeConsultation, setActiveConsultation] = useState({
    patient: 'Mel (Gato Persa)',
    tutor: 'Luciana Santos',
    reason: 'Acompanhamento Pós-Cirúrgico',
    status: 'Em Andamento'
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    showToast(isMicOn ? "Microfone silenciado" : "Microfone ativado");
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    showToast(isVideoOn ? "Vídeo desativado" : "Vídeo ativado");
  };

  const handleEndCall = () => {
    setTimeout(() => {
      setActiveConsultation(prev => ({ ...prev, status: 'Encerrada' }));
      showToast("Chamada encerrada com sucesso");
    }, 500);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'doctor'
    };
    
    setMessages([...messages, newMessage]);
    setChatInput('');
    showToast("Mensagem enviada");
  };

  const handleStartNewConsultation = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (consultationForm.patientName) {
        setActiveConsultation({
          patient: consultationForm.patientName,
          tutor: 'Tutor Solicitante',
          reason: consultationForm.reason || 'Consulta Geral',
          status: 'Em Andamento'
        });
      }
      setIsSaving(false);
      setIsModalOpen(false);
      setConsultationForm({ patientName: '', reason: '' });
      showToast("Nova consulta online agendada com sucesso");
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row p-4 gap-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Consulta Online</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <input 
                  type="text" 
                  value={consultationForm.patientName}
                  onChange={e => setConsultationForm({ ...consultationForm, patientName: e.target.value })}
                  placeholder="Nome do paciente" 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <input 
                  type="text" 
                  value={consultationForm.reason}
                  onChange={e => setConsultationForm({ ...consultationForm, reason: e.target.value })}
                  placeholder="Motivo da consulta" 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button disabled={isSaving} onClick={handleStartNewConsultation} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
                {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Video Feed */}
        <div className="flex-1 bg-black rounded-3xl relative overflow-hidden flex items-center justify-center shadow-lg border border-gray-800">
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm backdrop-blur-md flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            GRAVANDO 05:24
          </div>
          
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm backdrop-blur-md">
            Dr. Carlos (Anfitrião)
          </div>

          <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
            <User className="w-24 h-24 text-gray-700" />
            <p className="text-xl font-medium text-gray-400">Aguardando o paciente entrar...</p>
          </div>

          {/* Picture in Picture (Self) */}
          <div className="absolute bottom-6 right-6 w-48 h-32 bg-gray-800 rounded-2xl border-2 border-gray-700 overflow-hidden shadow-xl flex items-center justify-center">
             <span className="text-gray-500 text-sm">Sua Câmera</span>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 p-3 rounded-full backdrop-blur-md border border-gray-700 shadow-2xl">
            <button 
              onClick={handleToggleMic}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 ${isMicOn ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'}`}
              title="Alternar Microfone"
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 ${isVideoOn ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'}`}
              title="Alternar Vídeo"
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleEndCall}
              className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-600/30 ml-2"
              title="Encerrar Chamada"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Chat & Patient Record */}
      <div className="w-full md:w-[400px] flex flex-col gap-4">
        {/* Patient Quick Record */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{activeConsultation.patient}</h2>
              <p className="text-sm text-gray-500">{activeConsultation.reason} ({activeConsultation.status})</p>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Nova Consulta Online
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">Status</span>
              </div>
              <span className="text-sm font-semibold text-green-600">Recuperando Bem</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Última Visita</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Há 2 dias</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Chat da Consulta</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === 'patient' ? 'items-start' : 'items-end'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.sender === 'patient' ? 'bg-gray-100 rounded-tl-sm text-gray-700' : 'bg-blue-600 rounded-tr-sm text-white'}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 font-medium">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="relative mt-auto flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite uma mensagem..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-3 pl-5 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
            <button 
              onClick={handleSendMessage}
              className="w-11 h-11 flex-shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!chatInput.trim()}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
