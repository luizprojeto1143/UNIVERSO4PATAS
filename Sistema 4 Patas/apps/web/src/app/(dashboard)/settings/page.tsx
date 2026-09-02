'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Settings, Wallet, ShieldAlert, Building2, Bot, Users, LayoutDashboard, Building } from 'lucide-react';

export default function SettingsHubPage() {
  const modules = [
    {
      title: 'Repasses e Comissões',
      description: 'Regras de comissionamento para Solicitantes e Executantes, taxas de cartão e produtos.',
      icon: <Wallet className="w-8 h-8 text-emerald-500" />,
      href: '/settings/commissions',
      color: 'hover:border-emerald-300'
    },
    {
      title: 'Auditoria (Caixa Preta)',
      description: 'Log imutável de segurança. Rastreie quem apagou contas, cancelou notas ou editou prontuários.',
      icon: <ShieldAlert className="w-8 h-8 text-rose-500" />,
      href: '/settings/audit',
      color: 'hover:border-rose-300'
    },
    {
      title: 'Multi-Filiais',
      description: 'Gerencie as unidades da sua rede de clínicas. DRE consolidado e estoques separados.',
      icon: <Building2 className="w-8 h-8 text-blue-500" />,
      href: '/settings/branches',
      color: 'hover:border-blue-300'
    },
    {
      title: 'Automações & CRM',
      description: 'Motor de regras automáticas (IFTTT) para envio de WhatsApp, lembretes de vacina e alertas de estoque.',
      icon: <Bot className="w-8 h-8 text-purple-500" />,
      href: '/settings/automations',
      color: 'hover:border-purple-300'
    },
    {
      title: 'Cargos e Permissões',
      description: 'Controle de acesso. Defina quem pode ver o financeiro, o estoque ou editar dados da clínica.',
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      href: '/settings/roles',
      color: 'hover:border-indigo-300'
    },
    {
      title: 'Dados da Clínica',
      description: 'Nome, CNPJ, Endereço e Logomarca que aparecerão nos receituários e Notas Fiscais.',
      icon: <Building className="w-8 h-8 text-slate-500" />,
      href: '/settings/clinic',
      color: 'hover:border-slate-300'
    },
    {
      title: 'Esteiras (Funis)',
      description: 'Configure as etapas do Kanban para Internação, Banho e Tosa e Atendimento Médico.',
      icon: <LayoutDashboard className="w-8 h-8 text-amber-500" />,
      href: '/settings/pipelines',
      color: 'hover:border-amber-300'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-slate-700" />
          Painel de Controle (CEO)
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Gerencie as regras de negócio, auditoria de segurança e configurações do ERP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, i) => (
          <Link key={i} href={mod.href}>
            <Card className={`p-6 border-2 border-slate-100 bg-white transition-all shadow-sm hover:shadow-md cursor-pointer h-full group ${mod.color}`}>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {mod.icon}
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">{mod.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{mod.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
