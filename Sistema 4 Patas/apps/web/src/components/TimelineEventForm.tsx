"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TimelineEventForm({ recordId, users }: { recordId: string, users: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "NOTE", // NOTE, EXAM, PRESCRIPTION
    title: "",
    description: "",
    veterinarianId: users[0]?.id || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.veterinarianId || !formData.title || !formData.description) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/clinical/${recordId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ ...formData, title: "", description: "" });
        router.refresh();
      } else {
        alert("Erro ao salvar evolução.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Nova Evolução Clínica
        </h3>
        <select 
          className="text-sm border-gray-200 rounded-lg bg-white px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          value={formData.veterinarianId}
          onChange={e => setFormData({ ...formData, veterinarianId: e.target.value })}
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.email.split('@')[0]}</option>
          ))}
        </select>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, type: "NOTE" })}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center justify-center ${formData.type === 'NOTE' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Anotação / Exame Físico
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, type: "PRESCRIPTION" })}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center justify-center ${formData.type === 'PRESCRIPTION' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Prescrição Médica
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, type: "EXAM" })}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center justify-center ${formData.type === 'EXAM' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Pedido de Exame
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            required
            placeholder={formData.type === 'NOTE' ? 'Ex: Animal apresenta melhora no quadro...' : formData.type === 'PRESCRIPTION' ? 'Ex: Receituário Antibiótico...' : 'Ex: Solicitação de Hemograma Completo...'}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-gray-800"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            required
            placeholder="Descreva os detalhes da evolução..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none h-24 resize-none"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all disabled:opacity-70 flex items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : null}
            Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
}
