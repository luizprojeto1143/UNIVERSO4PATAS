'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, PawPrint } from 'lucide-react';
import Link from 'next/link';

export default function AddPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    breedId: '',
    birthDate: '',
    weight: '',
    color: ''
  });

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const token = localStorage.getItem('tutor_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`http://localhost:3000/tutor-portal/species`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setSpeciesList(data);
          if (data.length > 0) {
            setFormData(f => ({ ...f, speciesId: data[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecies();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('tutor_token');
      const res = await fetch(`http://localhost:3000/tutor-portal/patients`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Erro ao salvar');
      
      router.push('/dashboard');
    } catch (err) {
      alert("Ocorreu um erro ao adicionar o pet.");
      setSaving(false);
    }
  };

  const currentSpecies = speciesList.find(s => s.id === formData.speciesId);

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-indigo-600 pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <Link href="/dashboard" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold">Novo Pet</h1>
        </div>
        <p className="text-indigo-200 text-sm relative z-10">Preencha os dados do seu novo companheiro.</p>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <PawPrint className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Nome do Pet</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Rex, Luna..."
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Espécie</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.speciesId}
                    onChange={e => setFormData({...formData, speciesId: e.target.value, breedId: ''})}
                  >
                    <option value="">Selecione</option>
                    {speciesList.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Raça</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.breedId}
                    onChange={e => setFormData({...formData, breedId: e.target.value})}
                  >
                    <option value="">Selecione (Opcional)</option>
                    {currentSpecies?.breeds?.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Nascimento</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: 4.5"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Cor/Pelagem (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Preto e Branco"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={saving || !formData.name || !formData.speciesId}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 active:scale-95"
              >
                {saving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>
                ) : (
                  <><Save className="w-5 h-5" /> Cadastrar Pet</>
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
