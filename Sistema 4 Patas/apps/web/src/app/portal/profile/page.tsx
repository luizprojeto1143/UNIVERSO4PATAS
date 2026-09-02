"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Phone, MapPin, ShieldCheck, LogOut, Loader2, Edit2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PortalProfilePage() {
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Roberto Almeida Costa',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - Apto 45',
  });

  const handleLogout = () => {
    router.push('/portal/login');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      showToast('Perfil atualizado com sucesso!');
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6">
      
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Minha Conta</h1>
      </div>

      {/* Avatar / Resumo */}
      <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-3xl font-black text-indigo-700">RC</span>
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-800">{formData.name}</h2>
        <p className="text-sm text-slate-500 font-medium">roberto.costa@email.com</p>
        <div className="mt-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Conta Verificada
        </div>
      </Card>

      {/* Seções */}
      <div className="space-y-4">
        
        {/* Dados Pessoais */}
        <div>
          <div className="flex items-center justify-between mb-2 ml-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Dados Pessoais</h3>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 text-indigo-600 font-bold">
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8 text-slate-500 font-bold">
                Cancelar
              </Button>
            )}
          </div>

          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-4 space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-medium flex items-center gap-2"><User className="w-4 h-4" /> Nome Completo</label>
              {isEditing ? (
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl" />
              ) : (
                <p className="text-sm font-bold text-slate-800">{formData.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> CPF (Requer aprovação para mudar)</label>
              {isEditing ? (
                <Input value={formData.cpf} disabled className="rounded-xl bg-slate-50" />
              ) : (
                <p className="text-sm font-bold text-slate-800">{formData.cpf}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> WhatsApp</label>
              {isEditing ? (
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-xl" />
              ) : (
                <p className="text-sm font-bold text-slate-800">{formData.phone}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-medium flex items-center gap-2"><MapPin className="w-4 h-4" /> Endereço</label>
              {isEditing ? (
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl" />
              ) : (
                <p className="text-sm font-bold text-slate-800">{formData.address}</p>
              )}
            </div>

            {isEditing && (
              <Button onClick={handleSave} disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 mt-4">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </Card>
        </div>

        {/* Preferências e LGPD */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Privacidade e Preferências</h3>
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="pr-4">
                <p className="text-sm font-bold text-slate-800">Notificações por WhatsApp</p>
                <p className="text-xs text-slate-500 font-medium">Lembretes de vacina e consultas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <Input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => showToast('Funcionalidade em desenvolvimento.')}>
              <div>
                <p className="text-sm font-bold text-slate-800">Contatos Autorizados</p>
                <p className="text-xs text-slate-500 font-medium">Quem pode buscar o pet na clínica</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => showToast('Funcionalidade em desenvolvimento.')}>
              <div>
                <p className="text-sm font-bold text-slate-800">Termos de Uso e LGPD</p>
                <p className="text-xs text-slate-500 font-medium">Gerenciar meus consentimentos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full h-12 text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 font-bold rounded-2xl"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair do App
          </Button>
        </div>

      </div>

    </div>
  );
}
