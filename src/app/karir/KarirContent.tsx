'use client';

import React, { useState, useEffect } from 'react';
import styles from './Karir.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { getCareersSettings } from '@/app/actions';

interface Vacancy {
  id: string;
  titleId: string;
  titleEn: string;
  locId: string;
  locEn: string;
  typeId: string;
  typeEn: string;
  code: string;
  image?: string;
}

export default function KarirContent() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getCareersSettings().then(res => setSettings(res));
  }, []);

  const handleApplyClick = (positionTitle: string) => {
    router.push(`/karir/detail?posisi=${encodeURIComponent(positionTitle)}`);
  };

  if (!settings) {
    return (
      <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '100px 0', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>{lang === 'ID' ? 'Memuat halaman karir...' : 'Loading careers page...'}</p>
      </div>
    );
  }

  const vacanciesList = settings.vacancies || [];

  return (
    <div className={styles.karirContainer}>
      <div className={styles.header}>
        <h1>{lang === 'ID' ? settings.title_id : settings.title_en}</h1>
        <p>
          {lang === 'ID' ? settings.desc_id : settings.desc_en}
        </p>
      </div>

      <div className={styles.vacancies}>
        <h2 style={{ fontSize: '28px', color: 'var(--primary-color, #003366)', textAlign: 'center', marginBottom: '40px' }}>
          {lang === 'ID' ? 'Lowongan Pekerjaan Tersedia' : 'Available Job Openings'}
        </h2>
        
        <div className={styles.jobList}>
          {vacanciesList.map((job: Vacancy) => (
            <div key={job.id} className={styles.jobCard}>
              <div>
                {/* Visual Job Image block matching the Savings design */}
                <div className={styles.jobLogoPlaceholder}>
                  {job.image ? (
                    <img 
                      src={job.image} 
                      alt={lang === 'ID' ? job.titleId : job.titleEn} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        padding: '10px'
                      }} 
                    />
                  ) : (
                    <span style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                      💼
                    </span>
                  )}
                </div>

                {/* Job Info */}
                <h3 className={styles.jobTitle}>
                  {lang === 'ID' ? job.titleId : job.titleEn}
                </h3>
                
                <p className={styles.jobMetaText}>
                  📍 {lang === 'ID' ? job.locId : job.locEn}
                </p>
                <p className={styles.jobMetaText}>
                  💼 {lang === 'ID' ? job.typeId : job.typeEn}
                </p>
              </div>

              {/* Apply Now Button styled like the Buka Rekening button */}
              <button 
                onClick={() => handleApplyClick(lang === 'ID' ? job.titleId : job.titleEn)}
                className={styles.applyBtn}
              >
                {lang === 'ID' ? 'Lamar Sekarang' : 'Apply Now'}
              </button>
            </div>
          ))}

          {vacanciesList.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#95a5a6' }}>
              {lang === 'ID' ? 'Tidak ada lowongan pekerjaan yang tersedia saat ini.' : 'No job openings available at the moment.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
