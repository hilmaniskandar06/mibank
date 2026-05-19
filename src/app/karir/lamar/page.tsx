import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LamarPageClient from './LamarClient';

export default async function LamarPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mibank_session');
  if (!session) {
    redirect('/login');
  }

  return <LamarPageClient />;
}
