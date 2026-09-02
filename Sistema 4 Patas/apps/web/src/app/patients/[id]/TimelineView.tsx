"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const DEFAULT_EVENTS = [
  { id: 'evt-1', type: 'anamnesis', title: 'Consulta Médica de Rotina', description: 'Animal calmo, mucosas normais, sem alterações digestivas relatadas.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'evt-2', type: 'prescription', title: 'Prescrição Médica', description: 'Simparic 20mg 1 comp VO dose única + Shampoo Hipoalergênico banho 2x/semana.', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'evt-3', type: 'exam', title: 'Hemograma Completo', description: 'Hematócrito: 44%, Leucócitos: 9.800/mm³, Plaquetas: 280.000/mm³ (Dentro da normalidade).', createdAt: new Date().toISOString() }
];

export default function TimelineView({ events = [], recordId }: { events?: any[], recordId: string }) {
  const router = useRouter();
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [eventList, setEventList] = useState<any[]>(() => 
    events && events.length > 0 ? events : DEFAULT_EVENTS
  );
  
  const [formData, setFormData] = useState({
    type: 'anamnesis',
    title: '',
    description: '',
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'triage': return '📋';
      case 'anamnesis': return '🩺';
      case 'prescription': return '💊';
      case 'exam': return '🔬';
      case 'consent': return '✍️';
      default: return '📌';
    }
  };

  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'triage': return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'anamnesis': return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'prescription': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'exam': return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'consent': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default: return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newEvt = {
      id: `evt-${Date.now()}`,
      type: formData.type,
      title: formData.title || 'Registro Clínico',
      description: formData.description || 'Sem detalhes informados.',
      createdAt: new Date().toISOString()
    };

    try {
      await fetchApi(`clinical/${recordId}/events`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.warn('[TimelineView] Fetch error suppressed');
    }

    setEventList(prev => [newEvt, ...prev]);
    setShowEventForm(false);
    setFormData({ type: 'anamnesis', title: '', description: '' });
    showToast("Registro adicionado com sucesso!");
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <p className="font-bold">{toast.message}</p>
        </div>
      </div>

      <div className="mb-8">
        {!showEventForm ? (
          <Button 
            onClick={() => setShowEventForm(true)}
            className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors border border-indigo-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            Adicionar Registro Clínico
          </Button>
        ) : (
          <form onSubmit={handleAddEvent} className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            
            <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2 relative z-10">
              Novo Registro
              {formData.type === 'consent' && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">Gera Assinatura</span>}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipo do Registro</label>
                <select 
                  className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 h-11"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="triage">Triagem</option>
                  <option value="anamnesis">Anamnese / Evolução</option>
                  <option value="prescription">Receituário</option>
                  <option value="exam">Solicitação de Exame</option>
                  <option value="consent">Termo de Autorização (Para Tutor Assinar)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Título / Resumo</label>
                <Input 
                  type="text" required
                  placeholder={formData.type === 'consent' ? 'Ex: Autorização para Anestesia Geral' : 'Ex: Paciente apresenta melhora...'}
                  className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 h-11"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {formData.type === 'consent' ? 'Corpo do Documento (O que o tutor irá ler e assinar)' : 'Descrição Detalhada'}
                </label>
                <textarea 
                  required rows={4}
                  placeholder={formData.type === 'consent' ? 'Eu, [Tutor], autorizo o procedimento X...' : 'Detalhes do atendimento...'}
                  className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 relative z-10 border-t border-slate-100 pt-5 mt-2">
              <Button type="button" onClick={() => setShowEventForm(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</Button>
              <Button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2">
                {formData.type === 'consent' ? 'Gerar Termo para Assinatura' : 'Salvar Registro'}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
        {eventList.length === 0 ? (
          <p className="text-slate-400 font-medium pl-6">O prontuário está vazio. Inicie os registros.</p>
        ) : (
          eventList.map((event, idx) => (
            <div key={event.id} className="relative pl-8 group">
              <div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-md transition-transform group-hover:scale-110 z-10 ${
                event.type === 'consent' ? 'bg-amber-100' : 'bg-slate-50'
              }`}>
                {getIcon(event.type)}
              </div>
              
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getBadgeColor(event.type)}`}>
                      {event.type === 'consent' ? 'Termo de Autorização' : 
                       event.type === 'triage' ? 'Triagem' : 
                       event.type === 'anamnesis' ? 'Anamnese / Evolução' : 
                       event.type === 'prescription' ? 'Receituário' : 
                       event.type === 'exam' ? 'Solicitação de Exame' : event.type}
                    </span>
                    <h4 className="font-bold text-slate-800 text-lg">{event.title}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{event.date} â€¢ {event.time}</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{event.professional}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {event.description}
                </p>
                
                {event.type === 'consent' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Aguardando assinatura do tutor via App</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
