import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import JobDetailPageClient from './JobDetailClient';

export default async function JobDetailPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mibank_session');
  if (!session) {
    redirect('/login');
  }

  return <JobDetailPageClient />;
}
