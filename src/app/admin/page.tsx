import { 
  getPromos, 
  getSubmissions, 
  getUsers, 
  getSettings, 
  getSession,
  addPromo,
  deletePromo,
  updateSettings
} from '../actions';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const promos = await getPromos();
  const submissions = await getSubmissions();
  const users = await getUsers();
  const settings = await getSettings();

  return (
    <AdminDashboard 
      initialPromos={promos}
      initialSubmissions={submissions}
      initialUsers={users}
      initialSettings={settings}
    />
  );
}
