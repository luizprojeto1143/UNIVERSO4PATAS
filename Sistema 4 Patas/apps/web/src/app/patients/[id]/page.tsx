import { fetchApi } from '@/lib/api';
import PatientProfileClient from './PatientProfileClient';
import { redirect } from 'next/navigation';

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  let patient, timeline;
  try {
    const { id } = await params;
    patient = await fetchApi(`/patients/${id}`, { cache: 'no-store' });
    timeline = await fetchApi(`/clinical/patient/${id}/timeline`, { cache: 'no-store' });
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      redirect('/login');
    }
    redirect('/patients');
  }

  // Calcular idade aproximada
  const age = patient.birthDate 
    ? Math.floor((new Date().getTime() - new Date(patient.birthDate).getTime()) / 31557600000)
    : 0;
  patient.ageText = `${age} anos`;

  return (
    <PatientProfileClient patient={patient} timeline={timeline} />
  );
}
