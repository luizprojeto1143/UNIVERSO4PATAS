"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Wallet, Users, Settings2, Receipt, AlertCircle, Percent, ArrowRightLeft } from 'lucide-react';

export default function CommissionsSettingsPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'professionals'>('rules');
  const [discountCardFees, setDiscountCardFees] = useState(true);

  // Mock data for professionals
  const [professionals, setProfessionals] = useState([
    { id: 1, name: 'Dr. João (Clínico Geral)', productComm: 0, serviceExec: 40, serviceReq: 10 },
    { id: 2, name: 'Dra. Maria (Cirurgiã)', productComm: 0, serviceExec: 50, serviceReq: 5 },
    { id: 3, name: 'Dr. Roberto (Imaginologista)', productComm: 0, serviceExec: 30, serviceReq: 0 },
    { id: 4, name: 'Banho e Tosa (Equipe)', productComm: 10, serviceExec: 35, serviceReq: 0 },
  ]);

  const handleSave = () => {
    alert("Regras de comissionamento salvas com sucesso! As próximas vendas já utilizarão estas regras.");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            Central de Repasses
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Configuração avançada de comissionamento (Solicitante vs Executante).</p>
        </div>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 shadow-lg shadow-emerald-200">
          <Save className="w-4 h-4 mr-2" /> Salvar Regras
        </Button>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <Button 
          onClick={() => setActiveTab('rules')}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'rules' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Regras Globais
        </Button>
        <Button 
          onClick={() => setActiveTab('professionals')}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'professionals' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Comissões por Profissional
        </Button>
      </div>

      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-slate-400" />
              Descontos Financeiros
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Defina se a clínica deve absorver os custos bancários ou repassá-los antes de calcular a comissão do médico.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <p className="font-bold text-slate-800">Descontar taxa de Cartão/Boleto</p>
                <p className="text-xs text-slate-500 mt-1">Abate a taxa da maquininha antes de dividir o lucro.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <Input type="checkbox" className="sr-only peer" checked={discountCardFees} onChange={() => setDiscountCardFees(!discountCardFees)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            
            {discountCardFees && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Exemplo: Venda de R$ 100. Taxa de R$ 5. O médico receberá X% sobre R$ 95. A clínica não assume o prejuízo da taxa.</span>
              </div>
            )}
          </Card>

          <Card className="p-6 border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-slate-400" />
              Configurações Padrão
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Estas regras serão aplicadas a novos procedimentos e novos funcionários automaticamente.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Comissão Padrão de Produtos</span>
                <div className="relative">
                  <Input type="number" defaultValue={0} className="w-24 h-10 px-3 text-right bg-slate-50 border border-slate-200 rounded-lg font-bold" />
                  <Percent className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Comissão Padrão de Serviços</span>
                <div className="relative">
                  <Input type="number" defaultValue={30} className="w-24 h-10 px-3 text-right bg-slate-50 border border-slate-200 rounded-lg font-bold" />
                  <Percent className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'professionals' && (
        <Card className="p-6 border-slate-200 shadow-sm">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Tabela de Repasses por Profissional
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Configure as fatias de Solicitante (quem pede o exame) e Executante (quem faz o exame/serviço).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Profissional / Equipe</th>
                  <th className="p-4 text-center border-x border-slate-200 bg-blue-50/50">Produtos (Vitrine)</th>
                  <th className="p-4 text-center border-r border-slate-200 bg-purple-50/50" colSpan={2}>
                    <div className="mb-1 border-b border-purple-100 pb-1">Serviços e Exames (Clínica)</div>
                    <div className="flex justify-around text-[10px]">
                      <span>% Executante</span>
                      <span>% Solicitante</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {professionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800 text-sm">{prof.name}</td>
                    
                    {/* Produtos */}
                    <td className="p-4 border-x border-slate-100 bg-blue-50/10 align-middle">
                      <div className="flex justify-center">
                        <div className="relative">
                          <Input 
                            type="number" 
                            value={prof.productComm} 
                            onChange={(e) => setProfessionals(professionals.map(p => p.id === prof.id ? { ...p, productComm: Number(e.target.value) } : p))}
                            className="w-20 h-9 pl-7 pr-3 text-right bg-white border border-slate-200 rounded-md font-bold text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none" 
                          />
                          <Percent className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>
                    </td>

                    {/* Serviços Executante */}
                    <td className="p-4 bg-purple-50/10 align-middle">
                      <div className="flex justify-center">
                        <div className="relative">
                          <Input 
                            type="number" 
                            value={prof.serviceExec}
                            onChange={(e) => setProfessionals(professionals.map(p => p.id === prof.id ? { ...p, serviceExec: Number(e.target.value) } : p))}
                            className="w-20 h-9 pl-7 pr-3 text-right bg-white border border-slate-200 rounded-md font-bold text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none text-purple-700" 
                          />
                          <Percent className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-purple-400" />
                        </div>
                      </div>
                    </td>

                    {/* Serviços Solicitante */}
                    <td className="p-4 border-r border-slate-100 bg-purple-50/10 align-middle">
                      <div className="flex justify-center">
                        <div className="relative">
                          <Input 
                            type="number" 
                            value={prof.serviceReq}
                            onChange={(e) => setProfessionals(professionals.map(p => p.id === prof.id ? { ...p, serviceReq: Number(e.target.value) } : p))}
                            className="w-20 h-9 pl-7 pr-3 text-right bg-white border border-slate-200 rounded-md font-bold text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none text-indigo-700" 
                          />
                          <Percent className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-indigo-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3 text-sm font-medium text-indigo-800">
            <ArrowRightLeft className="w-5 h-5 shrink-0 text-indigo-500" />
            <p>
              <strong>Como funciona a divisão?</strong> Se o Dr. João solicita um Raio-X de R$ 200, ele recebe a fatia "Solicitante" (Ex: 10% = R$ 20). 
              O Dr. Roberto que realiza o exame, recebe a fatia "Executante" (Ex: 30% = R$ 60). A clínica retém o restante (R$ 120).
            </p>
          </div>
        </Card>
      )}

    </div>
  );
}
