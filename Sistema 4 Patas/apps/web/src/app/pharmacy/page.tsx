"use client";

import React, { useState } from 'react';
import { 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Clock, 
  Package, 
  FileText,
  ShieldAlert,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (action: 'report') => {
    if (action === 'report') setIsGenerating(true);

    setTimeout(() => {
      if (action === 'report') setIsGenerating(false);
      
      setToastMessage('Relatório gerado com sucesso!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispensing(true);
    setTimeout(() => {
      setIsDispensing(false);
      setShowModal(false);
      setToastMessage('Nova dispensação iniciada!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Farmácia Inteligente
            </h1>
            <p className="text-gray-500 mt-1">Gerenciamento de dispensação e prescrições</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar medicamentos..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64 shadow-sm transition-all"
              />
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-sm font-medium transition-all shadow-sm shadow-teal-200 hover:shadow-md flex items-center gap-2"
            >
              Nova Dispensação
            </button>
          </div>
        </div>

        {/* Drug Interaction Alert */}
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-rose-900">Interação Medicamentosa Crítica Detectada</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-xs font-medium animate-pulse">Ação Necessária</span>
              </div>
              <p className="text-rose-700 text-sm mb-3">
                Prescrição <span className="font-semibold">RX-2049</span> para o paciente "Max" (Canino) contém <span className="font-semibold">Carprofeno</span> e <span className="font-semibold">Prednisona</span>. O uso simultâneo de AINEs e corticosteroides aumenta o risco de ulceração gastrointestinal.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-sm font-medium transition-colors shadow-sm">
                  Revisar Prescrição
                </button>
                <button className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-sm font-medium transition-colors shadow-sm">
                  Contatar Veterinário
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Prescriptions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Prescrições Ativas</h2>
                <div className="flex gap-2 p-1 bg-gray-50 rounded-full border border-gray-100">
                  <button 
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Pendentes (4)
                  </button>
                  <button 
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Concluídas
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'RX-2050', patient: 'Bella', owner: 'Sarah Jenkins', drug: 'Amoxicilina 250mg', status: 'Revisão Pendente', type: 'Antibiótico', time: '10 min atrás' },
                  { id: 'RX-2051', patient: 'Charlie', owner: 'Mike Ross', drug: 'Apoquel 16mg', status: 'Pronto para Retirada', type: 'Alergia', time: '1 hora atrás' },
                  { id: 'RX-2052', patient: 'Luna', owner: 'Emma Watson', drug: 'Bravecto', status: 'Aguardando Estoque', type: 'Preventivo', time: '2 horas atrás' },
                ].map((rx) => (
                  <div key={rx.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors shrink-0">
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{rx.id}</span>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-sm font-medium text-gray-800">{rx.patient}</span>
                          <span className="text-xs text-gray-500">({rx.owner})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                            <Pill className="w-3.5 h-3.5 text-teal-500" />
                            {rx.drug}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-bold">{rx.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 border-t border-gray-50 sm:border-0 sm:pt-0">
                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm
                        ${rx.status === 'Pronto para Retirada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                        ${rx.status === 'Revisão Pendente' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                        ${rx.status === 'Aguardando Estoque' ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                      `}>
                        {rx.status === 'Pronto para Retirada' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {rx.status === 'Revisão Pendente' && <Clock className="w-3.5 h-3.5" />}
                        {rx.status === 'Aguardando Estoque' && <Package className="w-3.5 h-3.5" />}
                        {rx.status}
                      </div>
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {rx.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Inventory/Stock */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Alertas de Estoque Baixo</h2>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium hover:underline">Ver Todos</button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Gabapentina 100mg', current: 12, min: 50, unit: 'cápsulas' },
                  { name: 'Rimadyl 75mg', current: 5, min: 30, unit: 'comprimidos' },
                  { name: 'NexGard (10-25 kg)', current: 2, min: 10, unit: 'doses' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:bg-amber-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-black text-amber-700">{item.current}</span>
                        <span className="text-xs font-medium text-amber-700/80 ml-1">{item.unit} restando</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">Min: {item.min}</span>
                    </div>
                    <div className="w-full bg-amber-100/80 rounded-full h-2 mt-3 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(item.current / item.min) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => handleAction('report')}
                disabled={isGenerating}
                className="w-full mt-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-gray-200 shadow-sm hover:shadow-md"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-teal-600" /> : <Package className="w-4 h-4 text-teal-600" />}
                {isGenerating ? 'Gerando...' : 'Gerar Relatório de Pedidos'}
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="font-medium text-teal-50 mb-4 tracking-wide uppercase text-sm">Estatísticas de Dispensação Hoje</h3>
              <div className="grid grid-cols-2 gap-4 divide-x divide-teal-400/30">
                <div>
                  <div className="text-3xl font-black">42</div>
                  <div className="text-sm text-teal-100 mt-1 font-medium">Dispensados</div>
                </div>
                <div className="pl-4">
                  <div className="text-3xl font-black">8</div>
                  <div className="text-sm text-teal-100 mt-1 font-medium">Pendentes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal - Dispensar Medicamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Dispensar Medicamento</h2>
            <form onSubmit={handleDispense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Paciente</label>
                <input required type="text" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Nome do paciente" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Medicamento</label>
                <input required type="text" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Nome do medicamento" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Dose</label>
                  <input required type="text" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ex: 1 comprimido" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Frequência</label>
                  <input required type="text" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ex: 12/12h" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={isDispensing} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2">
                  {isDispensing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Dispensar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
