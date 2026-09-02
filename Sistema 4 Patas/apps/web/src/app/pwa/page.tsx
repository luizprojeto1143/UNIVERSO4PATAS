'use client';

import Link from 'next/link';
import { Stethoscope, HeartPulse, ChevronRight, PawPrint } from 'lucide-react';

export default function PwaEntryPage() {
  return (
    <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mt-12 mb-10 text-center">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
          <PawPrint size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Portal da Equipe</h1>
        <p className="text-slate-500 mt-2 font-medium">Selecione seu perfil para continuar</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 flex-1">
        <Link 
          href="/pwa/vet"
          className="group relative bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-100 active:scale-[0.98] active:shadow-sm transition-all duration-200 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Stethoscope size={100} />
          </div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <Stethoscope size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">Veterinário</h2>
              <p className="text-sm text-slate-500 mt-1 leading-tight">
                Acesso ao prontuário, fila e prescrições
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <ChevronRight size={20} />
            </div>
          </div>
        </Link>

        <Link 
          href="/pwa/aux"
          className="group relative bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-100 active:scale-[0.98] active:shadow-sm transition-all duration-200 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <HeartPulse size={100} />
          </div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <HeartPulse size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">Auxiliar</h2>
              <p className="text-sm text-slate-500 mt-1 leading-tight">
                Triagem, internados, plantão e ponto
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs font-medium text-slate-400">
        Sistema 4 Patas &copy; 2026
      </div>
    </div>
  );
}
