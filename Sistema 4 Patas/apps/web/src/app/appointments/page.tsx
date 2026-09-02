import { fetchApi } from '@/lib/api';
import AgendaClient from './AgendaClient';

export default async function AgendaPage() {
  let appointments: any[] = [];
  let patients: any[] = [];
  let tutors: any[] = [];
  let waitlist: any[] = [];
  let pipelines: any[] = [];
  let vets: any[] = [];

  try {
    const results = await Promise.allSettled([
      fetchApi('/appointments', { cache: 'no-store' }),
      fetchApi('/patients', { cache: 'no-store' }),
      fetchApi('/tutors', { cache: 'no-store' }),
      fetchApi('/waitlist', { cache: 'no-store' }),
      fetchApi('/pipelines', { cache: 'no-store' }),
      fetchApi('/users', { cache: 'no-store' })
    ]);

    if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) appointments = results[0].value;
    if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) patients = results[1].value;
    if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) tutors = results[2].value;
    if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) waitlist = results[3].value;
    if (results[4].status === 'fulfilled' && Array.isArray(results[4].value)) pipelines = results[4].value;
    if (results[5].status === 'fulfilled' && Array.isArray(results[5].value)) {
      vets = results[5].value.map((u: any) => ({
        id: u.id,
        name: u.name || (u.email ? u.email.split('@')[0] : 'Veterinário')
      }));
    }
  } catch (err) {
    console.error('Erro ao carregar dados da agenda:', err);
  }

  return (
    <AgendaClient 
      initialAppointments={appointments} 
      patients={patients} 
      tutors={tutors} 
      vets={vets} 
      initialWaitlist={waitlist}
      pipelines={pipelines}
    />
  );
}
