"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, Search, Filter, Stethoscope, Scissors, CheckCircle2, ArrowRight, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SmartAgendaPage() {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({show: false, message: '', type: 'success'});

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointmentsList, setAppointmentsList] = useState<any[]>([
    { id: 1, time: '08:00', patient: 'Bolinha', tutor: 'João', type: 'consulta', doctor: 'Dr. Roberto', status: 'arrived', duration: 30 },
    { id: 2, time: '08:30', patient: 'Mia', tutor: 'Ana', type: 'vacina', doctor: 'Dra. Carla', status: 'scheduled', duration: 15 },
    { id: 3, time: '09:00', patient: 'Rex', tutor: 'Carlos', type: 'cirurgia', doctor: 'Dr. Roberto', status: 'scheduled', duration: 120 },
    { id: 4, time: '10:00', patient: 'Lola', tutor: 'Mariana', type: 'retorno', doctor: 'Dra. Carla', status: 'canceled', duration: 30 },
    { id: 5, time: '11:00', patient: 'Thor', tutor: 'Pedro', type: 'banho', doctor: 'Estética', status: 'scheduled', duration: 60 },
  ]);

  const [form, setForm] = useState({
    patient: '',
    doctor: 'Dr. Roberto',
    type: 'consulta',
    time: '14:00',
    date: new Date().toISOString().split('T')[0]
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handlePrevDate = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
    showToast(`Data alterada para ${prev.toLocaleDateString('pt-BR')}`);
  };

  const handleNextDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
    showToast(`Data alterada para ${next.toLocaleDateString('pt-BR')}`);
  };

  const appointments = appointmentsList;

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'consulta': return 'border-indigo-500 bg-indigo-50 text-indigo-700';
      case 'vacina': return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case 'cirurgia': return 'border-rose-500 bg-rose-50 text-rose-700';
      case 'retorno': return 'border-amber-500 bg-amber-50 text-amber-700';
      case 'banho': return 'border-cyan-500 bg-cyan-50 text-cyan-700';
      default: return 'border-slate-500 bg-slate-50 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'arrived': return <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Na Clínica</span>;
      case 'scheduled': return <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Agendado</span>;
      case 'canceled': return <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Faltou</span>;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'consulta': return <Stethoscope className="w-4 h-4" />;
      case 'cirurgia': return <Stethoscope className="w-4 h-4" />;
      case 'banho': return <Scissors className="w-4 h-4" />;
      default: return <Stethoscope className="w-4 h-4" />;
    }
  };

  // Simulating time slots from 08:00 to 18:00
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  return (
    <div className="pb-12 max-w-full mx-auto min-h-screen bg-slate-50 flex flex-col h-screen">
      
      {/* Header Fixo */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" /> Agenda Inteligente
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Navegação de Data */}
          <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
            <Button onClick={handlePrevDate} className="p-2 hover:bg-white rounded-md transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></Button>
            <span className="px-4 font-bold text-slate-700">{selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
            <Button onClick={handleNextDate} className="p-2 hover:bg-white rounded-md transition-colors"><ChevronRight className="w-5 h-5 text-slate-500" /></Button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2"></div>

          {/* Toggle View */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <Button 
              onClick={() => setView('day')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'day' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Diário
            </Button>
            <Button 
              onClick={() => setView('week')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'week' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Semanal
            </Button>
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Toolbar Secundaria */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
        <div className="flex gap-4">
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <Input type="text" placeholder="Buscar tutor ou pet..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
           </div>
           <Button onClick={() => showToast('Filtro ativado')} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
             <Filter className="w-4 h-4" /> Todos os Médicos
           </Button>
        </div>
        
        {/* Legenda */}
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Consulta</div>
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Cirurgia</div>
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Vacina</div>
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-cyan-500"></span> Estética</div>
        </div>
      </div>

      {/* Grid do Calendário (Visão Diária) */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Coluna: Dr. Roberto */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[800px]">
             <div className="p-4 bg-slate-100 border-b border-slate-200 text-center sticky top-0 z-10">
               <h2 className="font-black text-slate-800 text-lg">Dr. Roberto</h2>
               <p className="text-xs font-medium text-slate-500">Consultório 1</p>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 relative">
               {/* Background Lines */}
               {timeSlots.map((time, idx) => (
                 <div key={time} className="flex border-b border-slate-100 h-20">
                   <div className="w-16 shrink-0 text-xs font-bold text-slate-400 p-2 text-right">{time}</div>
                   <div className="flex-1 border-l border-slate-100 relative group">
                     {/* Drag Target Hover effect */}
                     <div className="absolute inset-0 hover:bg-indigo-50/50 transition-colors cursor-crosshair"></div>
                   </div>
                 </div>
               ))}

               {/* Absolute Positioned Appointments (Mocked for 08:00 and 09:00) */}
               
               {/* 08:00 - Bolinha (Consulta) */}
               <div className={`absolute top-0 left-16 right-2 h-10 mt-2 mr-2 p-2 border-l-4 rounded-lg shadow-sm cursor-move ${getTypeStyle('consulta')}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black flex items-center gap-1">
                        {getTypeIcon('consulta')} 08:00 - Bolinha
                      </p>
                      <p className="text-[10px] font-medium opacity-80">Tutor: João</p>
                    </div>
                    {getStatusIcon('arrived')}
                  </div>
                  
                  {/* Botão de Ação Rápida (Aparece no Hover) */}
                  <div className="mt-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => showToast('Enviado para triagem')} className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded-md font-bold shadow-sm hover:bg-indigo-700">
                      Enviar para Triagem
                    </Button>
                  </div>
               </div>

               {/* 09:00 - Rex (Cirurgia) */}
               <div className={`absolute top-[80px] left-16 right-2 h-[150px] mt-2 mr-2 p-3 border-l-4 rounded-lg shadow-sm cursor-move flex flex-col justify-between ${getTypeStyle('cirurgia')}`}>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-black flex items-center gap-1">
                          {getTypeIcon('cirurgia')} 09:00 - Rex
                        </p>
                        <p className="text-xs font-medium opacity-80">Castração Completa (Tutor: Carlos)</p>
                      </div>
                      {getStatusIcon('scheduled')}
                    </div>
                  </div>
                  <p className="text-[10px] font-bold opacity-70">Duração prevista: 2 horas</p>
               </div>

             </div>
          </Card>

          {/* Coluna: Dra. Carla */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[800px]">
             <div className="p-4 bg-slate-100 border-b border-slate-200 text-center sticky top-0 z-10">
               <h2 className="font-black text-slate-800 text-lg">Dra. Carla</h2>
               <p className="text-xs font-medium text-slate-500">Consultório 2</p>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 relative">
               {timeSlots.map((time, idx) => (
                 <div key={time} className="flex border-b border-slate-100 h-20">
                   <div className="w-16 shrink-0 text-xs font-bold text-slate-400 p-2 text-right">{time}</div>
                   <div className="flex-1 border-l border-slate-100 relative group">
                     <div className="absolute inset-0 hover:bg-indigo-50/50 transition-colors cursor-crosshair"></div>
                   </div>
                 </div>
               ))}

               {/* 08:30 - Mia (Vacina) */}
               <div className={`absolute top-[40px] left-16 right-2 h-10 mt-2 mr-2 p-2 border-l-4 rounded-lg shadow-sm cursor-move ${getTypeStyle('vacina')}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black flex items-center gap-1">
                        08:30 - Mia
                      </p>
                    </div>
                    {getStatusIcon('scheduled')}
                  </div>
               </div>

               {/* 10:00 - Lola (Retorno Canceled) */}
               <div className={`absolute top-[160px] left-16 right-2 h-10 mt-2 mr-2 p-2 border-l-4 rounded-lg shadow-sm cursor-move opacity-50 ${getTypeStyle('retorno')}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black line-through">10:00 - Lola</p>
                    </div>
                    {getStatusIcon('canceled')}
                  </div>
               </div>

             </div>
          </Card>

          {/* Coluna: Banho e Tosa */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[800px]">
             <div className="p-4 bg-slate-100 border-b border-slate-200 text-center sticky top-0 z-10">
               <h2 className="font-black text-slate-800 text-lg">Centro Estético</h2>
               <p className="text-xs font-medium text-slate-500">Banho e Tosa</p>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 relative">
               {timeSlots.map((time, idx) => (
                 <div key={time} className="flex border-b border-slate-100 h-20">
                   <div className="w-16 shrink-0 text-xs font-bold text-slate-400 p-2 text-right">{time}</div>
                   <div className="flex-1 border-l border-slate-100 relative group">
                     <div className="absolute inset-0 hover:bg-cyan-50/50 transition-colors cursor-crosshair"></div>
                   </div>
                 </div>
               ))}

               {/* 11:00 - Thor (Banho) */}
               <div className={`absolute top-[240px] left-16 right-2 h-[70px] mt-2 mr-2 p-2 border-l-4 rounded-lg shadow-sm cursor-move ${getTypeStyle('banho')}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black flex items-center gap-1">
                        {getTypeIcon('banho')} 11:00 - Thor
                      </p>
                      <p className="text-[10px] font-medium opacity-80">Banho e Tosa Higiênica</p>
                    </div>
                    {getStatusIcon('scheduled')}
                  </div>
               </div>

             </div>
          </Card>

        </div>
      </div>
      
      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <X className="w-5 h-5 text-red-600" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Modal Novo Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Novo Agendamento</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setIsSaving(true);
              setTimeout(() => {
                const createdApt = {
                  id: Date.now(),
                  time: form.time || '14:00',
                  patient: form.patient || 'Novo Paciente',
                  tutor: 'Tutor Solicitante',
                  type: form.type,
                  doctor: form.doctor,
                  status: 'scheduled',
                  duration: 30
                };
                setAppointmentsList(prev => [...prev, createdApt]);
                setIsSaving(false);
                setIsModalOpen(false);
                setForm({ patient: '', doctor: 'Dr. Roberto', type: 'consulta', time: '14:00', date: new Date().toISOString().split('T')[0] });
                showToast(`Agendamento de ${createdApt.patient} salvo com sucesso!`);
              }, 600);
            }}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Paciente (e Tutor)</label>
                <Input 
                  required 
                  value={form.patient}
                  onChange={e => setForm({ ...form, patient: e.target.value })}
                  placeholder="Ex: Rex - Tutor: Carlos" 
                  className="w-full rounded-lg border border-gray-200 bg-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Veterinário</label>
                <select 
                  value={form.doctor}
                  onChange={e => setForm({ ...form, doctor: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm" 
                  required
                >
                  <option value="Dr. Roberto">Dr. Roberto</option>
                  <option value="Dra. Carla">Dra. Carla</option>
                  <option value="Dra. Jéssica">Dra. Jéssica</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Serviço / Tipo</label>
                  <select 
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm"
                  >
                    <option value="consulta">Consulta</option>
                    <option value="vacina">Vacina</option>
                    <option value="cirurgia">Cirurgia</option>
                    <option value="banho">Banho e Tosa</option>
                    <option value="retorno">Retorno</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Duração</label>
                  <select className="w-full rounded-lg border border-gray-200 px-4 py-2 bg-white text-sm">
                    <option>15 minutos</option>
                    <option>30 minutos</option>
                    <option>1 hora</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
                  <Input 
                    type="date" 
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required 
                    className="w-full rounded-lg border border-gray-200 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hora</label>
                  <Input 
                    type="time" 
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    required 
                    className="w-full rounded-lg border border-gray-200 bg-white" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
