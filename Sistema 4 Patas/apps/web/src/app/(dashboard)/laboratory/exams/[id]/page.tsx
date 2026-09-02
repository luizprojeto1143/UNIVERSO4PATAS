'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Microscope, ArrowLeft, ArrowUpCircle, ArrowDownCircle, CheckCircle2, FileSignature, Save, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LaboratoryExamResultPage({ params }: { params: { id: string } }) {
  // Mock Data: Hemograma Completo - Cão (Adulto)
  const exam = {
    id: params.id || 'REQ-8819',
    patient: 'Bob (Pug, 4 anos)',
    type: 'Hemograma Completo',
    species: 'Canina',
    date: '30/07/2026',
    doctor: 'Dra. Luiza',
  };

  const [results, setResults] = useState<Record<string, string>>({
    eritrocitos: '',
    hemoglobina: '',
    hematocrito: '',
    leucocitos: '',
    plaquetas: ''
  });

  const referenceRanges = {
    eritrocitos: { min: 5.5, max: 8.5, unit: 'x10^6/µL' },
    hemoglobina: { min: 12.0, max: 18.0, unit: 'g/dL' },
    hematocrito: { min: 37.0, max: 55.0, unit: '%' },
    leucocitos: { min: 6.0, max: 17.0, unit: 'x10^3/µL' },
    plaquetas: { min: 200, max: 500, unit: 'x10^3/µL' },
  };

  const handleInputChange = (field: string, value: string) => {
    setResults(prev => ({ ...prev, [field]: value }));
  };

  const checkStatus = (field: keyof typeof referenceRanges, val: string) => {
    if (!val) return 'empty';
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return 'empty';
    
    const range = referenceRanges[field];
    if (num < range.min) return 'low';
    if (num > range.max) return 'high';
    return 'normal';
  };

  const renderStatusIcon = (status: string) => {
    if (status === 'low') return <ArrowDownCircle className="w-5 h-5 text-rose-500 animate-pulse" />;
    if (status === 'high') return <ArrowUpCircle className="w-5 h-5 text-rose-500 animate-pulse" />;
    if (status === 'normal') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-200" />;
  };

  const [isSigned, setIsSigned] = useState(false);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Rascunho salvo com sucesso!');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border bg-emerald-50 border-emerald-200 text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Link href="/laboratory">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laudar Exame</h1>
            <p className="text-slate-500">Preenchimento de resultados e assinatura digital.</p>
          </div>
          {isSigned && (
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Assinado Digitalmente</p>
                <p className="text-sm font-medium text-emerald-900">Dra. Luiza (CRMV-SP 12345)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Requisição</p>
              <p className="font-mono text-sm font-bold text-slate-900">{exam.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Paciente</p>
              <p className="font-bold text-slate-900">{exam.patient}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Exame</p>
              <p className="font-bold text-indigo-700">{exam.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Referência Base</p>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                {exam.species} (Adulto)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Resultados: Eritrograma & Leucograma</CardTitle>
          <CardDescription>O sistema alertará automaticamente resultados fora do padrão de referência.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-500 font-bold border-b">
                <tr>
                  <th className="px-6 py-4">Parâmetro</th>
                  <th className="px-6 py-4 w-48">Resultado Obtido</th>
                  <th className="px-6 py-4">Unidade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Valor de Referência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(referenceRanges).map(([key, range]) => {
                  const status = checkStatus(key as keyof typeof referenceRanges, results[key]);
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  
                  return (
                    <tr key={key} className={`transition-colors ${status === 'high' || status === 'low' ? 'bg-rose-50/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4 font-bold text-slate-700">{label}</td>
                      <td className="px-6 py-4">
                        {isSigned ? (
                           <div className={`font-mono font-bold text-xl text-center py-2 ${status === 'high' || status === 'low' ? 'text-rose-600' : 'text-slate-800'}`}>
                             {results[key] || '-'}
                           </div>
                        ) : (
                          <Input 
                            value={results[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            placeholder="0.0"
                            className={`font-mono font-bold text-lg h-12 text-center transition-all ${status === 'high' || status === 'low' ? 'border-rose-400 text-rose-700 focus-visible:ring-rose-500 bg-white shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'border-slate-200'}`}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{range.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(status)}
                          {status === 'low' && <span className="text-xs font-bold text-rose-600">ABAIXO</span>}
                          {status === 'high' && <span className="text-xs font-bold text-rose-600">ACIMA</span>}
                          {status === 'normal' && <span className="text-xs font-bold text-emerald-600">NORMAL</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-500">
                        {range.min.toFixed(1)} a {range.max.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-2">Observações do Patologista (Sairá no Laudo)</label>
            <textarea 
              disabled={isSigned}
              className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Ex: Presença de hemácias policromáticas, sugestivo de resposta regenerativa..."
            ></textarea>
          </div>
        </CardContent>
      </Card>

      {!isSigned ? (
        <div className="flex justify-end gap-3 pb-12">
          <Button variant="outline" className="h-12 px-6" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? <span className="animate-spin mr-2 w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full"></span> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>
          <Button onClick={() => setIsSigningModalOpen(true)} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-base font-bold shadow-lg shadow-indigo-500/30">
            <FileSignature className="w-5 h-5 mr-2" />
            Assinar e Liberar Laudo
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-3 pb-12">
           <Link href="/laboratory">
            <Button variant="outline" className="h-12 px-8 font-bold border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
              Voltar para Fila de Exames
            </Button>
          </Link>
        </div>
      )}

      {isSigningModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-indigo-600" />
                Assinatura Digital (ICP-Brasil)
              </h2>
              <Button onClick={() => setIsSigningModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </Button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6">
                Para liberar o laudo <strong className="text-slate-900">{exam.id}</strong> para o prontuário do paciente, digite o PIN do seu certificado digital (e-CPF/CRMV-e).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Certificado Selecionado</label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-500 outline-none font-medium text-slate-700 bg-slate-50">
                    <option>Dra. Luiza - CRMV-SP 12345 (A3 Token)</option>
                    <option>Dra. Luiza - Gov.br (Nuvem)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">PIN do Token</label>
                  <Input 
                    type="password" 
                    placeholder="****"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-500 outline-none text-center tracking-widest text-lg font-mono"
                  />
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3">
                <Button type="button" onClick={() => setIsSigningModalOpen(false)} className="px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancelar</Button>
                <Button 
                  type="button" 
                  onClick={() => { setIsSigned(true); setIsSigningModalOpen(false); }} 
                  className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                >
                  Confirmar Assinatura
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
