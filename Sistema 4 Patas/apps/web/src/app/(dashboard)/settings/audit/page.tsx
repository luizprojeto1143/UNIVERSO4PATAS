"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ShieldAlert, Search, Filter, Trash2, Edit, AlertOctagon, User, Clock, ChevronDown, Settings2 } from 'lucide-react';

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    { id: 1, type: 'critical', action: 'Exclusão de Conta a Receber', user: 'Recepção (Ana)', time: 'Há 5 min', ip: '192.168.1.15', details: 'Fatura #10294 (R$ 450,00) de Cliente: Roberto Silva.' },
    { id: 2, type: 'warning', action: 'Estoque Alterado Manualmente', user: 'Gerente (Carlos)', time: 'Há 45 min', ip: '192.168.1.20', details: 'Vacina V10: de 15 para 10 unidades (Motivo: Quebra).' },
    { id: 3, type: 'info', action: 'Nova Regra de Comissionamento', user: 'Diretoria', time: 'Há 2 horas', ip: '189.45.22.1', details: 'Comissão do Dr. João alterada de 40% para 45%.' },
    { id: 4, type: 'critical', action: 'Cancelamento de NF-e', user: 'Financeiro', time: 'Ontem, 18:30', ip: '192.168.1.33', details: 'Nota Fiscal #4492 cancelada após 24h.' },
    { id: 5, type: 'warning', action: 'Edição de Prontuário Antigo', user: 'Dr. Roberto', time: 'Ontem, 14:15', ip: '192.168.1.10', details: 'Adicionou observações na consulta do paciente Rex (Data orig: 10/05/2026).' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            Caixa Preta (Auditoria)
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Log imutável de segurança. Acompanhe ações críticas do sistema.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-rose-50 text-rose-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-rose-100 shadow-sm">
            <AlertOctagon className="w-5 h-5" />
            Acesso Restrito: CEO
          </div>
        </div>
      </div>

      <Card className="p-6 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Buscar por usuário, ação, paciente..." 
              className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex items-center justify-center gap-2 px-6 h-12 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filtros
          </Button>
        </div>

        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all group flex flex-col md:flex-row gap-4 md:items-center">
              
              <div className="flex-shrink-0 pt-1 md:pt-0">
                {log.type === 'critical' && <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><Trash2 className="w-6 h-6" /></div>}
                {log.type === 'warning' && <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Edit className="w-6 h-6" /></div>}
                {log.type === 'info' && <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Settings2 className="w-6 h-6" /></div>}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-800">{log.action}</h3>
                  {log.type === 'critical' && <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-black px-2 py-0.5 rounded">Crítico</span>}
                </div>
                <p className="text-sm text-slate-600 font-medium">{log.details}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{log.user}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{log.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono bg-slate-100 px-1.5 rounded">{log.ip}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 self-start md:self-center">
                <Button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>

            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
