import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import VideoCall from './VideoCall';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mibank_session');
  if (!session) {
    redirect('/login');
  }

  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <div className="container">
        <VideoCall />
      </div>
    </div>
  );
}
