'use client';

import React, { useState } from 'react';
import styles from './Webform.module.css';
import { useLanguage } from '@/context/LanguageContext';

import { submitForm } from '../actions';

export default function WebformContent() {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await submitForm(formData);
    if (result.success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2>{lang === 'ID' ? 'Terima Kasih!' : 'Thank You!'}</h2>
        <p>
          {lang === 'ID' 
            ? 'Pengajuan Anda telah kami terima. Tim kami akan menghubungi Anda dalam 1x24 jam.' 
            : 'We have received your application. Our team will contact you within 24 hours.'}
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ marginTop: '20px' }}>
          {lang === 'ID' ? 'Kembali' : 'Back'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.webformContainer}>
      <div className={styles.formHeader}>
        <h1>{lang === 'ID' ? 'Buka Rekening Online' : 'Open Account Online'}</h1>
        <p>{lang === 'ID' ? 'Isi data diri Anda untuk memulai perjalanan finansial bersama Mitra Perbankan Indonesia.' : 'Fill in your details to start your financial journey with Mitra Perbankan Indonesia.'}</p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <div className={styles.sectionTitle}>
          <h3>{lang === 'ID' ? 'Data Pribadi' : 'Personal Data'}</h3>
        </div>
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Nama Lengkap (Sesuai KTP)' : 'Full Name (As per ID)'}</label>
            <input name="name" type="text" required placeholder="John Doe" />
          </div>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'NIK (Nomor Induk Kependudukan)' : 'ID Number (NIK)'}</label>
            <input name="nik" type="text" required placeholder="3201..." />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Tempat Lahir' : 'Place of Birth'}</label>
            <input type="text" required />
          </div>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Tanggal Lahir' : 'Date of Birth'}</label>
            <input type="date" required />
          </div>
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '30px' }}>
          <h3>{lang === 'ID' ? 'Kontak & Pekerjaan' : 'Contact & Occupation'}</h3>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Email' : 'Email Address'}</label>
            <input name="email" type="email" required placeholder="john@example.com" />
          </div>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Nomor Telepon' : 'Phone Number'}</label>
            <input name="phone" type="tel" required placeholder="0812..." />
          </div>
        </div>

        <div className={styles.field}>
          <label>{lang === 'ID' ? 'Pekerjaan' : 'Occupation'}</label>
          <select name="type" required>
            <option value="">{lang === 'ID' ? '-- Pilih Pekerjaan --' : '-- Select Occupation --'}</option>
            <option value="karyawan">Karyawan Swasta</option>
            <option value="pns">PNS / BUMN</option>
            <option value="wiraswasta">Wiraswasta</option>
            <option value="pelajar">Pelajar / Mahasiswa</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        <div className={styles.checkboxField}>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            {lang === 'ID' 
              ? 'Saya setuju dengan syarat dan ketentuan yang berlaku di Mitra Perbankan Indonesia.' 
              : 'I agree to the terms and conditions applicable at Mitra Perbankan Indonesia.'}
          </label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '15px' }}>
          {lang === 'ID' ? 'Kirim Pengajuan' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
