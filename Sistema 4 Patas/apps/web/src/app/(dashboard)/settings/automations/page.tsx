"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Zap, Plus, ArrowRight, MessageCircle, Mail, AlertTriangle } from 'lucide-react';

export default function AutomationsPage() {
  const automations = [
    { 
      id: 1, 
      name: 'Retorno de Vacina V10', 
      trigger: 'Vacina V10 Aplicada', 
      condition: 'Aguardar 345 dias', 
      action: 'Enviar WhatsApp (Template: Lembrança Vacina)', 
      status: 'active',
      icon: <MessageCircle className="w-5 h-5 text-emerald-500" />
    },
    { 
      id: 2, 
      name: 'Ruptura de Estoque (Curva A)', 
      trigger: 'Produto Curva A', 
      condition: 'Estoque < 5 unidades', 
      action: 'Aviso Sistema para Gestor', 
      status: 'active',
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />
    },
    { 
      id: 3, 
      name: 'Boas-vindas Novo Paciente', 
      trigger: 'Cadastro Criado', 
      condition: 'Imediato', 
      action: 'Enviar E-mail Institucional', 
      status: 'inactive',
      icon: <Mail className="w-5 h-5 text-blue-500" />
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-600" />
            CRM & Automações
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Motor de regras (IFTTT). O sistema trabalha por você enquanto você atende.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 shadow-lg shadow-purple-200">
          <Plus className="w-4 h-4 mr-2" /> Nova Automação
        </Button>
      </div>

      <div className="space-y-4">
        {automations.map(auto => (
          <Card key={auto.id} className={`p-6 border-2 transition-all shadow-sm ${auto.status === 'active' ? 'border-slate-200 hover:border-purple-300' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-800">{auto.name}</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <Input type="checkbox" className="sr-only peer" checked={auto.status === 'active'} readOnly />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-bold bg-slate-50 border border-slate-100 p-4 rounded-xl">
              
              {/* Trigger */}
              <div className="flex-1 w-full flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider">SE (Gatilho)</p>
                  <p className="text-slate-700">{auto.trigger}</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-300 shrink-0 rotate-90 md:rotate-0" />

              {/* Condition */}
              <div className="flex-1 w-full flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider">E (Condição)</p>
                  <p className="text-slate-700">{auto.condition}</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-300 shrink-0 rotate-90 md:rotate-0" />

              {/* Action */}
              <div className="flex-1 w-full flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-50">
                  {auto.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider">ENTÃO (Ação)</p>
                  <p className="text-slate-700">{auto.action}</p>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
