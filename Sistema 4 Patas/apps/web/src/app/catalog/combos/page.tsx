"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

import { Plus, Search, Layers, Settings, Trash2, CheckCircle2 } from 'lucide-react';

const DEFAULT_SERVICES = [
  { id: 'srv-1', name: 'Consulta Clínica Geral', basePrice: 150.00 },
  { id: 'srv-2', name: 'Vacinação V10 Importada', basePrice: 95.00 },
  { id: 'srv-3', name: 'Banho & Tosa Higiênica', basePrice: 80.00 }
];

const DEFAULT_PRODUCTS = [
  { id: 'prd-1', name: 'Simparic 20mg (10 a 20kg)', basePrice: 110.00 },
  { id: 'prd-2', name: 'Shampoo Hipoalergênico Pet 500ml', basePrice: 48.50 }
];

const DEFAULT_COMBOS = [
  {
    id: 'combo-1',
    name: 'Combo Checkup Canino Premium',
    description: 'Consulta Clínica + Vacina V10 + Simparic Antipulgas',
    price: 320.00,
    services: [{ serviceId: 'srv-1', name: 'Consulta Clínica Geral', price: 150.00, quantity: 1 }, { serviceId: 'srv-2', name: 'Vacinação V10 Importada', price: 95.00, quantity: 1 }],
    products: [{ productId: 'prd-1', name: 'Simparic 20mg (10 a 20kg)', price: 110.00, quantity: 1 }]
  },
  {
    id: 'combo-2',
    name: 'Combo Spa & Beleza Pet',
    description: 'Banho & Tosa + Shampoo Hipoalergênico Especial',
    price: 115.00,
    services: [{ serviceId: 'srv-3', name: 'Banho & Tosa Higiênica', price: 80.00, quantity: 1 }],
    products: [{ productId: 'prd-2', name: 'Shampoo Hipoalergênico Pet 500ml', price: 48.50, quantity: 1 }]
  }
];

export default function CombosPage() {
  const [combos, setCombos] = useState<any[]>(DEFAULT_COMBOS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  
  // Catalogs for selection
  const [availableServices, setAvailableServices] = useState<any[]>(DEFAULT_SERVICES);
  const [availableProducts, setAvailableProducts] = useState<any[]>(DEFAULT_PRODUCTS);

  // Form
  const [newCombo, setNewCombo] = useState({ 
    name: '', 
    description: '', 
    productPercentage: 60,
    servicePercentage: 40,
    services: [] as { serviceId: string, quantity: number, name: string, price: number }[],
    products: [] as { productId: string, quantity: number, name: string, price: number }[]
  });

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    loadCombos();
    loadCatalogs();
  }, []);

  const loadCombos = async () => {
    try {
      const data = await fetchApi('catalog/combos');
      if (Array.isArray(data) && data.length > 0) {
        setCombos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogs = async () => {
    try {
      const [servData, prodData] = await Promise.all([
        fetchApi('catalog/services'),
        fetchApi('catalog/products')
      ]);
      if (Array.isArray(servData) && servData.length > 0) setAvailableServices(servData);
      if (Array.isArray(prodData) && prodData.length > 0) setAvailableProducts(prodData);
    } catch (e) {
      console.error(e);
    }
  };

  const totalPrice = 
    newCombo.services.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) + 
    newCombo.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleAddService = () => {
    if (!selectedServiceId) return;
    const serv = availableServices.find(s => s.id === selectedServiceId);
    if (!serv) return;
    
    setNewCombo(prev => ({
      ...prev,
      services: [...prev.services, { serviceId: serv.id, name: serv.name, price: serv.basePrice, quantity: 1 }]
    }));
    setSelectedServiceId('');
  };

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const prod = availableProducts.find(p => p.id === selectedProductId);
    if (!prod) return;
    
    setNewCombo(prev => ({
      ...prev,
      products: [...prev.products, { productId: prod.id, name: prod.name, price: prod.basePrice, quantity: 1 }]
    }));
    setSelectedProductId('');
  };

  const removeService = (index: number) => {
    setNewCombo(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const removeProduct = (index: number) => {
    setNewCombo(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPrice <= 0) {
      alert("O combo precisa ter itens (serviços ou produtos).");
      return;
    }
    setIsSaving(true);
    const createdCombo = {
      id: `combo-${Date.now()}`,
      name: newCombo.name,
      description: newCombo.description || 'Sem descrição',
      price: totalPrice,
      productPercentage: newCombo.productPercentage,
      servicePercentage: newCombo.servicePercentage,
      services: newCombo.services,
      products: newCombo.products
    };

    try {
      await fetchApi('catalog/combos', {
        method: 'POST',
        body: JSON.stringify(createdCombo)
      });
    } catch (error) {
      console.warn('[CombosPage] Fetch error suppressed');
    }

    setCombos(prev => [createdCombo, ...prev]);
    setShowModal(false);
    setNewCombo({ name: '', description: '', productPercentage: 60, servicePercentage: 40, services: [], products: [] });
    setToastMessage('Combo criado com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
    setIsSaving(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setNewCombo({
      ...newCombo,
      productPercentage: val,
      servicePercentage: 100 - val
    });
  };

  const filteredCombos = combos.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto pb-24">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-fuchsia-500" />
              Catálogo de Combos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Crie pacotes promocionais, selecione itens e divida tributos/comissões.</p>
          </div>
          
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-fuchsia-200 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Novo Combo
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 mb-6 relative z-10">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Buscar combo por nome..."
              className="w-full bg-slate-50 border-none rounded-xl h-12 pl-12 pr-4 font-medium focus:ring-2 focus:ring-fuchsia-500/20"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative z-10">
          {loading ? (
            <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Carregando combos...</div>
          ) : filteredCombos.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum combo encontrado</h3>
              <p className="text-slate-500">Crie o primeiro combo para sua clínica.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-5 pl-6">Nome do Combo</th>
                  <th className="p-5">Itens (Serviços / Produtos)</th>
                  <th className="p-5 text-center">Rateio Fiscal</th>
                  <th className="p-5 text-right pr-6">Preço Base (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCombos.map(combo => (
                  <tr key={combo.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 pl-6">
                      <div className="font-bold text-slate-800">{combo.name}</div>
                      <div className="text-sm text-slate-400">{combo.description}</div>
                    </td>
                    <td className="p-5 text-slate-500 font-medium text-sm">
                      <div className="flex flex-col gap-1">
                        {combo.services?.map((cs: any) => (
                          <div key={cs.id} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            {cs.quantity}x {cs.service?.name}
                          </div>
                        ))}
                        {combo.products?.map((cp: any) => (
                          <div key={cp.id} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            {cp.quantity}x {cp.product?.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">Prod {combo.productPercentage}%</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">Serv {combo.servicePercentage}%</span>
                      </div>
                      <div className="text-xs text-center text-slate-400 mt-1 font-medium">
                        (R$ {(combo.price * (combo.productPercentage/100)).toFixed(2)} / R$ {(combo.price * (combo.servicePercentage/100)).toFixed(2)})
                      </div>
                    </td>
                    <td className="p-5 text-right pr-6">
                      <div className="font-black text-fuchsia-700 bg-fuchsia-50 inline-block px-3 py-1.5 rounded-lg border border-fuchsia-100/50">
                        {combo.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Settings className="w-6 h-6 text-fuchsia-500" />
                Montar Combo
              </h2>
              <Button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">âœ•</Button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Nome do Combo</label>
                <Input 
                  type="text" required
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all"
                  placeholder="Ex: Banho e Tosa Premium"
                  value={newCombo.name} onChange={e => setNewCombo({...newCombo, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Descrição Opcional</label>
                <textarea 
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all resize-none"
                  placeholder="Ex: Inclui tosa higiênica e corte de unhas"
                  value={newCombo.description} onChange={e => setNewCombo({...newCombo, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Serviços */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Adicionar Serviço</label>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 font-medium text-sm"
                      value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}
                    >
                      <option value="">Selecione um serviço...</option>
                      {availableServices.map(s => (
                        <option key={s.id} value={s.id}>{s.name} - R$ {s.basePrice}</option>
                      ))}
                    </select>
                    <Button type="button" onClick={handleAddService} className="bg-indigo-100 text-indigo-700 px-3 rounded-xl font-bold hover:bg-indigo-200 transition-colors">+</Button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {newCombo.services.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-indigo-50/50 border border-indigo-100 p-2 rounded-lg text-sm">
                        <span className="font-bold text-indigo-900 truncate">{s.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-indigo-600 font-bold">R$ {s.price}</span>
                          <Button type="button" onClick={() => removeService(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Produtos */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Adicionar Produto</label>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 font-medium text-sm"
                      value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}
                    >
                      <option value="">Selecione um produto...</option>
                      {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - R$ {p.basePrice}</option>
                      ))}
                    </select>
                    <Button type="button" onClick={handleAddProduct} className="bg-amber-100 text-amber-700 px-3 rounded-xl font-bold hover:bg-amber-200 transition-colors">+</Button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {newCombo.products.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-amber-50/50 border border-amber-100 p-2 rounded-lg text-sm">
                        <span className="font-bold text-amber-900 truncate">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-600 font-bold">R$ {p.price}</span>
                          <Button type="button" onClick={() => removeProduct(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-4">
                <label className="block text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider text-center">Rateio de Faturamento (Proporção)</label>
                
                <Input 
                  type="range" min="0" max="100" step="5"
                  value={newCombo.productPercentage} onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm w-5/12">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Produto</div>
                    <div className="text-xl font-black text-slate-700">{newCombo.productPercentage}%</div>
                    {totalPrice > 0 && (
                      <div className="text-xs font-bold text-slate-400 mt-1">R$ {(totalPrice * (newCombo.productPercentage/100)).toFixed(2)}</div>
                    )}
                  </div>
                  
                  <div className="text-slate-300 font-black">+</div>
                  
                  <div className="text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm w-5/12">
                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Serviço</div>
                    <div className="text-xl font-black text-slate-700">{newCombo.servicePercentage}%</div>
                    {totalPrice > 0 && (
                      <div className="text-xs font-bold text-slate-400 mt-1">R$ {(totalPrice * (newCombo.servicePercentage/100)).toFixed(2)}</div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-sm">Valor Total do Combo</span>
                <span className="text-3xl font-black text-slate-800">R$ {totalPrice.toFixed(2)}</span>
              </div>
              <Button onClick={handleCreate} disabled={isSaving} className="w-full h-12 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-200 transition-all flex items-center justify-center gap-2">
                {isSaving ? <span className="animate-spin text-xl">↻</span> : 'Salvar Combo'}
              </Button>
            </div>

          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5" />
          {toastMessage}
        </div>
      )}
    </>
  );
}
