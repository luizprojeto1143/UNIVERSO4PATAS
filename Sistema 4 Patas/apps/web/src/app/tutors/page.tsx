import { fetchApi } from '@/lib/api';
import TutorsClient from './TutorsClient';
import { redirect } from 'next/navigation';

export default async function TutorsPage() {
  let tutors = [];
  try {
    tutors = await fetchApi('/tutors', { cache: 'no-store' });
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      redirect('/login');
    }
  }

  return <TutorsClient initialTutors={tutors} />;
}
