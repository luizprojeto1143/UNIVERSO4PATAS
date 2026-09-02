"use client";
import { Button } from '@/components/ui/button';


import { Card } from '@/components/ui/card';
import { Package, Activity, Layers, AlertCircle, ShoppingCart, TrendingUp, Search, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CatalogHubPage() {
  return (
    <>
      <div className="p-8 max-w-7xl mx-auto pb-24">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-fuchsia-600" />
              Central de Catálogo
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Gestão centralizada de produtos, serviços e combos comerciais.</p>
          </div>
          
          <div className="flex gap-4">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              Automação de Compras (IA)
            </Button>
          </div>
        </div>

        {/* C-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="w-16 h-16 text-indigo-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Valor em Estoque</span>
              <span className="text-3xl font-black text-slate-800">R$ 42.150</span>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span>R$ 15k girando rápido</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-rose-100 bg-rose-50/30 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle className="w-16 h-16 text-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-2">Risco de Ruptura</span>
              <span className="text-3xl font-black text-slate-800">12 Itens</span>
              <div className="flex items-center gap-1 text-xs font-bold text-rose-600 mt-2">
                <span>Estoque abaixo do mínimo</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Serviço + Rentável</span>
              <span className="text-xl font-black text-slate-800 mt-1 truncate">TPLO (Ortopedia)</span>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 mt-3">
                <TrendingUp className="w-4 h-4" />
                <span>65% Margem de Lucro</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers className="w-16 h-16 text-fuchsia-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ticket Médio (Combos)</span>
              <span className="text-3xl font-black text-slate-800">R$ 850</span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mt-2">
                <span>Preventivos representam 40%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Pillars */}
        <h2 className="text-xl font-black text-slate-800 mb-4 mt-12">Módulos do Catálogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/catalog/products" className="block group">
            <Card className="p-6 h-full border-2 border-transparent hover:border-indigo-200 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-100/50 bg-gradient-to-b from-white to-indigo-50/30">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Produtos Físicos</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                Medicamentos, rações, cosméticos e insumos hospitalares com controle de ICMS e NCM.
              </p>
              <div className="flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                Gerenciar Produtos â†’
              </div>
            </Card>
          </Link>

          <Link href="/catalog/services" className="block group">
            <Card className="p-6 h-full border-2 border-transparent hover:border-blue-200 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-100/50 bg-gradient-to-b from-white to-blue-50/30">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Serviços Médicos</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                Consultas, cirurgias, exames e internação. Controle de custos por procedimento e impostos (ISS).
              </p>
              <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                Gerenciar Serviços â†’
              </div>
            </Card>
          </Link>

          <Link href="/catalog/combos" className="block group">
            <Card className="p-6 h-full border-2 border-transparent hover:border-fuchsia-200 transition-all cursor-pointer hover:shadow-xl hover:shadow-fuchsia-100/50 bg-gradient-to-b from-white to-fuchsia-50/30">
              <div className="w-14 h-14 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Combos & Pacotes</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                Agrupamentos comerciais (ex: Pacote Filhote) com divisão automática de impostos entre produtos e serviços.
              </p>
              <div className="flex items-center text-fuchsia-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                Montar Combos â†’
              </div>
            </Card>
          </Link>

        </div>

        {/* AI Suggestions Panel */}
        <div className="mt-12">
          <Card className="border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-5 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white tracking-wider">Ações Recomendadas (Inteligência Artificial)</h3>
            </div>
            <div className="p-0 divide-y divide-slate-100">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Estoque Baixo: Bravecto 10-20kg</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Restam apenas 2 unidades. A média de venda é de 5 unidades por semana.</p>
                  </div>
                </div>
                <Button className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100">
                  Gerar Pedido de Compra
                </Button>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Oportunidade de Precificação: Vacina V10</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Seu custo aumentou 12% no último XML importado, mas seu preço de venda não foi ajustado.</p>
                  </div>
                </div>
                <Button className="text-xs font-bold bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-indigo-700 hover:bg-indigo-100">
                  Ajustar Preço de Venda
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </>
  );
}
