"use client";
import { Input } from '@/components/ui/input';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PackagePlus, Save, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NewProductPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 1000);
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <PackagePlus className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">Produto Cadastrado!</h1>
        <p className="text-slate-500 font-medium text-lg">
          O item foi adicionado ao sistema com a localização específica e já pode ser incluído nas próximas contagens de estoque.
        </p>
        <Link href="/">
          <Button className="w-full h-14 text-lg font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-2xl mt-4">
            Voltar ao Início
          </Button>
        </Link>
        <Button onClick={() => setIsSaved(false)} variant="outline" className="w-full h-14 text-lg font-bold rounded-2xl">
          Cadastrar Outro Produto
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-3xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <PackagePlus className="w-7 h-7 text-blue-600" />
            Cadastrar Produto
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Adicione um novo item ao estoque e defina sua localização.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card className="border-slate-200 shadow-sm overflow-hidden mb-6 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Produto</label>
              <Input required type="text" placeholder="Ex: Seringa 3ml, Dipirona, Tapete Higiênico" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
              <select required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium appearance-none">
                <option value="">Selecione...</option>
                <option value="Medicamento">Medicamento</option>
                <option value="Consumível">Consumível</option>
                <option value="Fluido">Fluido / Soro</option>
                <option value="Higiene">Higiene / Limpeza</option>
                <option value="Alimentação">Alimentação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Unidade de Medida</label>
              <select required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium appearance-none">
                <option value="">Selecione...</option>
                <option value="unidades">Unidade</option>
                <option value="caixas">Caixa</option>
                <option value="ampolas">Ampola</option>
                <option value="frascos">Frasco</option>
                <option value="litros">Litro</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 mt-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-800">Localização no Estoque</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-6">Informe exatamente onde este produto deve ser guardado para facilitar a busca e a contagem.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sala / Setor</label>
                <Input required type="text" placeholder="Ex: Internação, Almoxarifado" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Armário / Estante</label>
                <Input type="text" placeholder="Ex: Armário A, Estante 2" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prateleira / Gaveta</label>
                <Input type="text" placeholder="Ex: Gaveta 3, Prateleira 2" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium" />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-14 font-black text-lg flex items-center gap-2 w-full md:w-auto shadow-lg shadow-emerald-200">
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isSaving ? 'Cadastrando...' : 'Cadastrar Produto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
