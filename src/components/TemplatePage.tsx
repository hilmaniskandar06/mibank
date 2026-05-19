'use client';

import React from 'react';
import styles from './TemplatePage.module.css';

interface TemplatePageProps {
  titleId: string;
  titleEn?: string;
  contentId: React.ReactNode;
  contentEn?: React.ReactNode;
}

const TemplatePage = ({ titleId, contentId }: TemplatePageProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1>{titleId}</h1>
        </div>
      </div>
      <div className="container" style={{ padding: '60px 20px' }}>
        {contentId}
      </div>
    </div>
  );
};

export default TemplatePage;
