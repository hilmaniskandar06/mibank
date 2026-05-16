import TemplatePage from '@/components/TemplatePage';

export default function BisnisPage() {
  return (
    <TemplatePage 
      titleId="Layanan Bisnis" 
      titleEn="Business Services" 
      contentId={<p>Dukung pertumbuhan bisnis Anda dengan solusi perbankan korporasi dan UMKM dari MiBANK. Kami menawarkan kredit usaha, manajemen kas, dan layanan ekspor-impor.</p>}
      contentEn={<p>Support your business growth with corporate and SME banking solutions from MiBANK. We offer business loans, cash management, and export-import services.</p>}
    />
  );
}
