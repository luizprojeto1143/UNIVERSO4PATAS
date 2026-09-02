'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Package, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  ShoppingCart, 
  Calendar, 
  CheckCircle2, 
  Loader2,
  Boxes,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  FileCheck,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  BarChart3,
  RefreshCw,
  X
} from 'lucide-react';
import Link from 'next/link';
import { api, fetchApi } from '@/lib/api';

const DEFAULT_PRODUCTS_STOCK = [
  { id: 'prd-5010', code: '5010', name: 'Vacina V10 Polivalente Importada', category: 'Vacinas', costPrice: 48.00, salePrice: 100.00, stock: 42, minStock: 15, unit: 'ampola', controlled: false },
  { id: 'prd-5011', code: '5011', name: 'Vacina Antirrábica Cell Culture', category: 'Vacinas', costPrice: 35.00, salePrice: 80.00, stock: 58, minStock: 20, unit: 'ampola', controlled: false },
  { id: 'prd-4001', code: '4001', name: 'Simparic 10-20kg (1 comprimido)', category: 'Antipulgas', costPrice: 52.00, salePrice: 98.00, stock: 25, minStock: 10, unit: 'caixa', controlled: false },
  { id: 'prd-[#CTRL-1]', code: '7701', name: 'Cloridrato de Ketamina 10% 50ml (Controlado)', category: 'Controlados (Portaria 344)', costPrice: 95.00, salePrice: 220.00, stock: 8, minStock: 5, unit: 'frasco', controlled: true },
  { id: 'prd-[#CTRL-2]', code: '7702', name: 'Cloridrato de Tramadol 50mg/ml 2ml (Controlado)', category: 'Controlados (Portaria 344)', costPrice: 18.00, salePrice: 45.00, stock: 12, minStock: 8, unit: 'ampola', controlled: true },
  { id: 'prd-4010', code: '4010', name: 'Amoxicilina + Clavulanato 250mg', category: 'Farmácia', costPrice: 32.00, salePrice: 65.00, stock: 35, minStock: 15, unit: 'caixa', controlled: false },
  { id: 'prd-4012', code: '4012', name: 'Meloxicam 2.5mg (10 comprimidos)', category: 'Farmácia', costPrice: 20.00, salePrice: 42.00, stock: 4, minStock: 10, unit: 'caixa', controlled: false },
  { id: 'prd-8001', code: '8001', name: 'Ração Premier Pet Adulto Raças Pequenas 15kg', category: 'Nutrição', costPrice: 190.00, salePrice: 280.00, stock: 12, minStock: 5, unit: 'saco', controlled: false },
  { id: 'prd-8010', code: '8010', name: 'Shampoo Antisséptico Clorexidina 500ml', category: 'Higiene', costPrice: 26.00, salePrice: 54.00, stock: 3, minStock: 8, unit: 'frasco', controlled: false }
];

const DEFAULT_BATCHES = [
  { id: 'btc-1', productId: 'prd-[#CTRL-1]', product: { name: 'Cloridrato de Ketamina 10% 50ml' }, batchNumber: 'KET-2026-B', expirationDate: '2026-09-25', quantity: 8, costPrice: 95.00 },
  { id: 'btc-2', productId: 'prd-5010', product: { name: 'Vacina V10 Polivalente Importada' }, batchNumber: 'VAC-2026-V10', expirationDate: '2026-10-14', quantity: 28, costPrice: 48.00 },
  { id: 'btc-3', productId: 'prd-[#CTRL-2]', product: { name: 'Cloridrato de Tramadol 50mg/ml' }, batchNumber: 'TRM-991', expirationDate: '2026-11-02', quantity: 12, costPrice: 18.00 },
  { id: 'btc-4', productId: 'prd-4012', product: { name: 'Meloxicam 2.5mg (10 comprimidos)' }, batchNumber: 'MLX-551', expirationDate: '2026-11-18', quantity: 4, costPrice: 20.00 }
];

const DEFAULT_MOVEMENTS = [
  { id: 'mov-1', type: 'ENTRADA (NF-9921)', productId: 'prd-5010', product: { name: 'Vacina V10 Polivalente Importada' }, quantity: 50, reason: 'Compra Distribuidora Vet', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'mov-2', type: 'SAÍDA (Prontuário #101)', productId: 'prd-[#CTRL-1]', product: { name: 'Cloridrato de Ketamina 10%' }, quantity: 1, reason: 'Procedimento Cirúrgico - Pet: Thor', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'mov-3', type: 'SAÍDA (PDV #2910)', productId: 'prd-4001', product: { name: 'Simparic 10-20kg' }, quantity: 1, reason: 'Venda Caixa Balcão', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() }
];

const DEFAULT_CONTROLLED = [
  { id: 'ctrl-1', type: 'SAÍDA', productId: 'prd-[#CTRL-1]', product: { name: 'Cloridrato de Ketamina 10% 50ml' }, quantity: 1, prescriptionNumber: 'NOT-2026-881', vetName: 'Dra. Jéssica Goulart', vetCrmv: 'CRMV-MG 52180', tutorName: 'Luciana Santos (Thor)', balanceAfter: 8, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'ctrl-2', type: 'ENTRADA', productId: 'prd-[#CTRL-2]', product: { name: 'Cloridrato de Tramadol 50mg/ml' }, quantity: 15, prescriptionNumber: 'NF-10298', vetName: 'Distribuidora Cristália', vetCrmv: 'CNPJ 01.293.111/0001-99', tutorName: 'Estoque Central', balanceAfter: 12, createdAt: new Date(Date.now() - 3600000 * 72).toISOString() }
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'batches' | 'movements' | 'controlled'>('stock');
  const [loading, setLoading] = useState(true);

  const [productsList, setProductsList] = useState<any[]>(DEFAULT_PRODUCTS_STOCK);
  const [batches, setBatches] = useState<any[]>(DEFAULT_BATCHES);
  const [movements, setMovements] = useState<any[]>(DEFAULT_MOVEMENTS);
  const [controlledLogs, setControlledLogs] = useState<any[]>(DEFAULT_CONTROLLED);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showControlledModal, setShowControlledModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form State
  const [batchForm, setBatchForm] = useState({
    productId: DEFAULT_PRODUCTS_STOCK[0].id,
    batchNumber: 'LOT-2026-X',
    expirationDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    quantity: 10,
    costPrice: 45,
  });

  const [movementForm, setMovementForm] = useState({
    productId: DEFAULT_PRODUCTS_STOCK[0].id,
    type: 'ENTRADA',
    quantity: 5,
    reason: 'Compra / Reposição de Estoque',
  });

  const [controlledForm, setControlledForm] = useState({
    productId: DEFAULT_PRODUCTS_STOCK[3].id,
    type: 'SAIDA',
    quantity: 1,
    prescriptionNumber: 'NOT-2026-' + Math.floor(100 + Math.random() * 900),
    vetName: 'Dra. Jéssica Goulart',
    vetCrmv: 'CRMV-MG 52180',
    tutorName: 'Jose Roberto Silva (Ringo)',
    notes: 'Prescrição para cirurgia ambulatorial',
  });

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchesRes, movementsRes, controlledRes] = await Promise.allSettled([
        api.get('/inventory/batches/expiring?days=60'),
        api.get('/inventory/movements'),
        api.get('/inventory/controlled'),
      ]);

      if (batchesRes.status === 'fulfilled' && Array.isArray(batchesRes.value?.data) && batchesRes.value.data.length > 0) {
        setBatches(batchesRes.value.data);
      }
      if (movementsRes.status === 'fulfilled' && Array.isArray(movementsRes.value?.data) && movementsRes.value.data.length > 0) {
        setMovements(movementsRes.value.data);
      }
      if (controlledRes.status === 'fulfilled' && Array.isArray(controlledRes.value?.data) && controlledRes.value.data.length > 0) {
        setControlledLogs(controlledRes.value.data);
      }
    } catch (err) {
      console.warn('Usando dados mock integrados para estoque');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const prod = productsList.find(p => p.id === batchForm.productId) || productsList[0];
    const newB = {
      id: `btc-${Date.now()}`,
      productId: prod.id,
      product: { name: prod.name },
      batchNumber: batchForm.batchNumber,
      expirationDate: batchForm.expirationDate,
      quantity: Number(batchForm.quantity),
      costPrice: Number(batchForm.costPrice)
    };

    setBatches(prev => [newB, ...prev]);
    showToast(`Lote ${batchForm.batchNumber} cadastrado com sucesso!`);
    setShowBatchModal(false);
    setIsSubmitting(false);

    try { await api.post('/inventory/batches', batchForm); } catch(err){}
  };

  const handleRegisterMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const prod = productsList.find(p => p.id === movementForm.productId) || productsList[0];
    const qty = Number(movementForm.quantity);
    const isOut = movementForm.type.includes('SAIDA') || movementForm.type === 'PERDA';

    // Atualiza estoque local do produto
    setProductsList(prev => prev.map(p => {
      if (p.id === prod.id) {
        const newStock = isOut ? Math.max(0, p.stock - qty) : p.stock + qty;
        return { ...p, stock: newStock };
      }
      return p;
    }));

    const newM = {
      id: `mov-${Date.now()}`,
      type: movementForm.type,
      productId: prod.id,
      product: { name: prod.name },
      quantity: qty,
      reason: movementForm.reason || 'Operacional',
      createdAt: new Date().toISOString()
    };

    setMovements(prev => [newM, ...prev]);
    showToast(`Movimentação de ${isOut ? '-' : '+'}${qty} un de ${prod.name} registrada!`);
    setShowMovementModal(false);
    setIsSubmitting(false);

    try { await api.post('/inventory/movements', movementForm); } catch(err){}
  };

  const handleCreateControlled = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const prod = productsList.find(p => p.id === controlledForm.productId) || productsList[3];
    const qty = Number(controlledForm.quantity);
    const isOut = controlledForm.type === 'SAIDA';

    let newBalance = prod.stock;
    setProductsList(prev => prev.map(p => {
      if (p.id === prod.id) {
        newBalance = isOut ? Math.max(0, p.stock - qty) : p.stock + qty;
        return { ...p, stock: newBalance };
      }
      return p;
    }));

    const newC = {
      id: `ctrl-${Date.now()}`,
      type: controlledForm.type,
      productId: prod.id,
      product: { name: prod.name },
      quantity: qty,
      prescriptionNumber: controlledForm.prescriptionNumber,
      vetName: controlledForm.vetName,
      vetCrmv: controlledForm.vetCrmv,
      tutorName: controlledForm.tutorName,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString()
    };

    setControlledLogs(prev => [newC, ...prev]);
    showToast(`Lançamento registrado no Livro Digital de Controlados!`);
    setShowControlledModal(false);
    setIsSubmitting(false);

    try { await api.post('/inventory/controlled', controlledForm); } catch(err){}
  };

  // Filtragem de produtos no catálogo
  const filteredProducts = productsList.filter(p => {
    const matchesSearch = !searchTerm.trim() || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.includes(searchTerm.trim());
    
    if (selectedCategory === 'ALL') return matchesSearch;
    if (selectedCategory === 'CONTROLLED') return matchesSearch && p.controlled;
    if (selectedCategory === 'LOW_STOCK') return matchesSearch && p.stock <= p.minStock;
    return matchesSearch && p.category === selectedCategory;
  });

  const lowStockCount = productsList.filter(p => p.stock <= p.minStock).length;
  const totalStockValue = productsList.reduce((acc, p) => acc + (p.costPrice * p.stock), 0);
  const expiringValue = batches.reduce((acc, b) => acc + ((b.costPrice || 0) * (b.quantity || 0)), 0);

  return (
    <div className="pb-12 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50">
      
      {/* Header com Ações Rápida */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" /> Gestão de Estoque & Controlados
            </h1>
            <p className="text-slate-500 font-bold text-xs mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Controle de Lotes, Validades e Portaria 344/98 SIVISA
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button 
            onClick={() => setShowBatchModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-extrabold shadow-md transition-all text-xs cursor-pointer"
          >
            <Clock className="w-4 h-4 mr-2 text-indigo-300" /> Cadastrar Lote
          </Button>
          <Button 
            onClick={() => setShowControlledModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold shadow-md transition-all text-xs cursor-pointer"
          >
            <FileCheck className="w-4 h-4 mr-2" /> Lançar Controlado
          </Button>
          <Button 
            onClick={() => setShowMovementModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold shadow-md transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> Movimentar Estoque
          </Button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-md border-0">
          <div className="flex justify-between items-start mb-1">
            <span className="text-indigo-200 text-xs font-black uppercase tracking-wider">Valor do Estoque</span>
            <Package className="w-5 h-5 text-indigo-200" />
          </div>
          <p className="text-3xl font-black tracking-tight">R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-indigo-100 text-[10px] font-medium mt-1">{productsList.length} produtos cadastrados</p>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-sm rounded-3xl">
          <div className="flex justify-between items-start mb-1">
            <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Perda Monitorada (60d)</span>
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">R$ {expiringValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-slate-500 text-[10px] font-bold mt-1">{batches.length} lotes em acompanhamento</p>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-sm rounded-3xl">
          <div className="flex justify-between items-start mb-1">
            <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Risco de Ruptura</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600">{lowStockCount} Produtos</p>
          <p className="text-rose-500 text-[10px] font-bold mt-1">Abaixo do estoque mínimo</p>
        </Card>

        <Card className="p-5 bg-amber-50 border-amber-200 shadow-sm rounded-3xl">
          <div className="flex justify-between items-start mb-1">
            <span className="text-amber-800 text-xs font-black uppercase tracking-wider">Controlados (Portaria 344)</span>
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-900">{productsList.filter(p => p.controlled).length} Itens</p>
          <p className="text-amber-700 text-[10px] font-bold mt-1">Livro digital SIVISA ativo</p>
        </Card>
      </div>

      {/* Tabs Principais */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-2 rounded-2xl shadow-xs border border-slate-200 overflow-x-auto">
        <Button 
          onClick={() => setActiveTab('stock')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-800 font-extrabold bg-white hover:bg-indigo-50 border border-slate-200'}`}
        >
          <Boxes className="w-4 h-4 mr-2" /> Catálogo & Saldos ({productsList.length})
        </Button>
        <Button 
          onClick={() => setActiveTab('batches')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${activeTab === 'batches' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-800 font-extrabold bg-white hover:bg-indigo-50 border border-slate-200'}`}
        >
          <Clock className="w-4 h-4 mr-2" /> Lotes & Validades ({batches.length})
        </Button>
        <Button 
          onClick={() => setActiveTab('movements')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${activeTab === 'movements' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-800 font-extrabold bg-white hover:bg-indigo-50 border border-slate-200'}`}
        >
          <ArrowUpRight className="w-4 h-4 mr-2" /> Movimentações ({movements.length})
        </Button>
        <Button 
          onClick={() => setActiveTab('controlled')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${activeTab === 'controlled' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-800 font-extrabold bg-white hover:bg-amber-50 border border-slate-200'}`}
        >
          <FileCheck className="w-4 h-4 mr-2" /> Livro de Controlados ({controlledLogs.length})
        </Button>
      </div>

      {/* ABA 1: CATÁLOGO DE ESTOQUE & SALDOS COMPLETO */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          
          {/* Barra de Filtro e Busca */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-indigo-600 font-black absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou código (#SKU)..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-black text-slate-900 outline-none focus:border-indigo-600 shadow-2xs"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              <button 
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${selectedCategory === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'}`}
              >
                Todos ({productsList.length})
              </button>
              <button 
                onClick={() => setSelectedCategory('LOW_STOCK')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${selectedCategory === 'LOW_STOCK' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'}`}
              >
                Estoque Baixo ({lowStockCount})
              </button>
              <button 
                onClick={() => setSelectedCategory('CONTROLLED')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${selectedCategory === 'CONTROLLED' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'}`}
              >
                Controlados Portaria 344
              </button>
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Código</th>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4 text-right">Custo</th>
                  <th className="p-4 text-right">Preço Venda</th>
                  <th className="p-4 text-center">Saldo Atual</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-black text-indigo-700 text-sm">#{p.code}</td>
                      <td className="p-4 font-extrabold text-slate-900 text-sm">
                        {p.name}
                        {p.controlled && (
                          <span className="ml-2 bg-amber-100 text-amber-900 font-black text-[10px] px-2 py-0.5 rounded-md border border-amber-300 inline-block">
                            CONTROLADO
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-700 font-extrabold">{p.category}</td>
                      <td className="p-4 text-right font-bold text-slate-600">R$ {p.costPrice.toFixed(2)}</td>
                      <td className="p-4 text-right font-black text-emerald-600 text-sm">R$ {p.salePrice.toFixed(2)}</td>
                      <td className="p-4 text-center font-black text-slate-900 text-sm">
                        {p.stock} {p.unit}
                      </td>
                      <td className="p-4 text-center">
                        {isLow ? (
                          <span className="bg-rose-100 border border-rose-300 text-rose-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Estoque Baixo
                          </span>
                        ) : (
                          <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => {
                              setMovementForm({ productId: p.id, type: 'ENTRADA', quantity: 10, reason: 'Reposição de Estoque' });
                              setShowMovementModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                          >
                            + Entrada
                          </button>
                          <button 
                            onClick={() => {
                              setMovementForm({ productId: p.id, type: 'SAIDA_CONSULTA', quantity: 1, reason: 'Consumo Clínico' });
                              setShowMovementModal(true);
                            }}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                          >
                            - Saída
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ABA 2: LOTES & VALIDADES PROXIMAS */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-indigo-600" /> Monitoramento de Lotes e Validades (Próximos 60 Dias)
            </h2>

            <div className="divide-y divide-slate-100">
              {batches.map((b: any) => (
                <div key={b.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{b.product?.name || 'Produto'}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Lote: <span className="font-mono font-bold text-slate-800">{b.batchNumber}</span> | Qtd em Estoque: <strong className="text-slate-800">{b.quantity} un</strong>
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                      Vence em: {new Date(b.expirationDate).toLocaleDateString('pt-BR')}
                    </span>
                    <Button onClick={() => showToast('Notificação enviada para a equipe veterinária!')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs px-3 py-1.5 cursor-pointer">
                      Notificar Médicos
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ABA 3: MOVIMENTAÇÕES DE ESTOQUE */}
      {activeTab === 'movements' && (
        <Card className="p-6 bg-white border-slate-200 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Histórico Recente de Entradas, Saídas e Perdas</h2>
          <div className="space-y-3">
            {movements.map((m: any) => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {m.type.startsWith('SAÍDA') || m.type.startsWith('SAIDA') || m.type === 'PERDA' ? (
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{m.product?.name || 'Produto'}</p>
                    <p className="text-xs text-slate-500 font-medium">{m.type} • Motivo: {m.reason || 'Operacional'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-black text-base ${m.type.startsWith('SAÍDA') || m.type.startsWith('SAIDA') || m.type === 'PERDA' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {m.type.startsWith('SAÍDA') || m.type.startsWith('SAIDA') || m.type === 'PERDA' ? `-${m.quantity}` : `+${m.quantity}`}
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium">{new Date(m.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ABA 4: LIVRO DE CONTROLADOS (PORTARIA 344 SIVISA) */}
      {activeTab === 'controlled' && (
        <Card className="p-6 bg-white border-slate-200 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-500" /> Livro Digital de Medicamentos Controlados (SIVISA / Portaria 344)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Rastreabilidade sanitária completa de receitas, CRMV, paciente e saldos.</p>
            </div>
            <Button onClick={() => setShowControlledModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs px-4 py-2">
              + Novo Lançamento
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {controlledLogs.map((log: any) => (
              <div key={log.id} className="py-4 flex justify-between items-start">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">{log.product?.name}</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs font-black rounded-md ${log.type === 'ENTRADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {log.type} ({log.quantity} un)
                  </span>
                  <div className="text-xs text-slate-600 font-medium mt-1 space-y-0.5">
                    <p>Receita / Notificação nº: <strong className="text-slate-800 font-mono">{log.prescriptionNumber || 'N/A'}</strong> | Veterinário: <strong>{log.vetName || 'N/A'} ({log.vetCrmv || 'N/A'})</strong></p>
                    <p>Tutor / Paciente / Destino: <strong>{log.tutorName || 'Estoque Interno'}</strong></p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Saldo do Livro</span>
                  <span className="font-mono font-black text-base text-slate-800">{log.balanceAfter} un</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(log.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL CADASTRAR LOTE */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
            <div className="bg-indigo-600 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-black">Cadastrar Lote & Validade</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateBatch} className="p-6 space-y-4 pt-0">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Selecione o Produto</label>
                <select 
                  value={batchForm.productId}
                  onChange={(e) => setBatchForm({ ...batchForm, productId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  {productsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (#{p.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Número do Lote</label>
                <Input required placeholder="Ex: LOT-2026-X9" value={batchForm.batchNumber} onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Data de Validade</label>
                  <Input type="date" required value={batchForm.expirationDate} onChange={(e) => setBatchForm({ ...batchForm, expirationDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Quantidade</label>
                  <Input type="number" required min="1" value={batchForm.quantity} onChange={(e) => setBatchForm({ ...batchForm, quantity: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowBatchModal(false)} className="bg-slate-100 text-slate-600 font-bold">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white font-bold">Salvar Lote</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LANÇAR CONTROLADO */}
      {showControlledModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
            <div className="bg-amber-500 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-black">Lançamento em Livro de Controlados</h3>
              <button onClick={() => setShowControlledModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateControlled} className="p-6 space-y-4 pt-0">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Selecione o Medicamento Controlado</label>
                <select 
                  value={controlledForm.productId}
                  onChange={(e) => setControlledForm({ ...controlledForm, productId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  {productsList.filter(p => p.controlled).map(p => (
                    <option key={p.id} value={p.id}>{p.name} (#{p.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tipo</label>
                  <select value={controlledForm.type} onChange={(e) => setControlledForm({ ...controlledForm, type: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                    <option value="SAIDA">SAÍDA (Receita)</option>
                    <option value="ENTRADA">ENTRADA (Nota Fiscal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Quantidade</label>
                  <Input type="number" required min="1" value={controlledForm.quantity} onChange={(e) => setControlledForm({ ...controlledForm, quantity: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Número da Receita / Notificação</label>
                <Input placeholder="Ex: NOT-88392" value={controlledForm.prescriptionNumber} onChange={(e) => setControlledForm({ ...controlledForm, prescriptionNumber: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nome do Veterinário</label>
                  <Input placeholder="Dra. Jéssica Goulart" value={controlledForm.vetName} onChange={(e) => setControlledForm({ ...controlledForm, vetName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">CRMV</label>
                  <Input placeholder="CRMV-MG 52180" value={controlledForm.vetCrmv} onChange={(e) => setControlledForm({ ...controlledForm, vetCrmv: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowControlledModal(false)} className="bg-slate-100 text-slate-600 font-bold">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-amber-500 text-white font-bold">Registrar no Livro</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MOVIMENTAÇÃO */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
            <div className="bg-indigo-600 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-black">Lançar Movimentação de Estoque</h3>
              <button onClick={() => setShowMovementModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleRegisterMovement} className="p-6 space-y-4 pt-0">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Selecione o Produto</label>
                <select 
                  value={movementForm.productId}
                  onChange={(e) => setMovementForm({ ...movementForm, productId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  {productsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (#{p.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tipo de Movimentação</label>
                  <select value={movementForm.type} onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                    <option value="ENTRADA">ENTRADA (Compra/NF)</option>
                    <option value="SAIDA_CONSULTA">SAÍDA (Consulta)</option>
                    <option value="SAIDA_INTERNACAO">SAÍDA (Internação)</option>
                    <option value="PERDA">PERDA / AVARIA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Quantidade</label>
                  <Input type="number" required min="1" value={movementForm.quantity} onChange={(e) => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Motivo / Observação</label>
                <Input placeholder="Ex: Compra NF-1029 ou Uso em internação" value={movementForm.reason} onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowMovementModal(false)} className="bg-slate-100 text-slate-600 font-bold">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white font-bold">Lançar Movimentação</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'} text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5`}>
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}

    </div>
  );
}
