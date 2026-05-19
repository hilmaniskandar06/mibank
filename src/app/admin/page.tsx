import { 
  getPromos, 
  getSubmissions, 
  getUsers, 
  getSettings, 
  getSession,
  addPromo,
  deletePromo,
  updateSettings,
  getJobApplications,
  getSavingsSettings,
  getCreditSettings,
  getLoanSettings,
  getDigitalSettings,
  getCareersSettings,
  getSmileUmkmSubmissions
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
  const applications = await getJobApplications();
  const savings = await getSavingsSettings();
  const credit = await getCreditSettings();
  const loans = await getLoanSettings();
  const digital = await getDigitalSettings();
  const careers = await getCareersSettings();
  const smileUmkm = await getSmileUmkmSubmissions();

  return (
    <AdminDashboard 
      initialPromos={promos}
      initialSubmissions={submissions}
      initialUsers={users}
      initialSettings={settings}
      initialApplications={applications}
      initialSavingsSettings={savings}
      initialCreditSettings={credit}
      initialLoanSettings={loans}
      initialDigitalSettings={digital}
      initialCareersSettings={careers}
      initialSmileUmkmSubmissions={smileUmkm}
    />
  );
}
