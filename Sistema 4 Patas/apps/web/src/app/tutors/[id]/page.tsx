import { fetchApi } from '@/lib/api';
import TutorProfileClient from './TutorProfileClient';
import { redirect } from 'next/navigation';

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  let tutor;
  try {
    const { id } = await params;
    tutor = await fetchApi(`/tutors/${id}`, { cache: 'no-store' });
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      redirect('/login');
    }
    redirect('/tutors');
  }

  return <TutorProfileClient tutor={tutor} />;
}
