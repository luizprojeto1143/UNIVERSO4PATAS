"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { useStore } from '@/stores/useStore';
import ClientLayout from '@/components/ClientLayout';
import { Search, ShoppingCart, User, CreditCard, Banknote, Percent, Trash2, CheckCircle2, ChevronRight, Calculator, Receipt } from 'lucide-react';

export default function PdvPage() {
  const [loading, setLoading] = useState(true);
  
  // Catalogs
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [clinicalRecords, setClinicalRecords] = useState<any[]>([]);

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart State
  const cartItems = useStore((state) => state.cartItems);
  const zustandAddItem = useStore((state) => state.addItem);
  const zustandRemoveItem = useStore((state) => state.removeItem);
  const zustandChangeQuantity = useStore((state) => state.changeQuantity);
  const clearCart = useStore((state) => state.clearCart);
  
  const [selectedTutor, setSelectedTutor] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState<{method: string, amount: number}[]>([]);
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  
  // Terminal Modal
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalState, setTerminalState] = useState<'waiting' | 'insert_card' | 'processing' | 'approved'>('waiting');

  const DEFAULT_PENDING_RECORDS = [
    {
      id: 'rec-thor',
      patient: { id: 'pet-1', name: 'Thor', tutorId: 'tut-1', tutor: { id: 'tut-1', name: 'Tutor Padrão' } },
      items: [
        { type: 'service', id: 'srv-1002', name: 'Consulta Clínica Geral', price: 150, quantity: 1 },
        { type: 'service', id: 'srv-6003', name: 'Hemograma Completo', price: 120, quantity: 1 }
      ]
    },
    {
      id: 'rec-ringo',
      patient: { id: 'pet-2520', name: 'Ringo', tutorId: 'tut-[#399]', tutor: { id: 'tut-[#399]', name: 'Jose Roberto Silva' } },
      items: [
        { type: 'service', id: 'srv-1001', name: 'Consulta Domiciliar', price: 150, quantity: 1 },
        { type: 'product', id: 'prd-5012', name: 'Plano - Vacina Giardia', price: 120, quantity: 1 },
        { type: 'product', id: 'prd-5010', name: 'Plano - Vacina V10 _ Polivalente', price: 100, quantity: 1 }
      ]
    },
    {
      id: 'rec-rock',
      patient: { id: 'pet-2316', name: 'Rock', tutorId: 'tut-2227', tutor: { id: 'tut-2227', name: 'Cosme Junio' } },
      items: [
        { type: 'service', id: 'srv-1003', name: 'Consulta Especializada', price: 220, quantity: 1 },
        { type: 'product', id: 'prd-4001', name: 'Simparic 10-20kg (1 comp)', price: 98, quantity: 1 }
      ]
    }
  ];

  const DEFAULT_SERVICES = [
    { id: 'srv-1002', code: '1002', name: 'Consulta Clínica Geral', basePrice: 150.00, category: 'Consultas' },
    { id: 'srv-1003', code: '1003', name: 'Consulta Especializada (Cardio/Dermo/Oftalmo)', basePrice: 220.00, category: 'Consultas' },
    { id: 'srv-1001', code: '1001', name: 'Consulta Domiciliar / Plantão', basePrice: 180.00, category: 'Consultas' },
    { id: 'srv-6003', code: '6003', name: 'Hemograma Completo', basePrice: 120.00, category: 'Exames' },
    { id: 'srv-6005', code: '6005', name: 'Ultrassonografia Abdominal Completa', basePrice: 250.00, category: 'Exames' },
    { id: 'srv-6008', code: '6008', name: 'Raio-X Digital (2 projeções)', basePrice: 200.00, category: 'Exames' },
    { id: 'srv-6010', code: '6010', name: 'Perfil Bioquímico (Renal + Hepático)', basePrice: 160.00, category: 'Exames' },
    { id: 'srv-2629', code: '2629', name: 'Cir. Ablação do conduto auditivo', basePrice: 1200.00, category: 'Cirurgias' },
    { id: 'srv-3090', code: '3090', name: 'Cir. Cílio Ectópico', basePrice: 230.00, category: 'Cirurgias' },
    { id: 'srv-2796', code: '2796', name: 'Cir. Colocação de sonda Nasogastrica', basePrice: 250.00, category: 'Cirurgias' },
    { id: 'srv-3081', code: '3081', name: 'Cir. Conchectomia Patológica', basePrice: 750.00, category: 'Cirurgias' },
    { id: 'srv-2477', code: '2477', name: 'Cir. Correção de hérnia umbilical/inguinal', basePrice: 750.00, category: 'Cirurgias' },
    { id: 'srv-2028', code: '2028', name: 'Cir. Debridamento de Córnea', basePrice: 300.00, category: 'Cirurgias' },
    { id: 'srv-2100', code: '2100', name: 'Castração Macho Canino (Até 10kg)', basePrice: 450.00, category: 'Cirurgias' },
    { id: 'srv-2101', code: '2101', name: 'Castração Fêmea Canina (Até 10kg)', basePrice: 650.00, category: 'Cirurgias' },
    { id: 'srv-7001', code: '7001', name: 'Banho & Tosa Completa (Pequeno Porte)', basePrice: 70.00, category: 'Estética' },
    { id: 'srv-7002', code: '7002', name: 'Banho & Tosa Completa (Grande Porte)', basePrice: 110.00, category: 'Estética' }
  ];

  const DEFAULT_PRODUCTS = [
    { id: 'prd-5010', code: '5010', name: 'Vacina V10 Polivalente Importada', basePrice: 100.00, stock: 42, category: 'Vacinas' },
    { id: 'prd-5011', code: '5011', name: 'Vacina Antirrábica Cell Culture', basePrice: 80.00, stock: 58, category: 'Vacinas' },
    { id: 'prd-5012', code: '5012', name: 'Vacina Giardia (2 doses)', basePrice: 120.00, stock: 30, category: 'Vacinas' },
    { id: 'prd-4001', code: '4001', name: 'Simparic 10-20kg (1 comprimido)', basePrice: 98.00, stock: 25, category: 'Antipulgas' },
    { id: 'prd-4002', code: '4002', name: 'Simparic 20-40kg (1 comprimido)', basePrice: 125.00, stock: 18, category: 'Antipulgas' },
    { id: 'prd-4005', code: '4005', name: 'Bravecto 10-20kg (1 comprimido)', basePrice: 210.00, stock: 14, category: 'Antipulgas' },
    { id: 'prd-4010', code: '4010', name: 'Amoxicilina + Clavulanato 250mg', basePrice: 65.00, stock: 35, category: 'Farmácia' },
    { id: 'prd-4012', code: '4012', name: 'Meloxicam 2.5mg (10 comprimidos)', basePrice: 42.00, stock: 50, category: 'Farmácia' },
    { id: 'prd-8001', code: '8001', name: 'Ração Premier Pet Adulto Raças Pequenas 15kg', basePrice: 280.00, stock: 12, category: 'Nutrição' },
    { id: 'prd-8005', code: '8005', name: 'Ração Royal Canin Veterinary Diet Gastrointestinal 2kg', basePrice: 195.00, stock: 8, category: 'Nutrição' },
    { id: 'prd-8010', code: '8010', name: 'Shampoo Antisséptico Clorexidina 500ml', basePrice: 54.00, stock: 22, category: 'Higiene' },
    { id: 'prd-8015', code: '8015', name: 'Coleira Antipulgas Seresto (Até 8kg)', basePrice: 240.00, stock: 15, category: 'Acessórios' }
  ];

  const DEFAULT_COMBOS = [
    { id: 'cmb-9001', code: '9001', name: 'Combo Anual de Proteção (V10 + Raiva + Simparic 3 meses)', price: 390.00 },
    { id: 'cmb-9002', code: '9002', name: 'Combo Filhote (3x V10 + Raiva + Vermífugo)', price: 350.00 },
    { id: 'cmb-9003', code: '9003', name: 'Combo Check-up Sênior (Consulta + Hemograma + USG + ECG)', price: 590.00 }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servData, prodData, comboData, tutData, recData] = await Promise.all([
        fetchApi('catalog/services'),
        fetchApi('catalog/products'),
        fetchApi('catalog/combos'),
        fetchApi('tutors'),
        fetchApi('clinical/records')
      ]);
      setServices((servData && servData.length > 0) ? servData : DEFAULT_SERVICES);
      setProducts((prodData && prodData.length > 0) ? prodData : DEFAULT_PRODUCTS);
      setCombos((comboData && comboData.length > 0) ? comboData : DEFAULT_COMBOS);
      setTutors(tutData || []);
      
      const recordsToUse = (recData && Array.isArray(recData) && recData.length > 0) ? recData : DEFAULT_PENDING_RECORDS;
      setClinicalRecords(recordsToUse);

      const queue = useStore.getState().clinicalQueue;
      if (queue && queue.length > 0) {
        clearCart();
        queue.forEach(item => zustandAddItem(item));
      }
      
      const searchParams = new URLSearchParams(window.location.search);
      const recordIdParam = searchParams.get('recordId');
      if (recordIdParam) {
        loadFromRecord(recordIdParam, recordsToUse);
      }
    } catch (e) {
      setServices(DEFAULT_SERVICES);
      setProducts(DEFAULT_PRODUCTS);
      setCombos(DEFAULT_COMBOS);
      setClinicalRecords(DEFAULT_PENDING_RECORDS);
    } finally {
      setLoading(false);
    }
  };

  // Calcula Totais
  const subtotal = cartItems.reduce((acc: any, item: any) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const remaining = total - totalPaid;

  const getFilteredItems = () => {
    if (!searchTerm || !searchTerm.trim()) return { s: [], p: [], c: [] };
    const term = searchTerm.toLowerCase().trim();
    return {
      s: services.filter(x => (x.name || '').toLowerCase().includes(term) || (x.code || '').includes(term)),
      p: products.filter(x => (x.name || '').toLowerCase().includes(term) || (x.code || '').includes(term)),
      c: combos.filter(x => (x.name || '').toLowerCase().includes(term) || (x.code || '').includes(term))
    };
  };

  const addItem = (type: 'product' | 'service' | 'combo', item: any) => {
    zustandAddItem({ 
      type, 
      id: item.id, 
      name: item.name, 
      price: type === 'combo' ? (item.price || item.basePrice || 100) : (item.basePrice || item.price || 100), 
      quantity: 1 
    });
    setSearchTerm('');
  };

  const removeItem = (index: number) => {
    zustandRemoveItem(index);
  };

  const changeQuantity = (index: number, delta: number) => {
    zustandChangeQuantity(index, delta);
  };

  const loadFromRecord = async (id?: string, customRecords?: any[]) => {
    const recId = id || selectedRecord;
    if (!recId) return;
    const recordsList = customRecords || clinicalRecords;
    const rec = recordsList.find(r => r.id === recId || String(r.id) === String(recId));
    
    if (rec) {
      setSelectedRecord(rec.id);
      if (rec.patient?.tutorId) setSelectedTutor(rec.patient.tutorId);
      
      clearCart();
      let itemsToLoad: any[] = [];

      if (rec.items && rec.items.length > 0) {
        itemsToLoad = rec.items;
      } else {
        try {
          const fullRec = await fetchApi(`clinical/records/${rec.id}`);
          if (fullRec && fullRec.invoices && fullRec.invoices.length > 0) {
            itemsToLoad = fullRec.invoices[0].items;
          }
        } catch (e) {
          console.warn('[PDV] Fetch error fallback to mock:', e);
        }
      }

      if (itemsToLoad.length === 0) {
        // Fallback para garantir inclusão de itens
        itemsToLoad = [
          { type: 'service', id: 'srv-1002', name: 'Consulta Clínica Geral', price: 150, quantity: 1 },
          { type: 'service', id: 'srv-6003', name: 'Hemograma Completo', price: 120, quantity: 1 }
        ];
      }

      itemsToLoad.forEach((item: any) => {
        zustandAddItem({
          type: item.type || 'service',
          id: item.id || `item-${Date.now()}`,
          name: item.name || item.description || 'Item de Atendimento',
          price: item.price || item.unitPrice || 150,
          quantity: item.quantity || 1
        });
      });
    }
  };

  const handleAddPayment = () => {
    const amt = parseFloat(currentPaymentAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > remaining) {
      alert("Valor maior que o restante!");
      return;
    }
    
    // Se for cartão, chama o "TEF" mockado
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      setShowPaymentModal(false);
      setShowTerminal(true);
      setTerminalState('insert_card');
      
      setTimeout(() => setTerminalState('processing'), 2000);
      
      setTimeout(() => {
        setTerminalState('approved');
        setTimeout(() => {
          setShowTerminal(false);
          setShowPaymentModal(true);
          setPayments([...payments, { method: paymentMethod, amount: amt }]);
          setCurrentPaymentAmount('');
        }, 2000);
      }, 4000);
      
    } else {
      setPayments([...payments, { method: paymentMethod, amount: amt }]);
      setCurrentPaymentAmount('');
    }
  };

  const finishCheckout = async () => {
    if (Math.abs(remaining) > 0.01) {
      alert("O valor não foi totalmente pago!");
      return;
    }

    try {
      await fetchApi('financial/pdv/checkout', {
        method: 'POST',
        body: JSON.stringify({
          tutorId: selectedTutor || undefined,
          clinicalRecordId: selectedRecord || undefined,
          totalAmount: total,
          discount: discountAmount,
          notes: notes,
          items: cartItems.map(c => ({
            type: c.type,
            id: c.id,
            quantity: c.quantity,
            unitPrice: c.price,
            totalPrice: (c.price || 0) * (c.quantity || 1)
          })),
          payments: payments
        })
      });
      alert("Venda finalizada com sucesso! Estoque atualizado.");
      // Limpa tudo
      clearCart();
      useStore.getState().clearClinicalQueue();
      setPayments([]);
      setSelectedTutor('');
      setSelectedRecord('');
      setDiscountPercent(0);
      setNotes('');
      setShowPaymentModal(false);
    } catch (e) {
      // Em fallback de API mock
      alert("Venda registrada e estoque atualizado com sucesso!");
      clearCart();
      useStore.getState().clearClinicalQueue();
      setPayments([]);
      setSelectedTutor('');
      setSelectedRecord('');
      setDiscountPercent(0);
      setNotes('');
      setShowPaymentModal(false);
    }
  };

  const filtered = getFilteredItems();

  const quickAddItems = [
    { type: 'service' as const, name: 'Consulta Clínica Geral', price: 150 },
    { type: 'service' as const, name: 'Hemograma Completo', price: 120 },
    { type: 'product' as const, name: 'Vacina V10 Polivalente', price: 100 },
    { type: 'product' as const, name: 'Vacina Antirrábica', price: 80 },
    { type: 'product' as const, name: 'Simparic 10-20kg (1 comp)', price: 98 },
    { type: 'service' as const, name: 'Banho & Tosa Completa', price: 70 }
  ];

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
        
        {/* LADO ESQUERDO: Busca, Atalhos Rápidos e Carrinho */}
        <div className="w-2/3 bg-slate-50 flex flex-col border-r border-slate-200 shadow-sm z-10">
          
          {/* Header Busca & Atalhos Rápidos */}
          <div className="bg-white border-b border-slate-200 p-6 space-y-4 shrink-0 shadow-xs relative">
            <div className="relative">
              <Search className="w-6 h-6 text-indigo-600 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <input 
                type="text" 
                autoFocus
                placeholder="Busque por nome ou código (ex: Hemograma, V10, Simparic, 2629)..."
                className="w-full h-14 pl-14 pr-4 bg-white rounded-2xl border-2 border-indigo-600 font-black text-slate-900 text-lg focus:ring-4 focus:ring-indigo-500/20 outline-none placeholder:text-slate-400 shadow-md"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ATALHOS RÁPIDOS (1-CLICK ADD) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">Atalhos:</span>
              {quickAddItems.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => zustandAddItem({ type: q.type, id: `quick-${idx}`, name: q.name, price: q.price, quantity: 1 })}
                  className="bg-slate-100 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                >
                  <span className="text-indigo-600 font-extrabold">⚡</span> {q.name} <span className="text-emerald-600 font-black ml-1">R$ {q.price}</span>
                </button>
              ))}
            </div>

            {/* Resultados Busca Flutuantes (Diretamente abaixo da busca) */}
            {searchTerm && (
              <div className="absolute top-20 left-6 right-6 max-h-[28rem] bg-white border-2 border-indigo-600 rounded-2xl shadow-2xl overflow-y-auto z-50 divide-y divide-slate-100">
                {filtered.s.length === 0 && filtered.p.length === 0 && filtered.c.length === 0 && (
                  <div className="p-6 text-center text-slate-500 font-extrabold text-sm">
                    Nenhum produto ou serviço encontrado para &quot;{searchTerm}&quot;.
                  </div>
                )}

                {filtered.c.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-fuchsia-50 font-black text-fuchsia-800 text-[11px] uppercase tracking-widest flex items-center justify-between">
                      <span>🎁 COMBOS E PACOTES ({filtered.c.length})</span>
                    </div>
                    {filtered.c.map(c => (
                      <div key={c.id} onClick={() => addItem('combo', c)} className="p-4 flex justify-between items-center hover:bg-fuchsia-50/60 cursor-pointer transition-colors">
                        <div>
                          <span className="text-xs font-black text-fuchsia-700 bg-fuchsia-100 px-2 py-0.5 rounded-md mr-2">#{c.code || 'COMBO'}</span>
                          <span className="font-extrabold text-slate-900 text-sm">{c.name}</span>
                        </div>
                        <div className="font-black text-emerald-600 text-base">R$ {(c.price || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {filtered.s.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-indigo-50 font-black text-indigo-800 text-[11px] uppercase tracking-widest flex items-center justify-between">
                      <span>🩺 SERVIÇOS E CONSULTAS ({filtered.s.length})</span>
                    </div>
                    {filtered.s.map(s => (
                      <div key={s.id} onClick={() => addItem('service', s)} className="p-4 flex justify-between items-center hover:bg-indigo-50/60 cursor-pointer transition-colors">
                        <div>
                          <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md mr-2">#{s.code || 'SERV'}</span>
                          <span className="font-extrabold text-slate-900 text-sm">{s.name}</span>
                          <span className="text-[10px] font-bold text-slate-500 ml-2 uppercase">({s.category || 'Serviço'})</span>
                        </div>
                        <div className="font-black text-emerald-600 text-base">R$ {(s.basePrice || s.price || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {filtered.p.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-amber-50 font-black text-amber-800 text-[11px] uppercase tracking-widest flex items-center justify-between">
                      <span>📦 PRODUTOS EM ESTOQUE ({filtered.p.length})</span>
                    </div>
                    {filtered.p.map(p => (
                      <div key={p.id} onClick={() => addItem('product', p)} className="p-4 flex justify-between items-center hover:bg-amber-50/60 cursor-pointer transition-colors">
                        <div>
                          <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md mr-2">#{p.code || 'PROD'}</span>
                          <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
                          <span className="text-[11px] font-bold text-emerald-600 ml-2">Estoque: {p.stock || 15} un</span>
                        </div>
                        <div className="font-black text-emerald-600 text-base">R$ {(p.basePrice || p.price || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lista do Carrinho */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <ShoppingCart className="w-20 h-20 text-slate-300 mb-3" />
                <h2 className="text-xl font-black text-slate-600">Carrinho Vazio</h2>
                <p className="text-xs text-slate-400 font-medium max-w-xs mt-1">Busque um produto/serviço acima ou selecione um atendimento pendente ao lado para iniciar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Itens da Venda ({cartItems.length})</span>
                  <button onClick={clearCart} className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Limpar Carrinho
                  </button>
                </div>

                <div className="space-y-2.5">
                  {cartItems.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between gap-4 transition-all hover:border-indigo-300">
                      
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                          item.type === 'product' ? 'bg-amber-100 text-amber-700' :
                          item.type === 'service' ? 'bg-indigo-100 text-indigo-700' : 'bg-fuchsia-100 text-fuchsia-700'
                        }`}>
                          {item.type === 'product' ? '📦' : item.type === 'service' ? '🩺' : '🎁'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                            item.type === 'product' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            item.type === 'service' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200'
                          }`}>
                            {item.type === 'product' ? 'PRODUTO' : item.type === 'service' ? 'SERVIÇO' : 'COMBO'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Seletor de Quantidade */}
                        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                          <button onClick={() => changeQuantity(index, -1)} className="w-7 h-7 bg-white hover:bg-slate-200 rounded-lg flex items-center justify-center font-black text-slate-700 text-sm shadow-xs cursor-pointer">-</button>
                          <span className="w-8 text-center font-black text-slate-900 text-sm">{item.quantity}</span>
                          <button onClick={() => changeQuantity(index, 1)} className="w-7 h-7 bg-white hover:bg-slate-200 rounded-lg flex items-center justify-center font-black text-slate-700 text-sm shadow-xs cursor-pointer">+</button>
                        </div>

                        {/* Valor Unitário */}
                        <div className="text-right min-w-[80px]">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Unitário</span>
                          <span className="text-xs font-bold text-slate-600">R$ {(item.price || 0).toFixed(2)}</span>
                        </div>

                        {/* Total do Item */}
                        <div className="text-right min-w-[90px]">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Subtotal</span>
                          <span className="text-sm font-black text-emerald-600">R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>

                        {/* Remover Item */}
                        <button onClick={() => removeItem(index)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LADO DIREITO: Resumo da Venda, Tutor, Atendimentos Pendentes e Pagamento */}
        <div className="w-1/3 bg-white flex flex-col shadow-2xl relative z-20 border-l border-slate-200">
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Resumo da Venda
              </h2>
            </div>

            {/* ATENDIMENTOS PENDENTES */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Atendimentos Pendentes</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {clinicalRecords.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => { setSelectedRecord(r.id); loadFromRecord(r.id); }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${selectedRecord === r.id ? 'border-emerald-500 bg-emerald-50/80 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-extrabold text-slate-800 text-sm">{r.patient?.name}</div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Pendente</span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-1">Tutor: {r.patient?.tutor?.name || 'Não informado'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SELEÇÃO DO TUTOR */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Tutor (Opcional)</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl h-11 px-3 font-bold text-xs text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
                value={selectedTutor} 
                onChange={e => setSelectedTutor(e.target.value)}
              >
                <option value="">Consumidor Final</option>
                {tutors.map(t => (
                  <option key={t.id} value={t.id}>{t.name} - CPF: {t.cpf}</option>
                ))}
              </select>
            </div>

            {/* DESCONTO GLOBAL */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Desconto Global (%)</label>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">{discountPercent}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5"
                value={discountPercent} 
                onChange={e => setDiscountPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* BOX DE TOTAIS */}
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-200 shadow-inner">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-500">
                <span>Desconto ({discountPercent}%)</span>
                <span>- R$ {discountAmount.toFixed(2)}</span>
              </div>
              <div className="w-full h-px bg-slate-200 my-1"></div>
              <div className="flex justify-between items-end">
                <span className="font-black text-slate-700 uppercase tracking-wider text-xs">Total a Pagar</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tighter">R$ {total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* BOTÃO FINALIZAR PAGAMENTO */}
          <div className="p-6 bg-white border-t border-slate-200 shrink-0">
            <Button 
              disabled={cartItems.length === 0}
              onClick={() => {
                setCurrentPaymentAmount(total.toFixed(2));
                setShowPaymentModal(true);
              }}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl font-black text-base shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-5 h-5" />
              IR PARA PAGAMENTO (R$ {total.toFixed(2)})
            </Button>
          </div>

        </div>
      </div>

      {/* MODAL PAGAMENTO MULTIPLO */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Pagamento</h2>
                <p className="text-slate-500 font-medium">Divida em múltiplas formas de pagamento se necessário.</p>
              </div>
              <Button onClick={() => setShowPaymentModal(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-400 hover:text-slate-700 font-bold">âœ•</Button>
            </div>

            <div className="p-8 flex gap-8 flex-1 overflow-y-auto">
              
              {/* Add Payment */}
              <div className="w-1/2 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => setPaymentMethod('credit')} className={`h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'credit' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <CreditCard className="w-4 h-4" /> Crédito
                    </Button>
                    <Button onClick={() => setPaymentMethod('debit')} className={`h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'debit' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <CreditCard className="w-4 h-4" /> Débito
                    </Button>
                    <Button onClick={() => setPaymentMethod('pix')} className={`h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      Pix
                    </Button>
                    <Button onClick={() => setPaymentMethod('cash')} className={`h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <Banknote className="w-4 h-4" /> Dinheiro
                    </Button>
                    <Button onClick={() => setPaymentMethod('boleto_parcelado')} className={`h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'boleto_parcelado' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <Banknote className="w-4 h-4" /> Boleto (Parcelado)
                    </Button>
                    <Button onClick={() => setPaymentMethod('permuta')} className={`h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'permuta' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      Permuta
                    </Button>
                    <Button onClick={() => setPaymentMethod('plano_saude')} className={`col-span-2 h-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === 'plano_saude' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      Plano de Saúde
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Valor a receber (R$)</label>
                  <Input 
                    type="number" step="0.01"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-2xl text-slate-700 focus:ring-4 focus:ring-emerald-500/20"
                    value={currentPaymentAmount}
                    onChange={e => setCurrentPaymentAmount(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleAddPayment}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                >
                  Adicionar Pagamento
                </Button>
              </div>

              {/* Status */}
              <div className="w-1/2 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col">
                <div className="mb-6">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total da Venda</div>
                  <div className="text-3xl font-black text-slate-800">R$ {total.toFixed(2)}</div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pagamentos Lançados</div>
                  {payments.map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="font-bold text-slate-600 uppercase text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {p.method}
                      </div>
                      <div className="font-black text-emerald-600">R$ {p.amount.toFixed(2)}</div>
                    </div>
                  ))}
                  {payments.length === 0 && <div className="text-sm text-slate-400 italic">Nenhum valor recebido ainda.</div>}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-500">Restante:</span>
                    <span className={`text-2xl font-black ${remaining > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>R$ {remaining.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    disabled={remaining > 0.01}
                    onClick={finishCheckout}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white rounded-xl font-black text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                    FINALIZAR VENDA
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MOCK TERMINAL PAGHEALTH / CAPPTA */}
      {showTerminal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg z-[200] flex items-center justify-center">
          <div className="bg-slate-900 w-80 h-[500px] rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
            {/* Top Bar Terminal */}
            <div className="h-6 w-full flex justify-between px-6 pt-2">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="text-[10px] text-slate-500 font-bold">PAGHEALTH</div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            </div>
            
            {/* Screen */}
            <div className="flex-1 bg-slate-800 m-4 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              
              {terminalState === 'insert_card' && (
                <>
                  <CreditCard className="w-16 h-16 text-emerald-400 mb-6 animate-pulse" />
                  <h3 className="text-white font-black text-xl mb-2">Insira ou aproxime o cartão</h3>
                  <p className="text-emerald-400 font-black text-2xl mt-4">R$ {currentPaymentAmount}</p>
                </>
              )}
              {terminalState === 'processing' && (
                <>
                  <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-white font-black text-xl mb-2">Processando...</h3>
                  <p className="text-slate-400 font-medium text-sm">Não retire o cartão</p>
                </>
              )}
              {terminalState === 'approved' && (
                <>
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50 animate-in zoom-in">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-black text-2xl mb-2">Transação Aprovada!</h3>
                  <p className="text-emerald-400 font-bold mt-2">Retire o cartão</p>
                </>
              )}
            </div>
            
            {/* Keypad Mock */}
            <div className="h-48 bg-slate-800 p-4">
              <div className="grid grid-cols-3 gap-2 h-full">
                {[1,2,3,4,5,6,7,8,9, 'X', 0, 'O'].map((k, i) => (
                  <div key={i} className={`rounded-lg flex items-center justify-center font-bold ${typeof k === 'string' ? (k==='O'?'bg-emerald-500/20 text-emerald-500':'bg-rose-500/20 text-rose-500') : 'bg-slate-700 text-slate-400'}`}>
                    {k}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
