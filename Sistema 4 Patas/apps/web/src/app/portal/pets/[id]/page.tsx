'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, ShieldAlert, Activity, FileText, Syringe, Heart, Scale, Dna, Info } from 'lucide-react';
import Link from 'next/link';

export default function PortalPetProfilePage({ params }: { params: { id: string } }) {
  // Dados mockados baseados no Thor
  const pet = {
    name: 'Thor', species: 'Cão', breed: 'Golden Retriever', sex: 'Macho', age: '4 anos', 
    dob: '10/05/2022', weight: '32.5 kg', chip: '982000405678123',
    color: 'from-amber-400 to-orange-500', photo: 'T',
    allergies: ['Dipirona', 'Picada de abelha'],
    chronic: ['Displasia Coxofemoral leve'],
    meds: ['Condroitina (Uso contínuo)'],
    diet: 'Ração Super Premium Cães Grandes',
    plan: 'Plano Ouro (Ativo)'
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Expandido (Instagram style) */}
      <div className={`h-48 bg-gradient-to-r ${pet.color} relative px-4 pt-4`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <Link href="/portal/pets">
            <Button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Perfil Content */}
      <div className="px-4 -mt-20 relative z-20">
        
        {/* Avatar e Nome */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden relative">
            <div className={`w-full h-full bg-gradient-to-br ${pet.color} flex items-center justify-center`}>
              <span className="text-5xl font-black text-white">{pet.photo}</span>
            </div>
            {/* Status Indicator */}
            <div className="absolute bottom-1 right-3 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mt-3">{pet.name}</h1>
          <p className="text-slate-500 font-bold">{pet.breed} • {pet.age}</p>
          
          <div className="mt-3 flex gap-2">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3 h-3" /> {pet.plan}
            </span>
          </div>
        </div>

        {/* Quick Menu */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href={`/portal/pets/${params.id}/vaccines`}>
            <Card className="p-3 bg-white border-slate-200 shadow-sm rounded-2xl flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Syringe className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Vacinas</span>
            </Card>
          </Link>
          
          <Card className="p-3 bg-white border-slate-200 shadow-sm rounded-2xl flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">Histórico</span>
          </Card>
          
          <Card className="p-3 bg-white border-slate-200 shadow-sm rounded-2xl flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">Exames</span>
          </Card>
        </div>

        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider ml-1">Ficha Clínica</h3>
          
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white overflow-hidden">
            
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
              <div className="p-4 flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Dna className="w-3 h-3" /> Espécie</span>
                <span className="text-sm font-black text-slate-700">{pet.species} ({pet.sex})</span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Info className="w-3 h-3" /> Nascimento</span>
                <span className="text-sm font-black text-slate-700">{pet.dob}</span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Scale className="w-3 h-3" /> Peso Atual</span>
                <span className="text-sm font-black text-slate-700">{pet.weight}</span>
              </div>
              <div className="p-4 flex flex-col gap-1 bg-slate-50">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Microchip</span>
                <span className="text-[10px] font-mono font-black text-slate-700 bg-white px-2 py-1 rounded border shadow-sm self-start">{pet.chip}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-rose-50/50">
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mb-1"><ShieldAlert className="w-3 h-3" /> Alergias</span>
              <div className="flex flex-wrap gap-2">
                {pet.allergies.map((a, i) => (
                  <span key={i} className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-md">{a}</span>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-amber-50/50">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mb-1"><Heart className="w-3 h-3" /> Doenças Crônicas / Uso Contínuo</span>
              <div className="space-y-1">
                {pet.chronic.map((c, i) => (
                  <p key={i} className="text-sm font-bold text-slate-700">• {c}</p>
                ))}
                {pet.meds.map((m, i) => (
                  <p key={i} className="text-sm font-bold text-slate-700">• {m}</p>
                ))}
              </div>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
