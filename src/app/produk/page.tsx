import TemplatePage from '@/components/TemplatePage';

export default function ProdukPage() {
  return (
    <TemplatePage 
      titleId="Produk Kami" 
      titleEn="Our Products" 
      contentId={<p>Temukan berbagai produk perbankan mulai dari tabungan, kartu kredit, pinjaman, hingga produk investasi.</p>}
      contentEn={<p>Discover various banking products ranging from savings, credit cards, loans, to investment products.</p>}
    />
  );
}
