import { fetchApi } from '@/lib/api';
import ConsultationRoomClient from './ConsultationRoomClient';
import { redirect } from 'next/navigation';

export default async function ConsultationRoomPage({ params }: { params: Promise<{ id: string }> }) {
  let record;
  try {
    const { id } = await params;
    record = await fetchApi(`/clinical/records/${id}`, { cache: 'no-store' });
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      redirect('/login');
    }
    redirect('/appointments');
  }

  return <ConsultationRoomClient record={record} />;
}
