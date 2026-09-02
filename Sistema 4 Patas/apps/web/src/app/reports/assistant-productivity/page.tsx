'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, BarChart3, Clock, CheckCircle2, XCircle, TrendingUp, TrendingDown, Users, ChevronDown, Download, FileText, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockProductivity = [
  {
    id: 1,
    name: 'Brenda Melo',
    shift: 'Diurno',
    score: 95,
    trend: 'up',
    checklists: { completed: 42, missed: 2, total: 44 },
    meds: { onTime: 120, delayed: 3, total: 123 },
    missedDetails: ['Piso da recepção não limpo (20/07)', 'Lixo do consultório não trocado (22/07)'],
    delayedDetails: ['Dipirona Injetável (Max) - 30m atraso'],
  },
  {
    id: 2,
    name: 'Deisy',
    shift: 'Noturno',
    score: 82,
    trend: 'down',
    checklists: { completed: 38, missed: 6, total: 44 },
    meds: { onTime: 95, delayed: 15, total: 110 },
    missedDetails: ['Banheiros não organizados (21/07)', 'Reposição de material não feita (21/07)', 'Lixo infectante não trocado (24/07)'],
    delayedDetails: ['Fluidoterapia (Suzi) - 1h atraso', 'Tramadol (Rex) - 45m atraso'],
  },
  {
    id: 3,
    name: 'Ana Souza',
    shift: 'Diurno',
    score: 98,
    trend: 'up',
    checklists: { completed: 44, missed: 0, total: 44 },
    meds: { onTime: 130, delayed: 1, total: 131 },
    missedDetails: [],
    delayedDetails: ['Ringer Lactato (Bolinha) - 10m atraso'],
  }
];

export default function AssistantProductivityPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Export States
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleExpand = (id: number) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      showToast('Relatório em PDF exportado com sucesso!');
      const content = `UNIVERSO 4 PATAS - RELATÓRIO DE PRODUTIVIDADE DA EQUIPE\nData de Emissão: ${new Date().toLocaleDateString('pt-BR')}\n\nDESEMPENHO DOS AUXILIARES:\n- Ana Paula (Recepção/Auxiliar): 42 Medicações, 12 Triagens (Desempenho: 98%)\n- Carlos Mendes (Auxiliar de UTI): 38 Medicações, 15 Triagens (Desempenho: 95%)\n- Letícia (Auxiliar): 29 Medicações, 8 Triagens (Desempenho: 92%)\n\nRelatório emitido pelo sistema de gestão veterinária.`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatorio_Produtividade_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    setTimeout(() => {
      setIsExportingExcel(false);
      showToast('Relatório em Excel baixado com sucesso!');
      const csv = `Auxiliar;Medicacoes;Triagens;Taxa de Pontualidade\nAna Paula;42;12;98%\nCarlos Mendes;38;15;95%\nLetícia;29;8;92%`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Produtividade_Equipe_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto p-4 md:p-8">
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
              <BarChart3 className="w-7 h-7 text-indigo-600" />
              Produtividade da Equipe
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Avalie o desempenho dos auxiliares com base nos plantões e medicações.</p>
          </div>
        </div>
        
      {/* Date Range Filter and Actions */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            <Input type="date" className="border-0 h-8 focus-visible:ring-0 w-32" />
            <span className="text-slate-400">-</span>
            <Input type="date" className="border-0 h-8 focus-visible:ring-0 w-32" />
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button 
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
            >
              {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>Exportar PDF</span>
            </Button>
            
            <Button 
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              {isExportingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Baixar Excel</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="p-6 border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Equipe Ativa</p>
              <p className="text-2xl font-black text-slate-800">3 Auxiliares</p>
            </div>
         </Card>
         <Card className="p-6 border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Média da Equipe</p>
              <p className="text-2xl font-black text-slate-800">91.6%</p>
            </div>
         </Card>
         <Card className="p-6 border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Medicações em Atraso</p>
              <p className="text-2xl font-black text-slate-800">19</p>
            </div>
         </Card>
      </div>

      {/* Mock Chart Area */}
      <Card className="p-6 border-slate-200 shadow-sm mb-8">
        <h3 className="font-bold text-slate-800 mb-6">Desempenho Semanal (Gráfico Simulado)</h3>
        <div className="flex items-end gap-4 h-48 mt-4 border-b border-slate-100 pb-2 relative">
          {/* Y Axis labels */}
          <div className="flex flex-col justify-between h-full text-xs text-slate-400 absolute -left-2 transform -translate-x-full">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>
          
          {/* Bars */}
          <div className="flex-1 flex justify-around items-end h-full">
            <div className="w-12 bg-indigo-200 rounded-t-sm h-[60%] hover:bg-indigo-300 transition-colors relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">60%</div>
            </div>
            <div className="w-12 bg-indigo-400 rounded-t-sm h-[80%] hover:bg-indigo-500 transition-colors relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">80%</div>
            </div>
            <div className="w-12 bg-indigo-600 rounded-t-sm h-[95%] hover:bg-indigo-700 transition-colors relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">95%</div>
            </div>
            <div className="w-12 bg-indigo-300 rounded-t-sm h-[75%] hover:bg-indigo-400 transition-colors relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">75%</div>
            </div>
            <div className="w-12 bg-indigo-500 rounded-t-sm h-[90%] hover:bg-indigo-600 transition-colors relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</div>
            </div>
          </div>
        </div>
        <div className="flex justify-around mt-2 text-xs font-medium text-slate-500 ml-6">
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
        </div>
      </Card>

      <div className="space-y-4">
        {mockProductivity.map(assistant => (
          <Card key={assistant.id} className="border-slate-200 shadow-sm overflow-hidden">
             {/* Header Row */}
             <div 
               onClick={() => toggleExpand(assistant.id)}
               className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-4"
             >
                <div className="flex items-center gap-6">
                   <div className="relative">
                     {/* Circular Progress */}
                     <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                        <circle 
                          cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                          strokeDasharray={28 * 2 * Math.PI} 
                          strokeDashoffset={(28 * 2 * Math.PI) - ((assistant.score / 100) * (28 * 2 * Math.PI))}
                          className={assistant.score >= 90 ? 'text-emerald-500' : assistant.score >= 80 ? 'text-amber-500' : 'text-rose-500'} 
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center font-black text-sm">
                        {assistant.score}%
                     </div>
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                       {assistant.name}
                       {assistant.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
                     </h2>
                     <p className="text-slate-500 font-medium">Plantão {assistant.shift}</p>
                   </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-6 md:items-center">
                   <div className="text-center md:text-right">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Checklist</p>
                     <p className="font-bold text-slate-700">
                       <span className={assistant.checklists.missed === 0 ? "text-emerald-600" : "text-amber-500"}>{assistant.checklists.completed}</span> / {assistant.checklists.total} feitos
                     </p>
                   </div>
                   <div className="hidden md:block w-px h-10 bg-slate-200"></div>
                   <div className="text-center md:text-right">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Medicação</p>
                     <p className="font-bold text-slate-700">
                       <span className={assistant.meds.delayed === 0 ? "text-emerald-600" : "text-rose-500"}>{assistant.meds.delayed}</span> / {assistant.meds.total} atrasadas
                     </p>
                   </div>
                   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 ml-2">
                     <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${expandedId === assistant.id ? 'rotate-180' : ''}`} />
                   </div>
                </div>
             </div>

             {/* Expanded Details */}
             {expandedId === assistant.id && (
               <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-500" /> 
                      Falhas de Checklist
                    </h3>
                    {assistant.missedDetails.length > 0 ? (
                      <ul className="space-y-2">
                        {assistant.missedDetails.map((detail, idx) => (
                          <li key={idx} className="text-sm font-medium text-slate-600 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                        Nenhuma falha de checklist neste período! 🎉
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" /> 
                      Atrasos de Medicação
                    </h3>
                    {assistant.delayedDetails.length > 0 ? (
                      <ul className="space-y-2">
                        {assistant.delayedDetails.map((detail, idx) => (
                          <li key={idx} className="text-sm font-medium text-slate-600 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                        Nenhum atraso de medicação registrado! 🎉
                      </p>
                    )}
                  </div>
               </div>
             )}
          </Card>
        ))}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}
    </div>
  );
}

