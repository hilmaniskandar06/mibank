'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getDigitalSettings } from '@/app/actions';

interface BankPartner {
  name: string;
  code: string;
  url: string;
  logo?: string;
}

export default function DigitalBankingPage() {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getDigitalSettings().then(res => setSettings(res));
  }, []);

  if (!settings) {
    return (
      <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '100px 0', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>{lang === 'ID' ? 'Memuat halaman digital banking...' : 'Loading digital banking page...'}</p>
      </div>
    );
  }

  const filteredBanks = (settings.banks || []).filter((bank: BankPartner) => 
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Description Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: 'var(--primary-color, #003366)', fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            {lang === 'ID' ? settings.title_id : settings.title_en}
          </h1>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
            {lang === 'ID' ? settings.desc_id : settings.desc_en}
          </p>
        </div>

        {/* Search Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder={lang === 'ID' ? 'Cari bank partner...' : 'Search partner bank...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '14px 20px',
              border: '1px solid #ddd',
              borderRadius: '30px',
              fontSize: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Banks Grid List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredBanks.map((bank: BankPartner, index: number) => (
            <div 
              key={index} 
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #eaeaea',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s'
              }}
            >
              <div>
                {/* Visual Grey Placeholder Image block */}
                <div style={{
                  width: '100%',
                  height: '140px',
                  backgroundColor: bank.logo ? '#ffffff' : '#e2e8f0', // White if logo exists, grey if not
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: bank.logo ? 'none' : '1px solid #cbd5e1',
                  marginBottom: '15px',
                  overflow: 'hidden',
                  padding: bank.logo ? '10px' : '12px'
                }}>
                  {bank.logo ? (
                    <img 
                      src={bank.logo} 
                      alt={bank.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  ) : (
                    <span style={{ color: '#64748b', fontWeight: '700', fontSize: '22px' }}>
                      {bank.code}
                    </span>
                  )}
                </div>

                {/* Bank Description */}
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2c3e50', marginBottom: '8px' }}>
                  {bank.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#7f8c8d', lineHeight: '1.4' }}>
                  {lang === 'ID' 
                    ? `Klik di bawah ini untuk membuka akun digital resmi di ${bank.name}.` 
                    : `Click below to open an official digital account at ${bank.name}.`}
                </p>
              </div>

              {/* External Link button */}
              <a 
                href={bank.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: '20px',
                  padding: '12px',
                  backgroundColor: 'var(--primary-color, #003366)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#002244'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color, #003366)'}
              >
                {lang === 'ID' ? 'Buka Akun Digital' : 'Open Digital Account'}
              </a>
            </div>
          ))}

          {filteredBanks.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#95a5a6' }}>
              {lang === 'ID' ? 'Bank partner tidak ditemukan.' : 'Partner bank not found.'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
