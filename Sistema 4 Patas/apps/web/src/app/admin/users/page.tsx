"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, UserPlus, Search, Edit2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'João Silva', email: 'joao@clinica.com', role: 'Veterinário', status: 'Ativo' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const showToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setUsers([...users, { id: Date.now(), name: formData.name, email: formData.email, role: formData.role, status: 'Ativo' }]);
      setIsSaving(false);
      setShowModal(false);
      setFormData({ name: '', email: '', role: '' });
      showToast('Usuário criado com sucesso!');
    }, 800);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Usuários e Equipe</h1>
          <p className="text-slate-500 mt-1">Gerencie os acessos do sistema</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden sm:rounded-2xl">
        {users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhum registro encontrado.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map((user) => (
              <li key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">{user.name}</div>
                    <div className="text-sm font-medium text-slate-500">{user.email} - {user.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {user.status}
                  </span>
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium">Editar</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Novo Usuário</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-11" placeholder="Nome completo" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <Input 
                  required type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-11" placeholder="email@clinica.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Perfil</label>
                <Input 
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full h-11" placeholder="Ex: Veterinário, Recepção" 
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5" />
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
