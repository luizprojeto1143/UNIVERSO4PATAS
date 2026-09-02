"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import TimelineView from "./TimelineView";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Save, AlertTriangle, Edit3, MapPin, Phone, Mail, FileText, Calendar, Activity, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useImagingStore } from "@/store/useImagingStore";

export default function PatientProfileClient({ patient, timeline }: { patient: any, timeline: any[] }) {
  const reports = useImagingStore(state => state.reports);
  const patientReports = reports.filter(r => r.patientId === patient.id.toString());
  
  const [activeTab, setActiveTab] = useState<'timeline' | 'patient' | 'tutor' | 'vaccines' | 'exams' | 'imaging'>('timeline');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // Edit States
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientData, setPatientData] = useState({
    name: patient.name,
    weight: patient.weight || '',
    birthDate: patient.birthDate ? patient.birthDate.split('T')[0] : ''
  });

  const [isEditingTutor, setIsEditingTutor] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);

  const [tutorData, setTutorData] = useState({
    name: patient.tutor?.name || '',
    email: patient.tutor?.email || '',
    phone: patient.tutor?.phone || '',
    cpf: patient.tutor?.cpf || '',
    address: patient.tutor?.address || ''
  });

  const [alertData, setAlertData] = useState({ description: '', severity: 'low' });
  const [vaccineData, setVaccineData] = useState({ name: '', dose: '', dateApplied: '', nextDueDate: '' });

  const handleStartRecord = async () => {
    setLoading(true);
    try {
      await fetchApi('clinical/records', {
        method: 'POST',
        body: JSON.stringify({ patientId: patient.id })
      });
      showToast("Atendimento iniciado com sucesso!");
      router.refresh();
    } catch (e) {
      setTimeout(() => {
        showToast("Atendimento iniciado com sucesso (Simulado)!");
        router.refresh();
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const savePatient = async () => {
    try {
      await fetchApi(`patients/${patient.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: patientData.name,
          weight: patientData.weight ? Number(patientData.weight) : null,
          birthDate: patientData.birthDate || null
        })
      });
      setIsEditingPatient(false);
      showToast("Paciente atualizado com sucesso!");
      router.refresh();
    } catch (e) { 
      setTimeout(() => {
        setIsEditingPatient(false);
        showToast("Paciente atualizado com sucesso (Simulado)!");
      }, 500);
    }
  };

  const saveTutor = async () => {
    try {
      await fetchApi(`tutors/${patient.tutor.id}`, {
        method: 'PATCH',
        body: JSON.stringify(tutorData)
      });
      setIsEditingTutor(false);
      showToast("Tutor atualizado com sucesso!");
      router.refresh();
    } catch (e) { 
      setTimeout(() => {
        setIsEditingTutor(false);
        showToast("Tutor atualizado com sucesso (Simulado)!");
      }, 500);
    }
  };

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`patients/${patient.id}/alerts`, {
        method: 'POST',
        body: JSON.stringify(alertData)
      });
      setIsAlertModalOpen(false);
      setAlertData({ description: '', severity: 'low' });
      showToast("Alerta adicionado com sucesso!");
      router.refresh();
    } catch (e) { 
      setTimeout(() => {
        setIsAlertModalOpen(false);
        setAlertData({ description: '', severity: 'low' });
        showToast("Alerta adicionado com sucesso (Simulado)!");
      }, 500);
    }
  };

  const handleAddVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`patients/${patient.id}/vaccines`, {
        method: 'POST',
        body: JSON.stringify(vaccineData)
      });
      setIsVaccineModalOpen(false);
      setVaccineData({ name: '', dose: '', dateApplied: '', nextDueDate: '' });
      showToast("Vacina adicionada com sucesso!");
      router.refresh();
    } catch (e) { 
      setTimeout(() => {
        setIsVaccineModalOpen(false);
        setVaccineData({ name: '', dose: '', dateApplied: '', nextDueDate: '' });
        showToast("Vacina adicionada com sucesso (Simulado)!");
      }, 500);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 relative">
      {/* Toast Notification */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="font-bold">{toast.message}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-10 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          
          <div className="flex items-center relative z-10">
            <div className="h-28 w-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white text-5xl font-black border border-white/30 shadow-xl overflow-hidden">
              {patient.name.charAt(0)}
            </div>
            
            <div className="ml-8 text-white flex-1">
              <h1 className="text-4xl font-black tracking-tight mb-2">{patient.name}</h1>
              <div className="flex items-center gap-4 text-indigo-100 font-medium text-lg">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-300"></span> {patient.species?.name}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-300"></span> {patient.breed?.name || 'SRD'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-300"></span> {patient.ageText}</span>
                {patient.weight && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-300"></span> {patient.weight} kg</span>}
              </div>
              <div className="mt-5 flex gap-2">
                {patient.alerts?.map((alert: any) => (
                  <span key={alert.id} className={`px-4 py-1.5 bg-${alert.severity === 'high' ? 'red' : 'amber'}-500 text-white text-xs font-bold rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-sm`}>
                    <AlertTriangle className="w-3 h-3" />
                    {alert.description}
                  </span>
                ))}
                <Button 
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors backdrop-blur-sm"
                >
                  + Adicionar Alerta
                </Button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-white min-w-[250px] shadow-lg">
              <p className="text-xs text-indigo-200 uppercase font-black tracking-wider mb-2 flex items-center gap-2">
                Tutor Responsável
              </p>
              <p className="font-bold text-xl">{patient.tutor?.name}</p>
              <p className="text-sm text-indigo-100 mt-2 flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4" /> {patient.tutor?.phone || 'Sem telefone'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex px-6 border-b border-slate-100 bg-white overflow-x-auto hide-scrollbar">
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'timeline' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('timeline')}
          >
            Histórico Clínico
            {activeTab === 'timeline' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'patient' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('patient')}
          >
            Dados do Paciente
            {activeTab === 'patient' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'tutor' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('tutor')}
          >
            Dados do Tutor
            {activeTab === 'tutor' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'vaccines' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('vaccines')}
          >
            Carteira de Vacinação
            {activeTab === 'vaccines' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'exams' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('exams')}
          >
            Exames (Laboratório)
            {activeTab === 'exams' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'imaging' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('imaging')}
          >
            Exames de Imagem
            {activeTab === 'imaging' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
        
        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Evolução Clínica</h2>
              <Button 
                onClick={handleStartRecord}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Iniciar Atendimento
              </Button>
            </div>
            
            {timeline.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
                  <Activity className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-xl font-black text-slate-700 tracking-tight">Nenhum atendimento registrado.</p>
                <p className="text-slate-500 font-medium mt-2">Clique em iniciar atendimento para abrir um prontuário.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {timeline.map((record: any) => (
                  <div key={record.recordId} className="border border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 px-8 py-5 flex justify-between items-center border-b border-slate-200">
                      <div>
                        <h3 className="font-black text-slate-800 text-xl tracking-tight">Prontuário Clínico</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">{new Date(record.startedAt).toLocaleDateString('pt-BR')} â€¢ {record.veterinarian}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${record.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {record.status === 'open' ? 'Em andamento' : 'Finalizado'}
                        </span>
                        {record.status === 'open' && (
                          <Button 
                            onClick={async () => {
                              try {
                                await fetchApi(`clinical/records/${record.recordId}/finish`, { method: 'PATCH' });
                                showToast("Atendimento finalizado!");
                                router.refresh();
                              } catch (e) { 
                                setTimeout(() => showToast("Atendimento finalizado (Simulado)!"), 500);
                              }
                            }}
                            className="text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 px-5 py-2.5 rounded-xl transition-all shadow-sm"
                          >
                            Finalizar Atendimento
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-8">
                      <TimelineView events={record.events} recordId={record.recordId} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PATIENT TAB */}
        {activeTab === 'patient' && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Dados do Paciente</h2>
              {!isEditingPatient && (
                <Button 
                  onClick={() => setIsEditingPatient(true)} 
                  className="text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Editar
                </Button>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
                  {isEditingPatient ? (
                    <Input value={patientData.name} onChange={e=>setPatientData({...patientData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800">{patient.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Espécie / Raça</label>
                  <div className="text-lg font-bold text-slate-800">{patient.species?.name} â€¢ {patient.breed?.name || 'SRD'}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data de Nascimento</label>
                  {isEditingPatient ? (
                    <Input type="date" value={patientData.birthDate} onChange={e=>setPatientData({...patientData, birthDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800">{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : '-'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Peso (kg)</label>
                  {isEditingPatient ? (
                    <Input type="number" step="0.1" value={patientData.weight} onChange={e=>setPatientData({...patientData, weight: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800">{patient.weight || '-'}</div>
                  )}
                </div>
              </div>

              {isEditingPatient && (
                <div className="pt-6 flex gap-3">
                  <Button onClick={savePatient} className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 flex items-center gap-2 shadow-sm">
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </Button>
                  <Button onClick={() => setIsEditingPatient(false)} className="bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-200">
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TUTOR TAB */}
        {activeTab === 'tutor' && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Dados do Tutor</h2>
              {!isEditingTutor && (
                <Button 
                  onClick={() => setIsEditingTutor(true)} 
                  className="text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Editar
                </Button>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
                  {isEditingTutor ? (
                    <Input value={tutorData.name} onChange={e=>setTutorData({...tutorData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800">{patient.tutor?.name}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CPF</label>
                  {isEditingTutor ? (
                    <Input value={tutorData.cpf} onChange={e=>setTutorData({...tutorData, cpf: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" /> {patient.tutor?.cpf || '-'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefone</label>
                  {isEditingTutor ? (
                    <Input value={tutorData.phone} onChange={e=>setTutorData({...tutorData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> {patient.tutor?.phone || '-'}
                    </div>
                  )}
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  {isEditingTutor ? (
                    <Input value={tutorData.email} onChange={e=>setTutorData({...tutorData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> {patient.tutor?.email || '-'}
                    </div>
                  )}
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Endereço</label>
                  {isEditingTutor ? (
                    <Input value={tutorData.address} onChange={e=>setTutorData({...tutorData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> {patient.tutor?.address || '-'}
                    </div>
                  )}
                </div>
              </div>

              {isEditingTutor && (
                <div className="pt-6 flex gap-3">
                  <Button onClick={saveTutor} className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 flex items-center gap-2 shadow-sm">
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </Button>
                  <Button onClick={() => setIsEditingTutor(false)} className="bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-200">
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VACCINES TAB */}
        {activeTab === 'vaccines' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Carteira de Vacinação</h2>
              <Button 
                onClick={() => setIsVaccineModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2"
              >
                + Nova Vacina
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-4">Vacina</th>
                    <th className="pb-4">Dose</th>
                    <th className="pb-4">Data Aplicação</th>
                    <th className="pb-4">Próxima Dose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patient.vaccines?.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-5 font-bold text-slate-800">{v.name}</td>
                      <td className="py-5 font-medium text-slate-600">{v.dose || '-'}</td>
                      <td className="py-5 font-medium text-slate-600">{v.dateApplied ? new Date(v.dateApplied).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="py-5">
                        {v.nextDueDate ? (
                          <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full flex items-center gap-2 w-max">
                            <Calendar className="w-3 h-3" />
                            {new Date(v.nextDueDate).toLocaleDateString('pt-BR')}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                  {(!patient.vaccines || patient.vaccines.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                        Nenhuma vacina registrada para este paciente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXAMS TAB */}
        {activeTab === 'exams' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Resultados de Laboratório</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
                Solicitar Novo Exame
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'REQ-8819', name: 'Hemograma Completo', date: '30/07/2026', status: 'laudado', doctor: 'Dra. Luiza' },
                { id: 'REQ-8750', name: 'Bioquímico (Renal/Hepático)', date: '15/06/2026', status: 'laudado', doctor: 'Dr. Carlos' },
              ].map(exam => (
                <div key={exam.id} className="border border-slate-200 bg-white rounded-2xl p-6 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{exam.name}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Data: {exam.date} â€¢ Solicitante: {exam.doctor}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                          Laudo Liberado
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Assinado Digitalmente
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button className="text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors">
                      Ver Laudo (PDF)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMAGING TAB */}
        {activeTab === 'imaging' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Exames de Imagem</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
                Solicitar Novo Exame
              </Button>
            </div>
            
            <div className="space-y-4">
              {patientReports.map(exam => (
                <div key={exam.id} className="border border-green-200 bg-green-50/30 rounded-2xl p-6 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                     <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{exam.modality} - {exam.fileName}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Data: {exam.date} • Clínica/Parceiro: {exam.provider}</p>
                      <p className="text-sm text-green-700 mt-2 font-bold flex items-center gap-1">
                        <CheckCircle2 size={16} /> NOVO LAUDO RECEBIDO VIA PORTAL DO PARCEIRO
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className="text-white font-bold bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                      Ver Laudo em PDF
                    </Button>
                  </div>
                </div>
              ))}
              {[
                { id: 'IMG-1029', name: 'Radiografia de Tórax', date: '01/08/2026', provider: 'Centro de Diagnóstico Vet', snippet: 'Silhueta cardíaca preservada. Campos pulmonares sem alterações evidentes.' },
                { id: 'IMG-1005', name: 'Ultrassonografia Abdominal', date: '10/05/2026', provider: 'ImagemVet', snippet: 'Fígado com dimensões normais. Rins com ecogenicidade habitual.' },
              ].map(exam => (
                <div key={exam.id} className="border border-slate-200 bg-white rounded-2xl p-6 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                     <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{exam.name}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Data: {exam.date} • Clínica/Parceiro: {exam.provider}</p>
                      <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        "{exam.snippet}"
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => showToast('Abrindo visualizador DICOM... (Simulado)')} className="text-white font-bold bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                      Ver Imagens
                    </Button>
                    <Button className="text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors">
                      Ver Laudo Completo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Novo Alerta Médico</h2>
              <Button onClick={() => setIsAlertModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </Button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Descrição do Alerta</label>
                  <Input 
                    type="text" 
                    required
                    placeholder="Ex: Alérgico a Dipirona"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 outline-none"
                    value={alertData.description}
                    onChange={e => setAlertData({...alertData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Gravidade</label>
                  <select 
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 outline-none"
                    value={alertData.severity}
                    onChange={e => setAlertData({...alertData, severity: e.target.value})}
                  >
                    <option value="low">Atenção (Amarelo)</option>
                    <option value="high">Crítico (Vermelho)</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" onClick={() => setIsAlertModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancelar</Button>
                  <Button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm">Salvar Alerta</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Vaccine Modal */}
      {isVaccineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Nova Vacina</h2>
              <Button onClick={() => setIsVaccineModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </Button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddVaccine} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Vacina / Produto</label>
                  <Input 
                    type="text" 
                    required
                    placeholder="Ex: V10, Antirrábica..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 outline-none"
                    value={vaccineData.name}
                    onChange={e => setVaccineData({...vaccineData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Dose / Lote (Opcional)</label>
                  <Input 
                    type="text" 
                    placeholder="Ex: 1Âª Dose, Reforço..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 outline-none"
                    value={vaccineData.dose}
                    onChange={e => setVaccineData({...vaccineData, dose: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Data da Aplicação</label>
                    <Input 
                      type="date" 
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 outline-none"
                      value={vaccineData.dateApplied}
                      onChange={e => setVaccineData({...vaccineData, dateApplied: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Próxima Dose</label>
                    <Input 
                      type="date" 
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 outline-none"
                      value={vaccineData.nextDueDate}
                      onChange={e => setVaccineData({...vaccineData, nextDueDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" onClick={() => setIsVaccineModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancelar</Button>
                  <Button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm">Salvar Vacina</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
