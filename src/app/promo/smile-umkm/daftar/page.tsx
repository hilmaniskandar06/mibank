import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SmileUmkmDaftarClient from './SmileUmkmDaftarClient';

export default async function SmileUmkmDaftarPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mibank_session');
  if (!session) {
    redirect('/login');
  }

  return <SmileUmkmDaftarClient />;
}
