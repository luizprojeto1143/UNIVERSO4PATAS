'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, CreditCard, History, ChevronRight, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PortalFinancialPage() {
  const invoices = [
    { id: 'FAT-2026-08', desc: 'Plano Ouro (Thor) + Banho', date: 'Vence em 05/08', value: 'R$ 250,00', status: 'pending' },
    { id: 'FAT-2026-07', desc: 'Plano Ouro (Thor)', date: 'Pago em 05/07', value: 'R$ 150,00', status: 'paid' },
    { id: 'FAT-2026-06', desc: 'Plano Ouro + Vacinas', date: 'Pago em 05/06', value: 'R$ 380,00', status: 'paid' },
  ];

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="pt-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financeiro</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Faturas, recibos e notas fiscais.</p>
        </div>
      </div>

      {/* Destaque - Fatura Atual */}
      <Card className="border-0 shadow-xl shadow-rose-200/50 rounded-3xl overflow-hidden relative bg-gradient-to-br from-rose-500 to-rose-600 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        <div className="p-5 relative z-10 flex flex-col items-center text-center">
          <AlertCircle className="w-8 h-8 text-white/80 mb-2" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-100">Próximo Vencimento</h2>
          <p className="text-3xl font-black mt-1 mb-2">R$ 250,00</p>
          <p className="text-sm font-medium text-rose-100 bg-white/20 px-3 py-1 rounded-full">Vence em 05 de Agosto</p>
          
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <Button className="w-full bg-white text-rose-600 hover:bg-rose-50 font-black h-12 rounded-xl">
              <CreditCard className="w-5 h-5 mr-2" /> Pagar
            </Button>
            <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 font-bold h-12 rounded-xl">
              <Receipt className="w-5 h-5 mr-2" /> Boleto
            </Button>
          </div>
        </div>
      </Card>

      {/* Planos Ativos */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-3">Planos de Saúde</h3>
        <Card className="p-4 border-2 border-amber-100 bg-amber-50 rounded-2xl flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h4 className="font-black text-slate-800 text-sm">Plano Ouro (Thor)</h4>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1">R$ 150,00 / mês</p>
          </div>
          <Button variant="ghost" size="sm" className="text-amber-700 font-bold">
            Detalhes
          </Button>
        </Card>
      </div>

      {/* Histórico */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" /> Histórico de Faturas
        </h3>
        
        <div className="space-y-3">
          {invoices.length === 0 ? (
            <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
            </div>
          ) : (
            invoices.map((inv) => (
              <Card key={inv.id} className="p-4 border border-slate-200 shadow-sm rounded-2xl bg-white flex justify-between items-center cursor-pointer hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${inv.status === 'pending' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {inv.status === 'pending' ? <Receipt className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{inv.desc}</h4>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      {inv.date}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-black text-slate-800">{inv.value}</span>
                  {inv.status === 'paid' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Nota Fiscal
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="text-center pb-8">
        <Button variant="outline" className="text-indigo-600 border-indigo-200 font-bold rounded-xl h-12 px-6">
          <Download className="w-4 h-4 mr-2" /> Extrato Completo
        </Button>
      </div>

    </div>
  );
}
