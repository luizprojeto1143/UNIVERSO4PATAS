'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Users, FlaskConical, Pill, ChevronLeft, Plus, Save, Search, User, X
} from 'lucide-react';
import { useClinicalStore } from '../../../../store/useClinicalStore';

export default function PrescribePage() {
  const pathname = usePathname() || '/pwa/vet/prescribe';
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  // ZUSTAND STORE
  const appointments = useClinicalStore(state => state.appointments);
  
  // Try to find if there is a patient currently in consultation
  const activeConsultation = appointments.find(a => a.status === 'Em Consulta');

  const [selectedPatientId, setSelectedPatientId] = useState<string>(activeConsultation?.id || '');
  const [prescriptions, setPrescriptions] = useState<{id: number, text: string}[]>([]);
  const [customText, setCustomText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const navItems = [
    { href: '/pwa/vet', label: 'Home', icon: Home },
    { href: '/pwa/vet/queue', label: 'Fila', icon: Users },
    { href: '/pwa/vet/results', label: 'Resultados', icon: FlaskConical },
    { href: '/pwa/vet/prescribe', label: 'Prescrever', icon: Pill },
  ];

  const templates = [
    { id: 1, name: 'Dipirona Gotas', text: 'Dipirona 500mg/ml - 1 gota por kg a cada 8h por 3 dias.' },
    { id: 2, name: 'Amoxicilina + Clav.', text: 'Amoxicilina + Clavulanato 250mg - 1 comprimido a cada 12h por 7 dias.' },
    { id: 3, name: 'Meloxicam 1mg', text: 'Meloxicam 1mg - 1 comprimido a cada 24h por 4 dias.' },
    { id: 4, name: 'Ondansetrona', text: 'Ondansetrona 4mg - 1/2 comprimido a cada 12h se houver vômito.' },
  ];

  const addTemplate = (template: typeof templates[0]) => {
    if (prescriptions.some(p => p.id === template.id)) {
      showToast('Este item já foi adicionado!', 'error');
      return;
    }
    setPrescriptions([...prescriptions, template]);
    showToast(`${template.name} adicionado.`, 'success');
  };

  const removePrescription = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const addCustom = () => {
    if (!customText.trim()) return;
    setPrescriptions([...prescriptions, { id: Date.now(), text: customText }]);
    setCustomText('');
  };

  const handleSave = () => {
    if (!selectedPatientId) {
      showToast('Selecione um paciente primeiro!', 'error');
      return;
    }
    if (prescriptions.length === 0) {
      showToast('Adicione ao menos um item!', 'error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Prescrição salva e enviada para o tutor!', 'success');
      setTimeout(() => router.push('/pwa/vet'), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans relative">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 w-[90%] text-center rounded-xl shadow-lg text-white text-sm font-bold flex justify-center items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-indigo-600 text-white px-5 pt-12 pb-6 shadow-md rounded-b-[2rem] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full active:bg-white/30">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Prescrição Digital</h1>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        
        {/* Patient Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
            <User size={14}/> Selecionar Paciente
          </label>
          <div className="relative">
            <select 
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 h-14 rounded-2xl px-4 appearance-none font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Selecione um paciente...</option>
              {appointments.filter(a => a.status === 'Em Consulta' || a.status === 'Finalizado').map(app => (
                <option key={app.id} value={app.id}>{app.petName} ({app.ownerName})</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronLeft size={16} className="-rotate-90" />
            </div>
          </div>
          {activeConsultation && selectedPatientId === activeConsultation.id && (
            <p className="text-xs font-bold text-indigo-600 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Paciente atual em consulta
            </p>
          )}
        </div>

        {/* Templates */}
        <div>
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Search size={16} /> Prescrições Rápidas
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {templates.map(template => (
              <button 
                key={template.id}
                onClick={() => addTemplate(template)}
                className="bg-white border border-slate-200 p-4 rounded-2xl min-w-[160px] text-left active:bg-slate-50 transition-colors shadow-sm flex flex-col justify-between"
              >
                <span className="font-bold text-slate-800 text-sm mb-2 leading-tight">{template.name}</span>
                <span className="text-[10px] text-slate-500 line-clamp-2">{template.text}</span>
                <div className="mt-3 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center self-end">
                  <Plus size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Digitar medicamento livre..."
            className="flex-1 bg-slate-50 border border-slate-100 h-12 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={addCustom}
            className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center active:bg-indigo-200"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Current Prescription */}
        {prescriptions.length > 0 && (
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100 space-y-3">
            <h3 className="font-bold text-amber-800 text-sm">Receituário Atual</h3>
            
            <div className="space-y-2">
              {prescriptions.map((p, index) => (
                <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3 items-start border border-amber-50">
                  <span className="font-bold text-amber-500 text-sm">{index + 1}.</span>
                  <p className="flex-1 text-sm text-slate-700 leading-tight pt-0.5">{p.text}</p>
                  <button onClick={() => removePrescription(p.id)} className="p-1 text-slate-400 hover:text-red-500 rounded-full active:bg-slate-100">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full mt-4 bg-amber-500 text-white font-bold text-lg h-14 rounded-2xl shadow-md shadow-amber-200 active:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? 'Gerando PDF...' : <><Save size={20} /> Assinar e Salvar</>}
            </button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
              <item.icon size={24} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
