'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Banknote, QrCode, CheckCircle2, ChevronRight, Activity, DollarSign, PackageMinus, TrendingUp, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/stores/useStore';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'pix' | 'cash'>('credit');
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const clinicalQueue = useStore(state => state.clinicalQueue);
  const clearClinicalQueue = useStore(state => state.clearClinicalQueue);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simula tempo de processamento de API e Maquininha
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      clearClinicalQueue();
    }, 1500);
  };

  const billItems = clinicalQueue.length > 0 ? clinicalQueue.map((item, i) => ({
    id: item.id || i,
    name: item.name,
    type: item.type,
    vet: item.vet || 'N/D',
    value: item.price || item.value || 0,
    commission: 0,
    stockDeduct: item.stockDeduct || 0
  })) : [
    { id: 1, name: 'Consulta Especialista (Dr. Roberto)', type: 'service', vet: 'Roberto', value: 200.00, commission: 80.00 },
    { id: 2, name: 'Vacina V10 Importada', type: 'product', vet: 'Roberto', value: 120.00, commission: 24.00, stockDeduct: 1 },
    { id: 3, name: 'Seringa 3ml + Agulha', type: 'material', vet: 'N/D', value: 15.00, commission: 0, stockDeduct: 1 },
    { id: 4, name: 'Hemograma Completo', type: 'exam', vet: 'N/D', value: 85.00, commission: 0 },
  ];

  const totalValue = billItems.reduce((acc, item) => acc + item.value, 0);

  if (isPaid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-10 rounded-[2rem] border-slate-200 shadow-xl bg-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-in zoom-in duration-500">
             <CheckCircle2 className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 mb-2">Conta Fechada!</h1>
          <p className="text-slate-500 font-medium text-lg mb-10">O pagamento de R$ {totalValue.toFixed(2).replace('.', ',')} foi aprovado com sucesso.</p>
          
          {/* System Triggers Mockup */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left mb-8">
            <h3 className="font-black text-slate-700 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> Gatilhos do Sistema Executados (Integração)
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shrink-0"><DollarSign className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Comissão Liberada</p>
                  <p className="text-xs text-slate-500">R$ 104,00 foram creditados no Painel do Dr. Roberto instantaneamente.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600 shrink-0"><PackageMinus className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Baixa Automática de Estoque</p>
                  <p className="text-xs text-slate-500">-1 Vacina V10 e -1 Seringa 3ml removidos do estoque do Almoxarifado.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0"><TrendingUp className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Receita Financeira Atualizada</p>
                  <p className="text-xs text-slate-500">O faturamento do CEO acaba de aumentar em R$ 420,00.</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/">
             <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-black text-lg">
               Voltar para a Home
             </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Caixa / Pagamento</h1>
            <p className="text-slate-500 font-medium mt-1">Fechamento de Conta do Paciente</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm border border-emerald-200">
          <ShieldCheck className="w-4 h-4" /> Ambiente Seguro
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: A Comanda */}
        <div className="lg:col-span-7 space-y-6">
           <Card className="p-0 border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Paciente: Bolinha (Tutor: João)</h2>
                  <p className="text-sm text-slate-500 mt-1">Atendido por Dr. Roberto (Sala 1)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Comanda nº</p>
                  <p className="font-mono font-bold text-slate-700">#8842-PT</p>
                </div>
             </div>

             <div className="p-6">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 Itens Lançados Automaticamente pelo Prontuário
               </h3>
               
               <div className="space-y-3">
                 {billItems.map(item => (
                   <div key={item.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl bg-white hover:border-slate-300 transition-colors">
                     <div>
                       <p className="font-bold text-slate-800">{item.name}</p>
                       <p className="text-xs font-medium text-slate-500 mt-1">
                         {item.type === 'product' ? '📦 Produto Físico (Estoque)' : item.type === 'service' ? '👨‍⚕️ Serviço Médico' : item.type === 'exam' ? '🔬 Exame' : '💉 Material Clínico'}
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="font-black text-slate-800">R$ {item.value.toFixed(2).replace('.', ',')}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="p-6 bg-slate-50 border-t border-slate-200">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 font-bold">Subtotal</span>
                 <span className="font-bold text-slate-700">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                 <span className="text-emerald-600 font-bold">Descontos</span>
                 <span className="font-bold text-emerald-600">R$ 0,00</span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-xl font-black text-slate-800">TOTAL A PAGAR</span>
                 <span className="text-3xl font-black text-indigo-600">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
               </div>
             </div>
           </Card>
        </div>

        {/* Lado Direito: O Pagamento */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <h3 className="font-black text-slate-800 mb-6 text-lg">Método de Pagamento</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <Button 
                   onClick={() => setPaymentMethod('credit')}
                   className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-3 transition-all ${paymentMethod === 'credit' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <CreditCard className="w-6 h-6" /> Crédito
                 </Button>
                 <Button 
                   onClick={() => setPaymentMethod('debit')}
                   className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-3 transition-all ${paymentMethod === 'debit' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <CreditCard className="w-6 h-6" /> Débito
                 </Button>
                 <Button 
                   onClick={() => setPaymentMethod('pix')}
                   className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-3 transition-all ${paymentMethod === 'pix' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <QrCode className="w-6 h-6" /> Pix Instantâneo
                 </Button>
                 <Button 
                   onClick={() => setPaymentMethod('cash')}
                   className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-3 transition-all ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <Banknote className="w-6 h-6" /> Dinheiro
                 </Button>
              </div>

              {paymentMethod === 'credit' && (
                <div className="space-y-4 mb-8 animate-in fade-in zoom-in duration-300">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Parcelamento</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700">
                      <option>1x de R$ 420,00 (Sem Juros)</option>
                      <option>2x de R$ 210,00 (Sem Juros)</option>
                      <option>3x de R$ 140,00 (Sem Juros)</option>
                    </select>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                     <p className="text-xs font-medium text-amber-800">Alerte o cliente: A máquina de cartão já está configurada. Peça para ele aproximar ou inserir o cartão.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-8 animate-in fade-in zoom-in duration-300">
                   <div className="w-40 h-40 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-4">
                     {/* QR Code Mock */}
                     <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover bg-center opacity-80"></div>
                   </div>
                   <p className="text-sm font-bold text-slate-600">Aguardando Pagamento...</p>
                </div>
              )}

              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-lg shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    Finalizar Venda <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
           </Card>
        </div>

      </div>
    </div>
  );
}
