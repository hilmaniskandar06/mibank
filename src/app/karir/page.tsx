import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import KarirContent from './KarirContent';

export default async function KarirPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mibank_session');
  if (!session) {
    redirect('/login');
  }

  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <div className="container">
        <KarirContent />
      </div>
    </div>
  );
}
