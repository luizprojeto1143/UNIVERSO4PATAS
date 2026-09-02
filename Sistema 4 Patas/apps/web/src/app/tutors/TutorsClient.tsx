"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Phone, Mail, FileText, User, ChevronRight, X, Loader2 } from "lucide-react";

const DEFAULT_TUTORS = [
  { id: 'tut-1', name: 'Luciana Santos', cpf: '123.456.789-00', email: 'luciana@email.com', phone: '(11) 98765-4321', patients: [{ id: 'pet-1', name: 'Thor' }] },
  { id: 'tut-2', name: 'Roberto Alves', cpf: '234.567.890-11', email: 'roberto@email.com', phone: '(11) 91234-5678', patients: [{ id: 'pet-2', name: 'Mel' }] },
  { id: 'tut-3', name: 'Cosme Junio', cpf: '345.678.901-22', email: 'cosme@email.com', phone: '(11) 99999-8888', patients: [{ id: 'pet-3', name: 'Rock' }] }
];

export default function TutorsClient({ initialTutors }: { initialTutors: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [tutorsList, setTutorsList] = useState<any[]>(() => 
    initialTutors && initialTutors.length > 0 ? initialTutors : DEFAULT_TUTORS
  );

  const [formData, setFormData] = useState({ name: '', cpf: '', email: '', phone: '' });

  const tutors = tutorsList.filter(t => 
    (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.cpf && t.cpf.includes(searchTerm)) ||
    (t.phone && t.phone.includes(searchTerm))
  );

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSaveTutor = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const createdTutor = {
        id: `tut-${Date.now()}`,
        name: formData.name || 'Novo Tutor',
        cpf: formData.cpf || '000.000.000-00',
        email: formData.email || 'tutor@email.com',
        phone: formData.phone || '(11) 99999-0000',
        patients: []
      };
      setTutorsList(prev => [createdTutor, ...prev]);
      setIsSaving(false);
      setIsModalOpen(false);
      setFormData({ name: '', cpf: '', email: '', phone: '' });
      showToast('Tutor cadastrado com sucesso!');
    }, 600);
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-sm z-50 animate-in slide-in-from-bottom-5 text-white ${toast.type === 'success' ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Modal Novo Tutor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Novo Tutor</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTutor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <Input required placeholder="Ex: João Silva" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                <Input required placeholder="000.000.000-00" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <Input type="email" required placeholder="joao@exemplo.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                <Input required placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                <Input required placeholder="Rua Exemplo, 123" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Tutor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Tutores</h1>
          <p className="text-slate-500 font-medium mt-1">Gerencie os clientes e responsáveis pelos pets.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-sm transition-all font-bold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Novo Tutor
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutors.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-600">Nenhum tutor encontrado.</p>
          </div>
        ) : (
          tutors.map((tutor) => (
            <Link key={tutor.id} href={`/tutors/${tutor.id}`}>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all hover:border-indigo-200 group cursor-pointer h-full flex flex-col">
                <div className="flex items-center gap-5 mb-6">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-2xl shadow-sm group-hover:scale-105 transition-transform">
                    {tutor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{tutor.name}</h2>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {tutor.phone || 'Sem telefone'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email</span>
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">{tutor.email || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5"><FileText className="w-4 h-4" /> CPF</span>
                    <span className="font-bold text-slate-700">{tutor.cpf || '-'}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pacientes Vinculados</span>
                    <span className="bg-indigo-50 text-indigo-700 font-black px-3 py-1 rounded-lg text-sm border border-indigo-100">
                      {tutor.patients?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
