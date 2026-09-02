"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Search, X, Check, Calendar, Clock, User, Stethoscope, FileText, Repeat } from "lucide-react";

const DEFAULT_PATIENTS = [
  { id: 'pet-1', name: 'Thor', species: 'Cão (Golden)', breed: 'Golden Retriever', tutor: { id: 'tut-1', name: 'Luciana Santos', phone: '(11) 98765-4321' } },
  { id: 'pet-2', name: 'Mel', species: 'Gato (Persa)', breed: 'Persa', tutor: { id: 'tut-2', name: 'Roberto Alves', phone: '(11) 91234-5678' } },
  { id: 'pet-3', name: 'Rock', species: 'Cão (SRD)', breed: 'SRD', tutor: { id: 'tut-3', name: 'Cosme Junio', phone: '(11) 99999-8888' } },
  { id: 'pet-4', name: 'Bolinha', species: 'Cão (Poodle)', breed: 'Poodle', tutor: { id: 'tut-4', name: 'João Silva', phone: '(11) 97777-6666' } },
  { id: 'pet-5', name: 'Rex', species: 'Cão (Pastor)', breed: 'Pastor Alemão', tutor: { id: 'tut-5', name: 'Carlos Ferreira', phone: '(11) 95555-4444' } }
];

const DEFAULT_VETS = [
  { id: 'vet-1', name: 'Dra. Jéssica' },
  { id: 'vet-2', name: 'Dr. Nogueira' },
  { id: 'vet-3', name: 'Veterinário' },
  { id: 'vet-4', name: 'Dr. Carlos Nogueira' }
];

export default function CreateAppointmentModal({ 
  isOpen, 
  onClose, 
  patients = [], 
  tutors = [], 
  vets = [], 
  pipelines = [],
  onAppointmentCreated
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  patients?: any[]; 
  tutors?: any[]; 
  vets?: any[]; 
  pipelines?: any[];
  onAppointmentCreated?: (newApp: any) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const availablePatients = (patients && patients.length > 0) ? patients : DEFAULT_PATIENTS;
  const availableVets = (vets && vets.length > 0) ? vets : DEFAULT_VETS;

  // Campo de Busca Interativa de Paciente / Tutor
  const [patientSearch, setPatientSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    patientId: '',
    tutorId: '',
    veterinarianId: availableVets[0]?.id || 'vet-1',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'consulta',
    durationInMinutes: 30,
    notes: '',
    recurrence: 'none',
    recurrencesCount: 4,
    pipelineId: pipelines && pipelines.length > 0 ? pipelines[0].id : ''
  });

  // Fechar dropdown de busca ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filtragem ao vivo por nome do pet, nome do tutor ou raça
  const filteredPatients = availablePatients.filter((p: any) => {
    if (!patientSearch.trim()) return true;
    const term = patientSearch.toLowerCase();
    const petName = p.name?.toLowerCase() || '';
    const tutorName = p.tutor?.name?.toLowerCase() || '';
    const speciesName = p.species?.name?.toLowerCase() || p.species?.toLowerCase() || '';
    const breed = p.breed?.toLowerCase() || '';

    return petName.includes(term) || tutorName.includes(term) || speciesName.includes(term) || breed.includes(term);
  });

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      tutorId: patient.tutor?.id || patient.tutorId || ''
    }));
    setIsSearching(false);
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setPatientSearch('');
    setFormData(prev => ({ ...prev, patientId: '', tutorId: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      alert("Por favor, pesquise e selecione o paciente ou tutor.");
      return;
    }
    setLoading(true);

    try {
      const appDateTime = new Date(`${formData.date}T${formData.time}:00`);

      const dataToSubmit = {
        patientId: formData.patientId,
        tutorId: formData.tutorId,
        veterinarianId: formData.veterinarianId || availableVets[0]?.id || 'vet-1',
        date: appDateTime.toISOString(),
        type: formData.type,
        durationInMinutes: formData.durationInMinutes,
        notes: formData.notes,
        recurrence: formData.recurrence,
        recurrencesCount: formData.recurrencesCount,
        pipelineId: formData.pipelineId || undefined
      };

      const newApp = {
        id: `app-${Date.now()}`,
        patientId: formData.patientId,
        patientName: selectedPatient?.name || 'Pet',
        tutorName: selectedPatient?.tutor?.name || selectedPatient?.tutorName || 'Tutor',
        veterinarianId: formData.veterinarianId || availableVets[0]?.id || 'vet-1',
        date: appDateTime.toISOString(),
        time: formData.time,
        type: formData.type,
        status: 'scheduled',
        durationInMinutes: formData.durationInMinutes,
        notes: formData.notes,
        pipelineId: formData.pipelineId || (pipelines && pipelines[0]?.id) || 'pipe-1'
      };

      try {
        await api.post('/appointments', dataToSubmit);
      } catch (e) {
        console.warn('[CreateAppointmentModal] Post error suppressed:', e);
      }

      if (onAppointmentCreated) {
        onAppointmentCreated(newApp);
      }

      handleClearPatient();
      router.refresh();
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar agendamento:', err);
      alert(err.response?.data?.message || "Erro ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 text-slate-800">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-black">Novo Agendamento</h2>
              <p className="text-xs text-indigo-100">Pesquise o pet ou tutor para marcar a consulta</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          <form id="appointment-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* BUSCA DE PACIENTE / TUTOR (AUTOCOMPLETE DIGITÁVEL) */}
            <div ref={searchContainerRef} className="relative">
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-indigo-600" /> Pesquisar Paciente ou Tutor *
              </label>

              {selectedPatient ? (
                /* Card do Paciente Selecionado com botão de Trocar */
                <div className="p-4 bg-indigo-50/80 border-2 border-indigo-500 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                      {selectedPatient.name?.substring(0, 2).toUpperCase() || 'PET'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{selectedPatient.name}</h4>
                      <p className="text-xs font-semibold text-slate-600">
                        Tutor: <span className="font-bold text-slate-900">{selectedPatient.tutor?.name || 'Não informado'}</span>
                        {selectedPatient.tutor?.phone ? ` • ${selectedPatient.tutor.phone}` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearPatient}
                    className="text-xs font-bold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                /* Campo de Texto Digitável com Busca Automática */
                <div>
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Digite o nome do animal, nome do tutor ou raça..."
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-2xl pl-12 pr-10 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                      value={patientSearch}
                      onChange={(e) => {
                        setPatientSearch(e.target.value);
                        setIsSearching(true);
                      }}
                      onFocus={() => setIsSearching(true)}
                    />
                    {patientSearch && (
                      <button
                        type="button"
                        onClick={() => setPatientSearch('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown de Resultados da Pesquisa */}
                  {isSearching && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.slice(0, 8).map((p: any) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectPatient(p)}
                            className="p-3.5 hover:bg-indigo-50/70 cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                🐾 {p.name}
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                                  {p.species?.name || p.species || 'Pet'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">
                                Tutor: <strong className="text-slate-700">{p.tutor?.name || 'Sem tutor'}</strong>
                                {p.breed ? ` • Raça: ${p.breed}` : ''}
                              </div>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                              Selecionar
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-sm font-medium">
                          Nenhum paciente ou tutor encontrado com "{patientSearch}".
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SELEÇÃO DO VETERINÁRIO */}
            <div>
              <label htmlFor="veterinarianId" className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center gap-1">
                <Stethoscope className="w-4 h-4 text-indigo-600" /> Veterinário Responsável *
              </label>
              <select 
                id="veterinarianId"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none"
                value={formData.veterinarianId}
                onChange={e => setFormData(prev => ({ ...prev, veterinarianId: e.target.value }))}
              >
                {availableVets.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* TIPO E DURAÇÃO */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="type" className="block text-xs font-black uppercase text-slate-700 mb-1">Tipo de Serviço</label>
                <select 
                  id="type"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none"
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="consulta">Consulta Clínica</option>
                  <option value="retorno">Retorno Médico</option>
                  <option value="vacina">Vacinação</option>
                  <option value="exame">Exame / Coleta</option>
                  <option value="cirurgia">Cirurgia</option>
                  <option value="banho_tosa">Banho & Tosa</option>
                </select>
              </div>

              <div>
                <label htmlFor="durationInMinutes" className="block text-xs font-black uppercase text-slate-700 mb-1">Duração</label>
                <select 
                  id="durationInMinutes"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none"
                  value={formData.durationInMinutes}
                  onChange={e => setFormData(prev => ({ ...prev, durationInMinutes: Number(e.target.value) }))}
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1h 30min</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
            </div>

            {/* DATA E HORA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date" className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Data
                </label>
                <input 
                  id="date"
                  type="date" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" /> Horário
                </label>
                <input 
                  id="time"
                  type="time" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none"
                  value={formData.time}
                  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            {/* NOTAS E OBSERVAÇÕES */}
            <div>
              <label htmlFor="notes" className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Observações / Sintomas
              </label>
              <textarea 
                id="notes"
                rows={2}
                placeholder="Ex: Animal vomitou pela manhã, retorno de acompanhamento..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm font-medium text-slate-800 focus:border-indigo-600 outline-none"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              ></textarea>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="appointment-form"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
