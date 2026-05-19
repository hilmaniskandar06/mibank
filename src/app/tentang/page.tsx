import TemplatePage from '@/components/TemplatePage';

export default function TentangPage() {
  return (
    <TemplatePage 
      titleId="Tentang Mitra Perbankan Indonesia" 
      titleEn="About Mitra Perbankan Indonesia" 
      contentId={<p>Mitra Perbankan Indonesia adalah mitra perbankan terpercaya di Indonesia yang berkomitmen untuk mendukung pertumbuhan ekonomi melalui layanan finansial yang inovatif dan aman.</p>}
      contentEn={<p>Mitra Perbankan Indonesia is a trusted banking partner in Indonesia committed to supporting economic growth through innovative and secure financial services.</p>}
    />
  );
}
