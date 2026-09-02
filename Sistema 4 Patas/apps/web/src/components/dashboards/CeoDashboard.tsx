'use client';

import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import { Card } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck,
  Calendar,
  Package,
  Plus
} from 'lucide-react';

export default function CeoDashboard({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="pb-12 max-w-7xl mx-auto relative">
      {/* Hero Header */}
      <div className="relative mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Painel de Gestão (CEO) 👋</h1>
            <p className="text-indigo-100 font-medium text-lg">Seu resumo diário de atendimentos e métricas gerenciais.</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/appointments">
              <button 
                className="bg-white text-slate-900 hover:bg-indigo-50 px-5 py-3 rounded-2xl shadow-lg font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Calendar className="w-5 h-5 text-indigo-600" /> Agendar Consulta
              </button>
            </Link>

            <Link href="/patients">
              <button 
                className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-3 rounded-2xl shadow-lg font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" /> Novo Paciente
              </button>
            </Link>

            <Link href="/financial/pdv">
              <button 
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-2xl shadow-lg font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <DollarSign className="w-5 h-5" /> Caixa / PDV
              </button>
            </Link>

            <Link href="/hospitalization">
              <button 
                className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-3 rounded-2xl shadow-lg font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Activity className="w-5 h-5" /> Internação (UTI)
              </button>
            </Link>

            <Link href="/inventory">
              <button 
                className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-3 rounded-2xl shadow-lg font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Package className="w-5 h-5" /> Estoque
              </button>
            </Link>

            <Link href="/settings/roles">
              <button 
                className="bg-indigo-500/40 hover:bg-indigo-500/60 backdrop-blur-md border border-indigo-400 text-white px-5 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="w-5 h-5" /> Equipe & Permissões
              </button>
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-purple-400 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        {/* Lado Esquerdo: KPIs */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link href="/financial">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform blur-xl"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Faturamento (Mês)</h3>
                  <div className="p-3 bg-green-100 text-green-600 rounded-2xl shadow-sm border border-green-200">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <p className="relative z-10 text-4xl font-black text-slate-800">{data.kpis?.monthlyRevenue || 'R$ 0,00'}</p>
              </div>
            </Link>
            
            <Link href="/appointments">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform blur-xl"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Consultas Hoje</h3>
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm border border-indigo-200">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <p className="relative z-10 text-4xl font-black text-slate-800">{data.kpis?.activeAppointments || 0}</p>
              </div>
            </Link>

            <Link href="/patients">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform blur-xl"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Novos Pacientes</h3>
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-sm border border-orange-200">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <p className="relative z-10 text-4xl font-black text-slate-800">{data.kpis?.newPatientsMonth || 0}</p>
              </div>
            </Link>
          </div>

          <DashboardCharts chartData={data.chartData || []} />
        </div>

        {/* Lado Direito: Acesso e Presença */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" /> Equipe (Presença)
              </h3>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">Ao Vivo</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-xs">
                  AD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Administrador</p>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Ativo Agora
                  </p>
                </div>
              </div>
            </div>
            
            <Link href="/settings/roles">
              <button 
                className="w-full mt-5 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                Gerenciar Equipe <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
