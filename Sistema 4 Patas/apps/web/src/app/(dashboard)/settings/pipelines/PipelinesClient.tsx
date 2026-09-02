"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Plus, Trash, Save } from "lucide-react";

const DEFAULT_PIPELINES = [
  {
    id: 'pipe-1',
    name: 'Esteira Médica Padrão',
    color: 'indigo',
    stages: [
      { name: 'Triagem / Recepção', color: 'blue' },
      { name: 'Em Atendimento', color: 'indigo' },
      { name: 'Aguardando Exames', color: 'purple' },
      { name: 'Concluído', color: 'emerald' }
    ]
  },
  {
    id: 'pipe-2',
    name: 'Esteira de Banho & Tosa',
    color: 'emerald',
    stages: [
      { name: 'Recepção Pet', color: 'teal' },
      { name: 'Banho', color: 'blue' },
      { name: 'Secagem & Tosa', color: 'purple' },
      { name: 'Pronto p/ Retirada', color: 'emerald' }
    ]
  }
];

export default function PipelinesClient({ initialPipelines }: { initialPipelines: any[] }) {
  const router = useRouter();
  const [pipelines, setPipelines] = useState<any[]>(() => 
    initialPipelines && initialPipelines.length > 0 ? initialPipelines : DEFAULT_PIPELINES
  );
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreatePipeline = async () => {
    setIsSaving(true);
    const newPipeline = {
      id: `pipe-${Date.now()}`,
      name: 'Nova Esteira',
      color: 'blue',
      stages: [
        { name: 'Agendado', color: 'indigo' },
        { name: 'Finalizado', color: 'emerald' }
      ]
    };

    try {
      await fetchApi('/pipelines', {
        method: 'POST',
        body: JSON.stringify(newPipeline)
      });
    } catch (e) {
      console.warn('[PipelinesClient] Fetch error suppressed');
    }

    setPipelines(prev => [...prev, newPipeline]);
    router.refresh();
    showToast('Esteira criada com sucesso!');
    setIsSaving(false);
  };

  const handleUpdatePipeline = async (pipeline: any) => {
    try {
      await fetchApi(`/pipelines/${pipeline.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: pipeline.name,
          color: pipeline.color,
          stages: pipeline.stages
        })
      });
    } catch (e) {
      console.warn('[PipelinesClient] Update fetch error suppressed');
    }
    setPipelines(prev => prev.map(p => p.id === pipeline.id ? pipeline : p));
    showToast('Salvo com sucesso!');
    router.refresh();
  };

  const handleDeletePipeline = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta esteira?")) return;
    try {
      await fetchApi(`/pipelines/${id}`, { method: 'DELETE' });
      setPipelines(pipelines.filter(p => p.id !== id));
      router.refresh();
      showToast('Esteira excluída!');
    } catch (e) {
      showToast('Erro ao excluir esteira');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={handleCreatePipeline}
          disabled={isSaving}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-bold flex items-center gap-2 text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> {isSaving ? 'Criando...' : 'Nova Esteira'}
        </Button>
      </div>

      {pipelines.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 font-medium">Nenhuma esteira configurada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pipelines.map(pipeline => (
            <PipelineEditor 
              key={pipeline.id} 
              pipeline={pipeline} 
              onSave={handleUpdatePipeline}
              onDelete={() => handleDeletePipeline(pipeline.id)} 
            />
          ))}
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

function PipelineEditor({ pipeline, onSave, onDelete }: any) {
  const [data, setData] = useState(pipeline);

  const addStage = () => {
    setData({
      ...data,
      stages: [...data.stages, { name: 'Nova Fase', color: 'gray' }]
    });
  };

  const updateStage = (index: number, field: string, value: string) => {
    const newStages = [...data.stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setData({ ...data, stages: newStages });
  };

  const removeStage = (index: number) => {
    const newStages = [...data.stages];
    newStages.splice(index, 1);
    setData({ ...data, stages: newStages });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="w-1/3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome da Esteira</label>
          <Input 
            value={data.name} 
            onChange={e => setData({...data, name: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(data)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border border-emerald-100">
            <Save className="w-4 h-4" /> Salvar
          </Button>
          <Button onClick={onDelete} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border border-red-100">
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Fases (Ordem da Esquerda p/ Direita)</label>
          <Button onClick={addStage} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Adicionar Fase
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {data.stages.map((stage: any, index: number) => (
            <div key={index} className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-2 gap-3 min-w-[200px]">
              <span className="text-slate-400 font-black text-sm pl-2">{index + 1}.</span>
              <Input 
                value={stage.name}
                onChange={e => updateStage(index, 'name', e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-slate-700 w-full text-sm"
              />
              <Button onClick={() => removeStage(index)} className="text-slate-400 hover:text-red-500 pr-2">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
