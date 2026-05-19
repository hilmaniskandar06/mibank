'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../Home.module.css'; // Reuse home styles for promo grid

export default function PromoList({ promos }: { promos: any[] }) {
  return (
    <div className={styles.promoGrid} style={{ marginTop: '40px' }}>
      {promos.map((promo) => (
        <div key={promo.id} className={styles.promoCard} style={{ cursor: 'default' }}>
          <div className={styles.promoImg}>
            {promo.image.startsWith('/') ? (
              <img src={promo.image} alt={promo.title_id} />
            ) : (
              promo.image
            )}
          </div>
          <div className={styles.promoInfo}>
            <span style={{ fontSize: '12px', color: 'var(--secondary-color)', fontWeight: '700', textTransform: 'uppercase' }}>
              Promo Terbatas
            </span>
            <h3 style={{ marginTop: '5px' }}>{promo.title_id}</h3>
            <p>{promo.desc_id}</p>
            {promo.id === 1 || promo.title_id === 'SMILE UMKM' ? (
              <Link 
                href="/promo/smile-umkm" 
                className="btn" 
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  marginTop: '20px', 
                  width: '100%', 
                  backgroundColor: 'var(--primary-color, #003366)', 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
              >
                Lihat Detail
              </Link>
            ) : (
              <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%' }}>
                Lihat Detail
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
