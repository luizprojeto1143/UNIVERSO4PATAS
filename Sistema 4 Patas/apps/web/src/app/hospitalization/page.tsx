'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Activity, 
  Clock, 
  Syringe, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  Stethoscope, 
  Droplet, 
  Loader2, 
  CheckCircle,
  FileText,
  Users,
  ShieldAlert,
  BedDouble
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function HospitalizationPage() {
  const [mainTab, setMainTab] = useState<'map' | 'schedule' | 'handovers'>('map');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'critical' | 'stable'>('all');
  
  const [beds, setBeds] = useState<any[]>([]);
  const [hospitalizations, setHospitalizations] = useState<any[]>([]);
  const [handovers, setHandovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewAdmission, setShowNewAdmission] = useState(false);
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [showNewHandover, setShowNewHandover] = useState(false);

  const [selectedHospId, setSelectedHospId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form states
  const [admissionForm, setAdmissionForm] = useState({
    patientId: '',
    bedId: '',
    veterinarianId: '',
    reason: '',
    isolation: false,
    expectedDischarge: '',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    hospitalizationId: '',
    medicationName: '',
    dosage: '',
    route: 'IV',
    frequencyInHours: 6,
    instructions: '',
  });

  const [handoverForm, setHandoverForm] = useState({
    hospitalizationId: '',
    shift: 'MANHA',
    patientStatus: 'ESTAVEL',
    summaryNotes: '',
  });

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bedsRes, hospRes, handoversRes] = await Promise.allSettled([
        api.get('/hospitalization/beds'),
        api.get('/hospitalization'),
        api.get('/hospitalization/shift-handovers'),
      ]);

      if (bedsRes.status === 'fulfilled' && Array.isArray(bedsRes.value?.data)) {
        setBeds(bedsRes.value.data);
      }
      if (hospRes.status === 'fulfilled' && Array.isArray(hospRes.value?.data)) {
        setHospitalizations(hospRes.value.data);
      }
      if (handoversRes.status === 'fulfilled' && Array.isArray(handoversRes.value?.data)) {
        setHandovers(handoversRes.value.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de internação:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdmitPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/hospitalization/admit', admissionForm);
      showToast('Admissão de internação registrada com sucesso!');
      setShowNewAdmission(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erro ao registrar admissão', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/hospitalization/prescriptions', prescriptionForm);
      showToast('Prescrição hospitalar e horários gerados com sucesso!');
      setShowNewPrescription(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erro ao criar prescrição', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/hospitalization/shift-handovers', handoverForm);
      showToast('Passagem de plantão registrada com sucesso!');
      setShowNewHandover(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erro ao registrar passagem de plantão', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminister = async (administrationId: string, status = 'ADMINISTERED') => {
    try {
      await api.post(`/hospitalization/administrations/${administrationId}`, { status });
      showToast('Checagem de medicação gravada!');
      fetchData();
    } catch (err: any) {
      showToast('Erro ao atualizar checagem de medicação', 'error');
    }
  };

  // Dados 100% reais consumidos da API (garantindo tipo Array)
  const displayHospitalizations = Array.isArray(hospitalizations) ? hospitalizations : [];

  return (
    <div className="pb-12 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-900 text-slate-100">
      
      {/* Header UTI / Hospitalar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-slate-800 rounded-xl shadow-sm border border-slate-700 hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-rose-500" /> UTI & Internação Hospitalar
            </h1>
            <p className="text-slate-400 font-medium mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema de Aprazamento & Passagem de Plantão
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowNewPrescription(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold transition-all"
          >
            <Syringe className="w-4 h-4 mr-2 text-indigo-400" /> Prescrição
          </Button>
          <Button 
            onClick={() => setShowNewHandover(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold transition-all"
          >
            <Users className="w-4 h-4 mr-2 text-amber-400" /> Plantão
          </Button>
          <Button 
            onClick={() => setShowNewAdmission(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-900/50 font-bold border-0 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Internação
          </Button>
        </div>
      </div>

      {/* Abas Principais */}
      <div className="flex gap-3 mb-8 bg-slate-800 p-2 rounded-2xl w-full border border-slate-700/60 overflow-x-auto">
        <Button 
          onClick={() => setMainTab('map')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${mainTab === 'map' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-transparent hover:bg-slate-700/50'}`}
        >
          <BedDouble className="w-4 h-4" /> Mapa de Leitos ({displayHospitalizations.length})
        </Button>
        <Button 
          onClick={() => setMainTab('schedule')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${mainTab === 'schedule' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-transparent hover:bg-slate-700/50'}`}
        >
          <Clock className="w-4 h-4" /> Grade de Aprazamento & Checagem
        </Button>
        <Button 
          onClick={() => setMainTab('handovers')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${mainTab === 'handovers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-transparent hover:bg-slate-700/50'}`}
        >
          <FileText className="w-4 h-4" /> Passagem de Plantão ({handovers.length})
        </Button>
      </div>

      {/* Conteúdo Aba 1: MAPA DE LEITOS */}
      {mainTab === 'map' && (
        <div className="space-y-6">
          {displayHospitalizations.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700/80 p-12 rounded-3xl text-center space-y-4">
              <BedDouble className="w-16 h-16 mx-auto text-slate-600" />
              <h3 className="text-xl font-black text-white">Nenhum paciente internado no momento</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                Os dados desta tela são 100% integrados à API e ao banco de dados SQLite/Prisma. Clique no botão abaixo para dar admissão ao primeiro paciente.
              </p>
              <Button 
                onClick={() => setShowNewAdmission(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-indigo-900/50"
              >
                <Plus className="w-4 h-4 mr-2" /> Realizar Primeira Admissão
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayHospitalizations.map((hosp: any) => (
              <Card key={hosp.id} className="p-0 overflow-hidden border-2 border-slate-700 bg-slate-800 rounded-3xl shadow-xl hover:border-indigo-500 transition-all">
                
                {/* Topo do Card */}
                <div className="p-5 bg-slate-850 border-b border-slate-700 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-white">{hosp.patient?.name || 'Paciente'}</h2>
                      {hosp.isolation && (
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold rounded-md flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> ISOLAMENTO
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-indigo-400 mt-0.5">
                      {hosp.patient?.species?.name} • {hosp.patient?.breed?.name || 'SRD'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Leito</span>
                    <span className="font-black text-xl text-amber-400">{hosp.bed?.name || 'Sem Leito'}</span>
                  </div>
                </div>

                {/* Info Médica */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Motivo / Quadro Clínico</span>
                    <p className="text-sm font-medium text-slate-200 mt-1 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                      {hosp.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-4 h-4 text-indigo-400" /> Resp: {hosp.veterinarian?.email?.split('@')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-400" /> Entrada: {new Date(hosp.admittedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Prescrições em andamento */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Medicações Ativas</span>
                    {hosp.prescriptions && hosp.prescriptions.length > 0 ? (
                      <div className="space-y-2">
                        {hosp.prescriptions.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-700/80 text-xs">
                            <span className="font-bold text-slate-200">{p.medicationName} ({p.dosage})</span>
                            <span className="px-2 py-1 bg-indigo-950 text-indigo-300 font-bold rounded-lg border border-indigo-800/50">
                              {p.frequencyInHours}h em {p.frequencyInHours}h
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Nenhuma medicação cadastrada</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Conteúdo Aba 2: GRADE DE APRAZAMENTO */}
      {mainTab === 'schedule' && (
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Grade de Horários e Checagem de Dose (Aprazamento)
          </h2>

          <div className="space-y-4">
            {displayHospitalizations.flatMap(h => (h.prescriptions || []).flatMap((p: any) => (p.administrations || []).map((admin: any) => ({
              ...admin,
              medicationName: p.medicationName,
              dosage: p.dosage,
              route: p.route,
              patientName: h.patient?.name || 'Paciente',
              bedName: h.bed?.name || 'Gaiola Geral',
            })))).map((item: any) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-700 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center font-mono font-black text-indigo-300 text-sm">
                    {new Date(item.scheduledTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{item.patientName} <span className="text-xs text-amber-400 font-medium">({item.bedName})</span></h3>
                    <p className="text-xs text-slate-400 font-medium">{item.medicationName} — <span className="text-indigo-400">{item.dosage} ({item.route})</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.status === 'ADMINISTERED' ? (
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/40 text-xs flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Administrado
                    </span>
                  ) : (
                    <Button 
                      onClick={() => handleAdminister(item.id, 'ADMINISTERED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs px-4 py-2 flex items-center gap-1.5"
                    >
                      <Droplet className="w-4 h-4" /> Confirmar Dose
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: PASSAGEM DE PLANTÃO */}
      {mainTab === 'handovers' && (
        <div className="space-y-4">
          {handovers.length > 0 ? (
            handovers.map((h: any) => (
              <Card key={h.id} className="p-6 bg-slate-800 border-slate-700 text-slate-100 rounded-3xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg border border-amber-500/40 text-xs">
                      PLANTÃO {h.shift}
                    </span>
                    <span className="font-bold text-white text-sm">Responsável: {h.author?.email}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-sm font-medium text-slate-200 bg-slate-900 p-4 rounded-2xl border border-slate-700/80">
                  {h.summaryNotes}
                </p>
              </Card>
            ))
          ) : (
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-500" />
              <p className="font-bold text-white">Nenhum registro de plantão anterior encontrado.</p>
              <p className="text-sm mt-1">Clique em "Plantão" no topo para registrar uma nova passagem de turno.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: NOVA INTERNAÇÃO */}
      {showNewAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5" /> Admissão de Paciente
              </h3>
            </div>
            <form onSubmit={handleAdmitPatient} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">ID do Paciente</label>
                <Input 
                  required
                  placeholder="ID do paciente cadastrado" 
                  value={admissionForm.patientId}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, patientId: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">ID do Veterinário Responsável</label>
                <Input 
                  required
                  placeholder="ID do veterinário" 
                  value={admissionForm.veterinarianId}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, veterinarianId: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Motivo / Quadro Clínico</label>
                <Input 
                  required
                  placeholder="Ex: Pós-cirúrgico, Desidratação, Suspeita de Parvovirose" 
                  value={admissionForm.reason}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, reason: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="isolationCheck"
                  checked={admissionForm.isolation}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, isolation: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded"
                />
                <label htmlFor="isolationCheck" className="text-sm font-bold text-slate-200">Requer Isolamento Infectocontagioso</label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowNewAdmission(false)} className="bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold rounded-xl">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6">
                  {isSubmitting ? 'Gravando...' : 'Admitir Paciente'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NOVA PRESCRIÇÃO HOSPITALAR */}
      {showNewPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 px-6 py-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Syringe className="w-5 h-5" /> Prescrição Médica Hospitalar
              </h3>
            </div>
            <form onSubmit={handleCreatePrescription} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">ID da Internação</label>
                <Input 
                  required
                  placeholder="ID da internação ativa" 
                  value={prescriptionForm.hospitalizationId}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, hospitalizationId: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Medicamento / Insumo</label>
                <Input 
                  required
                  placeholder="Ex: Dipirona, Furosemida, Ringer Lactato" 
                  value={prescriptionForm.medicationName}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicationName: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Dose / Volume</label>
                  <Input 
                    required
                    placeholder="Ex: 1ml, 25mg" 
                    value={prescriptionForm.dosage}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Via de Aplicação</label>
                  <select 
                    value={prescriptionForm.route}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, route: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white font-medium rounded-xl outline-none"
                  >
                    <option value="IV">IV (Intravenosa)</option>
                    <option value="SC">SC (Subcutânea)</option>
                    <option value="IM">IM (Intramuscular)</option>
                    <option value="VO">VO (Via Oral)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Intervalo de Aprazamento (Horas)</label>
                <select 
                  value={prescriptionForm.frequencyInHours}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequencyInHours: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white font-medium rounded-xl outline-none"
                >
                  <option value={4}>A cada 4 Horas (4/4h)</option>
                  <option value={6}>A cada 6 Horas (6/6h)</option>
                  <option value={8}>A cada 8 Horas (8/8h)</option>
                  <option value={12}>A cada 12 Horas (12/12h)</option>
                  <option value={24}>A cada 24 Horas (1x ao dia)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowNewPrescription(false)} className="bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold rounded-xl">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6">
                  {isSubmitting ? 'Gerando...' : 'Gerar Aprazamento'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PASSAGEM DE PLANTÃO */}
      {showNewHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-amber-600 px-6 py-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5" /> Registro de Passagem de Plantão
              </h3>
            </div>
            <form onSubmit={handleCreateHandover} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Turno do Plantão</label>
                <select 
                  value={handoverForm.shift}
                  onChange={(e) => setHandoverForm({ ...handoverForm, shift: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white font-medium rounded-xl outline-none"
                >
                  <option value="MANHA">Plantão Manhã</option>
                  <option value="TARDE">Plantão Tarde</option>
                  <option value="NOITE">Plantão Noturno / UTI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Resumo das Intercorrências & Condutas</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Relate os pacientes críticos, medicações administradas e intercorrências do turno..." 
                  value={handoverForm.summaryNotes}
                  onChange={(e) => setHandoverForm({ ...handoverForm, summaryNotes: e.target.value })}
                  className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-xl outline-none text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowNewHandover(false)} className="bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold rounded-xl">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl px-6">
                  {isSubmitting ? 'Registrando...' : 'Registrar Plantão'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'} text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5`}>
          <CheckCircle className="w-5 h-5" />
          {toast.message}
        </div>
      )}

    </div>
  );
}
