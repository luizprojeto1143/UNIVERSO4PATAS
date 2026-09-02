'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Filter, ChevronDown, CheckCircle2, Clock, FileDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockCommissions = [
  { id: 1, date: 'Hoje, 10:30', patient: 'Mel (Felino)', procedure: 'Consulta Especialista', totalValue: 200.00, vetPercentage: 40, vetEarned: 80.00, status: 'paid' },
  { id: 2, date: 'Hoje, 11:45', patient: 'Rex (Canino)', procedure: 'Vacina V10', totalValue: 120.00, vetPercentage: 20, vetEarned: 24.00, status: 'paid' },
  { id: 3, date: 'Hoje, 14:00', patient: 'Bolinha (Canino)', procedure: 'Ultrassonografia', totalValue: 350.00, vetPercentage: 30, vetEarned: 105.00, status: 'pending' },
  { id: 4, date: 'Ontem, 16:30', patient: 'Suzi (Felino)', procedure: 'Cirurgia de Castração', totalValue: 800.00, vetPercentage: 50, vetEarned: 400.00, status: 'paid' },
];

export default function VetCommissionsPage() {
  const [period, setPeriod] = useState<'hoje' | 'semana' | 'mes'>('hoje');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setToast({ show: true, message: 'Relatório gerado com sucesso!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }, 1500);
  };

  return (
    <div className="pb-12 max-w-6xl mx-auto p-4 md:p-8 relative">
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-emerald-500/90 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-sm z-50 animate-in slide-in-from-bottom-5">
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-emerald-600" />
              Minhas Comissões
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Acompanhe seus ganhos em tempo real.</p>
          </div>
        </div>
        
        {/* Toggle Period */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <Button 
              onClick={() => setPeriod('hoje')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${period === 'hoje' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Hoje
            </Button>
            <Button 
              onClick={() => setPeriod('semana')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${period === 'semana' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Nesta Semana
            </Button>
            <Button 
              onClick={() => setPeriod('mes')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${period === 'mes' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Neste Mês
            </Button>
          </div>
          <Button onClick={handleGenerateReport} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <Card className="p-6 border-emerald-200 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <TrendingUp className="w-32 h-32 text-emerald-600" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-emerald-700 mb-1 flex items-center gap-2">
                Total Aprovado (Hoje)
              </p>
              <p className="text-4xl font-black text-emerald-900">R$ 104,00</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-200/50 text-emerald-800 rounded-lg text-xs font-bold">
                <TrendingUp className="w-3 h-3" /> +12% em relação a ontem
              </div>
            </div>
         </Card>

         <Card className="p-6 border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-1">A Receber (Pendentes de Faturamento)</p>
            <p className="text-3xl font-black text-slate-800">R$ 105,00</p>
            <p className="text-sm text-slate-400 font-medium mt-4">Projetos de exames/internação ainda em andamento.</p>
         </Card>

         <Card className="p-6 border-slate-200 shadow-sm bg-slate-900 text-white">
            <p className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Projeção do Mês
            </p>
            <p className="text-3xl font-black text-white">R$ 12.450,00</p>
            <p className="text-sm text-indigo-300 font-medium mt-4">Mantendo o ritmo atual de consultas.</p>
         </Card>
      </div>

      {/* Statement Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-800">Extrato Detalhado de Repasses</h2>
          <Button variant="outline" className="h-9 rounded-lg font-bold text-slate-600 flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4" /> Filtrar
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 pl-6 border-b border-slate-100">Data/Hora</th>
                <th className="p-4 border-b border-slate-100">Paciente</th>
                <th className="p-4 border-b border-slate-100">Procedimento</th>
                <th className="p-4 border-b border-slate-100 text-right">Valor Bruto</th>
                <th className="p-4 border-b border-slate-100 text-center">Taxa (Admin)</th>
                <th className="p-4 border-b border-slate-100 text-right">Sua Comissão</th>
                <th className="p-4 pr-6 border-b border-slate-100 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCommissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                mockCommissions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 text-sm font-medium text-slate-500">{item.date}</td>
                    <td className="p-4 text-sm font-bold text-slate-800">{item.patient}</td>
                    <td className="p-4 text-sm font-medium text-slate-600">{item.procedure}</td>
                    <td className="p-4 text-sm font-medium text-slate-500 text-right">
                      R$ {item.totalValue.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                        {item.vetPercentage}%
                      </span>
                    </td>
                    <td className="p-4 text-sm font-black text-emerald-600 text-right">
                      + R$ {item.vetEarned.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      {item.status === 'paid' ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200/50">
                          <CheckCircle2 className="w-3 h-3" /> Faturado
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200/50">
                          <Clock className="w-3 h-3" /> Pendente
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 text-center text-xs font-medium text-slate-400">
          As taxas e percentuais são configurados automaticamente pela Diretoria (Admin).
        </div>
      </Card>
    </div>
  );
}
