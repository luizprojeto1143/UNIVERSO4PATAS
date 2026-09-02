'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmitirNFModal from '@/components/EmitirNFModal';
import { Settings, FileText, CheckCircle2, Loader2, DownloadCloud, AlertTriangle, ShieldAlert, BarChart3, Plus, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function FiscalDashboard() {
  const [notes, setNotes] = useState<any[]>([
    { id: 1, invoice: { tutor: { name: 'João Silva' } }, type: 'NFS-e (Serviço)', number: '1042', series: '1', accessKey: '3523...8901', status: 'AUTHORIZED', repasse: false },
    { id: 2, invoice: { tutor: { name: 'Maria Souza' } }, type: 'NFS-e (Repasse)', number: '1043', series: '1', accessKey: '3523...8902', status: 'AUTHORIZED', repasse: true, prof: 'Dr. Roberto (Anestesista)' },
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // Simulated fetch
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AUTHORIZED': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Autorizada</span>;
      case 'PROCESSING': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processando</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Rejeitada</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Pendente</span>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Módulo Fiscal</h1>
          <p className="text-slate-500 mt-1">Gerenciamento automático de NF-e, NFC-e e NFS-e</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setIsModalOpen(true)} variant="default" className="flex items-center bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Emitir NF Manual
          </Button>
          <Link href="/fiscal/settings">
            <Button className="flex items-center bg-slate-900 text-white hover:bg-slate-800">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </Link>
        </div>
      </div>

      {/* ALERTAS INTELIGENTES (IA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Termômetro Simples Nacional */}
        <Card className="p-6 bg-white border-l-4 border-l-amber-500 shadow-sm relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-5 p-4"><BarChart3 className="w-24 h-24"/></div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                 <AlertTriangle className="w-5 h-5 text-amber-500" />
                 <h3 className="text-lg font-black text-slate-800">Termômetro do Simples Nacional</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Seu faturamento acumulado (R$ 3.485.000) está a <strong>R$ 15.000</strong> de estourar a 5ª Faixa do Simples.</p>
              
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                 <div className="h-full bg-amber-500 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs font-bold text-amber-600">Ação Recomendada (IA): Segurar o faturamento de grandes cirurgias para o dia 1º do próximo mês para evitar aumento de imposto (14,3% para 19%).</p>
           </div>
        </Card>

        {/* Auditor de NCM */}
        <Card className="p-6 bg-white border-l-4 border-l-rose-500 shadow-sm relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-5 p-4"><ShieldAlert className="w-24 h-24"/></div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-5 h-5 text-rose-500" />
                 <h3 className="text-lg font-black text-slate-800">Auditoria IA de Estoque (NCM)</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">A IA bloqueou 1 emissão futura devido a inconsistência tributária encontrada no cadastro de produtos.</p>
              
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-100 mb-2">
                 <p className="text-sm font-bold text-rose-900">Ração Terapêutica Renal 2kg</p>
                 <p className="text-xs text-rose-700">NCM cadastrado (9503.00) é referente a "Brinquedos". Risco de Malha Fina e multa da SEFAZ.</p>
              </div>
              <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 mt-1">Corrigir NCM Automaticamente</Button>
           </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">Notas Emitidas (Mês)</h3>
          <p className="text-4xl font-black mt-2">142</p>
          <p className="text-xs mt-2 opacity-80 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> 100% Autorizadas</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">Proteção Bitributação</h3>
                <p className="text-4xl font-black mt-2">12</p>
             </div>
             <BrainCircuit className="w-6 h-6 opacity-50"/>
          </div>
          <p className="text-xs mt-2 opacity-90">NFs emitidas direto no CNPJ de terceiros (Repasse). Economia de <strong>R$ 1.450</strong> em impostos.</p>
        </Card>
        <Card className="p-6 border-2 border-indigo-100 flex flex-col justify-center items-center text-center bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors">
          <DownloadCloud className="h-8 w-8 text-indigo-500 mb-2" />
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Portal do Contador</h3>
          <p className="text-xs text-indigo-600 mt-1">Baixar Malote XML e SPED</p>
        </Card>
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-semibold text-slate-700">Últimas Notas Emitidas</div>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b text-slate-500 bg-white">
              <th className="p-4 font-medium">Fatura (Tutor)</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Número/Série</th>
              <th className="p-4 font-medium">Chave de Acesso</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-slate-50">
                <td className="p-4">
                   <p className="font-bold text-slate-900">{note.invoice?.tutor?.name || 'Avulso'}</p>
                   {note.repasse && <p className="text-xs font-bold text-emerald-600">Repasse Médico: {note.prof}</p>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${note.repasse ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                     {note.type}
                  </span>
                </td>
                <td className="p-4 font-medium">{note.number ? `${note.number}/${note.series}` : '-'}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{note.accessKey || '-'}</td>
                <td className="p-4">{getStatusBadge(note.status)}</td>
                <td className="p-4 text-right">
                  {note.status === 'AUTHORIZED' && (
                    <Button variant="outline" size="sm" className="text-slate-600 hover:text-slate-900 border-slate-200">Baixar DANFE</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <EmitirNFModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
