'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, Activity, Bone } from 'lucide-react';
import Link from 'next/link';

export default function PortalPetsPage() {
  const pets = [
    { id: 1, name: 'Thor', species: 'Cão', breed: 'Golden Retriever', age: '4 anos', photo: 'T', color: 'from-amber-400 to-orange-500', nextEvent: 'Vacina V10 (Ago/26)' },
    { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamês', age: '2 anos', photo: 'L', color: 'from-blue-400 to-indigo-500', nextEvent: 'Vermífugo (Set/26)' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Meus Pets</h1>
        <Button size="icon" className="w-10 h-10 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full shadow-sm">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {pets.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
          </div>
        ) : (
          pets.map(pet => (
            <Link key={pet.id} href={`/portal/pets/${pet.id}`}>
            <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer relative bg-white group">
              {/* Pet Banner */}
              <div className={`h-24 bg-gradient-to-r ${pet.color} relative`}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              </div>
              
              {/* Pet Info */}
              <div className="px-5 pb-5 relative">
                {/* Avatar flutuante */}
                <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white -mt-10 mb-3 relative z-10 overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${pet.color} flex items-center justify-center`}>
                    <span className="text-3xl font-black text-white">{pet.photo}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">{pet.name}</h2>
                    <p className="text-sm font-medium text-slate-500">{pet.species} • {pet.breed} • {pet.age}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors mt-1" />
                </div>

                <div className="mt-4 flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-600">Próximo cuidado: <span className="text-emerald-700">{pet.nextEvent}</span></span>
                </div>
              </div>
            </Card>
          </Link>
          ))
        )}
      </div>

      {/* Dicas */}
      <Card className="p-4 bg-indigo-50 border-indigo-100 rounded-2xl flex gap-4 items-start">
        <div className="bg-indigo-100 p-2 rounded-xl shrink-0">
          <Bone className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-indigo-900">Atualize os perfis</h4>
          <p className="text-xs text-indigo-700/80 font-medium mt-1 leading-relaxed">Mantenha a foto e o peso dos seus pets sempre atualizados para um melhor acompanhamento clínico.</p>
        </div>
      </Card>

    </div>
  );
}
