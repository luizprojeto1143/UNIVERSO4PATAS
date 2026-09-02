import { fetchApi } from '@/lib/api';
import PatientsClient from './PatientsClient';

export default async function PatientsPage() {
  let patients: any[] = [];
  try {
    const res = await fetchApi('/patients', { cache: 'no-store' });
    if (Array.isArray(res)) {
      patients = res;
    }
  } catch (err) {
    console.error('Erro ao buscar lista de pacientes:', err);
  }
  
  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Pacientes & Tutores</h1>
        <p className="text-slate-500 font-medium mt-1">Gerencie a base de clientes da clínica</p>
      </div>

      <PatientsClient initialPatients={patients} />
    </div>
  );
}
