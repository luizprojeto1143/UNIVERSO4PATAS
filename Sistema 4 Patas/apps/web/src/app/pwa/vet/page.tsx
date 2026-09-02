'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FlaskConical, Pill, Bell, ChevronRight, PenTool, FileText, DollarSign, TrendingUp, X } from 'lucide-react';

export default function VetDashboard() {
  const pathname = usePathname() || '/pwa/vet';
  
  const navItems = [
    { href: '/pwa/vet', label: 'Home', icon: Home },
    { href: '/pwa/vet/queue', label: 'Fila', icon: Users },
    { href: '/pwa/vet/results', label: 'Resultados', icon: FlaskConical },
    { href: '/pwa/vet/prescribe', label: 'Prescrever', icon: Pill },
  ];

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);
  
  const [pendingDocs, setPendingDocs] = useState([
    { id: 1, type: 'Termo de Anestesia', patient: 'Thor (Canino)', time: 'Há 5 min' },
    { id: 2, type: 'Requisição de RX', patient: 'Luna (Felino)', time: 'Há 12 min' }
  ]);

  const [signingDoc, setSigningDoc] = useState<number | null>(null);

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const activeDoc = pendingDocs.find(d => d.id === signingDoc);

  const confirmSignature = () => {
    if (!signingDoc) return;
    setPendingDocs(prev => prev.filter(doc => doc.id !== signingDoc));
    setSigningDoc(null);
    showToast('Documento assinado digitalmente!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans relative">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 w-[90%] text-center rounded-xl shadow-lg text-white text-sm font-bold flex justify-center items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-indigo-600 text-white pt-12 pb-6 px-5 shadow-md rounded-b-[2rem] sticky top-0 z-30">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Olá, Dr. Silva</h1>
            <p className="text-indigo-200 text-sm capitalize mt-1">{currentDate}</p>
          </div>
          <div className="relative bg-white/20 p-2 rounded-full">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-600"></span>
          </div>
        </div>

        {/* Real-time Commissions Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-5 shadow-inner border border-indigo-400/30">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-indigo-100 mb-2">
              <DollarSign size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Suas Comissões</span>
            </div>
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-indigo-200">Hoje</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">R$ 245<span className="text-lg text-indigo-300">,50</span></h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-indigo-200 uppercase">Acumulado Mês</p>
              <p className="text-sm font-bold text-indigo-100">R$ 4.250,00</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        
        {/* Pending Signatures Section */}
        {pendingDocs.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <PenTool size={16} className="text-amber-500"/> Documentos para Assinar
              </h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingDocs.length}</span>
            </div>
            
            <div className="space-y-3">
              {pendingDocs.map(doc => (
                <div key={doc.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-800 leading-tight">{doc.type}</h3>
                    <p className="text-xs text-slate-500">{doc.patient} • {doc.time}</p>
                  </div>
                  <button 
                    onClick={() => setSigningDoc(doc.id)}
                    className="h-10 px-4 bg-amber-100 text-amber-700 font-bold text-xs rounded-xl active:bg-amber-200 transition-colors shadow-sm"
                  >
                    Assinar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-3">Resumo do Turno</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/pwa/vet/queue" className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                <Users size={20} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">12</h3>
              <p className="text-sm text-slate-500 font-medium">Pacientes na fila</p>
            </Link>
            
            <Link href="/pwa/vet/results" className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3 relative">
                <FlaskConical size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">4</h3>
              <p className="text-sm text-slate-500 font-medium">Exames prontos</p>
            </Link>
          </div>
        </div>

        {/* Next Patient Mini-card */}
        <div className="bg-slate-900 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Próximo da Fila
            </span>
            <span className="text-slate-400 text-sm font-medium">10:30</span>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Bolinha</h3>
              <p className="text-slate-400 text-sm">Dermatologia</p>
            </div>
            <Link href="/pwa/vet/queue" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:bg-white/20 transition-colors">
              <ChevronRight size={24} />
            </Link>
          </div>
        </div>

      </main>

      {/* Signature Modal */}
      {signingDoc && activeDoc && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSigningDoc(null)}></div>
          
          <div className="bg-white w-full h-[70vh] rounded-t-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-3xl">
              <div>
                <h2 className="font-bold text-lg text-slate-800">Assinar Documento</h2>
                <p className="text-sm text-slate-500">{activeDoc.patient}</p>
              </div>
              <button onClick={() => setSigningDoc(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 active:bg-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50 flex flex-col items-center">
              <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
                <FileText className="text-indigo-500" size={24} />
                <span className="font-bold text-slate-700">{activeDoc.type}</span>
              </div>

              <p className="text-sm text-slate-500 font-medium mb-3 self-start">Área de Assinatura (Touch):</p>
              
              {/* Fake Canvas Area */}
              <div className="w-full h-48 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 active:bg-slate-50 transition-colors relative">
                <span className="text-sm font-medium pointer-events-none">Desenhe sua assinatura aqui</span>
                {/* Fake signature line */}
                <div className="absolute bottom-6 left-8 right-8 border-b border-slate-200"></div>
              </div>
              
              <button className="text-xs text-slate-400 mt-3 underline active:text-slate-600">
                Limpar assinatura
              </button>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white">
              <button 
                onClick={confirmSignature}
                className="w-full bg-indigo-600 text-white font-bold text-lg h-14 rounded-2xl shadow-md shadow-indigo-200 active:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <PenTool size={20} /> Confirmar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
              <item.icon size={24} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
