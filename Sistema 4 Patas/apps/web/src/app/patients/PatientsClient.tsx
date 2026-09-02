"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import Link from "next/link";
import CreatePatientModal from "@/components/CreatePatientModal";

export default function PatientsClient({ initialPatients }: { initialPatients: any[] }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = initialPatients.filter(p => {
    const term = search.toLowerCase();
    return p.name.toLowerCase().includes(term) ||
           p.species?.name.toLowerCase().includes(term) ||
           p.tutor?.name.toLowerCase().includes(term);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <Input 
            type="text" 
            placeholder="Buscar por pet, espécie ou tutor..." 
            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-sm font-medium ml-4 flex-shrink-0"
        >
          + Novo Cadastro
        </Button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <th className="px-6 py-5">Paciente</th>
              <th className="px-6 py-5">Espécie / Raça</th>
              <th className="px-6 py-5">Tutor Responsável</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <p className="text-slate-500 font-medium">Nenhum paciente encontrado.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{patient.name}</p>
                        {patient.weight && <p className="text-xs font-medium text-slate-500 mt-0.5">{patient.weight} kg</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 font-bold">{patient.species?.name}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">{patient.breed?.name || 'Sem raça definida'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 font-bold">{patient.tutor?.name}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">{patient.tutor?.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/patients/${patient.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      Prontuário
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreatePatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
