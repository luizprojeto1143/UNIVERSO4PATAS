'use client';

import Link from 'next/link';
import { Calendar, Plus, ChevronRight, Stethoscope, Clock, FileText, Beaker, DollarSign, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { useState } from 'react';

export default function VetDashboard({ data }: { data: any }) {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, message, type: type as any });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const myPatients = [
    { id: 1, time: '09:00', patient: 'Thor', type: 'Retorno', status: 'Aguardando na Recepção' },
    { id: 2, time: '10:30', patient: 'Mel', type: 'Consulta', status: 'Confirmado' },
    { id: 3, time: '14:00', patient: 'Bolinha', type: 'Vacina', status: 'A Confirmar' },
  ];

  const hospitalized = [
    { id: '1', name: 'Rex', box: 'Baia 2', nextMeds: '12:00', status: 'Estável' }
  ];

  const labResults = [
    { id: '102', patient: 'Nina', exam: 'Hemograma Completo', date: 'Hoje, 08:30' }
  ];

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      {/* Hero Header Premium */}
      <div className="relative mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-[2rem] p-8 md:p-10 text-white overflow-hidden shadow-2xl shadow-indigo-900/20">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-200 text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Plantão Veterinário Ativo
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Painel Médico Veterinário 👋</h1>
            <p className="text-indigo-200 font-medium text-lg max-w-xl">Gerencie seus atendimentos, prontuários e receitas clínicas.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2 lg:mt-0">
            <Link href="/financial">
              <button className="bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-500/30 text-emerald-50 px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-200">Financeiro / Extrato</p>
                  <p className="text-lg">Ver Comissões</p>
                </div>
              </button>
            </Link>
            
            <Link href="/patients">
              <button className="bg-white text-slate-900 hover:bg-indigo-50 px-6 py-4 rounded-2xl shadow-xl font-bold transition-all flex items-center gap-3 group">
                <div className="p-2 bg-slate-100 group-hover:bg-indigo-100 rounded-lg text-slate-600 group-hover:text-indigo-600 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-lg">Novo Atendimento</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agenda Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-500" /> Agenda de Consultas (Hoje)
              </h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {myPatients.map((apt) => (
                <div key={apt.id} className="p-6 px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="text-center w-16">
                      <p className="text-xl font-black text-teal-900 group-hover:text-teal-600 transition-colors">{apt.time}</p>
                    </div>
                    <div className="w-px h-12 bg-slate-200"></div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {apt.patient}
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-200">
                          {apt.type}
                        </span>
                      </h4>
                      <p className={`text-sm mt-1 font-bold flex items-center gap-1.5 ${apt.status.includes('Recepção') ? 'text-orange-500' : 'text-slate-500'}`}>
                        {apt.status.includes('Recepção') && <AlertCircle className="w-4 h-4" />}
                        {apt.status}
                      </p>
                    </div>
                  </div>
                  <Link href={`/clinical/att-${apt.id}`}>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-sm">
                      Atender Paciente
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-6 h-6 text-rose-500" /> Pacientes Internados
              </h2>
            </div>
            <div className="p-6">
               {hospitalized.map(h => (
                 <Link key={h.id} href="/hospitalization">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 p-5 border border-slate-200/60 rounded-2xl hover:shadow-lg hover:border-slate-300 transition-all bg-white cursor-pointer group">
                      <div>
                        <h3 className="font-black text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">{h.name} <span className="text-sm font-medium text-slate-500 ml-1">({h.box})</span></h3>
                        <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">Status clínico: <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md font-bold text-xs">{h.status}</span></p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Próxima Medicação</p>
                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl font-black border border-rose-100">
                           <Clock className="w-4 h-4" /> {h.nextMeds}
                         </div>
                      </div>
                   </div>
                 </Link>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Lateral */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Beaker className="w-6 h-6 text-purple-500" /> Exames & Resultados
            </h2>
            <div className="space-y-4">
              {labResults.map(res => (
                <Link key={res.id} href="/lab">
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200/60 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-black text-purple-900">{res.patient}</h4>
                      <span className="text-xs text-purple-600 font-medium">{res.date}</span>
                    </div>
                    <p className="text-sm text-purple-700 font-medium">{res.exam}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
