import { fetchApi } from '@/lib/api';
import ClinicalWorkspaceClient from './ClinicalWorkspaceClient';

export default async function ClinicalTimelinePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialTab = typeof resolvedSearchParams.tab === 'string' ? resolvedSearchParams.tab : undefined;

  let timelineData = null;
  let users = [];

  try {
    timelineData = await fetchApi(`/clinical/${id}/timeline`, { cache: 'no-store' });
  } catch (err: any) {
    console.warn(`[ClinicalTimelinePage] Error fetching timeline for ${id}:`, err?.message);
  }

  try {
    users = await fetchApi(`/users`, { cache: 'no-store' });
  } catch (err: any) {
    console.warn(`[ClinicalTimelinePage] Error fetching users:`, err?.message);
  }

  const safeTimeline = timelineData || {
    recordId: id,
    patientName: 'Thor',
    tutorName: 'Luciana Santos',
    events: [],
  };

  const safeUsers = Array.isArray(users) && users.length > 0
    ? users
    : [{ id: 'vet-1', email: 'dr.nogueira@4patas.com.br', name: 'Dr. Nogueira' }];

  return (
    <div className="w-full h-full">
      <ClinicalWorkspaceClient 
        recordId={safeTimeline.recordId || id} 
        initialTimeline={safeTimeline} 
        users={safeUsers} 
        initialTab={initialTab}
      />
    </div>
  );
}
