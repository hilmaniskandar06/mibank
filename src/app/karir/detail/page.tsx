'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getCareersSettings } from '@/app/actions';
import styles from '../Karir.module.css';

interface VacancyDetails {
  title: string;
  location: string;
  type: string;
  code: string;
  image?: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

const DEFAULT_DESCRIPTIONS: Record<string, {
  overviewId: string;
  overviewEn: string;
  responsibilitiesId: string[];
  responsibilitiesEn: string[];
  requirementsId: string[];
  requirementsEn: string[];
}> = {
  'teller': {
    overviewId: 'Bertanggung jawab melayani transaksi tunai dan non-tunai nasabah secara cepat, akurat, dan ramah sesuai standar operasional bank, serta menjaga rekonsiliasi kas harian.',
    overviewEn: 'Responsible for serving customers cash and non-cash transactions quickly, accurately, and friendly according to bank operational standards, and maintaining daily cash reconciliation.',
    responsibilitiesId: [
      'Melayani penarikan, penyetoran, dan transfer dana nasabah.',
      'Melakukan verifikasi tanda tangan dan keaslian uang kertas.',
      'Menyeimbangkan laci kas secara akurat di setiap akhir hari kerja.',
      'Memberikan edukasi produk simpanan dasar kepada nasabah.'
    ],
    responsibilitiesEn: [
      'Serve customer withdrawals, deposits, and fund transfers.',
      'Verify signatures and authenticity of banknotes.',
      'Balance the cash drawer accurately at the end of each working day.',
      'Provide basic savings product education to customers.'
    ],
    requirementsId: [
      'Pendidikan minimal D3 / S1 semua jurusan.',
      'Indeks Prestasi Kumulatif (IPK) minimal 3.00.',
      'Berpenampilan menarik, rapi, dan memiliki kemampuan komunikasi yang baik.',
      'Teliti, jujur, disiplin, dan memiliki integritas yang tinggi.'
    ],
    requirementsEn: [
      'Minimum Associate / Bachelor degree in any major.',
      'Minimum GPA of 3.00.',
      'Good looking, neat, and has good communication skills.',
      'Detail-oriented, honest, disciplined, and has high integrity.'
    ]
  },
  'cs': {
    overviewId: 'Bertanggung jawab membantu nasabah dalam pembukaan rekening baru, memberikan informasi produk perbankan, menangani keluhan, serta menjaga loyalitas nasabah dengan standar pelayanan prima.',
    overviewEn: 'Responsible for assisting customers in opening new accounts, providing banking product information, handling complaints, and maintaining customer loyalty with prime service standards.',
    responsibilitiesId: [
      'Melayani proses pembukaan, perubahan, dan penutupan akun perbankan nasabah.',
      'Memberikan informasi produk simpanan, pinjaman, dan layanan digital bank.',
      'Menangani keluhan nasabah dan mencarikan solusi terbaik dengan sopan.',
      'Membantu nasabah yang mengalami kendala teknis kartu ATM atau mobile banking.'
    ],
    responsibilitiesEn: [
      'Serve the opening, modification, and closing of customer banking accounts.',
      'Provide info on savings, loans, and digital banking services.',
      'Handle customer complaints and find the best solution politely.',
      'Assist customers experiencing technical issues with ATM cards or mobile banking.'
    ],
    requirementsId: [
      'Pendidikan minimal S1 semua jurusan.',
      'IPK minimal 3.00.',
      'Memiliki kemampuan komunikasi, persuasi, dan interpersonal yang sangat baik.',
      'Mampu berbahasa Inggris secara aktif menjadi nilai tambah.'
    ],
    requirementsEn: [
      'Minimum Bachelor degree in any major.',
      'Minimum GPA of 3.00.',
      'Has excellent communication, persuasion, and interpersonal skills.',
      'Ability to speak active English is a plus.'
    ]
  },
  'it': {
    overviewId: 'Bertanggung jawab menjaga keandalan infrastruktur IT, memelihara perangkat keras, lunak, jaringan komunikasi kantor bank, serta melakukan troubleshoot masalah teknis operasional harian.',
    overviewEn: 'Responsible for maintaining IT infrastructure reliability, hardware, software, bank communication networks, and troubleshooting daily operational technical issues.',
    responsibilitiesId: [
      'Memelihara keandalan perangkat keras, lunak komputer, dan jaringan LAN/WAN.',
      'Menyelesaikan troubleshooting masalah teknis perangkat kerja staf bank.',
      'Memastikan keamanan data internal perbankan berjalan sesuai kebijakan keamanan informasi.',
      'Melakukan backup data rutin dan pemeliharaan server secara berkala.'
    ],
    responsibilitiesEn: [
      'Maintain hardware, software, and LAN/WAN network reliability.',
      'Resolve technical troubleshooting issues for bank staff workstations.',
      'Ensure internal banking data security aligns with information security policy.',
      'Perform routine data backups and regular server maintenance.'
    ],
    requirementsId: [
      'Pendidikan S1 Teknik Informatika / Sistem Informasi / Ilmu Komputer.',
      'IPK minimal 3.00.',
      'Memiliki pengetahuan mendalam mengenai sistem operasi, jaringan komputer (TCP/IP), dan database.',
      'Memiliki inisiatif tinggi dan kemampuan problem-solving yang sangat baik.'
    ],
    requirementsEn: [
      'Bachelor degree in Computer Science / Information Systems / Informatics Engineering.',
      'Minimum GPA of 3.00.',
      'Deep knowledge of operating systems, computer networks (TCP/IP), and databases.',
      'Has high initiative and excellent problem-solving skills.'
    ]
  }
};

function JobDetailContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const posisiParam = searchParams.get('posisi') || '';
  const [settings, setSettings] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    getCareersSettings().then(res => setSettings(res));
  }, []);

  if (!posisiParam) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h3>{lang === 'ID' ? 'Lowongan tidak ditemukan.' : 'Job vacancy not found.'}</h3>
        <button onClick={() => router.push('/karir')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          {lang === 'ID' ? 'Kembali ke Halaman Karir' : 'Back to Careers Page'}
        </button>
      </div>
    );
  }

  // Find vacancy matching the parameter name (case-insensitive or exact)
  let matchedJob: any = null;
  if (settings && settings.vacancies) {
    matchedJob = settings.vacancies.find((v: any) => 
      v.titleId.toLowerCase() === posisiParam.toLowerCase() || 
      v.titleEn.toLowerCase() === posisiParam.toLowerCase()
    );
  }

  // Determine which fallback key to use
  let fallbackKey = 'teller';
  if (posisiParam.toLowerCase().includes('customer') || posisiParam.toLowerCase().includes('service')) {
    fallbackKey = 'cs';
  } else if (posisiParam.toLowerCase().includes('it') || posisiParam.toLowerCase().includes('support') || posisiParam.toLowerCase().includes('specialist')) {
    fallbackKey = 'it';
  }

  const fallbackData = DEFAULT_DESCRIPTIONS[fallbackKey];

  // Build the details object
  const jobDetails: VacancyDetails = {
    title: posisiParam,
    location: matchedJob ? (lang === 'ID' ? matchedJob.locId : matchedJob.locEn) : (lang === 'ID' ? 'Kantor Cabang Jakarta' : 'Jakarta Branch Office'),
    type: matchedJob ? (lang === 'ID' ? matchedJob.typeId : matchedJob.typeEn) : (lang === 'ID' ? 'Penuh Waktu' : 'Full Time'),
    code: matchedJob ? matchedJob.code : 'VAC',
    image: matchedJob ? matchedJob.image : undefined,
    overview: lang === 'ID' ? (matchedJob?.overviewId || fallbackData.overviewId) : (matchedJob?.overviewEn || fallbackData.overviewEn),
    responsibilities: lang === 'ID' 
      ? (matchedJob?.responsibilitiesId || fallbackData.responsibilitiesId) 
      : (matchedJob?.responsibilitiesEn || fallbackData.responsibilitiesEn),
    requirements: lang === 'ID' 
      ? (matchedJob?.requirementsId || fallbackData.requirementsId) 
      : (matchedJob?.requirementsEn || fallbackData.requirementsEn)
  };

  const handleApplyClick = () => {
    if (agreed) {
      router.push(`/karir/lamar?posisi=${encodeURIComponent(posisiParam)}`);
    }
  };

  return (
    <div className={styles.karirContainer} style={{ maxWidth: '900px' }}>
      
      {/* Back Button */}
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => router.push('/karir')} 
          className="btn" 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary-color, #003366)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontWeight: 'bold', 
            padding: 0 
          }}
        >
          ← {lang === 'ID' ? 'Kembali ke Karir' : 'Back to Careers'}
        </button>
      </div>

      {/* Header Info Block */}
      <div className={styles.jobCard} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '30px', padding: '30px', marginBottom: '30px', borderLeft: '6px solid var(--primary-color, #003366)', hover: 'none', transform: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '90px', height: '90px', flexShrink: 0, border: '1px solid #ddd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', overflow: 'hidden' }}>
          {jobDetails.image ? (
            <img src={jobDetails.image} alt={jobDetails.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '36px' }}>💼</span>
          )}
        </div>
        <div style={{ flexGrow: 1 }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-color)', background: '#e6f2ff', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
            Code: {jobDetails.code}
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 4px 0', color: '#2c3e50' }}>{jobDetails.title}</h2>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#7f8c8d' }}>
            <span>📍 {jobDetails.location}</span>
            <span>💼 {jobDetails.type}</span>
          </div>
        </div>
      </div>

      {/* Details Box */}
      <div className={styles.jobCard} style={{ padding: '30px', marginBottom: '30px', cursor: 'default' }}>
        
        {/* Overview */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: 'var(--primary-color, #003366)', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
            {lang === 'ID' ? 'Deskripsi Pekerjaan' : 'Job Description'}
          </h3>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.7' }}>
            {jobDetails.overview}
          </p>
        </div>

        {/* Responsibilities */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: 'var(--primary-color, #003366)', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
            {lang === 'ID' ? 'Tanggung Jawab Utama' : 'Key Responsibilities'}
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '15px', color: '#555', lineHeight: '1.7', listStyleType: 'disc' }}>
            {jobDetails.responsibilities.map((resp, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{resp}</li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color, #003366)', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
            {lang === 'ID' ? 'Persyaratan Pelamar' : 'Applicant Requirements'}
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '15px', color: '#555', lineHeight: '1.7', listStyleType: 'disc' }}>
            {jobDetails.requirements.map((req, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{req}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Agreement Checkbox Card */}
      <div className={styles.jobCard} style={{ padding: '25px', marginBottom: '30px', cursor: 'default', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
        <label style={{ display: 'flex', gap: '15px', cursor: 'pointer', alignItems: 'flex-start' }}>
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)} 
            style={{ width: '22px', height: '22px', marginTop: '2px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
            {lang === 'ID' 
              ? 'Saya telah membaca, memahami, dan menyetujui seluruh deskripsi pekerjaan serta persyaratan di atas, dan menyatakan siap memberikan data diri yang benar pada formulir pendaftaran lamaran.' 
              : 'I have read, understood, and agreed to all the job descriptions and requirements above, and declare myself ready to provide accurate personal data in the application form.'}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => router.push('/karir')} 
          className="btn" 
          style={{ padding: '12px 30px', fontWeight: 'bold', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          {lang === 'ID' ? 'Batal' : 'Cancel'}
        </button>
        
        <button 
          onClick={handleApplyClick}
          disabled={!agreed}
          className="btn"
          style={{ 
            padding: '12px 35px', 
            fontWeight: 'bold', 
            backgroundColor: agreed ? 'var(--primary-color, #003366)' : '#cbd5e1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: agreed ? 'pointer' : 'not-allowed', 
            transition: 'background-color 0.2s',
            boxShadow: agreed ? '0 4px 12px rgba(0, 51, 102, 0.2)' : 'none'
          }}
        >
          {lang === 'ID' ? 'Isi Formulir Pelamar' : 'Fill Application Form'}
        </button>
      </div>

    </div>
  );
}

export default function JobDetailPage() {
  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p style={{ color: '#666' }}>Loading details...</p>
        </div>
      }>
        <JobDetailContent />
      </Suspense>
    </div>
  );
}
