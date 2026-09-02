'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Activity, 
  ClipboardCheck, 
  Plus, 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  Search, 
  DollarSign,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  TestTube,
  PackageCheck
} from 'lucide-react';
import CreatePatientModal from '@/components/CreatePatientModal';

export default function AssistantDashboard({ data, role = 'assistant' }: { data: any, role?: string }) {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const isManager = role === 'assistant_leader' || role === 'assistant_manager';
  const hasReceptionPerms = role === 'assistant_reception' || isManager || true;

  // 1. Fila de Triagem
  const triageQueue = [
    { id: 1, time: '09:15', patient: 'Thor', species: 'Cão (Golden)', tutor: 'Luciana Santos', type: 'Espera (Consulta)' },
    { id: 2, time: '09:30', patient: 'Mel', species: 'Gato (Persa)', tutor: 'Roberto Alves', type: 'Espera (Retorno)' },
  ];

  // 2. Fila dos Atendimentos do Dia
  const todayAttendances = [
    { id: 101, time: '09:00', patient: 'Thor', tutor: 'Luciana Santos', vet: 'Dr. Nogueira', status: 'Em Atendimento' },
    { id: 102, time: '09:30', patient: 'Mel', tutor: 'Roberto Alves', vet: 'Dra. Jéssica', status: 'Aguardando Médico' },
    { id: 103, time: '10:00', patient: 'Bob', tutor: 'Carlos Silva', vet: 'Dr. Nogueira', status: 'Concluído' },
  ];

  // 3. Agenda do Dia
  const todayAgenda = [
    { id: 201, time: '09:00', patient: 'Thor', vet: 'Dr. Nogueira', type: 'Consulta Clínica', status: 'Confirmado' },
    { id: 202, time: '09:30', patient: 'Mel', vet: 'Dra. Jéssica', type: 'Vacinação V10', status: 'Em Espera' },
    { id: 203, time: '10:00', patient: 'Bob', vet: 'Dr. Nogueira', type: 'Retorno Ortopédico', status: 'Concluído' },
    { id: 204, time: '11:00', patient: 'Pipoca', vet: 'Dra. Jéssica', type: 'Exame de Sangue', status: 'Agendado' },
  ];

  return (
    <div className="pb-12 max-w-7xl mx-auto space-y-8">
      
      {/* Header Principal da Recepção */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Painel Operacional & Recepção</h1>
          <p className="text-slate-500 font-medium mt-1">Bem-vindo. Acompanhe os atendimentos, triagens e agenda em tempo real.</p>
        </div>
      </div>

      {/* Hero Header Gradient Original */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Painel de Operações 👋</h1>
            <p className="text-indigo-100 font-medium text-lg">Acompanhe a recepção, triagem e a enfermaria da clínica.</p>
          </div>

          <div className="flex gap-3 mt-6 md:mt-0 flex-wrap">
            <button 
              onClick={() => setIsPatientModalOpen(true)}
              className="bg-white text-indigo-900 hover:bg-indigo-50 px-5 py-3 rounded-2xl shadow-lg font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-sm"
            >
              <Plus className="w-5 h-5 text-indigo-600" /> Novo Cadastro (Tutor/Pet)
            </button>

            <Link href="/lab">
              <button 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
              >
                <TestTube className="w-5 h-5" /> Coletas Laboratório
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Módulos de Recepção Originais */}
      {hasReceptionPerms && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="p-1 bg-amber-100 text-amber-600 rounded-lg"><DollarSign className="w-4 h-4" /></span>
            <h2 className="text-xl font-bold text-slate-800">Módulos de Recepção</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setIsPatientModalOpen(true)}
              className="p-6 border-amber-200/60 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed rounded-3xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Novo Cadastro</h3>
                  <p className="text-sm text-slate-600">Tutor Completo & Pacientes (Pet)</p>
                </div>
              </div>
            </div>
            
            <Link href="/financial/pdv">
              <div className="p-6 border-amber-200/60 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-md transition-shadow cursor-pointer h-full border-2 border-dashed rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Caixa / PDV</h3>
                    <p className="text-sm text-slate-600">Fechar Contas e Receber</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Cards de Passagem de Plantão e Estoque Originais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passagem de Plantão */}
        <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Passagem de Plantão</h2>
              <p className="text-sm text-slate-500 font-medium">Preencha o checklist de limpeza, equipamentos e intercorrências.</p>
            </div>
          </div>
          <Link href="/hospitalization">
            <button className="w-full py-3 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-center">
              Abrir Painel da UTI & Plantão
            </button>
          </Link>
        </div>

        {/* Estoque & Controlados */}
        <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <PackageCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Estoque & Controlados</h2>
              <p className="text-sm text-slate-500 font-medium">Controle de lotes, validade e movimentações físicas.</p>
            </div>
          </div>
          <Link href="/inventory">
            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-center">
              Gerenciar Estoque
            </button>
          </Link>
        </div>
      </div>

      {/* ÁREA PRINCIPAL: FILA DE TRIAGEM, ATENDIMENTOS DO DIA E AGENDA DO DIA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Fila de Triagem, Atendimentos e Agenda */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. FILA DE TRIAGEM */}
          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-600" /> Fila de Triagem (Recepção)
              </h2>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                {triageQueue.length} na fila
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {triageQueue.map(apt => (
                <div key={apt.id} className="p-6 px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="text-center w-16">
                      <p className="text-xl font-black text-slate-700">{apt.time}</p>
                    </div>
                    <div className="w-px h-12 bg-slate-200"></div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{apt.patient} <span className="text-xs font-medium text-slate-500">({apt.species})</span></h4>
                      <p className="text-sm text-slate-500 font-medium">Tutor: <strong className="text-slate-700">{apt.tutor}</strong> • {apt.type}</p>
                    </div>
                  </div>
                  <Link href={`/clinical/att-${apt.id}?tab=exam`}>
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all text-sm shadow-md shadow-indigo-600/20 hover:scale-105 active:scale-95">
                      Fazer Triagem / Atender
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 2. FILA DOS ATENDIMENTOS DO DIA */}
          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-purple-600" /> Atendimentos do Dia (Fila Médica)
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {todayAttendances.map(att => (
                <Link href={`/clinical/att-${att.id}`} key={att.id}>
                  <div className="p-4 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200 hover:border-indigo-300 space-y-2 transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">{att.time}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        att.status === 'Em Atendimento' ? 'bg-purple-100 text-purple-700' :
                        att.status === 'Aguardando Médico' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {att.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{att.patient}</h4>
                    <p className="text-xs text-slate-500">Tutor: {att.tutor}</p>
                    <p className="text-xs font-semibold text-slate-700 border-t border-slate-200 pt-2">{att.vet}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. AGENDA DO DIA */}
          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-600" /> Agenda do Dia
              </h2>
              <Link href="/appointments">
                <button className="text-xs font-bold text-indigo-600 hover:underline">Ver Agenda Completa ➔</button>
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {todayAgenda.map(ag => (
                <div key={ag.id} className="p-4 px-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">{ag.time}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{ag.patient} <span className="text-xs font-normal text-slate-500">({ag.type})</span></h4>
                      <p className="text-xs text-slate-500">Médico: {ag.vet}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                    {ag.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Lado Direito: Avisos da UTI (Original) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-3xl border border-slate-200/60 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <AlertTriangle className="w-6 h-6 text-amber-500" /> Avisos da UTI
            </h2>
            <div className="space-y-4">
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200/60">
                <h4 className="text-sm font-bold text-amber-900">Alerta de Aprazamento</h4>
                <p className="text-sm text-amber-700/80 mt-1 font-medium">Consulte os horários de checagem de medicação no módulo de internação.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Cadastro de Tutor e Pet */}
      <CreatePatientModal 
        isOpen={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)} 
      />
    </div>
  );
}
