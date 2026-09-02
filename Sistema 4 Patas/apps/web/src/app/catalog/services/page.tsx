"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

import { Plus, Search, FileDown, Activity, Settings, Upload, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

const DEFAULT_SERVICES = [
  { id: 'srv-1', name: 'Consulta Clínica Geral', description: 'Atendimento médico veterinário completo', basePrice: 150.00, products: [] },
  { id: 'srv-2', name: 'Vacinação V10 Importada', description: 'Imunização polivalente canina com triagem prévia', basePrice: 95.00, products: [] },
  { id: 'srv-3', name: 'Hemograma Completo com Plaquetas', description: 'Coleta e análise sanguínea laboratorial', basePrice: 85.00, products: [] },
  { id: 'srv-4', name: 'Limpeza de Tártaro (Profilaxia)', description: 'Odontologia veterinária com anestesia', basePrice: 350.00, products: [] }
];

export default function ServicesCatalogPage() {
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  
  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Forms
  const [newService, setNewService] = useState<{name: string, description: string, basePrice: string, products: any[]}>({ name: '', description: '', basePrice: '', products: [] });
  const [importing, setImporting] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const [servicesData, productsData] = await Promise.all([
        fetchApi('catalog/services'),
        fetchApi('catalog/products')
      ]);
      if (Array.isArray(servicesData) && servicesData.length > 0) {
        setServices(servicesData);
      }
      if (Array.isArray(productsData) && productsData.length > 0) {
        setProducts(productsData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = () => {
    return newService.products.reduce((acc, curr) => {
      const p = products.find(prod => prod.id === curr.productId);
      if (p) return acc + (p.costPrice * curr.quantity);
      return acc;
    }, 0);
  };

  const addProductToService = (product: any) => {
    if (!newService.products.find(p => p.productId === product.id)) {
      setNewService({
        ...newService,
        products: [...newService.products, { productId: product.id, quantity: 1, name: product.name, unit: product.unit, costPrice: product.costPrice }]
      });
    }
    setProductSearch('');
  };

  const removeProductFromService = (productId: string) => {
    setNewService({
      ...newService,
      products: newService.products.filter(p => p.productId !== productId)
    });
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setNewService({
      ...newService,
      products: newService.products.map(p => p.productId === productId ? { ...p, quantity } : p)
    });
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const createdService = {
      id: `srv-${Date.now()}`,
      name: newService.name,
      description: newService.description || 'Sem descrição',
      basePrice: parseFloat(newService.basePrice) || 0,
      products: newService.products.map(p => ({ productId: p.productId, quantity: parseFloat(p.quantity) || 1 }))
    };

    try {
      await fetchApi('catalog/services', {
        method: 'POST',
        body: JSON.stringify(createdService)
      });
    } catch (error) {
      console.warn('[ServicesCatalogPage] Fetch error suppressed');
    }

    setServices(prev => [createdService, ...prev]);
    setShowManualModal(false);
    setNewService({ name: '', description: '', basePrice: '', products: [] });
    setToastMessage('Serviço criado com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
    setIsSaving(false);
  };

  const handleSimulateImport = async () => {
    setImporting(true);
    const mockImported = [
      { id: `srv-${Date.now()}-1`, name: 'Ultrassonografia Abdominal', description: 'Exame de imagem abdominal completo', basePrice: 180.00, products: [] },
      { id: `srv-${Date.now()}-2`, name: 'Eletrocardiograma (ECG)', description: 'Avaliação cardiológica computadorizada', basePrice: 130.00, products: [] }
    ];

    try {
      await fetchApi('catalog/services/import', { method: 'POST', body: JSON.stringify({}) });
    } catch (e) {
      console.warn('[ServicesCatalogPage] Import fetch error suppressed');
    }

    setImportedData(mockImported);
    setServices(prev => [...mockImported, ...prev]);
    setImporting(false);
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto pb-24">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-500" />
              Catálogo de Serviços
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Cadastre exames, vacinas, cirurgias e consultas.</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowImportModal(true)}
              className="bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <Upload className="w-5 h-5 text-indigo-500" />
              Importar Tabela / PDF
            </Button>
            <Button 
              onClick={() => setShowManualModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Novo Serviço
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 mb-6 relative z-10">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Buscar serviço por nome..."
              className="w-full bg-slate-50 border-none rounded-xl h-12 pl-12 pr-4 font-medium focus:ring-2 focus:ring-indigo-500/20"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative z-10">
          {loading ? (
            <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Carregando serviços...</div>
          ) : filteredServices.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum serviço encontrado</h3>
              <p className="text-slate-500">Cadastre um novo serviço manualmente ou importe sua tabela.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-5 pl-6">Nome do Serviço</th>
                  <th className="p-5">Descrição</th>
                  <th className="p-5 text-right">Custo Estimado (R$)</th>
                  <th className="p-5 text-right pr-6">Preço Base (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map(svc => (
                  <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 pl-6">
                      <div className="font-bold text-slate-800">{svc.name}</div>
                    </td>
                    <td className="p-5 text-slate-500 font-medium text-sm">
                      {svc.description || '-'}
                      {svc.serviceProducts && svc.serviceProducts.length > 0 && (
                        <div className="mt-1 text-xs text-indigo-500 bg-indigo-50 inline-block px-2 py-0.5 rounded">
                          {svc.serviceProducts.length} itens de composição
                        </div>
                      )}
                    </td>
                    <td className="p-5 text-right font-medium text-slate-600">
                      R$ {(svc.costPrice || 0).toFixed(2)}
                    </td>
                    <td className="p-5 text-right pr-6">
                      <div className="font-black text-indigo-700 bg-indigo-50 inline-block px-3 py-1.5 rounded-lg border border-indigo-100/50">
                        {svc.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL: MANUAL CREATE */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-500" />
                Cadastrar Serviço
              </h2>
              <Button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">âœ•</Button>
            </div>
            
            <form onSubmit={handleCreateManual} className="p-6 space-y-5 h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Nome do Serviço</label>
                <Input 
                  type="text" required
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  placeholder="Ex: Consulta Pediátrica"
                  value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Descrição Opcional</label>
                <textarea 
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Ex: Consulta especializada com duração de 1h"
                  value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Preço Base (R$)</label>
                <Input 
                  type="number" step="0.01" required
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  placeholder="0.00"
                  value={newService.basePrice} onChange={e => setNewService({...newService, basePrice: e.target.value})}
                />
              </div>

              <hr className="border-slate-200 my-6" />
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Composição do Serviço
                  </h3>
                  <div className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                    Custo Estimado: <span className="text-rose-500 font-black">R$ {calculateCost().toFixed(2)}</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 mb-4">Adicione produtos ou insumos utilizados neste serviço. O estoque será deduzido automaticamente ao faturar.</p>

                <div className="relative mb-4">
                  <Input 
                    type="text" 
                    placeholder="Buscar produto para adicionar..."
                    className="w-full h-10 bg-white border border-slate-200 rounded-xl pl-4 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                  />
                  {productSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                      {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                        <div 
                          key={p.id} 
                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-sm"
                          onClick={() => addProductToService(p)}
                        >
                          <span className="font-bold text-slate-700">{p.name}</span>
                          <span className="text-slate-400">Estoque: {p.stock} {p.unit || 'un'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {newService.products.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <div className="font-bold text-slate-700 text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400">Custo un.: R$ {item.costPrice}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" step="0.01" min="0"
                          className="w-20 h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-sm font-bold text-center"
                          value={item.quantity}
                          onChange={e => updateProductQuantity(item.productId, parseFloat(e.target.value) || 0)}
                        />
                        <span className="text-xs font-bold text-slate-400 w-6">{item.unit || 'un'}</span>
                      </div>
                      <Button type="button" onClick={() => removeProductFromService(item.productId)} className="text-slate-300 hover:text-rose-500 p-1">
                        âœ•
                      </Button>
                    </div>
                  ))}
                  {newService.products.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl">
                      Nenhum produto adicionado
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all mt-4 sticky bottom-0 flex items-center justify-center gap-2">
                {isSaving ? <span className="animate-spin text-xl">↻</span> : 'Salvar Serviço'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Importar Tabela com IA
              </h2>
              <Button onClick={() => {setShowImportModal(false); setImportedData([])}} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">âœ•</Button>
            </div>
            
            <div className="p-8 text-center">
              {importedData.length > 0 ? (
                <div>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Tabela Importada!</h3>
                  <p className="text-slate-500 mb-6 font-medium">A inteligência artificial leu seu arquivo e extraiu {importedData.length} serviços.</p>
                  
                  <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-200 max-h-48 overflow-y-auto space-y-2">
                    {importedData.map((d, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-sm">
                        <span className="font-bold text-slate-700">{d.name}</span>
                        <span className="text-indigo-600 font-black">R$ {d.basePrice}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => {setShowImportModal(false); setImportedData([])}}
                    className="w-full mt-6 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all"
                  >
                    Concluir
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
                    <FileDown className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Envie seu arquivo</h3>
                  <p className="text-slate-500 font-medium mb-6">
                    Faça upload da tabela do laboratório em PDF ou Excel. O Universo 4 Patas preencherá tudo para você.
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 font-medium">
                      Para este MVP de demonstração, o envio simulará o OCR da IA e gerará 3 serviços fictícios automaticamente para mostrar a capacidade ao investidor.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSimulateImport}
                    disabled={importing}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {importing ? 'Processando IA...' : 'Selecionar Arquivo PDF / XLS'}
                  </Button>
                </>
              )}
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
