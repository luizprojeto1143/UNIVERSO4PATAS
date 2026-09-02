"use client";
import { Button } from '@/components/ui/button';

import { Card } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Syringe, Bug, Activity } from 'lucide-react';
import Link from 'next/link';

export default function PortalPetVaccinesPage({ params }: { params: { id: string } }) {
  // Dados mockados
  const petName = 'Thor';
  const color = 'from-amber-400 to-orange-500';

  const vaccines = [
    { name: 'V10 (Múltipla)', date: '15/08/2025', next: '15/08/2026', vet: 'Dra. Ana', status: 'warning', batch: 'L-88392A' },
    { name: 'Raiva', date: '10/05/2025', next: '10/05/2026', vet: 'Dr. Roberto', status: 'ok', batch: 'R-9921B' },
    { name: 'Gripe Canina', date: '20/12/2025', next: '20/12/2026', vet: 'Dra. Ana', status: 'ok', batch: 'G-1102C' },
  ];

  const preventives = [
    { name: 'Simparic (Antipulgas)', date: '01/07/2026', next: '05/08/2026', status: 'warning' },
    { name: 'Drontal (Vermífugo)', date: '15/02/2026', next: '15/08/2026', status: 'warning' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* Header */}
      <div className={`h-32 bg-gradient-to-r ${color} relative px-4 pt-4`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        <div className="relative z-10 flex items-center gap-4">
          <Link href={`/portal/pets/${params.id}`}>
            <Button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-black text-white">Carteirinha Digital</h1>
        </div>
      </div>

      <div className="px-4 -mt-10 relative z-20 space-y-6">
        
        {/* Selo Central */}
        <Card className="p-4 bg-white border-0 shadow-lg shadow-slate-200/50 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-lg">Proteção Ativa</h2>
              <p className="text-xs font-bold text-slate-500">{petName} está quase 100% protegido.</p>
            </div>
          </div>
        </Card>

        {/* Vacinas */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider ml-1 mb-3 flex items-center gap-2">
            <Syringe className="w-4 h-4" /> Vacinas
          </h3>
          <div className="space-y-3">
            {vaccines.length === 0 ? (
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
              </div>
            ) : (
              vaccines.map((v, i) => (
                <Card key={i} className={`p-4 border-l-4 rounded-2xl shadow-sm bg-white ${v.status === 'warning' ? 'border-l-amber-500' : 'border-l-emerald-500 border-t-slate-100 border-r-slate-100 border-b-slate-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-800 text-lg">{v.name}</h4>
                  {v.status === 'warning' ? (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Vence em breve
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Em dia
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Aplicada em</p>
                    <p className="font-bold text-sm text-slate-700">{v.date}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${v.status === 'warning' ? 'bg-amber-50' : 'bg-slate-50'}`}>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Próxima dose</p>
                    <p className={`font-bold text-sm ${v.status === 'warning' ? 'text-amber-700' : 'text-slate-700'}`}>{v.next}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-2 mt-2">
                  <span>Resp: {v.vet}</span>
                  <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-500">Lote: {v.batch}</span>
                </div>
              </Card>
              ))
            )}
          </div>
        </div>

        {/* Preventivos */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider ml-1 mb-3 flex items-center gap-2">
            <Bug className="w-4 h-4" /> Controle de Parasitas
          </h3>
          <div className="space-y-3">
            {preventives.length === 0 ? (
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
              </div>
            ) : (
              preventives.map((p, i) => (
                <Card key={i} className="p-4 border-slate-200 shadow-sm rounded-2xl bg-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{p.name}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">Última: {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-amber-500 mb-0.5">Vencendo</p>
                  <p className="font-black text-amber-600 text-sm">{p.next}</p>
                </div>
              </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
