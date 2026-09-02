'use client';

import { useState } from 'react';
import CeoDashboard from './CeoDashboard';
import VetDashboard from './VetDashboard';
import AssistantDashboard from './AssistantDashboard';
import { Building2, Stethoscope, Users } from 'lucide-react';

export default function DashboardController({ data }: { data: any }) {
  const [role, setRole] = useState<'ceo' | 'vet' | 'assistant'>('ceo');

  return (
    <div className="space-y-6">
      {/* Seletor de Visão do Painel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm max-w-7xl mx-auto">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 pl-2">
          Alternar Modo de Visão do Painel:
        </span>

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setRole('ceo')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              role === 'ceo'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4" /> Diretoria (CEO)
          </button>

          <button
            onClick={() => setRole('vet')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              role === 'vet'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Corpo Médico (Vet)
          </button>

          <button
            onClick={() => setRole('assistant')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              role === 'assistant'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" /> Operacional (Recepção)
          </button>
        </div>
      </div>

      {role === 'ceo' && <CeoDashboard data={data} />}
      {role === 'vet' && <VetDashboard data={data} />}
      {role === 'assistant' && <AssistantDashboard data={data} role={role} />}
    </div>
  );
}
