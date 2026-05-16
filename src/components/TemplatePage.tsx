'use client';

import React from 'react';
import styles from './TemplatePage.module.css';
import { useLanguage } from '@/context/LanguageContext';

interface TemplatePageProps {
  titleId: string;
  titleEn: string;
  contentId: React.ReactNode;
  contentEn: React.ReactNode;
}

const TemplatePage = ({ titleId, titleEn, contentId, contentEn }: TemplatePageProps) => {
  const { lang } = useLanguage();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1>{lang === 'ID' ? titleId : titleEn}</h1>
        </div>
      </div>
      <div className="container" style={{ padding: '60px 20px' }}>
        {lang === 'ID' ? contentId : contentEn}
      </div>
    </div>
  );
};

export default TemplatePage;
