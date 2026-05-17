import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = ({ settings }: { settings: any }) => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerCol}>
          <h4>Produk</h4>
          <ul>
            <li><Link href="/produk">Simpanan Individu</Link></li>
            <li><Link href="/produk">Kartu Kredit</Link></li>
            <li><Link href="/produk">Pinjaman</Link></li>
            <li><Link href="/produk">Wealth Management</Link></li>
            <li><Link href="/produk">Investasi</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerCol}>
          <h4>Layanan</h4>
          <ul>
            <li><Link href="/layanan">E-Banking</Link></li>
            <li><Link href="/layanan">Layanan Transaksi</Link></li>
            <li><Link href="/layanan">MiBANK Syariah</Link></li>
            <li><Link href="/layanan">Reward MiBANK</Link></li>
            <li><Link href="/layanan">Kurs eRate</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerCol}>
          <h4>Tentang MiBANK</h4>
          <ul>
            <li><Link href="/tentang">Profil Perusahaan</Link></li>
            <li><Link href="/tentang">Hubungan Investor</Link></li>
            <li><Link href="/tentang">Tata Kelola Perusahaan</Link></li>
            <li><Link href="/tentang">Tanggung Jawab Sosial</Link></li>
            <li><Link href="/tentang">Berita & Fitur</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerCol}>
          <h4>Hubungi Kami</h4>
          <div className={styles.contactInfo}>
            <p>📍 {settings?.contact?.address || 'Menara MiBANK, Jakarta Pusat'}</p>
            <p>📞 {settings?.contact?.phone || 'Halo MiBANK 1500999'}</p>
            <p>📧 {settings?.contact?.email || 'support@mibank.co.id'}</p>
            <div className={styles.socialLinks}>
              <Link href="/" className={styles.socialIcon}>FB</Link>
              <Link href="/" className={styles.socialIcon}>IG</Link>
              <Link href="/" className={styles.socialIcon}>YT</Link>
              <Link href="/" className={styles.socialIcon}>TW</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.footerBottom}`}>
        <p>&copy; 2026 PT MITRA PERBANKAN INDONESIA. All Rights Reserved.</p>
        <div className={styles.bottomLinks}>
          <Link href="/">SBDK</Link>
          <Link href="/">Kebijakan Privasi</Link>
          <Link href="/">Syarat & Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
