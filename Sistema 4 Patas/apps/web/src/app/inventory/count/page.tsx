"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PackageCheck, Search, Filter, Save, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

const inventoryItems = [
  { id: 1, name: 'Seringa 3ml', category: 'Consumíveis', unit: 'unidades', location: 'Internação (Armário A, Gaveta 1)' },
  { id: 2, name: 'Seringa 5ml', category: 'Consumíveis', unit: 'unidades', location: 'Internação (Armário A, Gaveta 2)' },
  { id: 3, name: 'Agulha 25x7', category: 'Consumíveis', unit: 'unidades', location: 'Internação (Armário A, Gaveta 3)' },
  { id: 4, name: 'Dipirona Injetável', category: 'Medicamentos', unit: 'ampolas', location: 'Internação (Geladeira)' },
  { id: 5, name: 'Propofol 1%', category: 'Medicamentos', unit: 'frascos', location: 'Bloco Cirúrgico (Armário Principal)' },
  { id: 6, name: 'Tramadol Injetável', category: 'Medicamentos', unit: 'ampolas', location: 'Internação (Gaveta Trancada)' },
  { id: 7, name: 'Ringer Lactato 500ml', category: 'Fluidos', unit: 'bolsas', location: 'Almoxarifado (Prateleira 1)' },
  { id: 8, name: 'Soro Fisiológico 250ml', category: 'Fluidos', unit: 'bolsas', location: 'Almoxarifado (Prateleira 1)' },
  { id: 9, name: 'Tapete Higiênico', category: 'Higiene', unit: 'unidades', location: 'Recepção (Estante Baixa)' },
  { id: 10, name: 'Álcool 70%', category: 'Higiene', unit: 'litros', location: 'Todas as Salas' },
];

export default function InventoryCountPage() {
  const [counts, setCounts] = useState<Record<number, string>>({});
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['Todos', 'Consumíveis', 'Medicamentos', 'Fluidos', 'Higiene'];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCountChange = (id: number, value: string) => {
    setCounts(prev => ({ ...prev, [id]: value }));
  };

  const handleFinish = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsFinished(true);
    }, 1000);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">Contagem Salva!</h1>
        <p className="text-slate-500 font-medium text-lg">
          As quantidades dos produtos no estoque foram atualizadas automaticamente com base na sua contagem física.
        </p>
        <Link href="/">
          <Button className="w-full h-14 text-lg font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-2xl mt-4">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <PackageCheck className="w-7 h-7 text-emerald-600" />
              Auditoria de Estoque
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Contagem cega dos itens da internação.</p>
          </div>
        </div>
        <Button onClick={handleFinish} disabled={isSaving} className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-12 font-bold gap-2">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          {isSaving ? 'Salvando...' : 'Salvar Contagem'}
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
           {/* Search */}
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <Input 
               type="text" 
               placeholder="Buscar item..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
             />
           </div>
        </div>
        
        {/* Categories */}
        <div className="p-4 bg-white flex gap-2 overflow-x-auto hide-scrollbar border-b border-slate-100">
          {categories.map(cat => (
            <Button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                filterCategory === cat 
                ? 'bg-slate-800 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4">
               <div>
                 <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                 <div className="flex flex-wrap items-center gap-2 mt-2">
                   <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md uppercase tracking-wider">
                     {item.category}
                   </span>
                   <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                     {item.location}
                   </span>
                 </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0"
                      value={counts[item.id] || ''}
                      onChange={(e) => handleCountChange(item.id, e.target.value)}
                      placeholder="0"
                      className="w-24 h-12 px-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-black text-xl text-center text-emerald-700"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-500 w-16">{item.unit}</span>
               </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              Nenhum item encontrado para sua busca.
            </div>
          )}
        </div>
      </Card>

      {/* Mobile Sticky Button */}
      <div className="md:hidden sticky bottom-4">
         <Button onClick={handleFinish} disabled={isSaving} className="w-full shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 font-black text-lg flex items-center justify-center gap-2">
           {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
           {isSaving ? 'Salvando...' : 'Salvar Contagem'}
         </Button>
      </div>

    </div>
  );
}
