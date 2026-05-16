import { getPromos, getSettings } from './actions';
import HomeContent from './HomeContent';

export default async function Home() {
  const promos = await getPromos();
  const settings = await getSettings();
  
  return <HomeContent initialPromos={promos} settings={settings} />;
}
