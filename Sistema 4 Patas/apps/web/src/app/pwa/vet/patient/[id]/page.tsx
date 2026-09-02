'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Users, FlaskConical, Pill, ChevronLeft, Save, HeartPulse, Scale, Thermometer, Activity } from 'lucide-react';
import { useClinicalStore } from '../../../../../store/useClinicalStore';

export default function PatientRecordPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  const appointments = useClinicalStore(state => state.appointments);
  const updateStatus = useClinicalStore(state => state.updateStatus);

  const patient = appointments.find(a => a.id === params.id);

  const [anamnese, setAnamnese] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  if (!patient) {
    return <div className="p-8 text-center">Paciente não encontrado.</div>;
  }

  const handleFinish = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateStatus(patient.id, 'Finalizado');
      setIsSaving(false);
      showToast('Consulta finalizada com sucesso!', 'success');
      setTimeout(() => router.push('/pwa/vet/queue'), 1500);
    }, 1000);
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full active:bg-white/30">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-tight">{patient.petName}</h1>
              <p className="text-sm text-indigo-200">{patient.breed}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        
        {/* Triage Data Block (Pre-filled from Auxiliar) */}
        {patient.triageData && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
              Dados da Triagem
            </div>
            
            <h3 className="font-bold text-slate-700 mb-4 text-sm flex items-center gap-2">
              <Activity size={16} className="text-emerald-500"/> Sinais Vitais Coletados
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Scale size={12}/> Peso</span>
                <span className="text-lg font-bold text-slate-800 mt-1">{patient.triageData.weight} <span className="text-sm font-normal">kg</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Thermometer size={12}/> Temperatura</span>
                <span className="text-lg font-bold text-slate-800 mt-1">{patient.triageData.temp} <span className="text-sm font-normal">°C</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><HeartPulse size={12}/> Freq. Cardíaca</span>
                <span className="text-lg font-bold text-slate-800 mt-1">{patient.triageData.heartRate} <span className="text-sm font-normal">bpm</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400">Nível de Dor</span>
                <span className="text-lg font-bold text-slate-800 mt-1">{patient.triageData.painLevel} / 10</span>
              </div>
            </div>

            {patient.triageData.reason && (
              <div className="mt-4 bg-amber-50 p-3 rounded-2xl border border-amber-100">
                <span className="text-xs font-bold text-amber-700 block mb-1">Notas do Auxiliar:</span>
                <p className="text-sm text-slate-700">{patient.triageData.reason}</p>
              </div>
            )}
          </div>
        )}

        {/* Clinical Form */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-5">
          <h3 className="font-bold text-slate-700 text-sm">Anamnese / Evolução</h3>
          <textarea 
            value={anamnese}
            onChange={(e) => setAnamnese(e.target.value)}
            placeholder="Digite os achados clínicos..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 h-40"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => router.push('/pwa/vet/prescribe')} className="bg-indigo-50 text-indigo-600 font-bold text-sm h-14 rounded-2xl active:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
            <Pill size={18} /> Prescrever
          </button>
          <button className="bg-indigo-50 text-indigo-600 font-bold text-sm h-14 rounded-2xl active:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
            <FlaskConical size={18} /> Pedir Exame
          </button>
        </div>

        <button 
          onClick={handleFinish}
          disabled={isSaving}
          className="w-full bg-indigo-600 text-white font-bold text-lg h-14 rounded-2xl shadow-md active:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          {isSaving ? 'Finalizando...' : <><Save size={20} /> Finalizar Consulta</>}
        </button>

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors text-slate-400">
              <item.icon size={24} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
