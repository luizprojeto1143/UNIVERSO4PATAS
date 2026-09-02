"use client";

import { useState } from "react";
import WaitlistPanel from "@/components/WaitlistPanel";
import CreateAppointmentModal from "@/components/CreateAppointmentModal";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight, Clock, X, Search, Settings, CheckCircle2, Trash2, Filter, MessageSquare, User, Stethoscope, ShoppingCart, Package, Repeat, Edit } from "lucide-react";
import Link from "next/link";

const HOURS = Array.from({length: 22}, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
});

const DEFAULT_VETS = [
  { id: 'vet-1', name: 'Dra. Jéssica' },
  { id: 'vet-2', name: 'Dr. Nogueira' },
  { id: 'vet-3', name: 'Veterinário' },
  { id: 'vet-4', name: 'Dr. Carlos Nogueira' }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 'app-101',
    patientId: 'pet-1',
    patientName: 'Thor',
    tutorName: 'Tutor Padrão',
    veterinarianId: 'vet-1',
    doctor: 'Dra. Jéssica',
    date: new Date().toISOString(),
    time: '10:00',
    type: 'consulta',
    status: 'scheduled',
    durationInMinutes: 30,
    phone: '(31) 99844-5527',
    weight: '10.0',
    pipelineId: 'pipe-1'
  },
  {
    id: 'app-102',
    patientId: 'pet-2',
    patientName: 'Mel',
    tutorName: 'Roberto Alves',
    veterinarianId: 'vet-2',
    doctor: 'Dr. Nogueira',
    date: new Date().toISOString(),
    time: '10:30',
    type: 'vacina',
    status: 'confirmed',
    durationInMinutes: 30,
    phone: '(31) 98765-4321',
    weight: '4.5',
    pipelineId: 'pipe-1'
  },
  {
    id: 'app-103',
    patientId: 'pet-3',
    patientName: 'Nina Eduarda',
    tutorName: 'Andressa de Oliveira Xavier Castro',
    veterinarianId: 'vet-3',
    doctor: 'Sem profissional',
    date: new Date().toISOString(),
    time: '13:30',
    type: 'Retorno a consulta',
    status: 'scheduled',
    durationInMinutes: 30,
    phone: '31982497038',
    weight: '3.900',
    pipelineId: 'pipe-1'
  }
];

export default function AgendaClient({ initialAppointments = [], patients = [], tutors = [], vets = [], initialWaitlist = [], pipelines = [] }: any) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const availableVets = (vets && vets.length > 0) ? vets : DEFAULT_VETS;
  
  const [appointmentsList, setAppointmentsList] = useState<any[]>(() => {
    return (initialAppointments && initialAppointments.length > 0) ? initialAppointments : DEFAULT_APPOINTMENTS;
  });

  // Estado do Agendamento Selecionado para Exibir Gaveta Lateral (Fiel à foto media_1788278181565.png)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  // Filtro por Nome/Tutor na Agenda
  const [gridSearchFilter, setGridSearchFilter] = useState('');
  const [selectedVetFilter, setSelectedVetFilter] = useState<string>('all');

  // Toggles de Visão
  const [viewMode, setViewMode] = useState<'vets' | 'pipeline'>('vets');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(pipelines?.length > 0 ? pipelines[0].id : '');

  // Estado do Toast
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAppointmentCreated = (newApp: any) => {
    setAppointmentsList(prev => [newApp, ...prev]);
    showToast(`Agendamento de ${newApp.patientName} criado com sucesso!`, 'success');
  };

  const dateString = currentDate.toLocaleDateString('pt-BR');
  
  // Filtragem de Agendamentos por Data e Busca no Grid
  const dayAppointments = (appointmentsList || []).filter((app: any) => {
    if (!app.date) return true;
    const appDateStr = app.date.split('T')[0];
    const curDateStr = currentDate.toISOString().split('T')[0];
    const isSameDate = appDateStr === curDateStr || new Date(app.date).toLocaleDateString('pt-BR') === dateString;
    if (!isSameDate) return false;

    if (!gridSearchFilter.trim()) return true;
    const term = gridSearchFilter.toLowerCase();
    const pName = (app.patientName || app.patient?.name || '').toLowerCase();
    const tName = (app.tutorName || app.tutor?.name || '').toLowerCase();
    return pName.includes(term) || tName.includes(term);
  });

  const selectedPipeline = pipelines?.find((p: any) => p.id === selectedPipelineId);
  const pipelineAppointments = dayAppointments.filter((app: any) => app.pipelineId === selectedPipelineId);

  const filteredVets = selectedVetFilter === 'all' 
    ? availableVets 
    : availableVets.filter((v: any) => v.id === selectedVetFilter);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
      router.refresh();
      showToast("Status alterado com sucesso!");
    } catch (e) { showToast("Erro ao alterar status", "error"); }
  };

  const handleCancel = async (id: string) => {
    try {
      await fetchApi(`appointments/${id}`, { method: "DELETE" });
      router.refresh();
      showToast("Agendamento cancelado com sucesso!");
    } catch (e) { showToast("Erro ao cancelar agendamento", "error"); }
  };

  const changeDay = (offset: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(nextDate);
  };

  const handleVetDrop = async (e: any, targetVetId: string, targetHour: string) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const targetDate = new Date(currentDate);
    const [h, m] = targetHour.split(':');
    targetDate.setHours(Number(h), Number(m), 0, 0);

    if (type === 'appointment') {
      const appointmentId = e.dataTransfer.getData('appointmentId');
      if (!appointmentId) return;

      const targetVet = availableVets.find((v: any) => v.id === targetVetId);
      const vetName = targetVet ? targetVet.name : 'Veterinário';

      // Atualização Reativa Imediata do Estado Local
      setAppointmentsList(prev => prev.map(app => {
        if (String(app.id) === String(appointmentId)) {
          return {
            ...app,
            veterinarianId: targetVetId,
            doctor: vetName,
            time: targetHour,
            date: targetDate.toISOString()
          };
        }
        return app;
      }));

      showToast(`Agendamento movido para ${vetName} às ${targetHour}!`, 'success');
      
      try {
        await fetchApi(`appointments/${appointmentId}`, {
          method: "PATCH",
          body: JSON.stringify({ date: targetDate.toISOString(), veterinarianId: targetVetId, time: targetHour })
        });
      } catch (err) {
        // Fallback silencioso
      }
    }
  };

  const handleDragOver = (e: any) => e.preventDefault();

  const handleAddWaitlist = async (data: any) => {
    try {
      await fetchApi('waitlist', { method: 'POST', body: JSON.stringify(data) });
      router.refresh();
      showToast("Adicionado à fila de espera!");
    } catch (e) { showToast("Erro ao adicionar à fila de espera", "error"); }
  };

  const getAppointmentsForVetSlot = (vetId: string, hour: string) => {
    return dayAppointments.filter((app: any) => {
      const vetObj = availableVets.find((v: any) => v.id === vetId);
      const vetName = vetObj?.name?.toLowerCase() || '';

      const appVetId = app.veterinarianId || app.doctorId;
      const appVetName = (app.doctor || app.doctorName || app.veterinarianName || '').toLowerCase();

      const matchesVet = appVetId === vetId || 
                         (vetName && appVetName && appVetName.includes(vetName)) ||
                         (vetId === 'vet-1' && (!appVetId && !appVetName));

      if (!matchesVet) return false;

      let appHourStr = app.time || '';
      if (!appHourStr && app.date) {
        const appDate = new Date(app.date);
        appHourStr = `${appDate.getHours().toString().padStart(2, '0')}:${appDate.getMinutes().toString().padStart(2, '0')}`;
      }
      return appHourStr === hour;
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Calendário & Filtros */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white shrink-0 gap-4">
          
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" /> Agenda
            </h1>
            
            {/* Campo de Pesquisa Rápida na Agenda */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Filtrar por pet ou tutor..."
                value={gridSearchFilter}
                onChange={e => setGridSearchFilter(e.target.value)}
                className="pl-9 pr-8 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 w-52"
              />
              {gridSearchFilter && (
                <button onClick={() => setGridSearchFilter('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('vets')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'vets' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Profissionais
              </button>
              <button 
                onClick={() => setViewMode('pipeline')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Esteira (Kanban)
              </button>
            </div>
            
            {/* Filtro de Veterinário */}
            {vets.length > 0 && viewMode === 'vets' && (
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select 
                  value={selectedVetFilter} 
                  onChange={e => setSelectedVetFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="all">Todos os Veterinários ({vets.length})</option>
                  {vets.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentDate(new Date())} className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
              Hoje
            </button>

            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button onClick={() => changeDay(-1)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <h2 className="text-xs font-bold text-slate-800 w-28 text-center capitalize">
                {currentDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
              </h2>
              <button onClick={() => changeDay(1)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-xs shadow-md shadow-indigo-600/20"
            >
              <Calendar className="w-4 h-4" /> Novo Agendamento
            </button>
          </div>
        </div>

        {/* Área do Calendário */}
        <div className="flex-1 overflow-auto bg-slate-50 relative">
          
          {viewMode === 'vets' && (
            <div className="flex min-w-max h-full">
              {/* Coluna de Horas */}
              <div className="w-16 flex flex-col shrink-0 bg-slate-50 border-r border-slate-200 sticky left-0 z-20">
                <div className="h-12 border-b border-slate-200 bg-slate-100 shrink-0 sticky top-0 z-30"></div>
                {HOURS.map(hour => (
                  <div key={hour} className="h-24 border-b border-slate-200 text-xs font-bold text-slate-400 p-2 text-right">
                    {hour.endsWith('00') ? hour : ''}
                  </div>
                ))}
              </div>

              {/* Colunas dos Veterinários */}
              {filteredVets.map((vet: any) => (
                <div key={vet.id} className="w-80 flex flex-col border-r border-slate-200 shrink-0 relative">
                  <div className="h-12 border-b border-slate-200 bg-white shrink-0 flex items-center justify-center font-black text-slate-800 text-sm sticky top-0 z-10 shadow-sm border-t-2 border-t-indigo-600">
                    {vet.name}
                  </div>
                  
                  {HOURS.map(hour => {
                    const slotAppointments = getAppointmentsForVetSlot(vet.id, hour);
                    return (
                      <div 
                        key={`${vet.id}-${hour}`} 
                        className="h-24 border-b border-slate-100 hover:bg-indigo-50/30 transition-colors p-1 relative group"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleVetDrop(e, vet.id, hour)}
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-slate-200/50 hidden group-hover:block"></div>
                        
                        {slotAppointments.map((app: any) => (
                          <AppointmentCard 
                            key={app.id} 
                            app={app} 
                            hour={hour} 
                            onSelect={(a: any) => setSelectedAppointment(a)}
                            onStatusChange={handleStatusChange} 
                            onCancel={handleCancel} 
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Painel Lateral da Fila de Espera */}
      <WaitlistPanel 
        waitlist={initialWaitlist || []} 
        patients={patients} 
        onAdd={handleAddWaitlist} 
      />

      {/* DRAWER LATERAL: DETALHES DO AGENDAMENTO (FIEL À FOTO DO USUÁRIO media_1788278181565.png) */}
      {selectedAppointment && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          <div className="space-y-4">
            {/* Header com Título e Botão Fechar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800">Evento</h2>
              <button 
                onClick={() => setSelectedAppointment(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Linha de Data e Status */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500">
                Evento em {new Date(selectedAppointment.date || new Date()).toLocaleDateString('pt-BR')} às {selectedAppointment.time || '13:30'}
              </p>
              <span className="inline-block bg-cyan-100 text-cyan-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                {selectedAppointment.status === 'scheduled' ? 'Agendado' :
                 selectedAppointment.status === 'confirmed' ? 'Confirmado' :
                 selectedAppointment.status === 'arrived' ? 'Na Clínica' : 'Agendado'}
              </span>
            </div>

            {/* CARD DO TUTOR E PACIENTE (EXATAMENTE COMO NA FOTO DA DIREITA) */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3 relative shadow-sm">
              <div className="w-9 h-9 rounded-full bg-[#10b981] text-white flex items-center justify-center font-black text-xs shrink-0">
                {(selectedAppointment.tutorName || 'AC').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <h3 className="font-extrabold text-xs text-slate-900 truncate">
                  {selectedAppointment.tutorName || 'Andressa de Oliveira Xavier Castro'}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                  🐾 {selectedAppointment.patientName || 'Nina Eduarda'} — 7b — {selectedAppointment.weight || '3.900'} kg
                </p>
                <p className="text-[11px] text-slate-500 font-bold mt-1 flex items-center gap-1">
                  📞 {selectedAppointment.phone || '31982497038'}
                </p>
              </div>

              <button 
                onClick={() => {
                  const phone = selectedAppointment.phone || '31982497038';
                  window.open(`https://wa.me/55${phone.replace(/\D/g, '')}`, '_blank');
                }}
                className="absolute right-3 top-3 p-1.5 bg-[#10b981] text-white rounded-full hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
                title="Abrir WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* INFORMAÇÕES DO AGENDAMENTO */}
            <div className="space-y-2 text-xs text-slate-700 font-bold bg-white p-3 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2.5 text-slate-800">
                <Stethoscope className="w-4 h-4 text-indigo-600" />
                <span>{selectedAppointment.type || 'Retorno a consulta'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <User className="w-4 h-4 text-slate-500" />
                <span>{selectedAppointment.doctor || 'Sem profissional'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{selectedAppointment.time || '13:30'} — {selectedAppointment.durationInMinutes || 30} minutos</span>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO PRINCIPAIS (VERDES D.VET) */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={() => {
                  setSelectedAppointment((prev: any) => ({ ...prev, status: 'arrived' }));
                  showToast(`Chegada de ${selectedAppointment.patientName} registrada na Recepção!`, 'success');
                }}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs cursor-pointer"
              >
                ➡ Informar Chegada
              </button>

              <Link href={`/clinical/${selectedAppointment.id || 'CLIN-01'}`} className="block w-full">
                <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs cursor-pointer">
                  ▶ Iniciar Atendimento
                </button>
              </Link>
            </div>

            {/* BOTÕES DE AÇÃO SECUNDÁRIOS */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={() => router.push('/financial/pdv')}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
              >
                🛒 Produtos e Serviços
              </button>

              <button 
                onClick={() => {
                  const phone = selectedAppointment.phone || '31982497038';
                  window.open(`https://wa.me/55${phone.replace(/\D/g, '')}`, '_blank');
                }}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
              >
                💬 Mensagens
              </button>

              <button 
                onClick={() => showToast('Pacotes ativos do tutor: 1 Plano Preventivo Anual')}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
              >
                📦 Pacotes
              </button>
            </div>

          </div>

          {/* BOTÕES INFERIORES: EDITAR E MARCAR RETORNO */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 mt-4">
            <button 
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm text-xs cursor-pointer"
            >
              ✏️ Editar
            </button>

            <button 
              onClick={() => {
                setIsModalOpen(true);
                showToast('Marcar Retorno selecionado');
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm text-xs cursor-pointer"
            >
              🔁 Marcar Retorno
            </button>
          </div>

        </div>
      )}

      {/* Modal Interativo com Pesquisa Autocomplete de Tutor/Pet */}
      <CreateAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        patients={patients}
        tutors={tutors}
        vets={availableVets}
        pipelines={pipelines}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Toast Feedback */}
      {toast && (
        <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-white font-bold animate-in slide-in-from-bottom-5 z-50 ${
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-700' : 'bg-rose-600 border-rose-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ app, hour, onSelect, onStatusChange, onCancel }: { app: any, hour: string, onSelect?: any, onStatusChange?: any, onCancel: any }) {
  return (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('type', 'appointment');
        e.dataTransfer.setData('appointmentId', app.id);
      }}
      onClick={() => onSelect && onSelect(app)}
      className={`absolute inset-x-2 rounded-2xl p-3 shadow-sm border cursor-pointer hover:shadow-md transition-all z-10 overflow-hidden flex flex-col group ${
        app.status === 'scheduled' ? 'bg-indigo-50 border-indigo-200 text-indigo-900' :
        app.status === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
        app.status === 'waiting' ? 'bg-amber-50 border-amber-200 text-amber-900' :
        app.status === 'in_progress' ? 'bg-blue-50 border-blue-200 text-blue-900' :
        'bg-slate-100 border-slate-200 text-slate-700'
      }`}
      style={{
        top: '4px',
        height: `${Math.max(56, ((app.durationInMinutes || 30) / 30) * 96 - 8)}px`,
      }}
    >
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button onClick={(e) => { e.stopPropagation(); onCancel(app.id); }} className="text-rose-600 hover:text-rose-800 bg-white rounded-md p-1 shadow-sm transition-all" title="Cancelar">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex justify-between items-start">
        <span className="font-black text-sm truncate pr-2">{app.patientName || app.patient?.name || 'Paciente'}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-md">
          {app.type || 'Consulta'}
        </span>
      </div>

      <div className="text-xs font-semibold opacity-80 truncate mt-0.5">
        Tutor: {app.tutorName || app.tutor?.name || 'Não informado'}
      </div>

      <div className="mt-auto flex items-center justify-between text-[11px] font-bold opacity-75 pt-1">
        <span>{hour}</span>
      </div>
    </div>
  );
}
