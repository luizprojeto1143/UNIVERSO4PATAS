"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { HeartPulse, CreditCard, Receipt, FileText, ChevronDown } from "lucide-react";

export default function CreateInvoiceModal({ isOpen, onClose, tutors, catalog = [] }: { isOpen: boolean, onClose: () => void, tutors: any[], catalog?: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tutorId: tutors[0]?.id || "",
    items: [{ description: "", unitPrice: 0, quantity: 1 }]
  });

  const [paymentMethod, setPaymentMethod] = useState<'standard' | 'boleto' | 'health_plan'>('standard');
  const [installments, setInstallments] = useState(1);
  const [healthPlanCoverage, setHealthPlanCoverage] = useState(0); // Em % (Ex: 80%)
  const [useVetCoins, setUseVetCoins] = useState(false);
  
  // Mock balance
  const mockVetCoinsBalance = 85.00;

  if (!isOpen) return null;

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", unitPrice: 0, quantity: 1 }]
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'description') {
      const foundItem = catalog.find(c => c.name === value);
      if (foundItem) {
        newItems[index].unitPrice = foundItem.basePrice;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, item) => acc + ((item.unitPrice || 0) * (item.quantity || 0)), 0);
  };

  const calculateFinalTotal = () => {
    let subtotal = calculateSubtotal();
    
    if (paymentMethod === 'health_plan') {
      // Tutor pays the co-participation (remaining %)
      return subtotal * ((100 - healthPlanCoverage) / 100);
    }
    
    if (paymentMethod === 'boleto' && installments > 1) {
      return subtotal * 1.08;
    }
    
    let total = subtotal;
    if (useVetCoins) {
      total = Math.max(0, total - mockVetCoinsBalance);
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tutorId) return;

    setLoading(true);
    const totalAmount = calculateFinalTotal();

    try {
      const res = await fetchApi(`financial/invoices`, {
        method: "POST",
        body: JSON.stringify({
          tutorId: formData.tutorId,
          totalAmount,
          paymentMethod,
          installments,
          items: formData.items
        })
      });

      router.refresh();
      onClose();
      setFormData({
        tutorId: tutors[0]?.id || "",
        items: [{ description: "", unitPrice: 0, quantity: 1 }]
      });
      setPaymentMethod('standard');
      setInstallments(1);
      setUseVetCoins(false);
      
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar faturamento.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const finalTotal = calculateFinalTotal();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2"><CreditCard className="w-6 h-6"/> PDV / Fechamento de Fatura</h2>
            <p className="text-indigo-200 font-medium mt-1">Cálculo de checkout e opções de pagamento</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
           
           {/* Lado Esquerdo: Itens e Tutor */}
           <div className="w-3/5 p-8 overflow-y-auto border-r border-slate-200 bg-slate-50">
              <form id="invoiceForm" onSubmit={handleSubmit} className="space-y-6">
                <datalist id="catalog-items">
                  {catalog.map((c: any) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Tutor Responsável</label>
                  <select 
                    className="w-full bg-white border border-slate-300 rounded-xl p-4 font-bold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                    value={formData.tutorId}
                    onChange={e => setFormData({ ...formData, tutorId: e.target.value })}
                  >
                    {tutors.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.cpf || 'Sem CPF'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4 mt-8">
                    <label className="block text-sm font-black text-slate-700 uppercase tracking-widest">Itens Faturados</label>
                    <button type="button" onClick={handleAddItem} className="text-sm text-indigo-600 hover:text-white font-bold hover:bg-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                      + Adicionar Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Descrição</p>
                          <input 
                            type="text" 
                            required 
                            list="catalog-items"
                            placeholder="Ex: Consulta..."
                            className="w-full bg-transparent font-bold text-slate-800 outline-none placeholder:font-medium"
                            value={item.description}
                            onChange={e => handleItemChange(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="w-20 border-l border-slate-100 pl-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Qtd</p>
                          <input 
                            type="number" 
                            required 
                            min="1"
                            className="w-full bg-transparent font-bold text-slate-800 outline-none"
                            value={item.quantity}
                            onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="w-28 border-l border-slate-100 pl-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">R$ Unit</p>
                          <input 
                            type="number" 
                            required 
                            min="0" step="0.01"
                            className="w-full bg-transparent font-bold text-slate-800 outline-none"
                            value={item.unitPrice}
                            onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
           </div>

           {/* Lado Direito: Modos de Pagamento */}
           <div className="w-2/5 p-8 bg-white flex flex-col relative overflow-y-auto">
              <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-sm">Opções de Fechamento</h3>
              
              <div className="space-y-3 mb-8">
                {/* Standard */}
                <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'standard' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payMethod" checked={paymentMethod === 'standard'} onChange={() => setPaymentMethod('standard')} className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className={`font-bold ${paymentMethod === 'standard' ? 'text-indigo-900' : 'text-slate-700'}`}>Pix / Cartão Maquininha</p>
                      <p className="text-xs font-medium text-slate-500">Cobrança integral padrão balcão</p>
                    </div>
                  </div>
                </label>

                {/* Boleto Parcelado */}
                <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'boleto' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-start gap-3">
                    <input type="radio" name="payMethod" checked={paymentMethod === 'boleto'} onChange={() => setPaymentMethod('boleto')} className="w-5 h-5 text-sky-600 mt-1" />
                    <div className="w-full">
                      <p className={`font-bold flex items-center gap-2 ${paymentMethod === 'boleto' ? 'text-sky-900' : 'text-slate-700'}`}>
                        <Receipt className="w-4 h-4"/> Boleto Parcelado (Parceiro)
                      </p>
                      <p className="text-xs font-medium text-slate-500 mb-2">Aprovação de crédito. Taxa parceiro: +8%</p>
                      
                      {paymentMethod === 'boleto' && (
                        <select 
                          className="w-full p-2 bg-white border border-sky-200 rounded-xl text-sm font-bold text-sky-800 outline-none"
                          value={installments}
                          onChange={e => setInstallments(parseInt(e.target.value))}
                        >
                          <option value={1}>1x de {(subtotal * 1.08).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</option>
                          <option value={2}>2x de {((subtotal * 1.08)/2).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</option>
                          <option value={3}>3x de {((subtotal * 1.08)/3).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</option>
                          <option value={4}>4x de {((subtotal * 1.08)/4).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</option>
                        </select>
                      )}
                    </div>
                  </div>
                </label>

                {/* Plano de Saúde Parceiro */}
                <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'health_plan' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-start gap-3">
                    <input type="radio" name="payMethod" checked={paymentMethod === 'health_plan'} onChange={() => setPaymentMethod('health_plan')} className="w-5 h-5 text-emerald-600 mt-1" />
                    <div className="w-full">
                      <p className={`font-bold flex items-center gap-2 ${paymentMethod === 'health_plan' ? 'text-emerald-900' : 'text-slate-700'}`}>
                        <HeartPulse className="w-4 h-4"/> Plano de Saúde Parceiro
                      </p>
                      <p className="text-xs font-medium text-slate-500 mb-2">Tutor paga apenas a coparticipação.</p>
                      
                      {paymentMethod === 'health_plan' && (
                        <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-xl p-2">
                           <span className="text-xs font-bold text-emerald-700">Cobertura (%):</span>
                           <input 
                             type="number" min="0" max="100" 
                             value={healthPlanCoverage} onChange={e => setHealthPlanCoverage(parseInt(e.target.value) || 0)}
                             className="w-16 bg-emerald-50 text-emerald-900 font-bold p-1 rounded outline-none"
                           />
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Totals */}
              <div className="mt-auto">
                 <div className="border-t border-slate-100 pt-6 space-y-2 mb-6">
                    <div className="flex justify-between items-center mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-amber-800">Saldo VetCoins</p>
                        <p className="text-xs text-amber-600">Disponível: R$ {mockVetCoinsBalance.toFixed(2)}</p>
                      </div>
                      <label className="flex items-center gap-2 text-sm font-bold text-amber-900 cursor-pointer">
                        <input type="checkbox" checked={useVetCoins} onChange={e => setUseVetCoins(e.target.checked)} className="w-4 h-4 text-amber-600 rounded" />
                        Usar Saldo
                      </label>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Subtotal Itens:</span>
                      <span>{subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                    </div>
                    {useVetCoins && (
                      <div className="flex justify-between text-sm font-bold text-amber-600">
                        <span>Desconto VetCoins:</span>
                        <span>- {mockVetCoinsBalance.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                      </div>
                    )}
                    {paymentMethod === 'boleto' && (
                      <div className="flex justify-between text-sm font-bold text-sky-600">
                        <span>Taxa Parceiro (8%):</span>
                        <span>+ {(subtotal * 0.08).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                      </div>
                    )}
                    {paymentMethod === 'health_plan' && (
                      <div className="flex justify-between text-sm font-bold text-emerald-600">
                        <span>Coberto Plano ({healthPlanCoverage}%):</span>
                        <span>- {(subtotal * (healthPlanCoverage / 100)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                      </div>
                    )}
                 </div>
                 
                 <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-xl">
                   <div>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Cobrar no Balcão</p>
                     <p className="text-4xl font-black text-indigo-400 leading-none">
                       {finalTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                     </p>
                   </div>
                 </div>

                 <button type="submit" form="invoiceForm" disabled={loading} className="w-full mt-4 bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-70 uppercase tracking-widest">
                    {loading ? 'Processando...' : 'Efetivar Recebimento'}
                 </button>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
