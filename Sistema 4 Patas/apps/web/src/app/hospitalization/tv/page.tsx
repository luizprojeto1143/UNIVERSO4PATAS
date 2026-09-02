"use client";

import { useEffect, useState } from "react";
import { 
  AlertTriangle, Clock, Droplets, HeartPulse, Pill, 
  Activity, Bed, Sparkles, ShieldAlert, ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { useHospitalizationStore } from "@/store/useHospitalizationStore";

export default function HospitalizationTVPage() {
  const { kennels, activeDoctors } = useHospitalizationStore();
  const [time, setTime] = useState("");
  const [activeWardFilter, setActiveWardFilter] = useState<'all' | 'dogs' | 'cats' | 'icu' | 'isolation'>('all');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('pt-BR'));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const occupiedKennels = kennels.filter(k => k.status === 'occupied' && (activeWardFilter === 'all' || k.ward === activeWardFilter));
  const freeKennels = kennels.filter(k => k.status === 'free' && (activeWardFilter === 'all' || k.ward === activeWardFilter));

  const totalCritical = kennels.filter(k => k.status === 'occupied' && k.critical).length;
  let totalLateMeds = 0;
  kennels.filter(k => k.status === 'occupied').forEach(k => {
    k.medications.forEach(m => {
      m.times.forEach(t => {
        if (t.status === 'late') totalLateMeds++;
      });
    });
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden flex flex-col selection:bg-indigo-500/30">
      
      {/* Topbar TV */}
      <div className="h-24 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex justify-between items-center px-8 shrink-0 shadow-2xl sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/hospitalization">
            <div className="bg-indigo-600 hover:bg-indigo-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105">
              <Bed className="w-7 h-7 text-white" />
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Painel UTI & Internação TV
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> AO VIVO
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Monitoramento Hospitalar Contínuo de Leitos e Aprazamentos
            </p>
          </div>
        </div>
        
        {/* Right Side Stats & Clock */}
        <div className="flex items-center gap-6">
          {/* Emergency Alert Badge on TV */}
          {totalLateMeds > 0 && (
            <div className="hidden lg:flex items-center gap-2.5 bg-red-950/80 border border-red-500/50 px-4 py-2 rounded-2xl animate-pulse text-red-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>{totalLateMeds} medicação atrasada</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-3 bg-slate-800/80 px-5 py-2.5 rounded-2xl border border-slate-700 text-xs font-bold text-slate-300">
            <span className="text-slate-400">Plantonistas:</span>
            <span className="text-indigo-400 font-extrabold">{activeDoctors.slice(0, 2).join(' • ')}</span>
          </div>

          <div className="text-4xl md:text-5xl font-black text-indigo-400 font-mono tracking-tighter bg-slate-900 px-6 py-2 rounded-2xl border border-slate-800 shadow-inner">
            {time}
          </div>
        </div>
      </div>

      {/* Ward Filter Buttons on TV */}
      <div className="px-8 py-4 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 uppercase mr-2">Filtrar Ala:</span>
        <button 
          onClick={() => setActiveWardFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeWardFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Todas ({kennels.length})
        </button>
        <button 
          onClick={() => setActiveWardFilter('dogs')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeWardFilter === 'dogs' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Cães ({kennels.filter(k => k.ward === 'dogs').length})
        </button>
        <button 
          onClick={() => setActiveWardFilter('cats')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeWardFilter === 'cats' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Gatos ({kennels.filter(k => k.ward === 'cats').length})
        </button>
        <button 
          onClick={() => setActiveWardFilter('icu')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeWardFilter === 'icu' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          UTI ({kennels.filter(k => k.ward === 'icu').length})
        </button>
        <button 
          onClick={() => setActiveWardFilter('isolation')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeWardFilter === 'isolation' ? 'bg-red-600 text-white font-black shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Isolamento ({kennels.filter(k => k.ward === 'isolation').length})
        </button>
      </div>

      {/* Grid TV */}
      <div className="flex-1 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          
          {/* Occupied Kennels */}
          {occupiedKennels.map(k => {
            const latestVital = k.vitalRecords && k.vitalRecords.length > 0 ? k.vitalRecords[0] : null;
            const hasOverdueMed = k.medications.some(m => m.times.some(t => t.status === 'late'));
            const pendingMeds = k.medications
              .flatMap(m => m.times.map(t => ({ medName: m.name, dose: m.dose, ...t })))
              .filter(t => t.status === 'pending' || t.status === 'late')
              .slice(0, 3);

            return (
              <div 
                key={k.kennelId} 
                className={`rounded-3xl border-2 flex flex-col overflow-hidden transition-all duration-300 relative shadow-xl ${
                  k.critical && hasOverdueMed
                    ? 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.25)] bg-gradient-to-b from-red-950/40 to-slate-900/90'
                    : k.critical 
                    ? 'border-amber-500/70 bg-gradient-to-b from-amber-950/20 to-slate-900/90' 
                    : 'border-slate-800 bg-slate-900/90 hover:border-indigo-500/50'
                }`}
              >
                {/* Card Top */}
                <div className={`px-6 py-4 flex justify-between items-center ${
                  k.critical && hasOverdueMed ? 'bg-red-950/90' : k.critical ? 'bg-amber-950/50' : 'bg-slate-800/80'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-black ${k.critical ? 'text-white' : 'text-slate-100'}`}>
                      Baia {k.kennelId}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      k.ward === 'icu' ? 'bg-amber-500 text-slate-950' : 
                      k.ward === 'isolation' ? 'bg-red-500 text-white' : 
                      'bg-slate-700 text-slate-200'
                    }`}>
                      {k.wardLabel}
                    </span>
                  </div>

                  {k.critical && (
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <HeartPulse className="w-3.5 h-3.5" /> Crítico
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h2 className="text-3xl font-black text-white tracking-tight">{k.name}</h2>
                      <span className="text-sm font-bold text-slate-400">{k.species} • {k.weight} kg</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-300 leading-snug line-clamp-2 mb-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      {k.diagnosis}
                    </p>

                    {/* Vitals Highlights on TV */}
                    {latestVital ? (
                      <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Temp</span>
                          <span className={`font-black text-sm ${
                            latestVital.temperature > 39.2 ? 'text-red-400' : 'text-slate-200'
                          }`}>
                            {latestVital.temperature}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">FC</span>
                          <span className="font-black text-sm text-slate-200">{latestVital.heartRate} bpm</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Glicose</span>
                          <span className="font-black text-sm text-slate-200">{latestVital.glucose} mg/dL</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 bg-slate-950/40 p-2 rounded-xl text-center mb-4">
                        Aguardando aferição de vitais do turno
                      </div>
                    )}

                    {/* Fluids banner */}
                    {k.fluids.hasFluids && (
                      <div className="flex items-center justify-between text-xs bg-sky-950/40 border border-sky-500/30 p-2.5 rounded-xl text-sky-300 mb-4 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Droplets className="w-4 h-4 text-sky-400 animate-pulse" /> {k.fluids.solution}
                        </span>
                        <span className="font-black text-sky-400">{k.fluids.rateMlH} ml/h</span>
                      </div>
                    )}
                  </div>

                  {/* Next Meds Section */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Próximas Medicações
                    </span>

                    {pendingMeds.length === 0 ? (
                      <p className="text-xs font-bold text-emerald-400 py-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Todas as doses checadas
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pendingMeds.map((m, idx) => (
                          <div 
                            key={idx} 
                            className={`flex justify-between items-center p-2.5 rounded-xl border text-xs ${
                              m.status === 'late' 
                                ? 'bg-red-500/20 border-red-500 text-red-200 animate-pulse font-bold' 
                                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 font-medium'
                            }`}
                          >
                            <span className="truncate max-w-[180px] flex items-center gap-1.5">
                              <Pill className={`w-3.5 h-3.5 ${m.status === 'late' ? 'text-red-400' : 'text-slate-400'}`} />
                              {m.medName}
                            </span>
                            <span className={`font-black ${m.status === 'late' ? 'text-red-400' : 'text-indigo-400'}`}>
                              {m.time} {m.status === 'late' && '(ATRASADO)'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {/* Empty / Free Kennels */}
          {freeKennels.map(k => (
            <div 
              key={k.kennelId} 
              className="rounded-3xl border-2 border-slate-800/40 bg-slate-900/20 border-dashed flex flex-col items-center justify-center p-8 text-center text-slate-600 min-h-[280px]"
            >
              <Bed className="w-12 h-12 mb-2 opacity-40 text-slate-500" />
              <span className="font-black text-lg uppercase tracking-wider text-slate-400">Baia {k.kennelId} Livre</span>
              <span className="text-xs text-slate-600 mt-1 uppercase font-semibold">{k.wardLabel}</span>
            </div>
          ))}

        </div>
      </div>
      
    </div>
  );
}
