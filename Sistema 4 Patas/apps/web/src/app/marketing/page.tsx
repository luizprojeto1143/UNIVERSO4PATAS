"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, Target, MessageCircle, Trophy, Zap, RefreshCw, 
  Smartphone, CheckCircle2, Loader2, Plus, X, Users, Calendar, 
  TrendingUp, Sparkles, Send, BellRing
} from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  count: number;
  color: string;
  description: string;
  audience: string;
  channel: string;
  message: string;
  status: 'active' | 'paused';
}

export default function MarketingPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'c1',
      title: 'Vacinas Vencendo (7 dias)',
      count: 42,
      color: 'emerald',
      description: 'Lembrete automático para tutores de cães e gatos com vacina polivalente vencendo nesta semana.',
      audience: 'vaccine_delayed',
      channel: 'whatsapp',
      message: 'Olá [Tutor]! Passando para avisar que a vacina do [Pet] vence em breve. Vamos agendar para garantir a imunidade dele? 🐾',
      status: 'active'
    },
    {
      id: 'c2',
      title: 'Clientes Sumidos (> 1 ano)',
      count: 18,
      color: 'rose',
      description: 'Animais sem retorno ou atendimento registrado há mais de 12 meses (oferta de check-up preventivo).',
      audience: 'missing_1year',
      channel: 'whatsapp',
      message: 'Olá [Tutor]! Estamos com saudades do [Pet]. Preparamos uma condição especial de check-up para vocês!',
      status: 'active'
    },
    {
      id: 'c3',
      title: 'Aniversariantes do Mês',
      count: 8,
      color: 'indigo',
      description: 'Mensagem de parabéns ao pet no mês de aniversário com cupom de desconto em Banho & Tosa.',
      audience: 'birthday_month',
      channel: 'whatsapp',
      message: 'Parabéns ao [Pet] pelo aniversário! 🎂 Ganhe 15% de desconto no banho e tosa nesta semana!',
      status: 'active'
    },
    {
      id: 'c4',
      title: 'Pós-Cirúrgico & Retornos',
      count: 12,
      color: 'sky',
      description: 'Mensagem de acompanhamento 48h após procedimento cirúrgico para checagem de recuperação.',
      audience: 'post_op',
      channel: 'whatsapp',
      message: 'Olá [Tutor]! Como o [Pet] passou a noite após o procedimento? A equipe 4 Patas está à disposição!',
      status: 'active'
    }
  ]);

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    audience: 'vaccine_delayed',
    channel: 'whatsapp',
    description: '',
    message: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAutomationToggle = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      showToast("Robô de automação e disparos sincronizado com sucesso!");
    }, 600);
  };

  const handleSync = (campId: string) => {
    setSyncingId(campId);
    setTimeout(() => {
      setSyncingId(null);
      showToast("Fila de mensagens do playbook sincronizada com a API do WhatsApp!");
    }, 800);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title.trim() || !campaignForm.message.trim()) {
      showToast("Preencha o título e o texto da mensagem.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newCamp: Campaign = {
        id: `c-${Date.now()}`,
        title: campaignForm.title,
        count: Math.floor(Math.random() * 20) + 5,
        color: campaignForm.audience === 'birthday_month' ? 'indigo' : campaignForm.audience === 'missing_1year' ? 'rose' : 'emerald',
        description: campaignForm.description || `Disparo automático via ${campaignForm.channel.toUpperCase()}`,
        audience: campaignForm.audience,
        channel: campaignForm.channel,
        message: campaignForm.message,
        status: 'active'
      };

      setCampaigns([newCamp, ...campaigns]);
      setIsSaving(false);
      setShowModal(false);
      setCampaignForm({ title: '', audience: 'vaccine_delayed', channel: 'whatsapp', description: '', message: '' });
      showToast("Nova campanha criada e inserida no fluxo de disparos!");
    }, 800);
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-600" /> CRM & Automação de Marketing
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">
              Geração de receita, reengajamento de tutores e lembretes inteligentes via WhatsApp
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/marketing/whatsapp">
            <Button className="px-5 py-3 h-12 bg-emerald-600 text-white rounded-2xl font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2 text-xs">
              <Smartphone className="w-4 h-4" />
              Chat WhatsApp Ao Vivo
            </Button>
          </Link>

          <Button 
            onClick={() => setShowModal(true)}
            className="px-5 py-3 h-12 bg-indigo-600 text-white rounded-2xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 text-xs"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </Button>

          <Button 
            onClick={handleAutomationToggle}
            disabled={isActivating}
            className="px-5 py-3 h-12 bg-slate-900 text-white rounded-2xl font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 text-xs disabled:opacity-70"
          >
            {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
            {isActivating ? "Sincronizando..." : "Automação ON"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl relative overflow-hidden border-0 shadow-lg shadow-indigo-500/20 flex flex-col justify-between">
          <div className="absolute -right-4 -bottom-4 opacity-10"><MessageCircle className="w-36 h-36" /></div>
          <div>
            <span className="text-indigo-100 font-bold text-xs uppercase tracking-wider">Disparos no Mês</span>
            <p className="text-4xl font-black mt-2 mb-1">1.428</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-100 font-bold mt-4 bg-white/10 w-max px-3 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> +18% via WhatsApp API Oficial
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Taxa Média de Conversão</span>
            <p className="text-4xl font-black text-emerald-600 mt-2 mb-1">34.8%</p>
          </div>
          <p className="text-slate-500 text-xs font-semibold mt-4">
            Tutores que confirmaram agendamento após o lembrete
          </p>
        </Card>

        <Card className="p-6 bg-slate-900 text-white rounded-3xl shadow-md border-0 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 opacity-10"><Trophy className="w-36 h-36" /></div>
          <div>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Receita Resgatada (Mês)</span>
            <p className="text-4xl font-black text-white mt-2 mb-1">R$ 18.650</p>
          </div>
          <p className="text-slate-400 text-xs font-semibold mt-4 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Faturamento direto gerado pelas réguas
          </p>
        </Card>
      </div>

      {/* Playbooks Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Playbooks Ativos (Réguas Inteligentes)</h2>
          <p className="text-xs text-slate-500 font-medium">Disparo automatizado baseado no histórico de vacinas e consultas</p>
        </div>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl shadow-sm border border-slate-200 text-center">
          <Target className="w-16 h-16 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Nenhum playbook ativo</h3>
          <p className="text-xs text-slate-400 mt-1">Crie sua primeira régua de marketing para automatizar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {campaigns.map((camp) => (
            <Card 
              key={camp.id} 
              className={`border-t-4 ${
                camp.color === 'emerald' ? 'border-t-emerald-500' :
                camp.color === 'rose' ? 'border-t-rose-500' :
                camp.color === 'sky' ? 'border-t-sky-500' : 'border-t-indigo-500'
              } p-6 rounded-3xl shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${
                    camp.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    camp.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                    camp.color === 'sky' ? 'bg-sky-50 text-sky-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-800 font-black text-base px-3 py-1 rounded-xl">
                    {camp.count} tutores
                  </span>
                </div>

                <h3 className="font-black text-slate-900 text-base mb-1">{camp.title}</h3>
                <p className="text-xs font-medium text-slate-500 mb-4">{camp.description}</p>
                
                {/* Message Bubble Preview */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4 relative">
                  <div className="absolute top-0 right-3 -translate-y-1/2 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                    WhatsApp
                  </div>
                  <p className="text-xs text-slate-700 font-medium italic line-clamp-3">
                    &quot;{camp.message}&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => handleSync(camp.id)}
                  disabled={syncingId === camp.id}
                  className="w-full py-2.5 h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                >
                  {syncingId === camp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {syncingId === camp.id ? "Sincronizando..." : "Disparar / Sincronizar Fila"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Nova Campanha */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                Nova Campanha / Régua CRM
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Campanha *</label>
                <input 
                  type="text" 
                  value={campaignForm.title}
                  onChange={e => setCampaignForm({...campaignForm, title: e.target.value})}
                  placeholder="Ex: Vacinas Vencendo V10"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 font-medium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Público-Alvo</label>
                  <select 
                    value={campaignForm.audience}
                    onChange={e => setCampaignForm({...campaignForm, audience: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 bg-slate-50 font-medium"
                  >
                    <option value="vaccine_delayed">Vacinas a Vencer (7d)</option>
                    <option value="missing_1year">Clientes Inativos &gt; 1 ano</option>
                    <option value="birthday_month">Aniversariantes do Mês</option>
                    <option value="post_op">Pós-Cirúrgico</option>
                    <option value="custom">Lista Segmentada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Canal de Envio</label>
                  <select 
                    value={campaignForm.channel}
                    onChange={e => setCampaignForm({...campaignForm, channel: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 bg-slate-50 font-medium"
                  >
                    <option value="whatsapp">WhatsApp API</option>
                    <option value="sms">SMS</option>
                    <option value="email">E-mail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Curta</label>
                <input 
                  type="text" 
                  value={campaignForm.description}
                  onChange={e => setCampaignForm({...campaignForm, description: e.target.value})}
                  placeholder="Ex: Disparo 7 dias antes do vencimento da V10"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Texto da Mensagem *</label>
                <textarea 
                  value={campaignForm.message}
                  onChange={e => setCampaignForm({...campaignForm, message: e.target.value})}
                  placeholder="Olá [Tutor], a vacina do [Pet] está..."
                  rows={3}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 bg-slate-50 resize-none font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Variáveis disponíveis: [Tutor], [Pet], [Vacina], [Data]</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 font-bold text-slate-500 hover:bg-slate-100 bg-transparent rounded-xl"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-2 text-xs"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Salvando..." : "Salvar e Ativar Régua"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[60]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
