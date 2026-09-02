'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, FlaskConical, ChevronLeft, ShieldCheck, Weight, Activity, HeartPulse } from 'lucide-react';

export default function PetProfilePage() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/pwa/tutor', label: 'Home', icon: Home },
    { href: '/pwa/tutor/appointments', label: 'Agenda', icon: Calendar },
    { href: '/pwa/tutor/hospitalization', label: 'Internação', icon: HeartPulse },
    { href: '/pwa/tutor/results', label: 'Exames', icon: FlaskConical },
  ];

  const vaccines = [
    { name: 'V10 (Múltipla)', date: '15/09/2025', status: 'Em dia', vet: 'Dra. Silva' },
    { name: 'Antirrábica', date: '10/10/2025', status: 'Em dia', vet: 'Dra. Silva' },
    { name: 'Gripe Canina', date: '05/11/2023', status: 'Vencida', vet: 'Dr. Costa' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans relative">
      
      {/* Header Area with Pet Image */}
      <div className="relative h-64 bg-slate-200">
        <img src="https://i.pravatar.cc/500?u=thor" alt="Pet Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        
        <button onClick={() => router.back()} className="absolute top-12 left-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:bg-white/30">
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-5 text-white">
          <h1 className="text-3xl font-bold">Thor</h1>
          <p className="text-slate-200 text-sm">Golden Retriever • 4 Anos</p>
        </div>
      </div>

      <main className="px-5 pt-6 space-y-6">
        
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
              <Weight size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Último Peso</p>
              <p className="font-bold text-lg text-slate-800">28.5 kg</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Alergias</p>
              <p className="font-bold text-sm text-slate-800">Nenhuma</p>
            </div>
          </div>
        </div>

        {/* Digital Vaccine Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-orange-500" />
            <h2 className="font-bold text-lg text-slate-800">Carteirinha Digital</h2>
          </div>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {vaccines.map((vax, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${vax.status === 'Vencida' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                  <ShieldCheck size={16} className="text-white" />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800">{vax.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vax.status === 'Vencida' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {vax.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Aplicada em: {vax.date}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Ref: {vax.vet}</p>
                </div>
              </div>
            ))}
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
