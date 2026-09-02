'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, FlaskConical, FileText, ChevronRight, PenTool, X, ShieldAlert, HeartPulse } from 'lucide-react';

export default function TutorDashboard() {
  const pathname = usePathname() || '/pwa/tutor';
  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  const navItems = [
    { href: '/pwa/tutor', label: 'Home', icon: Home },
    { href: '/pwa/tutor/appointments', label: 'Agenda', icon: Calendar },
    { href: '/pwa/tutor/hospitalization', label: 'Internação', icon: HeartPulse },
    { href: '/pwa/tutor/results', label: 'Exames', icon: FlaskConical },
  ];

  const pets = [
    { id: '1', name: 'Thor', type: 'Cachorro', nextVaccine: 'V10 - 15/09/2026', img: 'https://i.pravatar.cc/150?u=thor' },
    { id: '2', name: 'Luna', type: 'Gato', nextVaccine: 'Antirrábica - 10/10/2026', img: 'https://i.pravatar.cc/150?u=luna' }
  ];

  const [pendingSignatures, setPendingSignatures] = useState([
    { id: 1, title: 'Termo de Anestesia (Thor)' }
  ]);
  const [signingDoc, setSigningDoc] = useState<number | null>(null);

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const confirmSignature = () => {
    setPendingSignatures(prev => prev.filter(d => d.id !== signingDoc));
    setSigningDoc(null);
    showToast('Documento assinado com sucesso!', 'success');
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-800 pb-24 font-sans relative">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 w-[90%] text-center rounded-xl shadow-lg text-white text-sm font-bold flex justify-center items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-orange-500 text-white pt-12 pb-8 px-5 shadow-md rounded-b-[2rem] sticky top-0 z-30 bg-gradient-to-br from-orange-500 to-rose-500">
        <h1 className="text-2xl font-bold mb-1">Olá, Maria! 👋</h1>
        <p className="text-orange-100 text-sm">Bem-vinda à Clínica 4 Patas.</p>
      </header>

      <main className="px-5 pt-6 space-y-6">
        
        {/* Assinaturas Pendentes */}
        {pendingSignatures.length > 0 && (
          <div className="bg-rose-100 border border-rose-200 rounded-3xl p-5 shadow-sm animate-in slide-in-from-top-4">
            <h2 className="font-bold text-rose-800 flex items-center gap-2 mb-3">
              <ShieldAlert size={20} /> Ação Necessária
            </h2>
            {pendingSignatures.map(doc => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{doc.title}</h3>
                  <p className="text-xs text-slate-500">Aguardando sua assinatura</p>
                </div>
                <button 
                  onClick={() => setSigningDoc(doc.id)}
                  className="bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl active:bg-rose-600"
                >
                  Assinar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Meus Pets */}
        <div>
          <h2 className="font-bold text-slate-700 mb-3 text-lg">Meus Pets</h2>
          <div className="space-y-3">
            {pets.map(pet => (
              <Link href={`/pwa/tutor/pets/${pet.id}`} key={pet.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 active:bg-slate-50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 border-2 border-orange-100">
                  <img src={pet.img} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{pet.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Próx. Vacina: <span className="text-orange-600">{pet.nextVaccine}</span></p>
                </div>
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/pwa/tutor/appointments" className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2 active:bg-slate-50">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <span className="font-bold text-sm text-slate-700">Agendar Consulta</span>
          </Link>
          <Link href="/pwa/tutor/hospitalization" className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2 active:bg-slate-50">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
              <HeartPulse size={24} />
            </div>
            <span className="font-bold text-sm text-slate-700">Boletim Médico</span>
          </Link>
        </div>

      </main>

      {/* Signature Modal */}
      {signingDoc && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSigningDoc(null)}></div>
          
          <div className="bg-white w-full h-[70vh] rounded-t-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800">Assinar Documento</h2>
              <button onClick={() => setSigningDoc(null)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50 flex flex-col items-center">
              <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
                <FileText className="text-orange-500" size={24} />
                <span className="font-bold text-slate-700">Termo de Consentimento</span>
              </div>
              <p className="text-sm text-slate-500 mb-2 self-start font-medium">Desenhe sua assinatura abaixo:</p>
              <div className="w-full h-48 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 relative">
                <span className="pointer-events-none">Painel de Assinatura</span>
                <div className="absolute bottom-6 left-8 right-8 border-b border-slate-200"></div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-white">
              <button onClick={confirmSignature} className="w-full bg-orange-500 text-white font-bold text-lg h-14 rounded-2xl flex items-center justify-center gap-2">
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
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${isActive ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}>
              <item.icon size={24} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
