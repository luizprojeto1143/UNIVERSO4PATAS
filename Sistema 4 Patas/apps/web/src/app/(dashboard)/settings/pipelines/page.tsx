import { fetchApi } from '@/lib/api';
import PipelinesClient from './PipelinesClient';

export default async function PipelinesPage() {
  const pipelines = await fetchApi('/pipelines', { cache: 'no-store' });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Esteiras de Atendimento</h1>
        <p className="text-slate-500 mt-2 font-medium">Configure os funis para organizar o fluxo de pacientes na clínica.</p>
      </div>

      <PipelinesClient initialPipelines={pipelines || []} />
    </div>
  );
}
