"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar as CalendarIcon, MapPin, CheckCircle2, Search, Filter, ShieldCheck, Download, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccessHistoryPage() {
  const [historyData, setHistoryData] = useState([
    { id: 1, name: 'Marcos Silva', role: 'Auxiliar', date: '30/07/2026', time: '07:58', type: 'Entrada', location: 'Clínica (Matriz)', status: 'Validado', photo: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Marcos Silva', role: 'Auxiliar', date: '29/07/2026', time: '18:05', type: 'Saída', location: 'Clínica (Matriz)', status: 'Validado', photo: 'https://i.pravatar.cc/150?img=11' },
    { id: 3, name: 'Marcos Silva', role: 'Auxiliar', date: '29/07/2026', time: '07:55', type: 'Entrada', location: 'Clínica (Matriz)', status: 'Validado', photo: 'https://i.pravatar.cc/150?img=11' },
    { id: 4, name: 'Ana Paula', role: 'Recepção', date: '30/07/2026', time: '08:05', type: 'Entrada', location: 'Clínica (Matriz)', status: 'Validado', photo: 'https://i.pravatar.cc/150?img=5' },
    { id: 5, name: 'Ana Paula', role: 'Recepção', date: '29/07/2026', time: '18:10', type: 'Saída', location: 'Clínica (Matriz)', status: 'Validado', photo: 'https://i.pravatar.cc/150?img=5' },
    { id: 6, name: 'João (Enfermeiro)', role: 'Auxiliar Noturno', date: '30/07/2026', time: '22:00', type: 'Entrada', location: 'Clínica (Filial)', status: 'Alerta GPS', photo: 'https://i.pravatar.cc/150?img=33' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Arquivo exportado com sucesso!');
    }, 1500);
  };

  const handleGrantAccess = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      showToast('Acesso concedido com sucesso!');
    }, 1000);
  };

  return (
    <div className="pb-12 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <Clock className="w-8 h-8 text-indigo-600" /> Histórico de Acessos
            </h1>
            <p className="text-slate-500 font-medium mt-1">Auditoria de Ponto, Localização e Fotos</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 border border-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Conceder Acesso
          </Button>
          <Button onClick={() => showToast('Filtros aplicados')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm">
            <Filter className="w-4 h-4" /> Filtros
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 shadow-sm min-w-[150px] justify-center">
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Exportando...' : 'Exportar (RH)'}
          </Button>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex gap-4 items-center">
           <div className="relative flex-1">
             <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
             <Input 
               type="text" 
               placeholder="Buscar por nome de funcionário ou data (ex: 30/07)..." 
               className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 font-medium shadow-sm"
             />
           </div>
           
           <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md">
             <ShieldCheck className="w-4 h-4" /> Acesso Seguro (RH/Admin)
           </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          {historyData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-black">Funcionário</th>
                  <th className="p-4 font-black">Data e Hora</th>
                  <th className="p-4 font-black">Tipo</th>
                  <th className="p-4 font-black">Localização</th>
                  <th className="p-4 font-black">Câmera (Foto)</th>
                  <th className="p-4 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{record.name}</span>
                        <span className="text-xs text-slate-500 font-medium">{record.role}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                           <CalendarIcon className="w-4 h-4 text-slate-400" /> {record.date}
                         </div>
                         <div className="flex items-center gap-1.5 text-slate-800 font-black bg-slate-100 px-2 py-1 rounded-md">
                           <Clock className="w-4 h-4 text-indigo-500" /> {record.time}
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${record.type === 'Entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-slate-400" /> {record.location}
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-slate-200 group-hover:scale-150 group-hover:z-10 transition-transform origin-left cursor-pointer shadow-sm">
                         <img src={record.photo} alt="Usuário" className="w-full h-full object-cover" width={500} height={500} />
                       </div>
                    </td>
                    <td className="p-4">
                      {record.status === 'Validado' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" /> Validado
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                          <ShieldCheck className="w-4 h-4" /> Alerta
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <ShieldCheck className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhum registro encontrado</h3>
              <p className="text-slate-500">Ainda não há registros de acesso no histórico.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Grant Access Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              Conceder Acesso
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Usuário</label>
                <Input placeholder="Nome do funcionário..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nível de Acesso</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="total">Total</option>
                  <option value="restrito">Restrito (Apenas horários específicos)</option>
                  <option value="visitante">Visitante</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Validade (Data)</label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="text-slate-600">
                Cancelar
              </Button>
              <Button onClick={handleGrantAccess} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
