"use client";
import { Input } from '@/components/ui/input';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FiscalSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: '',
    stateRegistration: '',
    municipalRegistration: '',
    taxRegime: 'simples_nacional',
    environment: 'homologation',
    accountantEmail: '',
    autoEmitNotes: false
  });

  useEffect(() => {
    api.get('/fiscal/settings').then(res => {
      if (res.data) setFormData({ ...formData, ...res.data });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'checkbox') finalValue = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch('/fiscal/settings', formData);
      alert('Configurações salvas!');
      router.push('/fiscal');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/fiscal">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações Fiscais</h1>
            <p className="text-slate-500 mt-1">Parametrize o motor de notas e certificados</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading} className="flex items-center bg-slate-900">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Dados da Clínica</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">CNPJ</label>
            <Input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full border rounded-md p-2" placeholder="00.000.000/0001-00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inscrição Estadual (IE)</label>
            <Input type="text" name="stateRegistration" value={formData.stateRegistration} onChange={handleChange} className="w-full border rounded-md p-2" placeholder="Isento ou Numérico" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inscrição Municipal (IM)</label>
            <Input type="text" name="municipalRegistration" value={formData.municipalRegistration} onChange={handleChange} className="w-full border rounded-md p-2" />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Tributação e Contador</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Regime Tributário</label>
            <select name="taxRegime" value={formData.taxRegime} onChange={handleChange} className="w-full border rounded-md p-2 bg-white">
              <option value="simples_nacional">Simples Nacional</option>
              <option value="lucro_presumido">Lucro Presumido</option>
              <option value="lucro_real">Lucro Real</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ambiente SEFAZ</label>
            <select name="environment" value={formData.environment} onChange={handleChange} className="w-full border rounded-md p-2 bg-white">
              <option value="homologation">Homologação (Testes sem valor fiscal)</option>
              <option value="production">Produção (Valor fiscal)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail do Contador (Para envio mensal)</label>
            <Input type="email" name="accountantEmail" value={formData.accountantEmail} onChange={handleChange} className="w-full border rounded-md p-2" placeholder="contador@escritorio.com" />
          </div>
        </Card>
      </div>

      <Card className="p-6 border-blue-200 bg-blue-50 mt-6">
        <div className="flex items-start space-x-4">
          <ShieldCheck className="h-6 w-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900">Emissão 100% Automática (Zero-Click)</h3>
            <p className="text-blue-700 text-sm mt-1">
              Ative esta opção para emitir notas fiscais invisivelmente assim que a fatura for dada como Paga no caixa. O cliente já receberá o link do DANFE direto.
            </p>
            <label className="mt-4 flex items-center space-x-3 p-3 bg-white border border-blue-200 rounded-md cursor-pointer hover:bg-slate-50">
              <Input type="checkbox" name="autoEmitNotes" checked={formData.autoEmitNotes} onChange={handleChange} className="h-5 w-5 rounded text-blue-600" />
              <span className="font-medium text-slate-800">Ativar Motor Automático de NF-e/NFS-e</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}
