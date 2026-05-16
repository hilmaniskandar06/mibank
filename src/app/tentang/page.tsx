import TemplatePage from '@/components/TemplatePage';

export default function TentangPage() {
  return (
    <TemplatePage 
      titleId="Tentang MiBANK" 
      titleEn="About MiBANK" 
      contentId={<p>MiBANK adalah mitra perbankan terpercaya di Indonesia yang berkomitmen untuk mendukung pertumbuhan ekonomi melalui layanan finansial yang inovatif dan aman.</p>}
      contentEn={<p>MiBANK is a trusted banking partner in Indonesia committed to supporting economic growth through innovative and secure financial services.</p>}
    />
  );
}
