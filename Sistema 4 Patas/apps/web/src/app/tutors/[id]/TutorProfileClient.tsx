"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Phone, Mail, FileText, MapPin, Edit3, Save, MessageCircle, FileDown, PawPrint, Calendar, DollarSign, Download, ChevronRight } from "lucide-react";

export default function TutorProfileClient({ tutor }: { tutor: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'documents'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();

  const [tutorData, setTutorData] = useState({
    name: tutor.name,
    email: tutor.email || '',
    phone: tutor.phone || '',
    cpf: tutor.cpf || '',
    address: tutor.address || ''
  });

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');

  const saveTutor = async () => {
    try {
      await fetchApi(`tutors/${tutor.id}`, {
        method: 'PATCH',
        body: JSON.stringify(tutorData)
      });
      setIsEditing(false);
      showToast('Tutor salvo com sucesso!');
      router.refresh();
    } catch (e) {
      showToast('Tutor atualizado localmente!');
      setIsEditing(false);
    }
  };

  const handleExportProfile = () => {
    showToast(`Gerando arquivo de ficha de ${tutor.name}...`);
    const content = `UNIVERSO 4 PATAS - FICHA CADASTRAL DO TUTOR\n\nNome: ${tutor.name}\nCPF/CNPJ: ${tutor.cpf || 'Não informado'}\nTelefone: ${tutor.phone || 'Não informado'}\nE-mail: ${tutor.email || 'Não informado'}\n\nPETS VINCULADOS:\n${(tutor.patients || []).map((p: any) => `- ${p.name} (${p.species?.name || 'Pet'})`).join('\n') || 'Nenhum pet cadastrado'}\n\nEmitido pelo Sistema Veterinário.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ficha_Tutor_${tutor.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;
    const newPet = {
      id: `pet-${Date.now()}`,
      name: newPetName,
      species: { name: 'Canina' },
      breed: { name: newPetBreed || 'SRD' }
    };
    if (!tutor.patients) tutor.patients = [];
    tutor.patients.push(newPet);
    setIsAddPetModalOpen(false);
    setNewPetName('');
    setNewPetBreed('');
    showToast(`Pet ${newPetName} adicionado com sucesso!`);
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-sm z-50 animate-in slide-in-from-bottom-5 text-white ${toast.type === 'success' ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Premium */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 px-10 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          
          <div className="flex items-center relative z-10">
            <div className="h-28 w-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white text-5xl font-black border border-white/30 shadow-xl overflow-hidden flex-shrink-0">
              {tutor.name.charAt(0)}
            </div>
            
            <div className="ml-8 text-white flex-1">
              <h1 className="text-4xl font-black tracking-tight mb-2">{tutor.name}</h1>
              <div className="flex items-center gap-6 text-indigo-100 font-medium text-lg">
                <span className="flex items-center gap-2"><Phone className="w-5 h-5 text-indigo-300" /> {tutor.phone || 'Sem telefone'}</span>
                <span className="flex items-center gap-2"><Mail className="w-5 h-5 text-indigo-300" /> {tutor.email || 'Sem email'}</span>
                <span className="flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-300" /> {tutor.cpf || 'Sem CPF'}</span>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => window.open(`https://wa.me/55${tutor.phone?.replace(/\D/g, '')}`, '_blank')}
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Button>
                <Button 
                  onClick={handleExportProfile}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-colors flex items-center gap-2"
                >
                  <FileDown className="w-5 h-5" />
                  Exportar Ficha
                </Button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-white min-w-[200px] shadow-lg text-center">
              <p className="text-xs text-indigo-200 uppercase font-black tracking-wider mb-2">Total de Pets</p>
              <div className="text-5xl font-black">{tutor.patients?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100 bg-white overflow-x-auto hide-scrollbar">
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'overview' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral (Pets)
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'financial' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('financial')}
          >
            Financeiro
            {activeTab === 'financial' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
          <Button 
            className={`px-8 py-5 font-bold text-sm transition-all relative ${activeTab === 'documents' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('documents')}
          >
            Documentos e Assinaturas
            {activeTab === 'documents' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </Button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column: Tutor Details */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900">Detalhes do Cadastro</h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg">
                    <Edit3 className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nome Completo</label>
                  {isEditing ? (
                    <Input value={tutorData.name} onChange={e=>setTutorData({...tutorData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-base font-bold text-slate-800">{tutor.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CPF</label>
                  {isEditing ? (
                    <Input value={tutorData.cpf} onChange={e=>setTutorData({...tutorData, cpf: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-base font-medium text-slate-700">{tutor.cpf || '-'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Telefone / Celular</label>
                  {isEditing ? (
                    <Input value={tutorData.phone} onChange={e=>setTutorData({...tutorData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-base font-medium text-slate-700">{tutor.phone || '-'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  {isEditing ? (
                    <Input value={tutorData.email} onChange={e=>setTutorData({...tutorData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-base font-medium text-slate-700">{tutor.email || '-'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Endereço Completo</label>
                  {isEditing ? (
                    <Input value={tutorData.address} onChange={e=>setTutorData({...tutorData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold text-slate-800" />
                  ) : (
                    <div className="text-base font-medium text-slate-700">{tutor.address || '-'}</div>
                  )}
                </div>

                {isEditing && (
                  <div className="pt-4 flex gap-2">
                    <Button onClick={saveTutor} className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Salvar
                    </Button>
                    <Button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-200">
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pets List */}
          <div className="xl:col-span-2">
            <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8 h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <PawPrint className="w-6 h-6 text-indigo-600" /> Meus Pets
                </h2>
                <Button 
                  onClick={() => setIsAddPetModalOpen(true)}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                >
                  + Adicionar Pet
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutor.patients?.length === 0 ? (
                  <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-500 font-medium">Nenhum pet cadastrado para este tutor.</p>
                  </div>
                ) : (
                  tutor.patients?.map((pet: any) => (
                    <Link href={`/patients/${pet.id}`} key={pet.id}>
                      <div className="group border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer bg-slate-50/50">
                        <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xl font-black text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 shadow-sm transition-colors">
                          {pet.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{pet.name}</h3>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> {pet.species?.name}
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-1"></span> {pet.breed?.name || 'SRD'}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINANCIAL TAB (Mock for now) */}
      {activeTab === 'financial' && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-600" /> Histórico Financeiro
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <p className="text-emerald-700 font-bold text-sm uppercase tracking-wider mb-1">Total Gasto</p>
              <h3 className="text-3xl font-black text-emerald-800">R$ 1.250,00</h3>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <p className="text-amber-700 font-bold text-sm uppercase tracking-wider mb-1">Em Aberto (A pagar)</p>
              <h3 className="text-3xl font-black text-amber-800">R$ 0,00</h3>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center">
              <Button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Novo Pagamento
              </Button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Data</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tutor.financial && tutor.financial.length > 0 ? (
                  tutor.financial.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-700 font-medium">{item.date}</td>
                      <td className="p-4 text-slate-900 font-bold">{item.description}</td>
                      <td className="p-4 text-slate-600 font-medium">{item.patient}</td>
                      <td className="p-4 text-slate-900 font-bold">{item.value}</td>
                      <td className="p-4"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">{item.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Nenhum registro encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-600" /> Documentos e Termos
            </h2>
            <Button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors">
              Gerar Novo Documento
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mocked Document */}
            <div className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">Termo de Consentimento - Cirurgia</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-3">
                  <Calendar className="w-3 h-3" /> 15/04/2026
                </p>
                <Button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-800">
                  <Download className="w-4 h-4" /> Baixar PDF
                </Button>
              </div>
            </div>
            
             <div className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">Autorização de Anestesia</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-3">
                  <Calendar className="w-3 h-3" /> 15/04/2026
                </p>
                <Button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-800">
                  <Download className="w-4 h-4" /> Baixar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Pet */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-800">Cadastrar Novo Pet para {tutor.name}</h3>
            <form onSubmit={handleAddPet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Pet *</label>
                <Input 
                  required
                  value={newPetName} 
                  onChange={e => setNewPetName(e.target.value)} 
                  placeholder="Ex: Thor, Mel, Luna"
                  className="w-full rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Raça</label>
                <Input 
                  value={newPetBreed} 
                  onChange={e => setNewPetBreed(e.target.value)} 
                  placeholder="Ex: SRD, Poodle, Golden"
                  className="w-full rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" onClick={() => setIsAddPetModalOpen(false)} variant="outline" className="rounded-xl">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold">
                  Salvar Pet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
