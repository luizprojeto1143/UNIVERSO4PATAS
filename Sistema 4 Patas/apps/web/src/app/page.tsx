import { fetchApi } from '../lib/api';
import { redirect } from 'next/navigation';
import DashboardController from '@/components/dashboards/DashboardController';

export default async function DashboardPage() {
  let data;
  try {
    data = await fetchApi('/dashboard', { cache: 'no-store' });
  } catch (error: any) {
    // redirect('/login'); // Temporarily disabled for prototype
    data = {};
  }

  return <DashboardController data={data} />;
}
