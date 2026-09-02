"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Zap, CheckCircle2, AlertCircle, RefreshCw, Server, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LaboratoryMachinesPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setToast({ show: true, message: 'Equipamento cadastrado com sucesso!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }, 1500);
  };
  const machines = [
    { name: 'IDEXX ProCyte Dx', type: 'Hematologia', status: 'connected', lastSync: 'Há 2 minutos', jobs: 12 },
    { name: 'IDEXX Catalyst One', type: 'Bioquímica', status: 'connected', lastSync: 'Há 5 minutos', jobs: 8 },
    { name: 'Mindray BC-2800 Vet', type: 'Hematologia', status: 'error', lastSync: 'Há 2 horas', jobs: 0 },
    { name: 'Abaxis VetScan VS2', type: 'Bioquímica', status: 'disconnected', lastSync: 'Ontem', jobs: 0 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/laboratory" className="hover:text-indigo-600">Laboratório</Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900">Equipamentos</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Integração de Equipamentos</h1>
          <p className="text-slate-500">Gerencie a conexão bidirecional com analisadores automatizados.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowModal(true)}>
          <Server className="w-4 h-4 mr-2" />
          Cadastrar Equipamento
        </Button>
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border bg-emerald-50 border-emerald-200 text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Cadastrar Equipamento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome/Modelo</label>
                <Input placeholder="Ex: IDEXX ProCyte Dx" className="w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Hematologia</option>
                  <option>Bioquímica</option>
                  <option>Urinálise</option>
                  <option>Outros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Protocolo de Comunicação</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>HL7 (TCP/IP)</option>
                  <option>ASTM (Serial/RS232)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Zap className="w-6 h-6 text-indigo-300" />
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                LIS Ativo
              </span>
            </div>
            <h3 className="text-2xl font-black mb-1">Servidor Universo 4 Patas LIS (Universal)</h3>
            <p className="text-indigo-200 text-sm max-w-lg mb-4">
              Nosso servidor LIS local escuta ativamente em portas de rede e portas seriais (RS232).
              Ele foi arquitetado para se conectar com <strong className="text-white">TODOS os equipamentos digitais do mercado</strong>.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono">HL7</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono">ASTM</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono">TCP/IP</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono">RS232 (Serial)</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50 border-indigo-100 flex items-center justify-center text-center p-6">
          <div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">Compatibilidade Total</h4>
            <p className="text-xs text-slate-500 font-medium">Idexx, Mindray, Abaxis, Sysmex, e dezenas de outros já homologados.</p>
          </div>
        </Card>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-4">Aparelhos Conectados</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {machines.map((machine, i) => (
          <Card key={i} className={`border-2 ${machine.status === 'connected' ? 'border-emerald-100' : machine.status === 'error' ? 'border-rose-100' : 'border-slate-200'}`}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-lg">{machine.name}</CardTitle>
                <CardDescription className="font-bold text-slate-500 mt-0.5">{machine.type}</CardDescription>
              </div>
              {machine.status === 'connected' && (
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
              )}
              {machine.status === 'error' && (
                <div className="bg-rose-50 p-2 rounded-lg text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {machine.status === 'disconnected' && (
                <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                  <WifiOff className="w-5 h-5" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mt-4">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-medium">Status</span>
                  {machine.status === 'connected' && <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Online</span>}
                  {machine.status === 'error' && <span className="text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Erro de Leitura</span>}
                  {machine.status === 'disconnected' && <span className="text-slate-500 font-bold flex items-center gap-1"><WifiOff className="w-3 h-3" /> Offline</span>}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-500 font-medium">Última Sincronização</span>
                  <span className="font-bold text-slate-900 flex items-center justify-end gap-1.5">
                    <RefreshCw className={`w-3 h-3 text-slate-400 ${machine.status === 'connected' ? 'animate-spin-slow' : ''}`} />
                    {machine.lastSync}
                  </span>
                </div>
              </div>

              {machine.status === 'connected' && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    <strong className="text-slate-900 text-sm">{machine.jobs}</strong> exames processados hoje
                  </span>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => {
                    setToast({ show: true, message: 'Abrindo configurações...' });
                    setTimeout(() => setToast({ show: false, message: '' }), 2000);
                  }}>Configurar</Button>
                </div>
              )}
              {machine.status === 'error' && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-rose-600 font-bold">Falha ao decodificar arquivo HL7.</span>
                  <Button variant="outline" size="sm" className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => {
                    setToast({ show: true, message: 'Visualizando logs...' });
                    setTimeout(() => setToast({ show: false, message: '' }), 2000);
                  }}>Ver Logs</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
