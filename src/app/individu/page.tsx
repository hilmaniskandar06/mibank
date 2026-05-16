import TemplatePage from '@/components/TemplatePage';

export default function IndividuPage() {
  return (
    <TemplatePage 
      titleId="Layanan Individu" 
      titleEn="Individual Services" 
      contentId={<p>Selamat datang di layanan perbankan individu MiBANK. Kami menyediakan solusi tabungan, kartu kredit, dan pinjaman pribadi yang sesuai dengan kebutuhan Anda.</p>}
      contentEn={<p>Welcome to MiBANK individual banking. We provide savings, credit cards, and personal loan solutions tailored to your needs.</p>}
    />
  );
}
