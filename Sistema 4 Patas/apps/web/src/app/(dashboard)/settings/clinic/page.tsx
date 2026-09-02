"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import ClientLayout from '@/components/ClientLayout';
import { Image as ImageIcon, Save, Building2, FileText, CheckCircle2 } from 'lucide-react';

export default function ClinicSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    accountantEmail: '',
    logoUrl: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchApi('settings/clinic');
      setFormData({
        name: data.name || '',
        cnpj: data.cnpj || '',
        accountantEmail: data.accountantEmail || '',
        logoUrl: data.logoUrl || ''
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await fetchApi('settings/clinic', {
        method: 'PATCH',
        body: JSON.stringify({
          name: formData.name,
          cnpj: formData.cnpj,
          logoUrl: formData.logoUrl
        })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800">Configurações da Clínica</h1>
          <p className="text-slate-500 font-medium">Personalize os dados e a identidade visual da sua clínica.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lado Esquerdo: Dados Gerais */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Nome da Clínica
                </label>
                <Input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  CNPJ
                </label>
                <Input 
                  type="text" 
                  value={formData.cnpj}
                  onChange={e => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Lado Direito: Logo */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Logo da Clínica (Documentos e Cabeçalhos)
              </label>
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group">
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {formData.logoUrl ? (
                  <div className="relative w-full aspect-video flex flex-col items-center justify-center">
                    <img src="/logo-mock.png" alt="Logo" className="max-w-full max-h-full object-contain mb-4" width={500} height={500} />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
                      <span className="text-white font-bold bg-slate-900/60 px-4 py-2 rounded-lg">Trocar Imagem</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 border border-slate-100 text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-600">Clique ou arraste a imagem</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">PNG ou JPG (Recomendado fundo transparente)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
            {success && (
              <span className="text-emerald-500 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="w-5 h-5" />
                Salvo com sucesso!
              </span>
            )}
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>

        </div>
      </div>
  );
}
