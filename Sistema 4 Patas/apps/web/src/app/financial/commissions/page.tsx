'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, ChevronDown, CheckCircle2, 
  ArrowLeft, Download, AlertCircle, FileText, ArrowRightLeft, CalendarClock
} from 'lucide-react';
import Link from 'next/link';

export default function CommissionsStatementsPage() {
  const [expandedProf, setExpandedProf] = useState<number | null>(1);
  const [markedAsPaid, setMarkedAsPaid] = useState<number[]>([]);

  // Mock Data
  const summary = {
    totalPending: 5430.50,
    totalPaidThisMonth: 12400.00,
    nextClosing: '30/08/2026'
  };

  const professionals = [
    {
      id: 1,
      name: 'Dr. João (Clínico Geral)',
      totalValue: 2150.00,
      statements: [
        { id: 'AT-1002', date: '15/08', patient: 'Bob (Pug)', item: 'Hemograma Completo', baseValue: 100, role: 'Solicitante (10%)', netValue: 10 },
        { id: 'AT-1002', date: '15/08', patient: 'Bob (Pug)', item: 'Consulta Clínica', baseValue: 150, role: 'Executante (40%)', netValue: 60 },
        { id: 'AT-1045', date: '18/08', patient: 'Rex (Labrador)', item: 'Ultrassom Abdominal', baseValue: 200, role: 'Solicitante (10%)', netValue: 20 },
        { id: '-', date: '...', patient: '-', item: 'Outros 42 atendimentos', baseValue: 0, role: '-', netValue: 2060 },
      ]
    },
    {
      id: 2,
      name: 'Dra. Maria (Cirurgiã)',
      totalValue: 3200.50,
      statements: [
        { id: 'AT-0991', date: '10/08', patient: 'Mel (Gato)', item: 'Castração Fêmea', baseValue: 800, role: 'Executante (50%)', netValue: 400 },
      ]
    },
    {
      id: 3,
      name: 'Dr. Roberto (Imaginologista)',
      totalValue: 80.00,
      statements: []
    }
  ];

  const handlePay = (id: number) => {
    if (!markedAsPaid.includes(id)) {
      setMarkedAsPaid([...markedAsPaid, id]);
      handleAction("Repasse marcado como pago com sucesso!");
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPDF = (profName: string) => {
    handleAction(`Gerando extrato PDF para ${profName}...`);
    const content = `UNIVERSO 4 PATAS - EXTRATO DE REPASSE DE COMISSÕES\nProfissional: ${profName}\nData do Fechamento: ${new Date().toLocaleDateString('pt-BR')}\n\nRELAÇÃO DE SERVIÇOS:\n- Consulta / Procedimentos executados no período\nTotal a Repassar: R$ 2.150,00\n\nDocumento emitido para fins de conferência financeira.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Extrato_Comissao_${profName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/financial">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-emerald-600" />
              Fechamento de Repasses
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Extrato detalhado de comissões por profissional (Agosto 2026).</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleAction("Carregando mês anterior...")} variant="outline" className="text-slate-600 font-bold border-slate-200">
             <CalendarClock className="w-4 h-4 mr-2" /> Mês Anterior
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-emerald-600 text-white">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-emerald-100 uppercase tracking-wider mb-1">Total Pendente (A Pagar)</p>
            <p className="text-4xl font-black tracking-tight">R$ {summary.totalPending.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Já Pago (Mês)</p>
            <p className="text-3xl font-black text-slate-800">R$ {summary.totalPaidThisMonth.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Próximo Fechamento</p>
            <p className="text-3xl font-black text-slate-800">{summary.nextClosing}</p>
          </CardContent>
        </Card>
      </div>

      {/* List of Professionals */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          Extratos por Profissional
        </h2>

        {professionals.map((prof) => {
          const isPaid = markedAsPaid.includes(prof.id);
          const isExpanded = expandedProf === prof.id;

          return (
            <Card key={prof.id} className={`border-slate-200 overflow-hidden transition-all ${isExpanded ? 'shadow-md ring-2 ring-emerald-500/20' : 'shadow-sm hover:border-slate-300'}`}>
              
              {/* Header / Summary Row */}
              <div 
                className={`p-6 flex items-center justify-between cursor-pointer ${isPaid ? 'bg-slate-50' : 'bg-white'}`}
                onClick={() => setExpandedProf(isExpanded ? null : prof.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <Calculator className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isPaid ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{prof.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {isPaid ? 'Pago via transferência bancária.' : 'Aguardando conferência e pagamento.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valor Líquido</p>
                    <p className={`text-2xl font-black ${isPaid ? 'text-slate-400' : 'text-emerald-600'}`}>
                      R$ {prof.totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Detailed Statement Expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" /> Detalhamento de Atendimentos
                    </h4>
                    <Button onClick={() => handleDownloadPDF(prof.name)} variant="outline" size="sm" className="text-slate-600 h-9 font-bold bg-white">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Extrato PDF
                    </Button>
                  </div>
                  
                  {prof.statements.length > 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                          <tr>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Paciente</th>
                            <th className="px-4 py-3">Serviço / Produto</th>
                            <th className="px-4 py-3 text-right">Valor Base</th>
                            <th className="px-4 py-3 text-center">Papel na Venda</th>
                            <th className="px-4 py-3 text-right">Valor Líquido (Repasse)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {prof.statements.map((stmt, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-medium text-slate-600">{stmt.date}</td>
                              <td className="px-4 py-3 font-medium text-slate-800">{stmt.patient}</td>
                              <td className="px-4 py-3 text-slate-600">{stmt.item}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-500">
                                R$ {stmt.baseValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase ${stmt.role.includes('Solicitante') ? 'bg-indigo-100 text-indigo-700' : stmt.role.includes('Executante') ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {stmt.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                                R$ {stmt.netValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200">
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-right font-bold text-slate-600 uppercase text-xs">Total do Período</td>
                            <td className="px-4 py-3 text-right font-mono font-black text-lg text-emerald-700">
                              R$ {prof.totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 mb-6">
                      Nenhum atendimento registrado para este profissional no período.
                    </div>
                  )}

                  {!isPaid && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-800">Pronto para Fechamento</p>
                          <p className="text-sm text-emerald-700">Você pode baixar o PDF para enviar ao contador e marcar como pago.</p>
                        </div>
                      </div>
                      <Button onClick={() => handlePay(prof.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-md shadow-emerald-200">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar como Pago
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
