"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Microscope, TestTube2, FlaskConical, AlertCircle, Clock, CheckCircle2, Search, ArrowRight, Printer, Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LaboratoryDashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };
  const queue = [
    { id: 'REQ-8821', patient: 'Thor (Golden Retriever)', exam: 'Hemograma Completo', status: 'coleta', time: '10 min atrás', priority: 'normal' },
    { id: 'REQ-8820', patient: 'Mia (Siamês)', exam: 'Bioquímico (Renal)', status: 'analise', time: '45 min atrás', priority: 'urgente' },
    { id: 'REQ-8819', patient: 'Bob (Pug)', exam: 'Urinálise', status: 'laudo', time: '2 horas atrás', priority: 'normal' },
    { id: 'REQ-8815', patient: 'Luna (SRD)', exam: 'Citologia de Ouvido', status: 'analise', time: '3 horas atrás', priority: 'normal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centro de Diagnóstico LIS</h1>
          <p className="text-slate-500">Gestão de coletas, análises e liberação de laudos (Sistema de Informação Laboratorial).</p>
        </div>
        <div className="flex gap-2">
          <Link href="/laboratory/machines">
            <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
              <Activity className="w-4 h-4 mr-2" />
              Integração de Máquinas
            </Button>
          </Link>
          <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido Avulso
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Aguardando Coleta</CardTitle>
            <TestTube2 className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">12</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Pacientes na recepção/internação</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Em Análise (Máquinas)</CardTitle>
            <FlaskConical className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">8</div>
            <p className="text-xs text-blue-600 font-medium mt-1">Processando resultados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-purple-700">Para Laudar (Assinar)</CardTitle>
            <Microscope className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">3</div>
            <p className="text-xs text-purple-600 font-medium mt-1">Resultados prontos para revisão</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Liberados (Hoje)</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">45</div>
            <p className="text-xs text-slate-500 font-medium mt-1">SLA médio: 2h 15m</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-4 border-b">
          <div>
            <CardTitle>Fila de Trabalho</CardTitle>
            <CardDescription>Gerencie o fluxo de exames desde a coleta até a assinatura do laudo.</CardDescription>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar requisição, paciente..." className="pl-9 bg-slate-50" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Requisição</th>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Exame(s)</th>
                  <th className="px-6 py-4">Status / Fase</th>
                  <th className="px-6 py-4">Tempo Espera</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium bg-slate-50/50">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  queue.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{req.id}</div>
                        {req.priority === 'urgente' && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-black text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded mt-1">
                            <AlertCircle className="w-3 h-3" /> Urgência
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{req.patient}</td>
                      <td className="px-6 py-4 text-slate-600">{req.exam}</td>
                      <td className="px-6 py-4">
                        {req.status === 'coleta' && (
                          <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-fit">
                            <TestTube2 className="w-3.5 h-3.5" /> Aguardando Coleta
                          </span>
                        )}
                        {req.status === 'analise' && (
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-fit">
                            <FlaskConical className="w-3.5 h-3.5" /> Em Análise (Aparelho)
                          </span>
                        )}
                        {req.status === 'laudo' && (
                          <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-fit">
                            <Microscope className="w-3.5 h-3.5" /> Digitar / Assinar Laudo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Clock className="w-4 h-4" />
                          {req.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'coleta' && (
                          <Button variant="outline" size="sm" className="font-bold" onClick={() => {
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 3000);
                          }}>Confirmar Coleta</Button>
                        )}
                        {req.status === 'analise' && (
                          <Button variant="ghost" size="sm" className="text-slate-400">Aguardando...</Button>
                        )}
                        {req.status === 'laudo' && (
                          <Link href={`/laboratory/exams/${req.id}`}>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold">
                              Digitar Resultados <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Nova Solicitação de Exame</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                <Input placeholder="Selecione ou digite o paciente..." className="rounded-lg border border-gray-200 px-4 py-2 w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Exame</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                  <option>Hemograma Completo</option>
                  <option>Bioquímico (Renal)</option>
                  <option>Bioquímico (Hepático)</option>
                  <option>Urinálise</option>
                  <option>Citologia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Urgência</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                  <option>Normal</option>
                  <option>Urgente (SLA 2h)</option>
                  <option>Emergência (Imediato)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar Pedido'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Pedido criado com sucesso!</span>
        </div>
      )}
    </div>
  );
}


