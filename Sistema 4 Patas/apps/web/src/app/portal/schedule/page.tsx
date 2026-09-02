'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, CheckCircle2, User, Stethoscope, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function PortalSchedulePage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const pets = ['Thor (Cão)', 'Luna (Gato)'];
  const services = ['Consulta', 'Retorno', 'Vacinação', 'Exames', 'Banho e Tosa'];
  const dates = ['Amanhã, 08/Ago', 'Sex, 09/Ago', 'Sáb, 10/Ago'];
  const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];

  const handleRequestConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsModalOpen(false);
      showToast('Solicitação enviada! Em breve nossa equipe confirmará o agendamento.');
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 relative">
      <div className="pt-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Agendar</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Marque consultas e serviços.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Solicitar Consulta
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              {s}
            </div>
            {s < 4 && <div className={`h-1 w-12 sm:w-20 mx-1 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>

      <div className="mt-8">
        
        {/* Step 1: Pet */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-lg font-black text-slate-800">Quem vamos atender?</h2>
            {pets.length === 0 ? (
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pets.map((pet) => (
                  <Card 
                    key={pet} 
                    onClick={() => setSelectedPet(pet)}
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedPet === pet ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-xl text-slate-400">
                          {pet.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 text-lg">{pet}</span>
                      </div>
                      {selectedPet === pet && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <Button 
              disabled={!selectedPet}
              onClick={() => setStep(2)}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl mt-6 shadow-lg shadow-indigo-200 transition-all"
            >
              Continuar
            </Button>
          </div>
        )}

        {/* Step 2: Service */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-lg font-black text-slate-800">Qual o motivo?</h2>
            
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex gap-3 items-start">
              <Stethoscope className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-800 mb-1">É uma urgência médica?</p>
                <p className="text-xs text-rose-700 font-medium">Casos urgentes não devem esperar agenda. Dirija-se imediatamente à clínica ou ligue agora.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {services.map((srv) => (
                <Card 
                  key={srv} 
                  onClick={() => setSelectedService(srv)}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-24 ${selectedService === srv ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                >
                  <span className="font-bold text-slate-800 text-sm">{srv}</span>
                </Card>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="w-14 h-14 rounded-2xl border-slate-200">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </Button>
              <Button 
                disabled={!selectedService}
                onClick={() => setStep(3)}
                className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-200 transition-all"
              >
                Escolher Horário
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-lg font-black text-slate-800">Data e Hora</h2>
            
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Selecione o Dia</p>
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x">
                {dates.map((d) => (
                  <Button 
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`snap-start shrink-0 px-5 py-3 rounded-2xl border-2 font-bold transition-all ${selectedDate === d ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-4 animate-in fade-in">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Horários Livres</p>
                <div className="grid grid-cols-3 gap-3">
                  {times.map((t) => (
                    <Button 
                      key={t}
                      onClick={() => setStep(4)}
                      className="py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all text-sm"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="w-14 h-14 rounded-2xl border-slate-200">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Tudo Certo!</h2>
              <p className="text-slate-500 font-medium mt-1">Seu agendamento foi reservado.</p>
            </div>

            <Card className="p-4 bg-slate-50 border-slate-200 shadow-sm rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Quando</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedDate} às 14:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Onde</p>
                  <p className="font-bold text-slate-800 text-sm">Clínica 4 Patas - Matriz</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Profissional</p>
                  <p className="font-bold text-slate-800 text-sm">Qualquer Vet. Disponível</p>
                </div>
              </div>
            </Card>

            <Link href="/portal">
              <Button className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white font-black text-lg rounded-2xl mt-4 transition-all">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Modal de Solicitação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-slate-800 mb-4">Solicitar Consulta</h2>
            
            <form onSubmit={handleRequestConsultation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Pet</label>
                <select className="w-full h-12 mt-1 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required>
                  <option value="">Selecione o pet</option>
                  <option value="Thor">Thor</option>
                  <option value="Luna">Luna</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Especialidade</label>
                <select className="w-full h-12 mt-1 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required>
                  <option value="">Selecione a especialidade</option>
                  <option value="Clinica">Clínica Geral</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Cardiologia">Cardiologia</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Data Preferencial</label>
                <Input type="date" className="h-12 mt-1 rounded-xl bg-slate-50" required />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Observações</label>
                <textarea rows={3} className="w-full mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none" placeholder="Motivo da consulta..." />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-2">
                {isSaving ? 'Enviando...' : 'Confirmar Solicitação'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
