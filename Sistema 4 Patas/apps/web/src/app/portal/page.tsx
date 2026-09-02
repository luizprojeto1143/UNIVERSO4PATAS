'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Syringe, Pill, Stethoscope, FileText, Receipt, Hospital, AlertCircle, PhoneCall, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function PortalHomePage() {
  const alerts = [
    { type: 'vaccine', title: 'Vacina V10 vencendo', subtitle: 'Thor - Vence em 15 de Agosto', icon: <Syringe className="w-5 h-5 text-rose-500" />, color: 'bg-rose-50 border-rose-100 text-rose-900' },
    { type: 'exam', title: 'Resultado Disponível', subtitle: 'Hemograma Completo (Luna)', icon: <FileText className="w-5 h-5 text-blue-500" />, color: 'bg-blue-50 border-blue-100 text-blue-900' },
    { type: 'payment', title: 'Fatura Pendente', subtitle: 'Consulta (R$ 150,00)', icon: <Receipt className="w-5 h-5 text-amber-500" />, color: 'bg-amber-50 border-amber-100 text-amber-900' },
  ];

  return (
    <div className="p-4 space-y-6">
      
      {/* Salutation */}
      <div className="pt-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Olá, Roberto! 👋</h1>
        <p className="text-slate-500 font-medium">Veja como estão seus pets hoje.</p>
      </div>

      {/* Próximo Compromisso em Destaque */}
      <Card className="p-5 border-0 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-xl shadow-indigo-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calendar className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Próximo Retorno
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-xs font-bold uppercase">Ago</span>
              <span className="text-xl font-black">03</span>
            </div>
            <div>
              <h2 className="text-xl font-black">Thor</h2>
              <p className="text-indigo-100 font-medium text-sm flex items-center gap-1">
                <Stethoscope className="w-4 h-4" /> Dra. Ana (14:00)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Internação em Andamento */}
      <Link href="/portal/hospitalization">
        <Card className="p-4 border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-200 cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-100">Internação Ativa</p>
              <h3 className="text-lg font-black">Piloto</h3>
              <p className="text-xs font-bold text-emerald-50">Boletim atualizado hoje às 08:00</p>
            </div>
          </div>
          <div className="bg-white text-emerald-600 px-3 py-1.5 rounded-full text-xs font-black">
            Ler
          </div>
        </Card>
      </Link>

      {/* Alertas e Pendências */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          Atenção
        </h3>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border flex items-center gap-4 ${alert.color}`}>
              <div className="bg-white p-2 rounded-xl shadow-sm">
                {alert.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{alert.title}</h4>
                <p className="text-xs font-medium opacity-80">{alert.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações Rápidas (Grid 2x2) */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/portal/schedule">
            <Card className="p-4 border-slate-200 shadow-sm rounded-2xl hover:border-indigo-300 transition-colors flex flex-col items-center justify-center text-center gap-2 h-28 bg-white">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">Agendar</span>
            </Card>
          </Link>
          
          <Link href="/portal/messages">
            <Card className="p-4 border-slate-200 shadow-sm rounded-2xl hover:border-indigo-300 transition-colors flex flex-col items-center justify-center text-center gap-2 h-28 bg-white">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">Falar com a Clínica</span>
            </Card>
          </Link>

          <Link href="/portal/exams">
            <Card className="p-4 border-slate-200 shadow-sm rounded-2xl hover:border-indigo-300 transition-colors flex flex-col items-center justify-center text-center gap-2 h-28 bg-white">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">Ver Exames</span>
            </Card>
          </Link>

          <Link href="/portal/emergency">
            <Card className="p-4 border-rose-200 shadow-sm rounded-2xl hover:border-rose-300 hover:bg-rose-50 transition-colors flex flex-col items-center justify-center text-center gap-2 h-28 bg-white">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                <Hospital className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-rose-700">Emergência</span>
            </Card>
          </Link>
        </div>
      </div>

    </div>
  );
}
