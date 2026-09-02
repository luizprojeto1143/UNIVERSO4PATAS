'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Users, FlaskConical, Pill, ChevronLeft } from 'lucide-react';
import { useClinicalStore } from '../../../../store/useClinicalStore';

export default function VetQueuePage() {
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  const appointments = useClinicalStore(state => state.appointments);
  const updateStatus = useClinicalStore(state => state.updateStatus);

  // Vets only see patients waiting for consultation or already in consultation
  const pendingPatients = appointments.filter(a => a.status === 'Aguardando Consulta' || a.status === 'Em Consulta');

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const navItems = [
    { href: '/pwa/vet', label: 'Home', icon: Home },
    { href: '/pwa/vet/queue', label: 'Fila', icon: Users },
    { href: '/pwa/vet/results', label: 'Resultados', icon: FlaskConical },
    { href: '/pwa/vet/prescribe', label: 'Prescrever', icon: Pill },
  ];

  const handleChamar = (id: string) => {
    updateStatus(id, 'Em Consulta');
    showToast('Paciente chamado! Iniciando consulta...', 'success');
    setTimeout(() => {
      router.push(`/pwa/vet/patient/${id}`);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando Consulta': return 'bg-amber-100 text-amber-700';
      case 'Em Consulta': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 w-[90%] text-center rounded-xl shadow-lg text-white text-sm font-bold flex justify-center items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-indigo-600 text-white px-5 pt-12 pb-6 shadow-md rounded-b-[2rem] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full active:bg-white/30">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            Fila do Dia 
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{pendingPatients.length}</span>
          </h1>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-4">
        {pendingPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100 mt-10">
            <h3 className="text-lg font-bold text-slate-700">Fila Limpa!</h3>
            <p className="text-sm text-slate-500 mt-2">Nenhum paciente aguardando consulta no momento.</p>
          </div>
        ) : (
          pendingPatients.map(patient => (
            <div key={patient.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    {patient.triageData && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                        Triagem OK
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{patient.petName} <span className="text-sm font-normal text-slate-500">({patient.breed})</span></h3>
                  <p className="text-sm text-slate-500 mt-1">Tutor: {patient.ownerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-indigo-600">{patient.time}</span>
                  <p className="text-xs font-medium text-slate-400">{patient.type}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-50 flex gap-2">
                {patient.status === 'Em Consulta' ? (
                  <button onClick={() => router.push(`/pwa/vet/patient/${patient.id}`)} className="flex-1 bg-indigo-50 text-indigo-600 font-bold text-sm h-12 rounded-xl active:bg-indigo-100 transition-colors">
                    Continuar Consulta
                  </button>
                ) : (
                  <button onClick={() => handleChamar(patient.id)} className="flex-1 bg-indigo-600 text-white font-bold text-sm h-12 rounded-xl shadow-md shadow-indigo-200 active:bg-indigo-700 transition-colors">
                    Chamar Paciente
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          const isActive = item.href === '/pwa/vet/queue';
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
