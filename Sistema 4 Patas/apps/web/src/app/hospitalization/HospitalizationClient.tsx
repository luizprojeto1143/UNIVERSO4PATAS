"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Activity, AlertTriangle, Bed, HeartPulse, Stethoscope, 
  Thermometer, Info, Settings, Search, Filter, Plus, Droplets, 
  Pill, RefreshCcw, CheckCircle, Loader2, Sparkles, User, Phone, CheckCircle2,
  Clock, ShieldAlert, ArrowRight, FileText
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useHospitalizationStore, KennelPatient } from '@/store/useHospitalizationStore';

export default function HospitalizationClient() {
  const { kennels, admitPatient, setKennelCleaning, setKennelFree, activeDoctors } = useHospitalizationStore();
  const [activeWard, setActiveWard] = useState<'all' | 'dogs' | 'cats' | 'icu' | 'isolation'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAdmission, setShowNewAdmission] = useState(false);
  const [selectedKennelForAdmission, setSelectedKennelForAdmission] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form State for new admission
  const [admissionForm, setAdmissionForm] = useState({
    name: '',
    species: 'Cão' as 'Cão' | 'Gato' | 'Silvestre' | 'Outro',
    breed: '',
    tutor: '',
    tutorPhone: '',
    weight: '',
    diagnosis: '',
    attendingVet: activeDoctors[0] || 'Dra. Fernanda Silva',
    kennelId: '',
    critical: false,
    notes: '',
    dietNotes: '',
    hasFluids: false,
    fluidSolution: 'Ringer com Lactato',
    fluidRate: '20'
  });

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleOpenAdmission = (preselectedKennel?: string) => {
    const availableKennels = kennels.filter(k => k.status === 'free');
    const targetKennel = preselectedKennel || (availableKennels.length > 0 ? availableKennels[0].kennelId : 'B01');
    
    setAdmissionForm({
      name: '',
      species: targetKennel.startsWith('C') ? 'Gato' : 'Cão',
      breed: '',
      tutor: '',
      tutorPhone: '',
      weight: '',
      diagnosis: '',
      attendingVet: activeDoctors[0] || 'Dra. Fernanda Silva',
      kennelId: targetKennel,
      critical: targetKennel.includes('UTI') || targetKennel.includes('ISO'),
      notes: '',
      dietNotes: '',
      hasFluids: false,
      fluidSolution: 'Ringer com Lactato',
      fluidRate: '25'
    });
    setShowNewAdmission(true);
  };

  const handleSaveAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionForm.name.trim() || !admissionForm.tutor.trim() || !admissionForm.kennelId) {
      showToast('Preencha os campos obrigatórios (Nome do Pet, Tutor e Baia).', 'error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const targetKennelData = kennels.find(k => k.kennelId === admissionForm.kennelId);
      const ward = targetKennelData ? targetKennelData.ward : (admissionForm.kennelId.startsWith('C') ? 'cats' : admissionForm.kennelId.includes('UTI') ? 'icu' : admissionForm.kennelId.includes('ISO') ? 'isolation' : 'dogs');
      const wardLabel = ward === 'cats' ? 'GATOS' : ward === 'icu' ? 'UTI' : ward === 'isolation' ? 'ISOLAMENTO' : 'CÃES';

      admitPatient({
        kennelId: admissionForm.kennelId,
        name: admissionForm.name,
        species: admissionForm.species,
        breed: admissionForm.breed || 'SRD',
        tutor: admissionForm.tutor,
        tutorPhone: admissionForm.tutorPhone,
        weight: parseFloat(admissionForm.weight) || 5,
        diagnosis: admissionForm.diagnosis || 'Em investigação clínica',
        attendingVet: admissionForm.attendingVet,
        admissionDate: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        critical: admissionForm.critical,
        ward,
        wardLabel,
        notes: admissionForm.notes || 'Paciente admitido na internação.',
        dietNotes: admissionForm.dietNotes,
        fluids: {
          hasFluids: admissionForm.hasFluids,
          solution: admissionForm.fluidSolution,
          volumeTotalMl: 500,
          rateMlH: parseFloat(admissionForm.fluidRate) || 20,
          dropsPerMin: Math.round((parseFloat(admissionForm.fluidRate) || 20) / 3),
          startedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        },
        medications: []
      });

      setIsSaving(false);
      setShowNewAdmission(false);
      showToast(`Admissão de ${admissionForm.name} registrada com sucesso na Baia ${admissionForm.kennelId}!`);
    }, 600);
  };

  // Stats Calculations
  const totalOccupied = kennels.filter(k => k.status === 'occupied').length;
  const totalKennels = kennels.length;
  const criticalCount = kennels.filter(k => k.status === 'occupied' && k.critical).length;
  
  let lateMedsCount = 0;
  kennels.filter(k => k.status === 'occupied').forEach(k => {
    k.medications.forEach(m => {
      m.times.forEach(t => {
        if (t.status === 'late') lateMedsCount++;
      });
    });
  });

  const fluidsCount = kennels.filter(k => k.status === 'occupied' && k.fluids.hasFluids).length;

  // Filtering
  const filteredKennels = kennels
    .filter(k => activeWard === 'all' || k.ward === activeWard)
    .filter(k => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        k.kennelId.toLowerCase().includes(term) ||
        k.name.toLowerCase().includes(term) ||
        k.tutor.toLowerCase().includes(term) ||
        k.diagnosis.toLowerCase().includes(term)
      );
    });

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bed className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Mapa de Internação & UTI
              </h1>
              <p className="text-slate-500 font-medium text-sm">
                Gestão centralizada de leitos, admissões, sinais vitais e aprazamentos em tempo real
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/hospitalization/tv">
            <Button className="bg-slate-950 text-white hover:bg-slate-900 px-5 py-3 rounded-2xl font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" /> Abrir Modo TV
            </Button>
          </Link>
          <Link href="/hospitalization/handover">
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 px-5 py-3 rounded-2xl font-bold shadow-sm flex items-center gap-2 transition-all">
              <RefreshCcw className="w-5 h-5 text-indigo-600" /> Passagem de Plantão
            </Button>
          </Link>
          <Button 
            onClick={() => handleOpenAdmission()} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" /> Nova Admissão
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Bed className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leitos Ocupados</p>
            <h3 className="text-3xl font-black text-slate-900 mt-0.5">{totalOccupied} <span className="text-lg font-bold text-slate-400">/ {totalKennels}</span></h3>
            <span className="text-xs font-bold text-indigo-600">{Math.round((totalOccupied / totalKennels) * 100)}% de ocupação</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
            <HeartPulse className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pacientes Críticos</p>
            <h3 className="text-3xl font-black text-red-600 mt-0.5">{criticalCount}</h3>
            <span className="text-xs font-bold text-slate-500">Monitoramento contínuo</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicações Atrasadas</p>
            <h3 className={`text-3xl font-black mt-0.5 ${lateMedsCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>{lateMedsCount}</h3>
            <span className="text-xs font-bold text-slate-500">{lateMedsCount > 0 ? 'Requer atenção do enfermeiro' : 'Todas em dia'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bombas de Infusão</p>
            <h3 className="text-3xl font-black text-slate-900 mt-0.5">{fluidsCount}</h3>
            <span className="text-xs font-bold text-sky-600">Fluido em andamento</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <WardBtn 
            active={activeWard === 'all'} 
            onClick={() => setActiveWard('all')} 
            label="Todas as Alas" 
            count={kennels.length} 
          />
          <WardBtn 
            active={activeWard === 'dogs'} 
            onClick={() => setActiveWard('dogs')} 
            label="Cães" 
            count={kennels.filter(k => k.ward === 'dogs').length} 
          />
          <WardBtn 
            active={activeWard === 'cats'} 
            onClick={() => setActiveWard('cats')} 
            label="Gatos" 
            count={kennels.filter(k => k.ward === 'cats').length} 
          />
          <div className="w-px bg-slate-200 my-1 mx-1 hidden sm:block"></div>
          <WardBtn 
            active={activeWard === 'icu'} 
            onClick={() => setActiveWard('icu')} 
            label="UTI" 
            count={kennels.filter(k => k.ward === 'icu').length} 
            isHighlight 
          />
          <WardBtn 
            active={activeWard === 'isolation'} 
            onClick={() => setActiveWard('isolation')} 
            label="Isolamento" 
            count={kennels.filter(k => k.ward === 'isolation').length} 
            isWarning 
          />
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por paciente, tutor, baia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Kennels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredKennels.map(k => {
          const latestVital = k.vitalRecords && k.vitalRecords.length > 0 ? k.vitalRecords[0] : null;
          const nextPendingMed = k.medications
            .flatMap(m => m.times.map(t => ({ medName: m.name, dose: m.dose, ...t })))
            .filter(t => t.status === 'pending' || t.status === 'late')
            .sort((a, b) => a.time.localeCompare(b.time))[0];

          return (
            <div 
              key={k.kennelId} 
              className={`bg-white rounded-3xl border-2 overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col ${
                k.status === 'occupied' 
                  ? (k.critical ? 'border-red-300 shadow-red-500/5' : 'border-indigo-100') 
                  : k.status === 'cleaning' 
                  ? 'border-amber-300 border-dashed bg-amber-50/20' 
                  : 'border-slate-200 border-dashed bg-slate-50/30'
              }`}
            >
              {/* Header Baia */}
              <div className={`px-6 py-4 flex justify-between items-center ${
                k.status === 'occupied' 
                  ? (k.critical ? 'bg-red-50/90 border-b border-red-100' : 'bg-indigo-50/70 border-b border-indigo-100') 
                  : k.status === 'cleaning' 
                  ? 'bg-amber-50 border-b border-amber-200' 
                  : 'bg-slate-100/60 border-b border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`font-black text-xl tracking-tight ${
                    k.status === 'occupied' ? (k.critical ? 'text-red-700' : 'text-indigo-800') : 'text-slate-600'
                  }`}>
                    Baia {k.kennelId}
                  </span>
                  
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    k.ward === 'icu' ? 'bg-amber-500 text-white' : 
                    k.ward === 'isolation' ? 'bg-red-500 text-white' : 
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {k.wardLabel}
                  </span>

                  {k.critical && k.status === 'occupied' && (
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <HeartPulse className="w-3 h-3" /> Crítico
                    </span>
                  )}
                </div>

                <div>
                  {k.status === 'occupied' ? (
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Ocupada
                    </span>
                  ) : k.status === 'cleaning' ? (
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                      Higienização
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                      Livre
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              {k.status === 'occupied' ? (
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                          {k.name}
                          <span className="text-sm font-semibold text-slate-500">({k.species} • {k.weight} kg)</span>
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mt-0.5 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" /> Tutor: <strong className="text-slate-800">{k.tutor}</strong>
                        </p>
                      </div>

                      <Link href={`/hospitalization/${k.kennelId}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Folha de Rosto
                        </Button>
                      </Link>
                    </div>

                    {/* Diagnóstico */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnóstico / Motivo</p>
                      <p className="text-sm font-bold text-slate-800 leading-snug">{k.diagnosis}</p>
                    </div>

                    {/* Quick Vitals & Support Pills */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className={`p-3 rounded-2xl border ${nextPendingMed?.status === 'late' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase mb-1">
                          <Pill className="w-3.5 h-3.5 text-indigo-600" /> Próx. Remédio
                        </div>
                        {nextPendingMed ? (
                          <div className={`font-black text-sm ${nextPendingMed.status === 'late' ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                            {nextPendingMed.time} - {nextPendingMed.medName}
                          </div>
                        ) : (
                          <div className="font-bold text-sm text-emerald-600">Sem pendências</div>
                        )}
                      </div>

                      <div className="p-3 rounded-2xl border bg-slate-50 border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase mb-1">
                          <Droplets className="w-3.5 h-3.5 text-sky-600" /> Fluido (Soro)
                        </div>
                        <div className="font-black text-sm text-slate-900">
                          {k.fluids.hasFluids ? `${k.fluids.rateMlH} ml/h` : 'Sem fluido'}
                        </div>
                      </div>
                    </div>

                    {/* Latest vitals badge */}
                    {latestVital && (
                      <div className="flex items-center justify-between text-xs bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 mb-3 font-semibold text-slate-700">
                        <span>Últimos Vitais ({latestVital.timestamp}):</span>
                        <div className="flex gap-2">
                          <span className="font-bold text-indigo-700">T: {latestVital.temperature}°C</span>
                          <span className="font-bold text-slate-800">FC: {latestVital.heartRate}</span>
                          <span className="font-bold text-slate-800">FR: {latestVital.respRate}</span>
                        </div>
                      </div>
                    )}

                    {k.notes && (
                      <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5 line-clamp-2">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        {k.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Admitido em: {k.admissionDate.split(' ')[0]}</span>
                    <span>Vet: <strong>{k.attendingVet.replace('Dra. ', '').replace('Dr. ', '')}</strong></span>
                  </div>
                </div>
              ) : k.status === 'cleaning' ? (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Aguardando Higienização</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Realize o protocolo de desinfecção para liberar a baia.
                  </p>
                  <Button 
                    onClick={() => {
                      setKennelFree(k.kennelId);
                      showToast(`Baia ${k.kennelId} limpa e liberada com sucesso!`);
                    }}
                    className="mt-4 bg-amber-50 hover:bg-amber-100 text-amber-800 px-5 py-2.5 rounded-xl font-bold border border-amber-300 shadow-sm text-sm"
                  >
                    Marcar como Pronta / Liberada
                  </Button>
                </div>
              ) : (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
                    <Bed className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-base">Baia Disponível</h3>
                  <p className="text-xs text-slate-400 mt-1">Pronta para nova admissão</p>
                  
                  <Button 
                    onClick={() => handleOpenAdmission(k.kennelId)}
                    className="mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl font-bold border border-indigo-200 shadow-sm text-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Internar Paciente
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Nova Admissão */}
      {showNewAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between text-white shrink-0">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-2.5">
                  <Plus className="w-6 h-6" /> Ficha de Admissão Hospitalar
                </h3>
                <p className="text-indigo-100 text-xs font-medium mt-0.5">
                  Entrada de paciente em leito, baia de cães/gatos ou leito de UTI
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAdmission} className="p-6 md:p-8 overflow-y-auto space-y-5">
              {/* Leito & Dados Básicos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Baia / Leito Destino *
                  </label>
                  <select 
                    value={admissionForm.kennelId} 
                    onChange={e => setAdmissionForm({...admissionForm, kennelId: e.target.value})}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none"
                  >
                    {kennels.map(k => (
                      <option key={k.kennelId} value={k.kennelId}>
                        Baia {k.kennelId} ({k.wardLabel}) - {k.status === 'free' ? 'Disponível' : k.status === 'cleaning' ? 'Higienização' : `Ocupada (${k.name})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome do Pet *
                  </label>
                  <Input 
                    value={admissionForm.name}
                    onChange={e => setAdmissionForm({...admissionForm, name: e.target.value})}
                    placeholder="Ex: Thor, Mel, Luna"
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Espécie & Raça
                  </label>
                  <div className="flex gap-2">
                    <select 
                      value={admissionForm.species}
                      onChange={e => setAdmissionForm({...admissionForm, species: e.target.value as any})}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none w-24"
                    >
                      <option value="Cão">Cão</option>
                      <option value="Gato">Gato</option>
                      <option value="Silvestre">Silvestre</option>
                      <option value="Outro">Outro</option>
                    </select>
                    <Input 
                      value={admissionForm.breed}
                      onChange={e => setAdmissionForm({...admissionForm, breed: e.target.value})}
                      placeholder="Raça (ex: SRD)"
                      className="bg-slate-50 flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Tutor & Peso */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome do Tutor *
                  </label>
                  <Input 
                    value={admissionForm.tutor}
                    onChange={e => setAdmissionForm({...admissionForm, tutor: e.target.value})}
                    placeholder="Nome completo do responsável"
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp do Tutor
                  </label>
                  <Input 
                    value={admissionForm.tutorPhone}
                    onChange={e => setAdmissionForm({...admissionForm, tutorPhone: e.target.value})}
                    placeholder="(00) 00000-0000"
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Peso Estimado (kg) *
                  </label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={admissionForm.weight}
                    onChange={e => setAdmissionForm({...admissionForm, weight: e.target.value})}
                    placeholder="Ex: 12.5"
                    required
                    className="bg-slate-50"
                  />
                </div>
              </div>

              {/* Diagnóstico & Veterinário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Diagnóstico / Suspeita Clínica *
                  </label>
                  <Input 
                    value={admissionForm.diagnosis}
                    onChange={e => setAdmissionForm({...admissionForm, diagnosis: e.target.value})}
                    placeholder="Ex: Pós-op Castração, Gastroenterite, ICC"
                    required
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Médico Veterinário Responsável
                  </label>
                  <select 
                    value={admissionForm.attendingVet}
                    onChange={e => setAdmissionForm({...admissionForm, attendingVet: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    {activeDoctors.map(doc => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Crítico & Suporte */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={admissionForm.critical}
                      onChange={e => setAdmissionForm({...admissionForm, critical: e.target.checked})}
                      className="w-5 h-5 text-red-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-red-600" /> Paciente Crítico / Alto Risco
                      </span>
                      <p className="text-xs text-slate-400">Ativa alertas sonoros/visuais no painel de enfermagem e TV</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={admissionForm.hasFluids}
                      onChange={e => setAdmissionForm({...admissionForm, hasFluids: e.target.checked})}
                      className="w-5 h-5 text-sky-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-sky-600" /> Fluidoterapia Inicial
                      </span>
                      <p className="text-xs text-slate-400">Instalar soro imediatamente</p>
                    </div>
                  </label>
                </div>

                {admissionForm.hasFluids && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Solução de Infusão</label>
                      <Input 
                        value={admissionForm.fluidSolution}
                        onChange={e => setAdmissionForm({...admissionForm, fluidSolution: e.target.value})}
                        className="bg-white text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Vazão (ml/h)</label>
                      <Input 
                        type="number"
                        value={admissionForm.fluidRate}
                        onChange={e => setAdmissionForm({...admissionForm, fluidRate: e.target.value})}
                        className="bg-white text-xs font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Observações & Nutrição */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Observações de Enfermagem / Cuidados
                  </label>
                  <textarea 
                    value={admissionForm.notes}
                    onChange={e => setAdmissionForm({...admissionForm, notes: e.target.value})}
                    placeholder="Ex: Cuidado com membro torácico esquerdo, animal arisco..."
                    rows={2}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Prescrição Dietética
                  </label>
                  <textarea 
                    value={admissionForm.dietNotes}
                    onChange={e => setAdmissionForm({...admissionForm, dietNotes: e.target.value})}
                    placeholder="Ex: Ração úmida 100g 3x ao dia, água ad libitum..."
                    rows={2}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none font-medium"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button" 
                  onClick={() => setShowNewAdmission(false)} 
                  disabled={isSaving} 
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving} 
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Registrando...' : 'Confirmar e Abrir Prontuário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-5 font-bold flex items-center gap-3`}>
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}

    </div>
  );
}

function WardBtn({ active, onClick, label, count, isHighlight, isWarning }: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  count: number; 
  isHighlight?: boolean; 
  isWarning?: boolean; 
}) {
  const baseColors = isWarning 
    ? 'text-red-700 hover:bg-red-50' 
    : isHighlight 
    ? 'text-amber-700 hover:bg-amber-50' 
    : 'text-slate-600 hover:bg-slate-50';
    
  const activeColors = isWarning 
    ? 'bg-red-600 text-white shadow-md' 
    : isHighlight 
    ? 'bg-amber-500 text-white shadow-md' 
    : 'bg-slate-900 text-white shadow-md';
  
  return (
    <Button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${active ? activeColors : baseColors}`}
    >
      {label} 
      <span className={`px-2 py-0.5 rounded-full text-[11px] ${
        active 
          ? 'bg-white/20 text-white' 
          : 'bg-slate-100 text-slate-600'
      }`}>
        {count}
      </span>
    </Button>
  );
}
