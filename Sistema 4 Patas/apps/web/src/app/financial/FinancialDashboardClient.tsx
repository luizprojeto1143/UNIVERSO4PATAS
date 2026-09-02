"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { useState } from "react";
import CreateInvoiceModal from "@/components/CreateInvoiceModal";
import Link from "next/link";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Activity, 
  ShieldAlert, CheckCircle, Clock, AlertTriangle, FileText, Lock, MessageSquare,
  Upload, QrCode, Smartphone, Coins, BrainCircuit, Trophy, Target, LineChart, Briefcase, Key
} from "lucide-react";

export default function FinancialDashboardClient({ dashboardData, tutors, catalog }: { dashboardData: any, tutors: any[], catalog: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'receivables' | 'blind-close' | 'payables' | 'strategy' | 'gamification'>('dashboard');
  const [marginTarget, setMarginTarget] = useState(35);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setTimeout(() => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }, 500);
  };

  // Mocks for C-Level metrics
  const cLevelMetrics = {
    revenue: "R$ 142.500,00",
    revenueGrowth: "+12.5%",
    netProfit: "R$ 48.300,00",
    profitMargin: "33.8%",
    cac: "R$ 45,00",
    ltv: "R$ 1.850,00",
    averageTicket: "R$ 320,00",
    churn: "4.2%"
  };

  const blindCloseState = {
    expectedCash: 1250.00, // hidden from receptionist
    expectedCard: 4500.00, // hidden
    expectedPix: 3200.00,  // hidden
  };

  const [blindInput, setBlindInput] = useState({ cash: '', card: '', pix: '' });
  const [blindResult, setBlindResult] = useState<null | 'success' | 'divergent'>(null);

  const handleBlindClose = () => {
    const cash = parseFloat(blindInput.cash) || 0;
    const card = parseFloat(blindInput.card) || 0;
    const pix = parseFloat(blindInput.pix) || 0;

    if (cash === blindCloseState.expectedCash && card === blindCloseState.expectedCard && pix === blindCloseState.expectedPix) {
      setBlindResult('success');
    } else {
      setBlindResult('divergent');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-600" /> Centro Financeiro C-Level
          </h1>
          <p className="text-slate-500 font-medium mt-1">Inteligência de Negócios, PDV e Prevenção de Fraudes</p>
        </div>
        <div className="flex gap-3">
          <Link href="/financial/commissions">
            <Button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 font-bold shadow-sm flex items-center gap-2">
              Fechamento de Repasses
            </Button>
          </Link>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Novo Faturamento (PDV)
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mt-6 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-max">
          <TabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Painel C-Level" icon={<Activity className="w-4 h-4"/>}/>
          <TabBtn active={activeTab === 'receivables'} onClick={() => setActiveTab('receivables')} label="Contas a Receber" icon={<FileText className="w-4 h-4"/>}/>
          <TabBtn active={activeTab === 'payables'} onClick={() => setActiveTab('payables')} label="Contas a Pagar & Repasses" icon={<Upload className="w-4 h-4"/>}/>
          <TabBtn active={activeTab === 'blind-close'} onClick={() => setActiveTab('blind-close')} label="Auditoria (PDV)" icon={<Lock className="w-4 h-4"/>}/>
          <div className="w-px bg-slate-300 mx-1"></div>
          <TabBtn active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} label="Portal Sócios (IA)" icon={<BrainCircuit className="w-4 h-4"/>}/>
          <TabBtn active={activeTab === 'gamification'} onClick={() => setActiveTab('gamification')} label="Gamificação" icon={<Trophy className="w-4 h-4"/>}/>
        </div>
      </div>

      <div className="p-8 max-w-7xl">
        
        {/* --- TAB: DASHBOARD C-LEVEL --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6"/></div>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg"><TrendingUp className="w-4 h-4"/> {cLevelMetrics.revenueGrowth}</span>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Faturamento Mês</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{cLevelMetrics.revenue}</h3>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Activity className="w-6 h-6"/></div>
                  <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Margem: {cLevelMetrics.profitMargin}</span>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Lucro Líquido (DRE)</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{cLevelMetrics.netProfit}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center"><Users className="w-6 h-6"/></div>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">LTV (Vida Útil do Tutor)</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{cLevelMetrics.ltv}</h3>
                <p className="text-xs font-bold text-slate-400 mt-2">Custo de Aquisição (CAC): {cLevelMetrics.cac}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><TrendingDown className="w-6 h-6"/></div>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tíquete Médio / Churn</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{cLevelMetrics.averageTicket}</h3>
                <p className="text-xs font-bold text-slate-400 mt-2">Churn (Perda de Clientes): <span className="text-red-500">{cLevelMetrics.churn}</span></p>
              </div>
            </div>

            {/* Split and Rules Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-600" /> Fluxo de Comissionamento e Saúde Vet
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700">Comissionamento Dinâmico (Split)</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">Ativo</span>
                    </div>
                    <p className="text-sm text-slate-500">O sistema está retendo automaticamente o valor de custo de exames de laboratórios parceiros e repassando apenas o % configurado para o médico executor na hora da baixa da fatura.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700">Convênios e Planos de Saúde Parceiros</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">2 Ativos</span>
                    </div>
                    <p className="text-sm text-slate-500">Ao faturar, a recepção pode selecionar "Cobrir pelo Plano Parceiro", e o sistema calcula automaticamente a Coparticipação que o tutor deve pagar no balcão.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center hover:shadow-md transition-all">
                 <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <QrCode className="w-6 h-6 text-emerald-600" /> Automação de Recebimentos
                 </h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                       </div>
                       <div>
                          <p className="font-bold text-emerald-900">Open Finance API Ativo</p>
                          <p className="text-xs text-emerald-700">Conciliação Mágica via PIX. Faturas baixam sozinhas.</p>
                       </div>
                    </div>
                    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-sky-600" />
                       </div>
                       <div>
                          <p className="font-bold text-sky-900">Integração TEF Smart</p>
                          <p className="text-xs text-sky-700">O sistema dita o valor pra maquininha. Fim de digitação errada.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: RECEIVABLES --- */}
        {activeTab === 'receivables' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Contas a Receber</h2>
              <div className="flex gap-2">
                <span className="text-sm font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">A Vencer: R$ 12.400,00</span>
                <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">Inadimplência: R$ 4.200,00</span>
              </div>
            </div>
            
            <ul className="divide-y divide-slate-100">
              {/* Mock Fatura 1 */}
              <li className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl text-red-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900">João Silva (Tutor do Rex)</p>
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-md">Risco IA: Alto (Vermelho)</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Cirurgia Ortopédica - Fatura #4928</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-lg">R$ 2.450,00</p>
                    <p className="text-sm font-bold text-red-500">Venceu há 15 dias</p>
                  </div>
                  <Button 
                    onClick={() => handleAction('Cobrança enviada com sucesso pelo WhatsApp!')}
                    className="bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Cobrar via WhatsApp
                  </Button>
                </div>
              </li>
              
              {/* Mock Fatura 2 */}
              <li className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900">Maria Oliveira (Tutor do Mimi)</p>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Risco IA: Médio (Amarelo)</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Internação UTI - Fatura #4931</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-lg">R$ 850,00</p>
                    <p className="text-sm font-bold text-amber-500">Vence Hoje</p>
                  </div>
                  <Button 
                    onClick={() => handleAction('Chave Pix enviada para o tutor!')}
                    className="bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Mandar Pix (WhatsApp)
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* --- TAB: PAYABLES --- */}
        {activeTab === 'payables' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-indigo-600 rounded-t-3xl px-8 py-8 flex justify-between items-center text-white">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-2"><Upload className="w-6 h-6"/> Central de Contas a Pagar</h2>
                  <p className="text-indigo-200 font-medium">Fornecedores, Boletos da Clínica e Repasses de Especialistas</p>
                </div>
                <Button 
                  onClick={() => handleAction('Abertura do explorador de arquivos para importação...')}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                   <Upload className="w-5 h-5" /> Importar NF/Boleto Inteligente
                </Button>
             </div>
             <div className="bg-white rounded-b-3xl border-x border-b border-slate-200 shadow-sm p-8">
                
                <div className="mb-8 p-6 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-center">
                   <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3"><Upload className="w-8 h-8"/></div>
                   <p className="font-bold text-slate-700">Arraste a Nota Fiscal (XML/PDF) ou Boleto do fornecedor aqui.</p>
                   <p className="text-sm text-slate-500 mt-1">Nossa IA lê código de barras, insere itens no estoque e agenda o pagamento.</p>
                </div>

                {/* SIMULADOR DE MARGEM E PRECIFICAÇÃO (IA) */}
                <div className="mb-8 p-6 bg-rose-50 border-2 border-rose-200 rounded-2xl animate-pulse-slow">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                         <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-lg font-black text-rose-900 mb-1">Alerta de Margem: Aumento de Custo Detectado</h4>
                         <p className="text-sm text-rose-700 font-medium mb-4">A leitura da última Nota Fiscal da "Distribuidora VetMed" detectou um aumento de 12% no custo de aquisição da Vacina V10. Sua margem de lucro caiu para 15%.</p>
                         
                         <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 flex items-center justify-between">
                            <div>
                               <p className="font-bold text-slate-900">Simulador de Precificação (IA)</p>
                               <div className="flex items-center gap-2 mt-1">
                                 <p className="text-xs text-slate-500">Repassar custo e manter margem de:</p>
                                 <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
                                   <Input 
                                     type="number" 
                                     value={marginTarget}
                                     onChange={(e) => setMarginTarget(Number(e.target.value))}
                                     className="w-12 bg-transparent text-sm font-bold text-indigo-600 outline-none text-right"
                                   />
                                   <span className="text-sm font-bold text-slate-500">%</span>
                                 </div>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                               <div>
                                  <p className="text-xs text-slate-400 line-through">De R$ 120,00</p>
                                  <p className="font-black text-emerald-600">Para R$ {(100 * (1 + (marginTarget/100))).toFixed(2).replace('.', ',')}</p>
                               </div>
                               <Button 
                                 onClick={() => handleAction('Tabela de preços atualizada com a nova margem!')}
                                 className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md hover:bg-rose-700 transition-colors"
                               >
                                  Atualizar Tabela
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <h3 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-sm">Vencimentos Próximos</h3>
                
                <ul className="divide-y divide-slate-100 mb-8 border border-slate-100 rounded-2xl overflow-hidden">
                  <li className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-bold"><FileText className="w-5 h-5"/></div>
                       <div>
                          <p className="font-bold text-slate-900">Distribuidora VetMed S/A</p>
                          <p className="text-xs text-slate-500">Boleto #4922 - Lote de Vacinas V10</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">R$ 4.250,00</p>
                       <p className="text-xs font-bold text-rose-500">Vence Hoje</p>
                    </div>
                  </li>
                  <li className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold"><FileText className="w-5 h-5"/></div>
                       <div>
                          <p className="font-bold text-slate-900">Enel (Conta de Luz)</p>
                          <p className="text-xs text-slate-500">Cód. Barras Reconhecido via IA</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">R$ 1.840,00</p>
                       <p className="text-xs font-bold text-slate-500">Vence em 3 dias</p>
                    </div>
                  </li>
                </ul>

                <h3 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-sm">Holerites / Repasses Pendentes</h3>
                
                <ul className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  <li className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold"><Users className="w-5 h-5"/></div>
                       <div>
                          <p className="font-bold text-slate-900">Dr. Roberto (Anestesista Volante)</p>
                          <p className="text-xs text-slate-500">Repasse Automático - 3 Cirurgias no Mês</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">R$ 1.200,00</p>
                       <Button 
                         onClick={() => handleAction('Repasse pago com sucesso via Open Finance!')}
                         className="mt-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                       >
                         Pagar Repasse
                       </Button>
                    </div>
                  </li>
                </ul>

             </div>
          </div>
        )}

        {/* --- TAB: STRATEGY (IA & Sócios) --- */}
        {activeTab === 'strategy' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
             <div className="grid grid-cols-2 gap-6">
                
                {/* DRE MACHINE LEARNING */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                   <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                      <BrainCircuit className="w-6 h-6 text-indigo-600" /> Previsibilidade DRE (IA)
                   </h3>
                   <p className="text-sm font-medium text-slate-500 mb-6">Projeção de Machine Learning baseada no histórico sazonável dos últimos 3 anos.</p>
                   
                   <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                         <LineChart className="w-48 h-48" />
                      </div>
                      <div className="relative z-10">
                         <p className="text-sky-400 font-bold uppercase tracking-widest text-xs mb-1">Previsão 6 Meses (Out - Mar)</p>
                         <h4 className="text-3xl font-black mb-2">Queda Sazonal Detectada</h4>
                         <p className="text-slate-300 font-medium text-sm leading-relaxed mb-4">
                           A IA detectou que historicamente a taxa de vacinação cai no final de ano. Há uma previsão de **redução de 15% nas receitas**. Recomendação automática do sistema: **Pausar novas contratações temporárias** e rodar campanha preventiva no WhatsApp em Novembro.
                         </p>
                         <Button 
                           onClick={() => handleAction('Campanha criada e agendada no WhatsApp!')}
                           className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-colors"
                         >
                            Aceitar Recomendação e Criar Campanha
                         </Button>
                      </div>
                   </div>
                </div>

                {/* PORTAL DOS SÓCIOS */}
                <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
                   <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-amber-600" /> Portal Restrito aos Sócios
                   </h3>
                   <p className="text-sm font-medium text-slate-500 mb-6">Proteção de Capital de Giro e Distribuição de Lucros Segura.</p>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                         <span className="font-bold text-slate-600">Lucro Líquido Acumulado (Mês):</span>
                         <span className="font-black text-slate-900 text-lg">R$ 48.300,00</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                         <span className="font-bold text-slate-600">Reserva Capital de Giro Sugerida (IA):</span>
                         <span className="font-black text-amber-600 text-lg">- R$ 20.000,00</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                         <span className="font-black text-slate-900 uppercase tracking-widest text-sm">Pró-Labore / Dividendos (Saque Máx Segur0)</span>
                         <span className="font-black text-emerald-600 text-2xl">R$ 28.300,00</span>
                      </div>
                   </div>
                   <Button 
                     onClick={() => handleAction('Solicitação enviada. Aguardando aprovação dos sócios!')}
                     className="w-full mt-6 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                   >
                      <Key className="w-4 h-4" /> Solicitar Transferência de Dividendos
                   </Button>
                </div>
             </div>

             {/* ROI DE CAPEX */}
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                    <Target className="w-6 h-6 text-emerald-600" /> Hub de ROI (Payback de Equipamentos)
                 </h3>
                 <p className="text-sm font-medium text-slate-500 mb-6">Acompanhe se os investimentos altos (CAPEX) já se pagaram operando na clínica.</p>
                 
                 <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <div className="flex justify-between items-end mb-4">
                       <div>
                          <p className="font-black text-slate-900">Aparelho Raio-X Digital (GE Healthcare)</p>
                          <p className="text-sm font-bold text-slate-500">Valor Investido: R$ 150.000,00</p>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600">65%</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Recuperado</p>
                       </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    
                    <div className="mt-4 flex justify-between text-xs font-bold text-slate-500">
                       <span>Total Faturado no Balcão com Raio-X: R$ 97.500,00</span>
                       <span>Faltam R$ 52.500,00 para atingir o Ponto de Equilíbrio.</span>
                    </div>
                 </div>
             </div>
          </div>
        )}

        {/* --- TAB: GAMIFICATION --- */}
        {activeTab === 'gamification' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                <div className="relative pt-12 px-8 pb-8 text-center">
                   <div className="w-24 h-24 bg-white rounded-full mx-auto border-4 border-white shadow-xl flex items-center justify-center text-amber-500 mb-4">
                      <Trophy className="w-12 h-12" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900">Liga dos Campeões (Balcão)</h2>
                   <p className="text-slate-500 font-medium">Bata metas de Venda Adicional (perfumes, vacinas premium) e ganhe comissões.</p>
                </div>

                <div className="p-8 bg-slate-50">
                   <div className="space-y-4">
                      {/* 1st Place */}
                      <div className="bg-white border-2 border-amber-400 p-4 rounded-2xl flex items-center justify-between shadow-md transform hover:scale-105 transition-transform">
                         <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-amber-500 w-8 text-center">1Âº</span>
                            <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                               <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Avatar" className="w-full h-full object-cover" width={500} height={500} />
                            </div>
                            <div>
                               <p className="font-black text-slate-900">Luiza Marques (Recepção Noite)</p>
                               <p className="text-xs font-bold text-amber-600">Nível: Mestre de Vendas</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-black text-slate-900">1.450 XP</p>
                            <p className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md inline-block mt-1">+ R$ 350,00 de Bônus</p>
                         </div>
                      </div>

                      {/* 2nd Place */}
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                         <div className="flex items-center gap-4">
                            <span className="text-xl font-black text-slate-400 w-8 text-center">2Âº</span>
                            <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                               <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-full h-full object-cover" width={500} height={500} />
                            </div>
                            <div>
                               <p className="font-black text-slate-900">Carlos Silva (Recepção Dia)</p>
                               <p className="text-xs font-bold text-slate-500">Nível: Vendedor Ouro</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-black text-slate-700">980 XP</p>
                            <p className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md inline-block mt-1">+ R$ 150,00 de Bônus</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: BLIND CLOSE (FECHAMENTO CEGO) --- */}
        {activeTab === 'blind-close' && (
          <div className="max-w-3xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-900 px-8 py-8 text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-20"><Lock className="w-32 h-32 text-white" /></div>
                   <h2 className="text-2xl font-black text-white mb-2 relative z-10">Fechamento de Caixa Cego</h2>
                   <p className="text-slate-400 font-medium relative z-10">Auditoria Antifraude: Insira os valores físicos contados na gaveta. O sistema não revelará o saldo esperado antes do envio.</p>
                </div>
                
                <div className="p-8">
                   {blindResult === null && (
                     <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Dinheiro Físico (Gaveta)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-4 text-slate-400 font-bold">R$</span>
                            <Input 
                              type="number" 
                              value={blindInput.cash} onChange={e => setBlindInput({...blindInput, cash: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 font-black text-xl text-slate-900 focus:border-indigo-500 outline-none" 
                              placeholder="0.00" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Comprovantes de Cartão (Soma)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-4 text-slate-400 font-bold">R$</span>
                            <Input 
                              type="number" 
                              value={blindInput.card} onChange={e => setBlindInput({...blindInput, card: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 font-black text-xl text-slate-900 focus:border-indigo-500 outline-none" 
                              placeholder="0.00" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Pix (Conta Corrente)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-4 text-slate-400 font-bold">R$</span>
                            <Input 
                              type="number" 
                              value={blindInput.pix} onChange={e => setBlindInput({...blindInput, pix: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 font-black text-xl text-slate-900 focus:border-indigo-500 outline-none" 
                              placeholder="0.00" 
                            />
                          </div>
                        </div>

                        <Button 
                          onClick={handleBlindClose}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg mt-4 transition-all"
                        >
                          Auditar e Fechar Turno
                        </Button>
                     </div>
                   )}

                   {blindResult === 'success' && (
                     <div className="text-center py-10">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                           <CheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Caixa Batido!</h3>
                        <p className="text-slate-500 font-medium">Os valores informados coincidem perfeitamente com os registros do sistema. Turno encerrado com sucesso.</p>
                        <Button onClick={() => setBlindResult(null)} className="mt-8 text-indigo-600 font-bold hover:underline">Fazer novo fechamento</Button>
                     </div>
                   )}

                   {blindResult === 'divergent' && (
                     <div className="text-center py-10">
                        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                           <ShieldAlert className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Divergência Detectada</h3>
                        <p className="text-slate-500 font-medium mb-6">Os valores informados não batem com o sistema. O Gestor C-Level foi notificado automaticamente para auditoria.</p>
                        <div className="bg-red-50 p-4 rounded-xl text-left border border-red-100 inline-block">
                           <p className="text-sm font-bold text-red-800">Diferença de Saldo: Contagem física é menor que o esperado.</p>
                        </div>
                        <br/>
                        <Button onClick={() => setBlindResult(null)} className="mt-8 text-slate-500 font-bold hover:underline">Tentar recontar moedas</Button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <CreateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tutors={tutors} 
        catalog={catalog}
      />
    </div>
  );
}

function TabBtn({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <Button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
        active ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50'
      }`}
    >
      {icon} {label}
    </Button>
  );
}
function Plus({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>;
}
