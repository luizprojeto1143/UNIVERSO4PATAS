"use client";
import { Button } from '@/components/ui/button';

import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Building2, PackageMinus, Users, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import DashboardCharts from '@/components/DashboardCharts';

export default function FinancialDashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNovaVendaModal, setShowNovaVendaModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAction = (msg: string) => {
    setTimeout(() => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }, 500);
  };

  const handleSaveVenda = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowNovaVendaModal(false);
      handleAction('Venda salva com sucesso!');
    }, 1500);
  };

  // Mock Data for DRE
  const financialData = {
    revenue: 145000,
    variableCosts: 35000,
    grossMargin: 110000,
    fixedCosts: 65000,
    netProfit: 45000,
    breakEven: 85500, // Ponto de equilíbrio
  };

  const profitMargin = ((financialData.netProfit / financialData.revenue) * 100).toFixed(1);

  const mockChartData = [
    { name: 'Jan', value: 30000 },
    { name: 'Fev', value: 35000 },
    { name: 'Mar', value: 45000 }, // Lucro subindo
  ];

  return (
    <div className="pb-12 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <PieChart className="w-8 h-8 text-indigo-600" /> DRE & Inteligência Financeira
            </h1>
            <p className="text-slate-500 font-medium mt-1">Demonstrativo de Resultados e Ponto de Equilíbrio (Mês Atual)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/financial/pdv">
            <Button 
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-sm transition-colors"
            >
              Nova Venda (PDV / Caixa)
            </Button>
          </Link>
          <Button 
            onClick={() => handleAction('Relatório em PDF baixado com sucesso!')}
            className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 shadow-sm transition-colors"
          >
            Baixar Relatório (PDF)
          </Button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Receita Bruta */}
        <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Receita Bruta</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-800">R$ {financialData.revenue.toLocaleString('pt-BR')}</p>
          <p className="text-sm font-bold text-emerald-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +12% vs. mês anterior
          </p>
        </Card>

        {/* Custos Totais */}
        <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Custos Totais</h3>
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><TrendingDown className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-800">R$ {(financialData.fixedCosts + financialData.variableCosts).toLocaleString('pt-BR')}</p>
          <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-1">
            Fixos + Variáveis
          </p>
        </Card>

        {/* Lucro Líquido (EBITDA Simulado) */}
        <Card className="p-6 border-transparent shadow-xl rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-wider">Lucro Líquido</h3>
            <div className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black relative z-10">R$ {financialData.netProfit.toLocaleString('pt-BR')}</p>
          <p className="text-sm font-bold text-indigo-200 mt-2 flex items-center gap-1 relative z-10">
            Margem de {profitMargin}%
          </p>
        </Card>

        {/* Ponto de Equilíbrio */}
        <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ponto Equilíbrio</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Target className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-800">R$ {financialData.breakEven.toLocaleString('pt-BR')}</p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-2 text-right">Meta Atingida! (Sem prejuízo)</p>
        </Card>
      </div>

      {/* DRE Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Custos Detalhados */}
        <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white hover:shadow-md transition-all">
           <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
             <Activity className="w-6 h-6 text-indigo-600" /> Estrutura de Custos
           </h2>
           
           {/* Custos Variáveis */}
           <div className="mb-8">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <PackageMinus className="w-4 h-4" /> Custos Variáveis (R$ {financialData.variableCosts.toLocaleString('pt-BR')})
             </h3>
             <div className="space-y-3 pl-4 border-l-2 border-slate-100">
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Insumos e Medicamentos (Estoque)</span>
                 <span className="font-bold text-slate-800">R$ 15.000</span>
               </div>
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Comissões Médicas</span>
                 <span className="font-bold text-slate-800">R$ 12.000</span>
               </div>
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Taxas de Cartão (Adquirentes)</span>
                 <span className="font-bold text-slate-800">R$ 8.000</span>
               </div>
             </div>
           </div>

           {/* Custos Fixos */}
           <div>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Building2 className="w-4 h-4" /> Custos Fixos (R$ {financialData.fixedCosts.toLocaleString('pt-BR')})
             </h3>
             <div className="space-y-3 pl-4 border-l-2 border-slate-100">
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Folha de Pagamento (Equipe Base)</span>
                 <span className="font-bold text-slate-800">R$ 35.000</span>
               </div>
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Aluguel e Condomínio</span>
                 <span className="font-bold text-slate-800">R$ 15.000</span>
               </div>
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Energia, Água, Internet</span>
                 <span className="font-bold text-slate-800">R$ 5.000</span>
               </div>
               <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Marketing e Software</span>
                 <span className="font-bold text-slate-800">R$ 10.000</span>
               </div>
             </div>
           </div>
        </Card>

        {/* Evolução do Lucro */}
        <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white flex flex-col hover:shadow-md transition-all">
           <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
             <TrendingUp className="w-6 h-6 text-emerald-600" /> Evolução do Lucro
           </h2>
           <div className="flex-1 min-h-[300px]">
             <DashboardCharts chartData={mockChartData} />
           </div>
        </Card>

      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Nova Venda Modal */}
      {showNovaVendaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              Nova Venda
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Item</label>
                <input 
                  type="text" 
                  placeholder="Ex: Consulta, Vacina" 
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    placeholder="0,00" 
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Desconto (%)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>Pix</option>
                  <option>Dinheiro</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setShowNovaVendaModal(false)}
                disabled={isSaving}
                className="font-bold text-slate-600"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveVenda}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
