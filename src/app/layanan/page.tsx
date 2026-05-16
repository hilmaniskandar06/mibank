import TemplatePage from '@/components/TemplatePage';

export default function LayananPage() {
  return (
    <TemplatePage 
      titleId="Layanan Perbankan" 
      titleEn="Banking Services" 
      contentId={<p>Kami menyediakan layanan perbankan digital, pengiriman uang, dan layanan operasional lainnya untuk kemudahan Anda.</p>}
      contentEn={<p>We provide digital banking, money transfers, and other operational services for your convenience.</p>}
    />
  );
}
