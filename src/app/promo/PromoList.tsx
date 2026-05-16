'use client';

import React from 'react';
import styles from '../Home.module.css'; // Reuse home styles for promo grid
import { useLanguage } from '@/context/LanguageContext';

export default function PromoList({ promos }: { promos: any[] }) {
  const { lang } = useLanguage();

  return (
    <div className={styles.promoGrid} style={{ marginTop: '40px' }}>
      {promos.map((promo) => (
        <div key={promo.id} className={styles.promoCard} style={{ cursor: 'default' }}>
          <div className={styles.promoImg}>
            {promo.image.startsWith('/') ? (
              <img src={promo.image} alt={promo.title_en} />
            ) : (
              promo.image
            )}
          </div>
          <div className={styles.promoInfo}>
            <span style={{ fontSize: '12px', color: 'var(--secondary-color)', fontWeight: '700', textTransform: 'uppercase' }}>
              {lang === 'ID' ? 'Promo Terbatas' : 'Limited Offer'}
            </span>
            <h3 style={{ marginTop: '5px' }}>{lang === 'ID' ? promo.title_id : promo.title_en}</h3>
            <p>{lang === 'ID' ? promo.desc_id : promo.desc_en}</p>
            <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%' }}>
              {lang === 'ID' ? 'Lihat Detail' : 'View Details'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
