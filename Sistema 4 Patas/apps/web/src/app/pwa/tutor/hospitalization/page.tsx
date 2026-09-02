'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, FlaskConical, ChevronLeft, HeartPulse, Camera, Clock, Activity, AlertCircle } from 'lucide-react';

export default function TutorHospitalizationPage() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/pwa/tutor', label: 'Home', icon: Home },
    { href: '/pwa/tutor/appointments', label: 'Agenda', icon: Calendar },
    { href: '/pwa/tutor/hospitalization', label: 'Internação', icon: HeartPulse },
    { href: '/pwa/tutor/results', label: 'Exames', icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans relative">
      
      {/* Header */}
      <header className="bg-orange-500 text-white pt-12 pb-6 px-5 shadow-md rounded-b-[2rem] sticky top-0 z-30 bg-gradient-to-br from-orange-500 to-rose-500">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full active:bg-white/30">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Boletim de Internação</h1>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        
        {/* Active Patient Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 border-2 border-orange-100">
              <img src="https://i.pravatar.cc/150?u=thor" alt="Thor" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Thor</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-sm font-bold text-amber-600">Em Observação</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Update */}
        <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={20} className="text-amber-600" />
            <h3 className="font-bold text-amber-800">Última Atualização</h3>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed font-medium">
            "Thor passou bem a noite. A temperatura está estável e ele aceitou alimentação pastosa pela manhã. Continuamos com a fluidoterapia."
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700/70 font-bold">
            <Clock size={12} /> 08:30 - Dra. Silva
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="font-bold text-slate-700 mb-4 text-lg">Histórico (Hoje)</h3>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-500 shrink-0 shadow-sm z-10">
                <Activity size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 text-sm">Sinais Vitais Avaliados</h4>
                  <span className="text-xs font-bold text-slate-400">07:00</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Temp: 38.5°C • FC: 120 • Dor: 2</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-100 text-purple-500 shrink-0 shadow-sm z-10">
                <Camera size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 text-sm">Foto Recebida</h4>
                  <span className="text-xs font-bold text-slate-400">Ontem, 20:00</span>
                </div>
                <div className="w-full h-32 bg-slate-200 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300" alt="Pet resting" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>

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
