'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Home.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export default function HomeContent({ initialPromos, settings }: { initialPromos: any[], settings: any }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="animate-fade">{lang === 'ID' ? settings.hero.title_id : settings.hero.title_en}</h1>
          <p className="animate-fade" style={{ animationDelay: '0.2s' }}>
            {lang === 'ID' ? settings.hero.desc_id : settings.hero.desc_en}
          </p>
          <div className="animate-fade" style={{ animationDelay: '0.4s' }}>
            <Link href="/webform" className="btn btn-primary">{t.ctaBukaRekening}</Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src="/images/hero.png" alt="MiBANK Digital Banking" />
        </div>
      </section>

      {/* Promo Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionTitle}>
            <h2>{t.promoTitle}</h2>
            <Link href="/promo" className={styles.viewAll}>{t.lihatSemua} &rarr;</Link>
          </div>
          <div className={styles.promoGrid}>
            {initialPromos.map((promo) => (
              <Link href={`/promo`} key={promo.id} className={styles.promoCard}>
                <div className={styles.promoImg}>
                  {promo.image.startsWith('/') ? (
                    <img src={promo.image} alt={promo.title_en} />
                  ) : (
                    promo.image
                  )}
                </div>
                <div className={styles.promoInfo}>
                  <h3>{lang === 'ID' ? promo.title_id : promo.title_en}</h3>
                  <p>{lang === 'ID' ? promo.desc_id : promo.desc_en}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`${styles.section} ${styles.services}`}>
        <div className="container">
          <div className={styles.sectionTitle} style={{ justifyContent: 'center', textAlign: 'center' }}>
            <h2>{t.layananTitle}</h2>
          </div>
          <div className={styles.serviceGrid}>
            {[
              { icon: '💳', title: lang === 'ID' ? 'Kartu Kredit' : 'Credit Card', desc: lang === 'ID' ? 'Pilihan kartu yang sesuai gaya hidup Anda.' : 'Cards tailored to your lifestyle.', link: '/produk' },
              { icon: '💰', title: lang === 'ID' ? 'Simpanan' : 'Savings', desc: lang === 'ID' ? 'Kelola tabungan dengan bunga kompetitif.' : 'Manage savings with competitive rates.', link: '/produk' },
              { icon: '🏢', title: lang === 'ID' ? 'Pinjaman Bisnis' : 'Business Loan', desc: lang === 'ID' ? 'Dukungan modal untuk UMKM.' : 'Capital support for SMEs.', link: '/bisnis' },
              { icon: '📱', title: 'Digital Banking', desc: lang === 'ID' ? 'Transaksi kapan saja.' : 'Transact anytime.', link: '/layanan' }
            ].map((s, idx) => (
              <Link href={s.link} key={idx} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.aboutContent}>
            <div>
              <h2>{t.tentangTitle}</h2>
              <p style={{ marginTop: '20px' }}>
                {lang === 'ID' ? 'MiBANK hadir untuk melayani kebutuhan finansial masyarakat Indonesia dengan teknologi modern dan sentuhan personal.' : 'MiBANK is here to serve the financial needs of the Indonesian people with modern technology and a personal touch.'}
              </p>
              <div style={{ marginTop: '30px' }}>
                <h3>{lang === 'ID' ? 'Visi Kami' : 'Our Vision'}</h3>
                <p>{lang === 'ID' ? settings.about.visi_id : settings.about.visi_en}</p>
                <h3 style={{ marginTop: '20px' }}>{lang === 'ID' ? 'Misi Kami' : 'Our Mission'}</h3>
                <p>{lang === 'ID' ? settings.about.misi_id : settings.about.misi_en}</p>
              </div>
            </div>
            <div className={styles.aboutImg}>
              <img src="/images/company.jpg" alt="MiBANK Tower" />
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className={`${styles.section} ${styles.services}`}>
        <div className="container">
          <div className={styles.sectionTitle}>
            <h2>{t.lokasiTitle}</h2>
            <p className={styles.contactInfo}>{t.cariCabang}</p>
          </div>
          <div className={styles.mapSection}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273763261623!2d106.82194681476906!3d-6.214271995498858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f9d3f1d3f1%3A0x1d3f1d3f1d3f1d3f!2sMenara%20BCA!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '12px' }} 
              allowFullScreen={true} 
              loading="lazy"
            ></iframe>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <a href="https://maps.google.com" target="_blank" className="btn btn-outline">{t.lihatMap}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
