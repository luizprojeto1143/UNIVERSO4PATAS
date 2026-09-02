"use client";

import { useState } from "react";
import { X, Search, CheckCircle2, AlertTriangle, ShieldAlert, ChevronRight, Package, Stethoscope, Users, Loader2 } from "lucide-react";

interface EmitirNFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmitirNFModal({ isOpen, onClose }: EmitirNFModalProps) {
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState("");
  const [loadingCpf, setLoadingCpf] = useState(false);
  const [clientData, setClientData] = useState<any>(null);

  // Mocks for items and repasse
  const [items, setItems] = useState<any[]>([
    { id: 1, type: 'produto', name: 'Ração Terapêutica Renal 2kg', price: 180.00, ncm: '9503.00', ncmError: true },
    { id: 2, type: 'servico', name: 'Cirurgia Ortopédica (TPLO)', price: 2500.00, hasRepasse: true, prof: 'Dr. Roberto (Ortopedista)', profCommissionRate: 40 }
  ]);

  if (!isOpen) return null;

  const handleCpfSearch = () => {
    setLoadingCpf(true);
    setTimeout(() => {
      setClientData({
        name: "Carlos Eduardo Mendes",
        address: "Av. Paulista, 1578, Bela Vista, São Paulo - SP",
        status: "REGULAR"
      });
      setLoadingCpf(false);
    }, 800);
  };

  const calculateRepasse = (item: any) => {
    return (item.price * (item.profCommissionRate / 100)).toFixed(2).replace('.', ',');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-black">Emissor Fiscal Inteligente</h2>
            <p className="text-sm text-slate-400 mt-1">Geração unificada de NFS-e (Serviços) e NFC-e/NF-e (Produtos)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Progress */}
        <div className="flex border-b bg-slate-50 px-6">
          {[
            { n: 1, title: 'Sacado' },
            { n: 2, title: 'Itens & Impostos' },
            { n: 3, title: 'Bitributação (Repasse)' },
            { n: 4, title: 'Auditoria IA' }
          ].map((s) => (
            <div key={s.n} className={`flex-1 py-4 text-center text-sm font-bold border-b-4 transition-colors ${step === s.n ? 'border-indigo-600 text-indigo-700' : step > s.n ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}>
              Passo {s.n}: {s.title}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          
          {/* STEP 1: CLIENTE */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-slate-800">Identificação do Tutor (Sacado)</h3>
              <p className="text-slate-500 text-sm">Digite o CPF ou CNPJ. Nós buscamos os dados na Receita Federal para você.</p>
              
              <div className="flex gap-4 max-w-md">
                <input 
                  type="text" 
                  placeholder="000.000.000-00" 
                  className="flex-1 border-2 border-slate-200 p-3 rounded-xl font-mono text-lg focus:border-indigo-500 focus:ring-0 outline-none"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
                <button onClick={handleCpfSearch} className="bg-indigo-600 text-white px-6 rounded-xl font-bold flex items-center hover:bg-indigo-700 transition-colors">
                  {loadingCpf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
              </div>

              {clientData && (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl mt-6 flex items-start gap-4 animate-in fade-in">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-emerald-900">{clientData.name}</h4>
                    <p className="text-emerald-700 mt-1">{clientData.address}</p>
                    <span className="inline-block mt-3 bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">CPF REGULAR - BASE RECEITA FEDERAL</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: ITENS */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="flex justify-between items-end">
                  <div>
                     <h3 className="text-xl font-bold text-slate-800">Itens da Nota</h3>
                     <p className="text-slate-500 text-sm">Adicione os serviços e produtos. O sistema cuidará da separação tributária.</p>
                  </div>
                  <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100">+ Adicionar Item</button>
               </div>

               <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-600">
                        <tr>
                           <th className="p-4 font-bold">Tipo</th>
                           <th className="p-4 font-bold">Descrição</th>
                           <th className="p-4 font-bold">Valor</th>
                           <th className="p-4 font-bold">Ação da IA</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {items.map(item => (
                           <tr key={item.id} className="bg-white">
                              <td className="p-4">
                                 {item.type === 'produto' 
                                    ? <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded"><Package className="w-3 h-3"/> PRODUTO</span>
                                    : <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded"><Stethoscope className="w-3 h-3"/> SERVIÇO</span>
                                 }
                              </td>
                              <td className="p-4 font-medium text-slate-800">{item.name}</td>
                              <td className="p-4 text-slate-600">R$ {item.price.toFixed(2).replace('.', ',')}</td>
                              <td className="p-4">
                                 {item.type === 'produto' 
                                    ? <span className="text-xs text-amber-700 bg-amber-100/50 px-2 py-1 rounded font-medium">Irá para SEFAZ (Estado)</span>
                                    : <span className="text-xs text-blue-700 bg-blue-100/50 px-2 py-1 rounded font-medium">Irá para Prefeitura</span>
                                 }
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* STEP 3: REPASSE (Fim da Bitributação) */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-3 text-emerald-600">
                 <ShieldAlert className="w-8 h-8" />
                 <h3 className="text-xl font-black text-slate-800">Proteção contra Bitributação</h3>
              </div>
              <p className="text-slate-600">O sistema detectou que você possui serviços médicos nesta fatura. Vamos vincular os repasses às comissões cadastradas para abater seus impostos legais.</p>
              
              {items.filter(i => i.hasRepasse).map(item => (
                 <div key={item.id} className="border-2 border-emerald-100 bg-emerald-50/30 p-6 rounded-xl mt-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
                          <p className="text-slate-500">Valor total do serviço: R$ {item.price.toFixed(2).replace('.', ',')}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-emerald-700 flex items-center justify-end gap-1"><Users className="w-4 h-4"/> Parceiro Vinculado</p>
                          <p className="font-black text-slate-900">{item.prof}</p>
                          <p className="text-xs text-slate-500 bg-white border px-2 py-1 rounded mt-1 inline-block">Comissão do Profissional: {item.profCommissionRate}%</p>
                       </div>
                    </div>
                    
                    <div className="mt-6 bg-white border border-emerald-200 p-4 rounded-lg flex items-center justify-between">
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">A IA irá gerar uma NFS-e de repasse no valor de:</p>
                          <p className="text-2xl font-black text-emerald-600">R$ {calculateRepasse(item)}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-slate-500">Imposto Base Clínica (Antes): R$ 2.500</p>
                          <p className="text-sm font-bold text-emerald-700">Imposto Base Clínica (Agora): R$ {(item.price - parseFloat(calculateRepasse(item).replace(',', '.'))).toFixed(2).replace('.', ',')}</p>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
          )}

          {/* STEP 4: AUDITORIA */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  Auditoria Fiscal IA <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
               </h3>
               <p className="text-slate-600">Antes de transmitirmos para os servidores da SEFAZ, nossa IA está validando todas as regras fiscais vigentes em {new Date().getFullYear()}.</p>

               <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                     <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                     <p className="font-medium text-sm">Dados do Sacado (Tutor) conferem com a Receita Federal.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                     <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                     <p className="font-medium text-sm">CFOP (Operações Fiscais) compatíveis com venda presencial.</p>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-800 rounded-lg border border-rose-200">
                     <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                     <div>
                        <p className="font-bold text-sm">Alerta de Risco Tributário: NCM Incorreto</p>
                        <p className="text-xs text-rose-700 mt-1">O produto <strong>Ração Terapêutica Renal 2kg</strong> está configurado com o NCM "9503.00" (Brinquedos). Isso pode gerar multa em caso de fiscalização.</p>
                        <button className="mt-3 bg-white text-rose-600 border border-rose-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-rose-100 transition-colors">
                           Corrigir para NCM "2309.90" (Preparações p/ Animais) Automaticamente
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t p-6 flex justify-between items-center">
          <button 
            disabled={step === 1}
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`font-bold px-6 py-3 rounded-xl transition-colors ${step === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Voltar
          </button>
          
          {step < 4 ? (
            <button 
               onClick={() => setStep(s => s + 1)}
               className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
            >
               Avançar Passo <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
               onClick={onClose}
               className="bg-emerald-600 text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
            >
               Emitir Múltiplas NFs Agora
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
