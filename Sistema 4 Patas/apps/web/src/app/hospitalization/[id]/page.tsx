"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Clock, Pill, Activity, AlertTriangle, 
  CheckCircle, Plus, FileText, Droplets, HeartPulse, Camera,
  Smartphone, Thermometer, Battery, Flame, Share2, LogOut, 
  MessageSquare, Loader2, CheckCircle2, User, Sparkles, X,
  AlertCircle, ChevronRight, ShieldAlert, History, BedDouble
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useHospitalizationStore, KennelPatient, Medication, VitalRecord } from '@/store/useHospitalizationStore';

export default function HospitalizationNursingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const kennelId = resolvedParams.id;
  
  const { 
    kennels, 
    addVitalRecord, 
    addMedication, 
    toggleMedicationSlot, 
    updateFluidTherapy, 
    dischargePatient,
    updatePatientNotes
  } = useHospitalizationStore();

  const patient = kennels.find(k => k.kennelId === kennelId) || kennels[0];

  const [activeTab, setActiveTab] = useState<'rosto' | 'vitais' | 'suporte' | 'camera'>('rosto');
  const [showCodeBlue, setShowCodeBlue] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddVitalModal, setShowAddVitalModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDischarging, setIsDischarging] = useState(false);
  const [nurseName, setNurseName] = useState('Enf. Beatriz');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form State for new medication
  const [medForm, setMedForm] = useState({
    name: '',
    dose: '',
    route: 'IV' as 'IV' | 'SC' | 'IM' | 'PO' | 'Inalação' | 'Tópico',
    frequency: '8/8h',
    startTime: '08:00',
    notes: '',
    prescribedBy: patient?.attendingVet || 'Dra. Fernanda Silva'
  });

  // Form State for new vital signs
  const [vitalForm, setVitalForm] = useState({
    temperature: '38.5',
    heartRate: '110',
    respRate: '28',
    bloodPressure: '120/80',
    crt: '<2s',
    mucousMembranes: 'Normocorada',
    glucose: '100',
    glasgowPosture: 0,
    glasgowVocalization: 0,
    glasgowInteraction: 0,
    glasgowPalpation: 0,
    notes: '',
    recordedBy: nurseName
  });

  // Fluid therapy state
  const [fluidState, setFluidState] = useState({
    hasFluids: patient?.fluids?.hasFluids || false,
    solution: patient?.fluids?.solution || 'Ringer com Lactato',
    volumeTotalMl: patient?.fluids?.volumeTotalMl || 500,
    rateMlH: patient?.fluids?.rateMlH || 25,
    dropsPerMin: patient?.fluids?.dropsPerMin || 8,
    startedAt: patient?.fluids?.startedAt || '08:00'
  });

  const [nutritionNotes, setNutritionNotes] = useState(patient?.dietNotes || '');
  const [patientGeneralNotes, setPatientGeneralNotes] = useState(patient?.notes || '');

  // Code Blue Timer Logic
  const [cprTime, setCprTime] = useState(0);
  useEffect(() => {
    let interval: any;
    if (showCodeBlue) {
      interval = setInterval(() => setCprTime(t => t + 1), 1000);
    } else {
      setCprTime(0);
    }
    return () => clearInterval(interval);
  }, [showCodeBlue]);

  const formatCprTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Helper to generate time slots based on frequency
  const generateSlots = (freq: string, start: string) => {
    const [startH] = start.split(':').map(Number);
    const slots = [];
    let intervalHours = 8;
    if (freq === '4/4h') intervalHours = 4;
    else if (freq === '6/6h') intervalHours = 6;
    else if (freq === '8/8h') intervalHours = 8;
    else if (freq === '12/12h') intervalHours = 12;
    else if (freq === '24/24h') intervalHours = 24;
    else if (freq === 'Contínuo') return [{ time: 'Contínuo', status: 'pending' as const }];
    else if (freq === 'Dose Única') return [{ time: start, status: 'pending' as const }];

    const count = Math.floor(24 / intervalHours);
    for (let i = 0; i < count; i++) {
      const h = (startH + i * intervalHours) % 24;
      const formatted = `${h.toString().padStart(2, '0')}:00`;
      slots.push({ time: formatted, status: 'pending' as const });
    }
    return slots;
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medForm.name.trim() || !medForm.dose.trim()) {
      showToast('Preencha o nome do medicamento e a dosagem.');
      return;
    }

    const times = generateSlots(medForm.frequency, medForm.startTime);
    addMedication(patient.kennelId, {
      name: medForm.name,
      dose: medForm.dose,
      route: medForm.route,
      frequency: medForm.frequency,
      prescribedBy: medForm.prescribedBy,
      notes: medForm.notes,
      times
    });

    setShowAddMedModal(false);
    setMedForm({
      name: '',
      dose: '',
      route: 'IV',
      frequency: '8/8h',
      startTime: '08:00',
      notes: '',
      prescribedBy: patient.attendingVet
    });
    showToast(`Prescrição de ${medForm.name} incluída no aprazamento!`);
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPainScore = 
      Number(vitalForm.glasgowPosture) + 
      Number(vitalForm.glasgowVocalization) + 
      Number(vitalForm.glasgowInteraction) + 
      Number(vitalForm.glasgowPalpation);

    addVitalRecord(patient.kennelId, {
      temperature: parseFloat(vitalForm.temperature) || 38.5,
      heartRate: parseInt(vitalForm.heartRate) || 100,
      respRate: parseInt(vitalForm.respRate) || 24,
      bloodPressure: vitalForm.bloodPressure || '120/80',
      crt: vitalForm.crt,
      mucousMembranes: vitalForm.mucousMembranes,
      glucose: parseInt(vitalForm.glucose) || 100,
      painScore: totalPainScore,
      notes: vitalForm.notes,
      recordedBy: vitalForm.recordedBy || nurseName
    });

    setShowAddVitalModal(false);
    showToast('Sinais vitais e escala de dor registrados com sucesso!');
  };

  const handleSaveFluids = () => {
    const rate = parseFloat(fluidState.rateMlH.toString()) || 20;
    const total = parseFloat(fluidState.volumeTotalMl.toString()) || 500;
    const hoursRemaining = rate > 0 ? (total / rate).toFixed(1) : '0';

    updateFluidTherapy(patient.kennelId, {
      hasFluids: fluidState.hasFluids,
      solution: fluidState.solution,
      volumeTotalMl: total,
      rateMlH: rate,
      dropsPerMin: Math.round(rate / 3),
      startedAt: fluidState.startedAt,
      estimatedEnd: `Em aprox. ${hoursRemaining} horas`
    });

    showToast('Configurações de fluidoterapia atualizadas!');
  };

  const handleDischarge = () => {
    setIsDischarging(true);
    setTimeout(() => {
      dischargePatient(patient.kennelId);
      setIsDischarging(false);
      showToast('Alta médica efetuada. A baia foi colocada em estado de Higienização.');
      setTimeout(() => {
        window.location.href = '/hospitalization';
      }, 1200);
    }, 800);
  };

  const calculateRER = (weight: number) => {
    if (!weight || weight <= 0) return 0;
    return Math.round(70 * Math.pow(weight, 0.75));
  };

  // Safe checks if patient exists
  if (!patient || patient.status === 'free') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <BedDouble className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800">Baia {kennelId} está Livre</h2>
        <p className="text-slate-500 mt-2 mb-6">Nenhum paciente internado neste leito atualmente.</p>
        <Link href="/hospitalization">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold">
            Voltar ao Mapa de Internação
          </Button>
        </Link>
      </div>
    );
  }

  const latestVital = patient.vitalRecords && patient.vitalRecords.length > 0 ? patient.vitalRecords[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative pb-16">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-5 font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          {toastMessage}
        </div>
      )}

      {/* Code Blue Full Screen Modal */}
      {showCodeBlue && (
        <div className="fixed inset-0 bg-red-950 z-50 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-2 animate-pulse text-red-500 flex items-center gap-4">
            <ShieldAlert className="w-12 h-12" /> Código Azul (PCR)
          </h1>
          <h2 className="text-2xl font-bold mb-8 text-slate-200">
            Parada Cardiorrespiratória - {patient.name} (Baia {patient.kennelId})
          </h2>
          
          <div className="text-[8rem] md:text-[12rem] font-black leading-none font-mono tracking-tighter tabular-nums mb-10 text-white">
            {formatCprTime(cprTime)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl w-full">
            <div className={`p-8 rounded-3xl border-4 ${cprTime % 180 > 165 ? 'border-amber-400 bg-amber-400/20 animate-pulse' : 'border-slate-800 bg-slate-900'} text-center`}>
              <div className="text-5xl font-black mb-1">{3 - Math.floor((cprTime % 180) / 60)}m</div>
              <div className="font-bold text-slate-400 uppercase text-sm">Próxima Adrenalina (3-5 min)</div>
            </div>
            <div className={`p-8 rounded-3xl border-4 ${cprTime % 120 > 105 ? 'border-sky-400 bg-sky-400/20 animate-pulse' : 'border-slate-800 bg-slate-900'} text-center`}>
              <div className="text-5xl font-black mb-1">{2 - Math.floor((cprTime % 120) / 60)}m</div>
              <div className="font-bold text-slate-400 uppercase text-sm">Trocar Massagista (2 min)</div>
            </div>
          </div>

          <Button 
            onClick={() => setShowCodeBlue(false)} 
            className="bg-slate-800 hover:bg-slate-700 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-xl"
          >
            Encerrar Protocolo de Emergência
          </Button>
        </div>
      )}

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6" />
                <h3 className="text-xl font-black">Boletim / Diário do Pet</h3>
              </div>
              <button onClick={() => setShowWhatsAppModal(false)} className="text-emerald-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-500 mb-3 font-medium text-sm">
                Mensagem formatada para envio no WhatsApp do tutor (<strong>{patient.tutor}</strong>):
              </p>
              <textarea 
                className="w-full h-52 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 text-sm outline-none focus:border-emerald-500 resize-none"
                defaultValue={`🐾 Olá, ${patient.tutor}! Aqui é da equipe veterinária cuidando do ${patient.name}.\n\n📋 Resumo de hoje:\n• Temperatura: ${latestVital?.temperature || 38.5}°C (${latestVital?.temperature && latestVital.temperature > 39.2 ? 'Atenção / Febril' : 'Estável'})\n• Sinais Vitais: Frequência e pressão monitoradas\n• Alimentação: ${patient.dietNotes || 'Aceitando bem a dieta prescrita'}\n• Estado geral: Confortável e bem assistido pela enfermagem.\n\nQualquer novidade entraremos em contato! 💙🐾`}
              />
              <div className="flex justify-end gap-3 mt-5">
                <Button 
                  onClick={() => setShowWhatsAppModal(false)} 
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    showToast('Boletim enviado para a fila do WhatsApp com sucesso!');
                  }} 
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Enviar WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Sticky */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/hospitalization">
            <Button className="w-11 h-11 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-colors text-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm ${
              patient.critical ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {patient.kennelId}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 leading-tight">{patient.name}</h1>
                <span className="text-sm font-bold text-slate-400">({patient.species} • {patient.breed})</span>
                {patient.critical && (
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <HeartPulse className="w-3 h-3" /> Crítico
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-semibold text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase">{patient.wardLabel}</span>
                <span>• Peso: <strong className="text-slate-800">{patient.weight} kg</strong></span>
                <span>• Tutor: <strong className="text-slate-800">{patient.tutor}</strong></span>
                <span>• Vet: <strong className="text-indigo-600">{patient.attendingVet}</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <Button 
            onClick={() => setShowWhatsAppModal(true)} 
            className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 text-xs border border-emerald-200"
          >
            <Smartphone className="w-4 h-4" /> Diário Pet
          </Button>

          <Button 
            onClick={() => setShowCodeBlue(true)} 
            className="bg-red-50 text-red-700 font-bold px-4 py-2.5 rounded-xl hover:bg-red-100 hover:text-red-800 transition-colors flex items-center gap-2 text-xs border border-red-200 shadow-sm"
          >
            <HeartPulse className="w-4 h-4 text-red-600 animate-pulse" /> CÓDIGO AZUL
          </Button>

          <Button 
            onClick={handleDischarge}
            disabled={isDischarging}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs"
          >
            {isDischarging ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} 
            {isDischarging ? 'Processando...' : 'Dar Alta Médica'}
          </Button>
        </div>
      </div>

      {/* TABS Navigation */}
      <div className="px-4 md:px-8 mt-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-max">
          <TabBtn 
            active={activeTab === 'rosto'} 
            onClick={() => setActiveTab('rosto')} 
            label="Aprazamento & Medicações" 
            icon={<Clock className="w-4 h-4"/>}
            count={patient.medications.length}
          />
          <TabBtn 
            active={activeTab === 'vitais'} 
            onClick={() => setActiveTab('vitais')} 
            label="Sinais Vitais & Dor" 
            icon={<Activity className="w-4 h-4"/>}
            count={patient.vitalRecords.length}
          />
          <TabBtn 
            active={activeTab === 'suporte'} 
            onClick={() => setActiveTab('suporte')} 
            label="Suporte Avançado & RER" 
            icon={<Flame className="w-4 h-4"/>}
          />
          <TabBtn 
            active={activeTab === 'camera'} 
            onClick={() => setActiveTab('camera')} 
            label="Monitoramento Câmera IP" 
            icon={<Camera className="w-4 h-4"/>}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
        
        {/* --- TAB 1: APRAZAMENTO & MEDICAÇÕES --- */}
        {activeTab === 'rosto' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Quick Diagnostic Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diagnóstico & Conduta</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{patient.diagnosis}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{patient.notes}</p>
              </div>
              <Button 
                onClick={() => setShowAddMedModal(true)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-md flex items-center gap-2 text-sm shrink-0"
              >
                <Plus className="w-4 h-4" /> Nova Prescrição / Remédio
              </Button>
            </div>

            {/* Prescriptions & Slot Schedule */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-indigo-600" /> Grade de Aprazamento de Enfermagem (24h)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Clique no horário para checar a administração ou atualizar status</p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  Data: {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>

              {patient.medications.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Pill className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-bold text-slate-600">Nenhum medicamento prescrito ainda.</p>
                  <p className="text-xs text-slate-400 mt-1">Clique no botão &quot;Nova Prescrição&quot; acima para adicionar.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {patient.medications.map(med => (
                    <div key={med.id} className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 hover:bg-slate-50/40 transition-colors">
                      <div className="lg:w-1/3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Pill className="w-4 h-4" />
                          </div>
                          <h3 className="text-base font-black text-slate-900">{med.name}</h3>
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-0.5">
                          Dose: <span className="text-indigo-700">{med.dose}</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md uppercase font-bold text-slate-600">{med.route}</span>
                          <span>• {med.frequency}</span>
                          <span>• Vet: {med.prescribedBy.split(' ')[0]}</span>
                        </div>
                        {med.notes && (
                          <p className="text-xs text-slate-400 mt-2 italic">&quot;{med.notes}&quot;</p>
                        )}
                      </div>
                      
                      <div className="lg:w-2/3 flex flex-wrap gap-3 items-center">
                        {med.times.map((t, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => toggleMedicationSlot(patient.kennelId, med.id, idx, nurseName)}
                            className={`group relative border-2 rounded-2xl p-3.5 w-32 cursor-pointer transition-all hover:scale-105 select-none ${
                              t.status === 'done' 
                                ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' 
                                : t.status === 'late' 
                                ? 'border-red-400 bg-red-50/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse' 
                                : t.status === 'suspended'
                                ? 'border-slate-300 bg-slate-100 opacity-60'
                                : 'border-slate-200 bg-white hover:border-indigo-400'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`text-lg font-black mb-1.5 ${
                                t.status === 'done' ? 'text-emerald-700' : 
                                t.status === 'late' ? 'text-red-600 font-black' : 
                                t.status === 'suspended' ? 'text-slate-400 line-through' :
                                'text-slate-800'
                              }`}>
                                {t.time}
                              </div>
                              
                              {t.status === 'done' ? (
                                <div className="flex flex-col items-center">
                                  <CheckCircle className="w-5 h-5 text-emerald-600 mb-0.5" />
                                  <span className="text-[10px] font-bold text-emerald-800 truncate w-full">{t.signedBy || 'Checado'}</span>
                                  {t.checkedAt && <span className="text-[9px] text-emerald-600">{t.checkedAt}</span>}
                                </div>
                              ) : t.status === 'late' ? (
                                <div className="flex flex-col items-center">
                                  <AlertTriangle className="w-5 h-5 text-red-500 mb-0.5" />
                                  <span className="text-[10px] font-black text-red-600 uppercase">Atrasado</span>
                                  <span className="text-[9px] text-red-500">Checar Agora</span>
                                </div>
                              ) : t.status === 'suspended' ? (
                                <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Suspenso</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-400 mb-0.5 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Pendente</span>
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

          </div>
        )}

        {/* --- TAB 2: SINAIS VITAIS & DOR --- */}
        {activeTab === 'vitais' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Top Bar for Vitals */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <Activity className="w-6 h-6 text-indigo-600" /> Histórico & Monitoramento de Sinais Vitais
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Aferições periódicas de temperatura, FC, FR, pressão arterial, glicemia e escala de dor
                </p>
              </div>

              <Button 
                onClick={() => setShowAddVitalModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-md flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Nova Aferição
              </Button>
            </div>

            {/* Quick Metrics Banner */}
            {latestVital && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperatura</span>
                  <div className={`text-2xl font-black mt-1 ${
                    latestVital.temperature > 39.2 ? 'text-red-600' : latestVital.temperature < 37.5 ? 'text-sky-600' : 'text-slate-800'
                  }`}>
                    {latestVital.temperature}°C
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Ref: 38.0 - 39.2°C</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freq. Cardíaca</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{latestVital.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span></div>
                  <span className="text-[10px] font-bold text-slate-500">Ref: 70 - 140 bpm</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freq. Resp.</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{latestVital.respRate} <span className="text-xs font-normal text-slate-400">mpm</span></div>
                  <span className="text-[10px] font-bold text-slate-500">Ref: 18 - 34 mpm</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pressão Arterial</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{latestVital.bloodPressure}</div>
                  <span className="text-[10px] font-bold text-slate-500">PAS / PAD mmHg</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Glicemia</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{latestVital.glucose} <span className="text-xs font-normal text-slate-400">mg/dL</span></div>
                  <span className="text-[10px] font-bold text-slate-500">Ref: 70 - 140 mg/dL</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Escala Dor</span>
                  <div className={`text-2xl font-black mt-1 ${latestVital.painScore > 6 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {latestVital.painScore} / 24
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{latestVital.painScore > 6 ? 'Dor Moderada/Alta' : 'Confortável'}</span>
                </div>
              </div>
            )}

            {/* Vital Records Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Registros de Parâmetros Clínicos</span>
                <span>Total: {patient.vitalRecords.length} aferições</span>
              </div>

              {patient.vitalRecords.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-bold text-slate-600">Nenhum sinal vital registrado neste turno.</p>
                  <p className="text-xs text-slate-400 mt-1">Clique em &quot;Nova Aferição&quot; para registrar os parâmetros.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-wider">
                        <th className="py-3.5 px-6">Horário</th>
                        <th className="py-3.5 px-4">Temp (°C)</th>
                        <th className="py-3.5 px-4">FC (bpm)</th>
                        <th className="py-3.5 px-4">FR (mpm)</th>
                        <th className="py-3.5 px-4">PA</th>
                        <th className="py-3.5 px-4">TPC</th>
                        <th className="py-3.5 px-4">Mucosas</th>
                        <th className="py-3.5 px-4">Glicemia</th>
                        <th className="py-3.5 px-4">Dor (Glasgow)</th>
                        <th className="py-3.5 px-6">Responsável</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patient.vitalRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-black text-slate-900">{record.timestamp}</td>
                          <td className="py-4 px-4 font-bold">
                            <span className={record.temperature > 39.2 ? 'text-red-600 font-black' : record.temperature < 37.5 ? 'text-sky-600 font-black' : 'text-slate-800'}>
                              {record.temperature}°C
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">{record.heartRate}</td>
                          <td className="py-4 px-4 font-bold text-slate-800">{record.respRate}</td>
                          <td className="py-4 px-4 font-medium text-slate-700">{record.bloodPressure}</td>
                          <td className="py-4 px-4 font-medium text-slate-700">{record.crt}</td>
                          <td className="py-4 px-4 font-medium text-slate-700">{record.mucousMembranes}</td>
                          <td className="py-4 px-4 font-bold text-slate-800">{record.glucose} mg/dL</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                              record.painScore > 6 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {record.painScore} / 24
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs font-semibold text-slate-600">{record.recordedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 3: SUPORTE AVANÇADO --- */}
        {activeTab === 'suporte' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Bomba de Infusão */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
                      <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Bomba de Infusão Contínua</h3>
                      <p className="text-xs text-slate-400 font-medium">Controle volumétrico e taxa de infusão venosa</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={fluidState.hasFluids}
                      onChange={e => setFluidState({...fluidState, hasFluids: e.target.checked})}
                      className="w-5 h-5 text-sky-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">Ativa</span>
                  </label>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Solução / Soluto</label>
                    <Input 
                      value={fluidState.solution}
                      onChange={e => setFluidState({...fluidState, solution: e.target.value})}
                      className="bg-slate-50"
                      placeholder="Ex: Ringer com Lactato, NaCl 0.9%, Glicofisiológico"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Volume da Bolsa (ml)</label>
                      <Input 
                        type="number"
                        value={fluidState.volumeTotalMl}
                        onChange={e => setFluidState({...fluidState, volumeTotalMl: parseFloat(e.target.value) || 0})}
                        className="bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Vazão (ml/h)</label>
                      <Input 
                        type="number"
                        value={fluidState.rateMlH}
                        onChange={e => setFluidState({...fluidState, rateMlH: parseFloat(e.target.value) || 0})}
                        className="bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-sky-700 uppercase">Gotas / min (Equipo Macrogotas)</span>
                      <p className="text-2xl font-black text-sky-900 mt-0.5">
                        {Math.round((fluidState.rateMlH || 0) / 3)} gts/min
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-sky-700 uppercase">Tempo Restante Estimado</span>
                      <p className="text-2xl font-black text-sky-900 mt-0.5">
                        {fluidState.rateMlH > 0 ? `${(fluidState.volumeTotalMl / fluidState.rateMlH).toFixed(1)}h` : '0h'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveFluids}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md text-sm"
              >
                Salvar Parâmetros da Bomba
              </Button>
            </div>

            {/* Suporte Nutricional / RER */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Suporte Nutricional & RER</h3>
                    <p className="text-xs text-slate-400 font-medium">Cálculo de Necessidade Energética de Repouso</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 mb-6 shadow-md shadow-emerald-500/20">
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">
                    Fórmula RER (70 x peso^0.75) para {patient.weight} kg:
                  </p>
                  <div className="text-4xl font-black mt-2 flex items-baseline gap-2">
                    {calculateRER(patient.weight)} <span className="text-lg font-bold text-emerald-100">kcal / dia</span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-2">
                    Dividir em 3 a 4 refeições diárias (~{Math.round(calculateRER(patient.weight) / 3)} kcal/refeição).
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Prescrição e Ingestão Alimentar</label>
                  <textarea 
                    value={nutritionNotes}
                    onChange={e => setNutritionNotes(e.target.value)}
                    rows={3}
                    placeholder="Ex: Aceitou 1/2 lata de patê renal às 12h. Água oferecida em seringa..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-emerald-500 resize-none font-medium text-slate-800"
                  />
                </div>
              </div>

              <Button 
                onClick={() => {
                  updatePatientNotes(patient.kennelId, patient.notes, nutritionNotes);
                  showToast('Prescrição e anotações nutricionais salvas!');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md text-sm"
              >
                Salvar Anotações Nutricionais
              </Button>
            </div>

          </div>
        )}

        {/* --- TAB 4: CÂMERA IP / RTSP --- */}
        {activeTab === 'camera' && (
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-950 rounded-2xl aspect-video flex flex-col items-center justify-center text-slate-500 border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-white text-xs uppercase tracking-widest">AO VIVO • BAIA {patient.kennelId}</span>
              </div>
              <div className="absolute top-4 right-4 text-white text-xs font-mono opacity-60 bg-black/40 px-3 py-1 rounded-lg">
                Cam-{patient.kennelId} (1080p 30fps)
              </div>
              
              <Camera className="w-16 h-16 mb-3 opacity-40 group-hover:scale-110 transition-transform text-indigo-400" />
              <p className="font-bold text-slate-300 text-base">Câmera IP Vinculada ao Leito</p>
              <p className="text-xs mt-1 opacity-60 max-w-md text-center text-slate-400">
                O sinal de vídeo RTSP está pronto para transmissão no aplicativo do tutor e painel da UTI.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Modal Nova Prescrição */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 px-6 py-5 flex items-center justify-between text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Pill className="w-5 h-5" /> Nova Prescrição de Medicamento
              </h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-indigo-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Medicamento *</label>
                <Input 
                  value={medForm.name}
                  onChange={e => setMedForm({...medForm, name: e.target.value})}
                  placeholder="Ex: Tramadol, Dipirona, Cefazolina, Ondansetrona"
                  required
                  className="bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dosagem / Volume *</label>
                  <Input 
                    value={medForm.dose}
                    onChange={e => setMedForm({...medForm, dose: e.target.value})}
                    placeholder="Ex: 1.2 ml IV (25mg/kg)"
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Via de Aplicação</label>
                  <select 
                    value={medForm.route}
                    onChange={e => setMedForm({...medForm, route: e.target.value as any})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="IV">IV (Intravenosa)</option>
                    <option value="SC">SC (Subcutânea)</option>
                    <option value="IM">IM (Intramuscular)</option>
                    <option value="PO">PO (Oral)</option>
                    <option value="Inalação">Inalação</option>
                    <option value="Tópico">Tópico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Frequência (Intervalo)</label>
                  <select 
                    value={medForm.frequency}
                    onChange={e => setMedForm({...medForm, frequency: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="4/4h">4/4h (6x ao dia)</option>
                    <option value="6/6h">6/6h (4x ao dia)</option>
                    <option value="8/8h">8/8h (3x ao dia)</option>
                    <option value="12/12h">12/12h (2x ao dia)</option>
                    <option value="24/24h">24/24h (1x ao dia)</option>
                    <option value="Contínuo">Contínuo</option>
                    <option value="Dose Única">Dose Única</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Horário Inicial</label>
                  <Input 
                    type="time"
                    value={medForm.startTime}
                    onChange={e => setMedForm({...medForm, startTime: e.target.value})}
                    className="bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Observações de Administração</label>
                <Input 
                  value={medForm.notes}
                  onChange={e => setMedForm({...medForm, notes: e.target.value})}
                  placeholder="Ex: Administrar lentamente diluído em 10ml NaCl"
                  className="bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  Adicionar ao Aprazamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Aferição de Sinais Vitais */}
      {showAddVitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between text-white shrink-0">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Activity className="w-5 h-5" /> Aferição de Sinais Vitais & Escala Glasgow
              </h3>
              <button onClick={() => setShowAddVitalModal(false)} className="text-indigo-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVitals} className="p-6 md:p-8 overflow-y-auto space-y-5">
              
              {/* Parâmetros Vitais Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Temp (°C) *</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={vitalForm.temperature}
                    onChange={e => setVitalForm({...vitalForm, temperature: e.target.value})}
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">FC (bpm) *</label>
                  <Input 
                    type="number"
                    value={vitalForm.heartRate}
                    onChange={e => setVitalForm({...vitalForm, heartRate: e.target.value})}
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">FR (mpm) *</label>
                  <Input 
                    type="number"
                    value={vitalForm.respRate}
                    onChange={e => setVitalForm({...vitalForm, respRate: e.target.value})}
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PA (PAS/PAD)</label>
                  <Input 
                    value={vitalForm.bloodPressure}
                    onChange={e => setVitalForm({...vitalForm, bloodPressure: e.target.value})}
                    placeholder="120/80"
                    className="bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">TPC (Capilar)</label>
                  <select 
                    value={vitalForm.crt}
                    onChange={e => setVitalForm({...vitalForm, crt: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="<2s">&lt; 2 segundos (Normal)</option>
                    <option value="2s">2 segundos</option>
                    <option value=">2s">&gt; 2 segundos (Aumentado)</option>
                    <option value=">3s">&gt; 3 segundos (Choque)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Coloração Mucosas</label>
                  <select 
                    value={vitalForm.mucousMembranes}
                    onChange={e => setVitalForm({...vitalForm, mucousMembranes: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="Normocorada">Normocorada (Rosada)</option>
                    <option value="Pálida">Pálida</option>
                    <option value="Cianótica">Cianótica (Roxeada)</option>
                    <option value="Ictérica">Ictérica (Amarelada)</option>
                    <option value="Congesta">Congesta (Hiperêmica)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Glicemia (mg/dL)</label>
                  <Input 
                    type="number"
                    value={vitalForm.glucose}
                    onChange={e => setVitalForm({...vitalForm, glucose: e.target.value})}
                    className="bg-slate-50"
                  />
                </div>
              </div>

              {/* Escala de Dor de Glasgow */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-900 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-600" /> Escala Comportamental de Dor (Glasgow Short-Form)
                  </span>
                  <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                    Score: {Number(vitalForm.glasgowPosture) + Number(vitalForm.glasgowVocalization) + Number(vitalForm.glasgowInteraction) + Number(vitalForm.glasgowPalpation)} / 24
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">1. Postura do Animal (0-4)</label>
                    <select 
                      value={vitalForm.glasgowPosture}
                      onChange={e => setVitalForm({...vitalForm, glasgowPosture: Number(e.target.value)})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                    >
                      <option value={0}>0 - Relaxado / Confortável</option>
                      <option value={2}>2 - Inquieto / Tensa</option>
                      <option value={3}>3 - Encolhido / Posição de prece</option>
                      <option value={4}>4 - Rígido / Recusa em deitar</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">2. Vocalização (0-3)</label>
                    <select 
                      value={vitalForm.glasgowVocalization}
                      onChange={e => setVitalForm({...vitalForm, glasgowVocalization: Number(e.target.value)})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                    >
                      <option value={0}>0 - Silencioso</option>
                      <option value={1}>1 - Gemendo ocasionalmente</option>
                      <option value={2}>2 - Chorando / Uivando constante</option>
                      <option value={3}>3 - Rosnando / Gritando à aproximação</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">3. Interação / Atenção (0-4)</label>
                    <select 
                      value={vitalForm.glasgowInteraction}
                      onChange={e => setVitalForm({...vitalForm, glasgowInteraction: Number(e.target.value)})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                    >
                      <option value={0}>0 - Abana cauda / Atento e responsivo</option>
                      <option value={2}>2 - Desinteressado / Apático</option>
                      <option value={3}>3 - Ansioso / Assustado</option>
                      <option value={4}>4 - Deprimido / Não responsivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">4. Reação à Palpação da Lesão (0-3)</label>
                    <select 
                      value={vitalForm.glasgowPalpation}
                      onChange={e => setVitalForm({...vitalForm, glasgowPalpation: Number(e.target.value)})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                    >
                      <option value={0}>0 - Sem reação dolorosa</option>
                      <option value={1}>1 - Afasta a mão / Olha o local</option>
                      <option value={2}>2 - Grita / Tenta morder</option>
                      <option value={3}>3 - Defesa extrema / Não permite toque</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Observações da Aferição</label>
                <Input 
                  value={vitalForm.notes}
                  onChange={e => setVitalForm({...vitalForm, notes: e.target.value})}
                  placeholder="Ex: Paciente estava agitado durante aferição de PA..."
                  className="bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button"
                  onClick={() => setShowAddVitalModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  Salvar Aferição de Sinais Vitais
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function TabBtn({ active, onClick, label, icon, count }: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <Button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all ${
        active 
          ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40 bg-transparent'
      }`}
    >
      {icon} {label}
      {typeof count === 'number' && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
          active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
        }`}>
          {count}
        </span>
      )}
    </Button>
  );
}
