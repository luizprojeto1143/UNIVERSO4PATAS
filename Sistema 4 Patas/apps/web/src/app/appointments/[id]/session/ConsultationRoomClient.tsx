"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Mic, Activity, Check, Plus, Package, Stethoscope, Save, Clock, History, FileText, Loader2, Sparkles } from "lucide-react";

export default function ConsultationRoomClient({ record }: { record: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [time, setTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [tutorReport, setTutorReport] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  
  // Vitals
  const [vitals, setVitals] = useState({ weight: '', temp: '', heartRate: '' });
  
  // Billing items
  const [billableItems, setBillableItems] = useState<{name: string, price: number, qty: number, type: 'service' | 'product' | 'combo'}[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState<'service' | 'product' | 'combo'>('service');
  const [newItemId, setNewItemId] = useState<string | undefined>(undefined);
  
  // Lab & Documents
  const [examType, setExamType] = useState('');
  const [requestedExams, setRequestedExams] = useState<{id: string, type: string, status: string}[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [generatedDocs, setGeneratedDocs] = useState<{id: string, title: string}[]>([]);
  
  // Catalogs for Autocomplete
  const [catalogItems, setCatalogItems] = useState<{id: string, name: string, price: number, type: 'service' | 'product' | 'combo'}[]>([]);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  
  // History
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Form saving state
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({show: false, message: '', type: 'success'});
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetchApi('documents/templates');
        setTemplates(res);
      } catch (e) {
        console.error('Erro ao carregar templates', e);
      }
    };
    
    const loadCatalogs = async () => {
      try {
        const [serv, prod, comb] = await Promise.all([
          fetchApi('catalog/services'),
          fetchApi('catalog/products'),
          fetchApi('catalog/combos')
        ]);
        const allItems = [
          ...serv.map((s: any) => ({ id: s.id, name: s.name, price: s.basePrice, type: 'service' as const })),
          ...prod.map((p: any) => ({ id: p.id, name: p.name, price: p.basePrice, type: 'product' as const })),
          ...comb.map((c: any) => ({ id: c.id, name: c.name, price: c.price, type: 'combo' as const }))
        ];
        setCatalogItems(allItems);
      } catch (e) {
        console.error('Erro ao carregar catálogos', e);
      }
    };

    loadTemplates();
    loadCatalogs();
  }, []);

  useEffect(() => {
    if (activeTab === 'history' && timeline.length === 0) {
      const loadHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetchApi(`clinical/patient/${record.patientId}/timeline`);
          setTimeline(res);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingHistory(false);
        }
      };
      loadHistory();
    }
  }, [activeTab, record.patientId, timeline.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    try {
      const res = await fetchApi(`clinical/transcribe`, { method: 'POST', body: JSON.stringify({}) });
      
      if (res.tutorReport) {
        setTutorReport(prev => prev + (prev ? '\n\n' : '') + res.tutorReport);
      }
      if (res.anamnesis) {
        setAnamnesis(prev => prev + (prev ? '\n\n' : '') + res.anamnesis);
      }
    } catch (e) {
      showToast("Erro na IA", "error");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAddBillableItem = async () => {
    if (!newItemName || !newItemPrice) return;
    const price = parseFloat(newItemPrice);
    
    // Save to DB immediately so it creates invoice
    try {
      await fetchApi(`clinical/records/${record.id}/items`, {
        method: 'POST',
        body: JSON.stringify({
          name: newItemName,
          unitPrice: price,
          quantity: 1,
          type: newItemType,
          itemId: newItemId
        })
      });
      
      setBillableItems([...billableItems, { name: newItemName, price, qty: 1, type: newItemType }]);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemId(undefined);
      showToast("Item adicionado com sucesso!");
    } catch (e) {
      showToast("Erro ao adicionar item", "error");
    }
  };

  const handleRequestExam = async () => {
    if (!examType) return;
    try {
      const res = await fetchApi(`clinical/${record.id}/exams`, {
        method: 'POST',
        body: JSON.stringify({ type: examType })
      });
      setRequestedExams([...requestedExams, res]);
      
      // Auto add to billing
      const price = 150.00;
      await fetchApi(`clinical/records/${record.id}/items`, {
        method: 'POST',
        body: JSON.stringify({
          name: `Exame: ${examType}`,
          unitPrice: price,
          quantity: 1,
          type: 'service'
        })
      });
      setBillableItems([...billableItems, { name: `Exame: ${examType}`, price, qty: 1, type: 'service' }]);

      setExamType('');
      showToast("Exame solicitado com sucesso!");
    } catch (e) {
      showToast('Erro ao solicitar exame', 'error');
    }
  };

  const handleSimulateExamResult = async (examId: string) => {
    try {
      await fetchApi(`clinical/exams/${examId}/result`, { method: 'PATCH' });
      setRequestedExams(requestedExams.map(ex => ex.id === examId ? { ...ex, status: 'completed' } : ex));
      showToast('Resultado do exame simulado com sucesso! Verifique a aba Histórico.');
    } catch (e) {
      showToast('Erro ao simular resultado', 'error');
    }
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplateId) return;
    const template = templates.find(t => t.id === selectedTemplateId);
    try {
      const res = await fetchApi(`clinical/${record.id}/documents`, {
        method: 'POST',
        body: JSON.stringify({ templateId: selectedTemplateId })
      });
      setGeneratedDocs([...generatedDocs, res]);
      setSelectedTemplateId('');
      showToast('Documento gerado com sucesso para assinatura do tutor!');
    } catch (e) {
      showToast('Erro ao gerar documento', 'error');
    }
  };

  const handleFinish = async (redirectToPdv: boolean = false) => {
    setSaving(true);
    try {
      // Save anamnesis
      if (anamnesis || tutorReport) {
        const fullDescription = [
          tutorReport ? `**Relato do Tutor:**\n${tutorReport}` : '',
          anamnesis ? `**Anamnese:**\n${anamnesis}` : ''
        ].filter(Boolean).join('\n\n');

        await fetchApi(`clinical/${record.id}/events`, {
          method: 'POST',
          body: JSON.stringify({
            type: 'anamnesis',
            title: 'Anamnese e Exame Clínico',
            description: fullDescription,
            data: JSON.stringify(vitals)
          })
        });
      }
      
      // Finish record
      await fetchApi(`clinical/records/${record.id}/finish`, { method: 'PATCH' });
      
      if (redirectToPdv) {
        router.push(`/financial/pdv?recordId=${record.id}`);
      } else {
        router.push(`/patients/${record.patientId}`);
      }
    } catch (e) {
      showToast("Erro ao finalizar", "error");
      setSaving(false);
    }
  };

  const patient = record.patient;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header Room */}
      <div className="bg-indigo-950 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center text-white mb-8 shadow-xl shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
            <span className="text-2xl font-black">{patient.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{patient.name}</h1>
            <p className="text-indigo-200 font-medium flex items-center gap-2 mt-1">
              {patient.species?.name} â€¢ {patient.breed?.name || 'SRD'} â€¢ Tutor: {patient.tutor?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-6 md:mt-0 relative z-10">
          <div className="text-right">
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Tempo de Sessão</p>
            <p className="text-2xl font-mono font-bold flex items-center gap-2 justify-end">
              <Clock className="w-5 h-5 text-indigo-400" />
              {formatTime(time)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => handleFinish(true)}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Finalizar & Faturar
            </Button>
            <Button 
              onClick={() => handleFinish(false)}
              disabled={saving}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm border border-white/20"
            >
              Apenas Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={() => setActiveTab('current')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'current' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          <Stethoscope className="w-5 h-5" /> Sessão Atual
        </Button>
        <Button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          <History className="w-5 h-5" /> Histórico do Paciente
        </Button>
      </div>

      {activeTab === 'current' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column (Scroll) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Assistant & Anamnesis */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-500" /> Anamnese
                </h2>
                
                <Button 
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${isTranscribing ? 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100'}`}
                >
                  {isTranscribing ? (
                    <><Mic className="w-4 h-4 animate-bounce" /> Ouvindo e Transcrevendo...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> IA: Ditar Anamnese</>
                  )}
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Relato do Responsável (Tutor)</label>
                  <textarea 
                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 leading-relaxed font-medium resize-none relative z-10"
                    placeholder="O que o tutor relatou sobre o problema, duração, hábitos..."
                    value={tutorReport}
                    onChange={(e) => setTutorReport(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Anamnese do Veterinário</label>
                  <textarea 
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 leading-relaxed font-medium resize-none relative z-10"
                    placeholder="Descreva as queixas, evolução e observações clínicas..."
                    value={anamnesis}
                    onChange={(e) => setAnamnesis(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-rose-500" /> Sinais Vitais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Peso (kg)</label>
                  <Input type="text" className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4 font-medium" placeholder="Ex: 4.5" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Temp. (Â°C)</label>
                  <Input type="text" className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4 font-medium" placeholder="Ex: 38.5" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Freq. Cardíaca</label>
                  <Input type="text" className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4 font-medium" placeholder="Ex: 110" value={vitals.heartRate} onChange={e => setVitals({...vitals, heartRate: e.target.value})} />
                </div>
              </div>
            </div>
            
            {/* Laboratory / Exams */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" /> Laboratório & Exames
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    className="flex-1 rounded-xl border-slate-200 bg-slate-50 h-12 px-4 font-medium text-sm" 
                    placeholder="Nome do Exame (ex: Hemograma Completo)" 
                    value={examType} 
                    onChange={e => setExamType(e.target.value)} 
                  />
                  <Button 
                    onClick={handleRequestExam}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Solicitar
                  </Button>
                </div>
                
                {requestedExams.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Exames Solicitados nesta sessão</p>
                    {requestedExams.map(ex => (
                      <div key={ex.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{ex.type}</p>
                          <p className={`text-[10px] font-bold uppercase ${ex.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {ex.status === 'completed' ? 'Resultado Pronto' : 'Aguardando Coleta'}
                          </p>
                        </div>
                        {ex.status !== 'completed' && (
                          <Button 
                            onClick={() => handleSimulateExamResult(ex.id)}
                            className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-indigo-600 hover:bg-indigo-50"
                          >
                            Simular Laudo
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clinical Documents */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-500" /> Documentos & Termos
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select 
                    className="flex-1 rounded-xl border-slate-200 bg-slate-50 h-12 px-4 font-medium text-sm"
                    value={selectedTemplateId}
                    onChange={e => setSelectedTemplateId(e.target.value)}
                  >
                    <option value="">Selecione um modelo de documento...</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <Button 
                    onClick={handleGenerateDocument}
                    className="bg-amber-500 hover:bg-amber-400 text-white px-8 h-12 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20"
                  >
                    <Check className="w-4 h-4" /> Gerar Documento
                  </Button>
                </div>

                {generatedDocs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Documentos Gerados</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedDocs.map(doc => (
                        <div key={doc.id} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                          <Check className="w-3 h-3" /> {doc.title} (Pendente Assinatura)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
          
          {/* Side Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Alerts */}
            {patient.alerts?.length > 0 && (
              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6">
                <h3 className="text-rose-800 font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Alertas Médicos
                </h3>
                <div className="space-y-2">
                  {patient.alerts.map((alert: any) => (
                    <div key={alert.id} className="bg-white/60 p-3 rounded-xl text-sm font-bold text-rose-700 shadow-sm border border-rose-100/50">
                      {alert.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing / Products Used */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" /> Consumo & Serviços
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Faturado nesta consulta</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {billableItems.length === 0 && <p className="text-sm text-slate-400 font-medium text-center py-4">Nenhum registro encontrado</p>}
                  {billableItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type === 'service' ? 'Serviço' : item.type === 'combo' ? 'Combo' : 'Produto'}</p>
                      </div>
                      <p className="font-black text-indigo-700">R$ {item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 border-dashed">
                  <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Adicionar Item</h4>
                  <div className="space-y-3 relative">
                    <Input 
                      type="text" 
                      placeholder="Busque Serviço, Produto ou Combo..." 
                      className="w-full text-sm rounded-xl border-slate-200 h-10 px-3 focus:ring-2 focus:ring-indigo-500" 
                      value={newItemName} 
                      onChange={e => {
                        setNewItemName(e.target.value);
                        setShowCatalogDropdown(true);
                      }}
                      onFocus={() => setShowCatalogDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCatalogDropdown(false), 200)}
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {showCatalogDropdown && newItemName.length > 0 && (
                      <div className="absolute top-10 left-0 w-full max-h-48 overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl z-50">
                        {catalogItems.filter(i => i.name.toLowerCase().includes(newItemName.toLowerCase())).map((item) => (
                          <div 
                            key={`${item.type}-${item.id}`} 
                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex justify-between items-center"
                            onClick={() => {
                              setNewItemName(item.name);
                              setNewItemPrice(item.price.toString());
                              setNewItemType(item.type);
                              setNewItemId(item.id);
                              setShowCatalogDropdown(false);
                            }}
                          >
                            <div>
                              <span className="text-sm font-bold text-slate-700 block">{item.name}</span>
                              <span className={`text-[10px] uppercase font-bold tracking-widest ${item.type === 'service' ? 'text-indigo-500' : item.type === 'combo' ? 'text-fuchsia-500' : 'text-amber-500'}`}>{item.type}</span>
                            </div>
                            <span className="font-black text-emerald-600 text-sm">R$ {item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <select className="w-1/2 text-sm rounded-xl border-slate-200 h-10 px-3" value={newItemType} onChange={e => setNewItemType(e.target.value as any)}>
                        <option value="service">Serviço</option>
                        <option value="product">Produto</option>
                        <option value="combo">Combo</option>
                      </select>
                      <Input type="number" placeholder="R$ 0,00" className="w-1/2 text-sm rounded-xl border-slate-200 h-10 px-3" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
                    </div>
                    <Button onClick={handleAddBillableItem} className="w-full bg-slate-800 text-white font-bold h-10 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm">
                      <Plus className="w-4 h-4" /> Lançar Item
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/60 min-h-[500px]">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" /> Histórico Clínico
          </h2>
          
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
              <p className="text-slate-500 font-medium">Buscando histórico completo...</p>
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
            </div>
          ) : (
            <div className="space-y-8">
              {timeline.map((session, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm">
                      {new Date(session.startedAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-slate-500 font-medium text-sm">
                      Atendido por <span className="font-bold text-slate-700">{session.veterinarian}</span>
                    </div>
                  </div>
                  
                  <div className="pl-6 border-l-2 border-indigo-100 space-y-6">
                    {session.events.length === 0 && <p className="text-sm text-slate-400">Nenhum evento registrado nesta sessão.</p>}
                    {session.events.map((event: any) => (
                      <div key={event.id} className="relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${event.color === 'green' ? 'bg-green-500' : event.color === 'amber' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-lg">{event.title}</h4>
                            <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg shadow-sm">{event.time}</span>
                          </div>
                          
                          {event.description && (
                            <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mt-2 bg-white/50 p-4 rounded-xl">{event.description}</p>
                          )}
                          
                          {event.metrics && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              {event.metrics.weight && (
                                <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Peso</span>
                                  <span className="font-bold text-slate-700">{event.metrics.weight}</span>
                                </div>
                              )}
                              {event.metrics.temperature && (
                                <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Temp</span>
                                  <span className="font-bold text-slate-700">{event.metrics.temperature}</span>
                                </div>
                              )}
                              {event.metrics.heartRate && (
                                <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase">BPM</span>
                                  <span className="font-bold text-slate-700">{event.metrics.heartRate}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <div className="w-5 h-5 text-red-600 font-bold text-center leading-5">X</div>}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
