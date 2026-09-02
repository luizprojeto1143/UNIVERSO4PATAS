'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, FlaskConical, ChevronLeft, HeartPulse, FileText, Download, CheckCircle2, Clock, CalendarClock } from 'lucide-react';
import { useLabStore } from '@/store/useLabStore';

export default function TutorResultsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  const navItems = [
    { href: '/pwa/tutor', label: 'Home', icon: Home },
    { href: '/pwa/tutor/appointments', label: 'Agenda', icon: Calendar },
    { href: '/pwa/tutor/hospitalization', label: 'Internação', icon: HeartPulse },
    { href: '/pwa/tutor/results', label: 'Exames', icon: FlaskConical },
  ];

  const { exams } = useLabStore();
  const results = exams.filter(e => e.status !== 'aguardando_confirmacao');

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownloadClick = (result: any) => {
    if (result.status !== 'pronto') return;

    // Se está dentro dos 30 dias de retorno, ele NÃO baixa. Ele força agendar retorno.
    if (result.daysSinceConsult <= 30) {
      router.push(`/pwa/tutor/appointments?pet=${result.pet}&service=Retorno`);
      return;
    }

    // Se passou de 30 dias, libera o laudo.
    showToast('Iniciando download do laudo (PDF)...', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans relative">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 w-[90%] text-center rounded-xl shadow-lg text-white text-sm font-bold flex justify-center items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-orange-500 text-white pt-12 pb-6 px-5 shadow-md rounded-b-[2rem] sticky top-0 z-30 bg-gradient-to-br from-orange-500 to-rose-500">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full active:bg-white/30">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Central de Resultados</h1>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-4">
        
        {/* Info card sobre a regra do laudo */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-3xl mb-2 flex items-start gap-3">
          <CalendarClock className="text-blue-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-blue-800 font-medium leading-snug">
            Laudos são discutidos em consulta de retorno (gratuito até 30 dias da avaliação clínica).
          </p>
        </div>

        {results.map(result => {
          const isReady = result.status === 'pronto';
          const requiresReturn = isReady && result.daysSinceConsult <= 30;

          return (
            <div key={result.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden group">
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isReady ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                    {isReady ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{result.exam}</h3>
                    <p className="text-xs text-slate-500 mt-1">{(result as any).pet || 'Pet'} • {result.timestamp}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                <span className="text-xs text-slate-400 font-medium">Ref: {result.vet}</span>
                
                <button 
                  onClick={() => handleDownloadClick(result)}
                  disabled={!isReady}
                  className={`h-10 px-4 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-colors ${
                    !isReady 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : requiresReturn
                        ? 'bg-orange-500 text-white shadow-md active:bg-orange-600'
                        : 'bg-emerald-100 text-emerald-700 active:bg-emerald-200'
                  }`}
                >
                  {!isReady ? (
                    'Aguardando Lab'
                  ) : requiresReturn ? (
                    <>Agendar Retorno</>
                  ) : (
                    <><Download size={14} /> Baixar Laudo</>
                  )}
                </button>
              </div>
            </div>
          );
        })}

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          const isActive = pathname?.startsWith(item.href) && item.href !== '/pwa/tutor';
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
