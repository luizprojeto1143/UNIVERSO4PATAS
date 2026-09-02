"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { User, HeartHandshake, MapPin, Phone, Mail, FileText, Dog, Calendar as CalendarIcon, ShieldCheck } from "lucide-react";

export default function CreatePatientModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    // Dados do Tutor
    tutorName: '',
    tutorCpf: '',
    tutorGender: 'Feminino',
    tutorEmail: '',
    tutorPhone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    zipCode: '',

    // Dados do Pet
    petName: '',
    species: 'Cão',
    breed: 'SRD',
    gender: 'Macho',
    birthDate: '',
    neutered: 'SEM_INFORMACAO', // SIM, NAO, SEM_INFORMACAO
    coatColor: 'Caramelo',
    weight: '5.0'
  });

  if (!isOpen) return null;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
      if (type === 'success') onClose();
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cadastrar tutor completo
      let tutorId = '';
      const fullAddress = `${formData.street}, ${formData.number} - ${formData.neighborhood}, ${formData.city}/${formData.state} - CEP: ${formData.zipCode}`;

      const tutorRes = await api.post('/tutors', {
        name: formData.tutorName,
        cpf: formData.tutorCpf,
        gender: formData.tutorGender,
        email: formData.tutorEmail,
        phone: formData.tutorPhone,
        address: fullAddress,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });

      if (tutorRes.data?.id) {
        tutorId = tutorRes.data.id;
      }

      // 2. Cadastrar paciente (pet)
      await api.post('/patients', {
        name: formData.petName,
        tutorId: tutorId || undefined,
        speciesName: formData.species,
        breedName: formData.breed,
        gender: formData.gender,
        birthDate: formData.birthDate || undefined,
        neutered: formData.neutered,
        coatColor: formData.coatColor,
        weight: parseFloat(formData.weight) || 5,
        notes: `Pelagem: ${formData.coatColor}, Castrado: ${formData.neutered}`,
      });

      showToast("Tutor e Paciente cadastrados com sucesso!", 'success');
    } catch (err: any) {
      console.error('Erro ao cadastrar paciente:', err);
      showToast(err.response?.data?.message || 'Erro ao cadastrar tutor e pet', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      {/* Toast Feedback */}
      <div className={`fixed top-4 right-4 z-[60] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-xl border text-white font-bold ${toast.type === 'error' ? 'bg-rose-600 border-rose-700' : 'bg-emerald-600 border-emerald-700'}`}>
          <ShieldCheck className="w-5 h-5" />
          <p>{toast.message}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 flex flex-col max-h-[92vh] text-slate-800 border border-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-indigo-600" /> Cadastro de Tutor & Pet
            </h2>
            <p className="text-xs text-slate-500 font-medium">Preencha as informações do responsável e do animal de estimação</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto pr-2 space-y-6">
          <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* SEÇÃO DO TUTOR */}
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1.5 border-b border-indigo-200/60 pb-2">
                <User className="w-4 h-4 text-indigo-600" /> Dados do Tutor / Responsável
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label htmlFor="tutorName" className="block text-xs font-bold uppercase text-slate-700 mb-1">Nome Completo *</label>
                  <input id="tutorName" type="text" name="tutorName" required placeholder="Nome do tutor" className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.tutorName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="tutorCpf" className="block text-xs font-bold uppercase text-slate-700 mb-1">CPF *</label>
                  <input id="tutorCpf" type="text" name="tutorCpf" required placeholder="000.000.000-00" className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.tutorCpf} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="tutorGender" className="block text-xs font-bold uppercase text-slate-700 mb-1">Gênero do Tutor</label>
                  <select id="tutorGender" name="tutorGender" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.tutorGender} onChange={handleChange}>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tutorPhone" className="block text-xs font-bold uppercase text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input id="tutorPhone" type="text" name="tutorPhone" required placeholder="(11) 99999-9999" className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.tutorPhone} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="tutorEmail" className="block text-xs font-bold uppercase text-slate-700 mb-1">E-mail</label>
                  <input id="tutorEmail" type="email" name="tutorEmail" placeholder="tutor@email.com" className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.tutorEmail} onChange={handleChange} />
                </div>
              </div>

              {/* ENDEREÇO COMPLETO DO TUTOR */}
              <div className="border-t border-indigo-200/60 pt-3">
                <p className="text-[11px] font-black uppercase text-indigo-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Endereço Completo
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div className="md:col-span-3">
                    <label htmlFor="street" className="block text-[11px] font-bold text-slate-600 mb-1">Rua / Logradouro</label>
                    <input id="street" type="text" name="street" placeholder="Rua Flores" className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none" value={formData.street} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="number" className="block text-[11px] font-bold text-slate-600 mb-1">Número</label>
                    <input id="number" type="text" name="number" placeholder="123 / Apt 4" className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none" value={formData.number} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label htmlFor="neighborhood" className="block text-[11px] font-bold text-slate-600 mb-1">Bairro</label>
                    <input id="neighborhood" type="text" name="neighborhood" placeholder="Centro" className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none" value={formData.neighborhood} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-[11px] font-bold text-slate-600 mb-1">Cidade</label>
                    <input id="city" type="text" name="city" placeholder="São Paulo" className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none" value={formData.city} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-[11px] font-bold text-slate-600 mb-1">UF / Estado</label>
                    <input id="state" type="text" name="state" placeholder="SP" className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs uppercase outline-none" value={formData.state} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-[11px] font-bold text-slate-600 mb-1">CEP</label>
                    <input id="zipCode" type="text" name="zipCode" placeholder="01000-000" className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none" value={formData.zipCode} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO DO PET */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Dog className="w-4 h-4 text-indigo-600" /> Dados do Paciente (Pet)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="petName" className="block text-xs font-bold uppercase text-slate-700 mb-1">Nome do Pet *</label>
                  <input id="petName" type="text" name="petName" required placeholder="Ex: Thor, Mel, Bob" className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.petName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="species" className="block text-xs font-bold uppercase text-slate-700 mb-1">Espécie *</label>
                  <select id="species" name="species" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.species} onChange={handleChange}>
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Silvestre">Silvestre / Exótico</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="breed" className="block text-xs font-bold uppercase text-slate-700 mb-1">Raça *</label>
                  <input id="breed" type="text" name="breed" required placeholder="SRD, Golden, Poodle..." className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.breed} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="gender" className="block text-xs font-bold uppercase text-slate-700 mb-1">Gênero</label>
                  <select id="gender" name="gender" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.gender} onChange={handleChange}>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-xs font-bold uppercase text-slate-700 mb-1">Nascimento</label>
                  <input id="birthDate" type="date" name="birthDate" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.birthDate} onChange={handleChange} />
                </div>

                <div>
                  <label htmlFor="neutered" className="block text-xs font-bold uppercase text-slate-700 mb-1">Castrado?</label>
                  <select id="neutered" name="neutered" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.neutered} onChange={handleChange}>
                    <option value="SIM">Sim</option>
                    <option value="NAO">Não</option>
                    <option value="SEM_INFORMACAO">Sem Informação</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="coatColor" className="block text-xs font-bold uppercase text-slate-700 mb-1">Cor da Pelagem</label>
                  <input id="coatColor" type="text" name="coatColor" placeholder="Caramelo, Preto..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none" value={formData.coatColor} onChange={handleChange} />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
          <button type="submit" form="patient-form" disabled={loading} className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-colors">
            {loading ? 'Cadastrando...' : 'Cadastrar Tutor e Pet'}
          </button>
        </div>
      </div>
    </div>
  );
}
