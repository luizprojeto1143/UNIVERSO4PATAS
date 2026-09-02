'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, MapPin, Phone, Users, CheckCircle2, Copy } from 'lucide-react';

export default function BranchesSettingsPage() {
  const branches = [
    { id: 1, name: 'Matriz (Centro)', status: 'active', address: 'Rua das Flores, 123 - São Paulo, SP', phone: '(11) 98765-4321', employees: 14 },
    { id: 2, name: 'Filial (Zona Sul)', status: 'active', address: 'Av. Paulista, 900 - São Paulo, SP', phone: '(11) 91234-5678', employees: 8 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Gestão Multi-Filiais
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Controle sua rede de clínicas. Cada filial tem estoque e caixa independentes.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 shadow-lg shadow-blue-200">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Filial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map(branch => (
          <Card key={branch.id} className="p-6 border-2 border-slate-200 hover:border-blue-300 transition-colors shadow-sm group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl border border-blue-100">
                  {branch.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{branch.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Operacional
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <Users className="w-5 h-5 text-slate-400 shrink-0" />
                <span>{branch.employees} funcionários alocados</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" className="flex-1 font-bold text-slate-600">Editar Dados</Button>
              <Button variant="outline" className="flex-1 font-bold text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                <Copy className="w-4 h-4 mr-2" /> Clonar Configurações
              </Button>
            </div>
          </Card>
        ))}

        <Card className="p-6 border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer min-h-[250px]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-sm border border-slate-200">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg">Abrir Nova Unidade</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">Expanda sua rede. O faturamento será consolidado automaticamente no DRE Matriz.</p>
        </Card>
      </div>

    </div>
  );
}
