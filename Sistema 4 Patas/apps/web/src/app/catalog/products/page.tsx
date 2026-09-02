"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

import { Plus, Search, FileDown, Package, Settings, Upload, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

const DEFAULT_PRODUCTS = [
  { id: 'prd-1', name: 'Simparic 20mg (10 a 20kg)', costPrice: 65.00, basePrice: 110.00, stock: 25, unit: 'un', isSupply: false },
  { id: 'prd-2', name: 'Ração Royal Canin Medium Adult 15kg', costPrice: 280.00, basePrice: 389.90, stock: 12, unit: 'un', isSupply: false },
  { id: 'prd-3', name: 'Shampoo Hipoalergênico Pet 500ml', costPrice: 22.00, basePrice: 48.50, stock: 18, unit: 'un', isSupply: false },
  { id: 'prd-4', name: 'Seringa Descartável 3ml c/ Agulha', costPrice: 0.40, basePrice: 1.50, stock: 500, unit: 'un', isSupply: true },
  { id: 'prd-5', name: 'Algodão Hidrófilo Rolo 500g', costPrice: 15.00, basePrice: 29.90, stock: 30, unit: 'un', isSupply: true }
];

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Forms
  const [newProduct, setNewProduct] = useState({ 
    name: '', costPrice: '', basePrice: '', stock: '', unit: 'un',
    ncm: '', icms: '', cfopInsideState: '', cfopOutsideState: '', isSupply: false
  });
  const [importing, setImporting] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchApi('catalog/products');
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const createdItem = {
      id: `prd-${Date.now()}`,
      name: newProduct.name,
      costPrice: parseFloat(newProduct.costPrice) || 0,
      basePrice: parseFloat(newProduct.basePrice) || 0,
      stock: parseInt(newProduct.stock) || 0,
      unit: newProduct.unit,
      ncm: newProduct.ncm,
      icms: parseFloat(newProduct.icms) || 0,
      cfopInsideState: newProduct.cfopInsideState,
      cfopOutsideState: newProduct.cfopOutsideState,
      isSupply: newProduct.isSupply
    };

    try {
      await fetchApi('catalog/products', {
        method: 'POST',
        body: JSON.stringify(createdItem)
      });
    } catch (error) {
      console.warn('[ProductsCatalogPage] Fetch error suppressed');
    }

    setProducts(prev => [createdItem, ...prev]);
    setShowManualModal(false);
    setNewProduct({ 
      name: '', costPrice: '', basePrice: '', stock: '', unit: 'un',
      ncm: '', icms: '', cfopInsideState: '', cfopOutsideState: '', isSupply: false
    });
    setToastMessage('Produto criado com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
    setIsSaving(false);
  };

  const handleSimulateImport = async () => {
    setImporting(true);
    const mockImported = [
      { id: `prd-${Date.now()}-1`, name: 'Dipirona Gotas 20ml', costPrice: 8.50, basePrice: 24.90, stock: 50, unit: 'un', isSupply: false },
      { id: `prd-${Date.now()}-2`, name: 'Meloxicam 2.5mg (10 comprimidos)', costPrice: 18.00, basePrice: 42.00, stock: 35, unit: 'un', isSupply: false },
      { id: `prd-${Date.now()}-3`, name: 'Ataduras Cretan 10cm x 1.8m', costPrice: 1.20, basePrice: 4.50, stock: 120, unit: 'un', isSupply: true },
      { id: `prd-${Date.now()}-4`, name: 'Luva de Procedimento PP (Caixa 100un)', costPrice: 22.00, basePrice: 45.00, stock: 15, unit: 'un', isSupply: true }
    ];

    try {
      await fetchApi('catalog/products/import', { method: 'POST', body: JSON.stringify({}) });
    } catch (e) {
      console.warn('[ProductsCatalogPage] Import fetch error suppressed');
    }

    setImportedData(mockImported);
    setProducts(prev => [...mockImported, ...prev]);
    setImporting(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto pb-24">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-500" />
              Catálogo de Produtos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Cadastre medicamentos, rações, descartáveis e insumos.</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowImportModal(true)}
              className="bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <Upload className="w-5 h-5 text-indigo-500" />
              Importar XML / Tabela
            </Button>
            <Button 
              onClick={() => setShowManualModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 mb-6 relative z-10">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Buscar produto por nome..."
              className="w-full bg-slate-50 border-none rounded-xl h-12 pl-12 pr-4 font-medium focus:ring-2 focus:ring-indigo-500/20"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative z-10">
          {loading ? (
            <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Carregando produtos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum produto encontrado</h3>
              <p className="text-slate-500">Cadastre um novo produto manualmente ou importe uma nota fiscal (XML/PDF).</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-5 pl-6">Nome do Produto</th>
                  <th className="p-5 text-right">Custo</th>
                  <th className="p-5 text-right">Preço de Venda</th>
                  <th className="p-5 text-right pr-6">Estoque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 pl-6">
                      <div className="font-bold text-slate-800">{prod.name}</div>
                      {prod.isSupply && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase mt-1 inline-block">Uso Interno</span>}
                    </td>
                    <td className="p-5 text-right text-slate-500 font-medium text-sm">
                      {prod.costPrice ? prod.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                    </td>
                    <td className="p-5 text-right">
                      <div className="font-black text-indigo-700 bg-indigo-50 inline-block px-3 py-1.5 rounded-lg border border-indigo-100/50">
                        {prod.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </td>
                    <td className="p-5 text-right pr-6">
                      <div className={`font-bold inline-block px-3 py-1.5 rounded-lg border ${
                        prod.stock && prod.stock > 0 
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-100/50' 
                          : 'text-rose-700 bg-rose-50 border-rose-100/50'
                      }`}>
                        {prod.stock || 0} un
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
                Cadastrar Produto
              </h2>
              <Button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">âœ•</Button>
            </div>
            
            <form onSubmit={handleCreateManual} className="p-6 space-y-5 h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Nome do Produto</label>
                <Input 
                  type="text" required
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  placeholder="Ex: Vacina V10"
                  value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Custo (R$)</label>
                  <Input 
                    type="number" step="0.01" required
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="0.00"
                    value={newProduct.costPrice} onChange={e => setNewProduct({...newProduct, costPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Venda (R$)</label>
                  <Input 
                    type="number" step="0.01" required
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="0.00"
                    value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Estoque Inicial</label>
                  <Input 
                    type="number" required
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="0"
                    value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Unidade</label>
                  <select 
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="mg">Miligramas (mg)</option>
                    <option value="kg">Quilos (kg)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <Input 
                  type="checkbox" id="isSupply"
                  checked={newProduct.isSupply} onChange={e => setNewProduct({...newProduct, isSupply: e.target.checked})}
                  className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isSupply" className="text-sm font-bold text-indigo-900">Uso Interno (Insumo da clínica)</label>
              </div>

              <hr className="border-slate-200 my-4" />
              <h3 className="font-bold text-slate-800 flex items-center gap-2">Informações Fiscais</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">NCM</label>
                  <Input 
                    type="text"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="Ex: 3004.90.99"
                    value={newProduct.ncm} onChange={e => setNewProduct({...newProduct, ncm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">ICMS (%)</label>
                  <Input 
                    type="number" step="0.01"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="Ex: 18"
                    value={newProduct.icms} onChange={e => setNewProduct({...newProduct, icms: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">CFOP (Dentro do Estado)</label>
                  <Input 
                    type="text"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="Ex: 5102"
                    value={newProduct.cfopInsideState} onChange={e => setNewProduct({...newProduct, cfopInsideState: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">CFOP (Fora do Estado)</label>
                  <Input 
                    type="text"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="Ex: 6102"
                    value={newProduct.cfopOutsideState} onChange={e => setNewProduct({...newProduct, cfopOutsideState: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all mt-4 sticky bottom-0 flex items-center justify-center gap-2">
                {isSaving ? <span className="animate-spin text-xl">↻</span> : 'Salvar Produto'}
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
                Importar NF / Tabela
              </h2>
              <Button onClick={() => {setShowImportModal(false); setImportedData([])}} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">âœ•</Button>
            </div>
            
            <div className="p-8 text-center">
              {importedData.length > 0 ? (
                <div>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Produtos Importados!</h3>
                  <p className="text-slate-500 mb-6 font-medium">A inteligência artificial leu seu arquivo e extraiu {importedData.length} produtos.</p>
                  
                  <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-200 max-h-48 overflow-y-auto space-y-2">
                    {importedData.map((d, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-sm">
                        <span className="font-bold text-slate-700">{d.name}</span>
                        <div className="text-right">
                          <span className="text-slate-400 text-xs line-through mr-2">Custo: R$ {d.costPrice}</span>
                          <span className="text-indigo-600 font-black">Venda: R$ {d.basePrice}</span>
                        </div>
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
                    Faça upload da Nota Fiscal (XML/PDF) ou Tabela Excel. O sistema fará a entrada no estoque e ajuste de preços automaticamente.
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 font-medium">
                      Para este MVP de demonstração, o envio simulará o OCR da IA e fará o cadastro de 4 produtos fictícios para mostrar a capacidade ao investidor.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSimulateImport}
                    disabled={importing}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {importing ? 'Processando IA...' : 'Selecionar Arquivo PDF / XML / XLS'}
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
