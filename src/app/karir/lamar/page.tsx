'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { submitJobApplication } from '../../actions';
import styles from '../Karir.module.css';

interface Vacancy {
  id: string;
  titleId: string;
  titleEn: string;
}

const VACANCIES: Vacancy[] = [
  {
    id: 'teller',
    titleId: 'Teller (Frontliner)',
    titleEn: 'Teller (Frontliner)'
  },
  {
    id: 'cs',
    titleId: 'Customer Service Representative',
    titleEn: 'Customer Service Representative'
  },
  {
    id: 'it',
    titleId: 'IT Support Specialist',
    titleEn: 'IT Support Specialist'
  }
];

function LamarForm() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const posisiParam = searchParams.get('posisi') || '';
  const [selectedPosition, setSelectedPosition] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (posisiParam) {
      setSelectedPosition(posisiParam);
    }
  }, [posisiParam]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await submitJobApplication(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Terjadi kesalahan saat mengirim lamaran.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung dengan server.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successMessage} style={{ margin: '40px auto', maxWidth: '600px' }}>
        <div className={styles.successIcon}>✓</div>
        <h2>{lang === 'ID' ? 'Lamaran Terkirim!' : 'Application Sent!'}</h2>
        <p>
          {lang === 'ID'
            ? 'Terima kasih telah melamar. Tim HRD kami akan meninjau berkas Anda secara mendalam dan menghubungi Anda kembali jika Anda memenuhi kriteria.'
            : 'Thank you for applying. Our HRD team will review your documents in detail and contact you if you meet the criteria.'}
        </p>
        <button onClick={() => router.push('/karir')} className="btn btn-primary">
          {lang === 'ID' ? 'Kembali ke Karir' : 'Back to Careers'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formSection} style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
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

      <h2>
        {lang === 'ID' 
          ? `Formulir Lamaran Kerja ${selectedPosition || 'Lengkap'}` 
          : `Job Application Form ${selectedPosition || 'Detailed'}`}
      </h2>
      <p style={{ marginBottom: '30px' }}>
        {lang === 'ID'
          ? 'Harap isi seluruh informasi di bawah ini dengan lengkap dan benar.'
          : 'Please fill out all the information below completely and truthfully.'}
      </p>

      {errorMsg && (
        <div style={{ color: '#721c24', background: '#f8d7da', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      <form action={handleSubmit} className={styles.form}>
        
        {/* SECTION 1: PERSONAL DATA */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>1. {lang === 'ID' ? 'Data Pribadi' : 'Personal Data'}</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Nama Lengkap' : 'Full Name'}</label>
              <input name="name" type="text" required placeholder="John Doe" />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Nomor KTP / NIK' : 'NIK / ID Card Number'}</label>
              <input name="nik" type="text" required maxLength={16} placeholder="320xxxxxxxxxxxxx" />
            </div>
          </div>
          
          <div className={styles.row} style={{ marginTop: '15px' }}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Tempat Lahir' : 'Place of Birth'}</label>
              <input name="birthPlace" type="text" required placeholder="Jakarta" />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Tanggal Lahir' : 'Date of Birth'}</label>
              <input name="birthDate" type="date" required />
            </div>
          </div>

          <div className={styles.row} style={{ marginTop: '15px' }}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Jenis Kelamin' : 'Gender'}</label>
              <select name="gender" required>
                <option value="">{lang === 'ID' ? '-- Pilih Jenis Kelamin --' : '-- Select Gender --'}</option>
                <option value="Laki-laki">{lang === 'ID' ? 'Laki-laki' : 'Male'}</option>
                <option value="Perempuan">{lang === 'ID' ? 'Perempuan' : 'Female'}</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Agama' : 'Religion'}</label>
              <select name="religion" required>
                <option value="">{lang === 'ID' ? '-- Pilih Agama --' : '-- Select Religion --'}</option>
                <option value="Islam">Islam</option>
                <option value="Kristen Protestan">Kristen Protestan</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Khonghucu">Khonghucu</option>
              </select>
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Status Pernikahan' : 'Marital Status'}</label>
            <select name="maritalStatus" required>
              <option value="">{lang === 'ID' ? '-- Pilih Status --' : '-- Select Status --'}</option>
              <option value="Belum Kawin">{lang === 'ID' ? 'Belum Kawin' : 'Single'}</option>
              <option value="Kawin">{lang === 'ID' ? 'Kawin' : 'Married'}</option>
              <option value="Cerai Hidup">{lang === 'ID' ? 'Cerai Hidup' : 'Divorced'}</option>
              <option value="Cerai Mati">{lang === 'ID' ? 'Cerai Mati' : 'Widowed'}</option>
            </select>
          </div>

          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Alamat Domisili Saat Ini' : 'Current Residential Address'}</label>
            <textarea name="address" rows={2} required placeholder={lang === 'ID' ? 'Masukkan alamat lengkap Anda saat ini' : 'Enter your current full address'} />
          </div>
        </div>

        {/* SECTION 2: CONTACT */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>2. {lang === 'ID' ? 'Informasi Kontak' : 'Contact Information'}</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Nomor WhatsApp Aktif' : 'Active WhatsApp Number'}</label>
              <input name="phone" type="tel" required placeholder="0812xxxxxxxx" />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Nomor Telepon Alternatif' : 'Alternative Phone Number'}</label>
              <input name="phoneAlt" type="tel" placeholder="0813xxxxxxxx" />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Alamat Email Utama' : 'Primary Email Address'}</label>
            <input name="email" type="email" required placeholder="example@mail.com" />
          </div>
        </div>

        {/* SECTION 3: EDUCATION */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>3. {lang === 'ID' ? 'Pendidikan Terakhir' : 'Education'}</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Nama Universitas / Sekolah' : 'University / School Name'}</label>
              <input name="eduUniv" type="text" required placeholder="Universitas Indonesia" />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Fakultas' : 'Faculty'}</label>
              <input name="eduFaculty" type="text" placeholder="Fakultas Ekonomi" />
            </div>
          </div>
          <div className={styles.row} style={{ marginTop: '15px' }}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Jurusan / Program Studi' : 'Major / Program Study'}</label>
              <input name="eduMajor" type="text" required placeholder="Akuntansi" />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Tahun Masuk & Lulus' : 'Year Entry & Graduation'}</label>
              <input name="eduYears" type="text" required placeholder="2020 - 2024" />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'IPK (GPA) / Nilai Rata-rata Ujian' : 'IPK (GPA) / Exam Average Score'}</label>
            <input name="eduGpa" type="text" required placeholder="3.75" />
          </div>
        </div>

        {/* SECTION 4: EXPERIENCE & ACHIEVEMENTS */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>4. {lang === 'ID' ? 'Pengalaman & Prestasi' : 'Experience & Achievements'}</h3>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Prestasi & Beasiswa (Opsional)' : 'Achievements & Scholarships (Optional)'}</label>
            <textarea name="achievements" rows={2} placeholder={lang === 'ID' ? 'Sebutkan prestasi akademik/non-akademik atau beasiswa yang pernah diterima' : 'List any achievements or scholarships received'} />
          </div>
          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Pengalaman Organisasi / Kerja' : 'Organizational / Work Experience'}</label>
            <textarea name="experience" rows={3} required placeholder={lang === 'ID' ? 'Sebutkan pengalaman kerja magang, kontrak, atau organisasi kampus/luar' : 'Describe your work or organizational experience'} />
          </div>
        </div>

        {/* SECTION 5: STATEMENTS */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>5. {lang === 'ID' ? 'Pernyataan Khusus' : 'Special Declarations'}</h3>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Kesediaan Ditempatkan di Seluruh Wilayah Kerja' : 'Willingness to be Placed in Any Work Area'}</label>
            <select name="willingPlacement" required>
              <option value="">{lang === 'ID' ? '-- Pilih Jawaban --' : '-- Select Answer --'}</option>
              <option value="Ya">{lang === 'ID' ? 'Ya (Yes)' : 'Yes'}</option>
              <option value="Tidak">{lang === 'ID' ? 'Tidak (No)' : 'No'}</option>
            </select>
          </div>
          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Pernyataan Tidak Memiliki Hubungan Keluarga Inti di Bank Ini' : 'Declaration of No Immediate Family Members Working in this Bank'}</label>
            <select name="noFamilyRelation" required>
              <option value="">{lang === 'ID' ? '-- Pilih Jawaban --' : '-- Select Answer --'}</option>
              <option value="Ya">{lang === 'ID' ? 'Ya, Saya menyatakan tidak memiliki hubungan keluarga inti' : 'Yes, I declare I have no family relations'}</option>
              <option value="Tidak">{lang === 'ID' ? 'Tidak, Saya memiliki hubungan keluarga inti' : 'No, I have family relations'}</option>
            </select>
          </div>
          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Posisi Yang Dilamar' : 'Position Applied'}</label>
            <select 
              value={selectedPosition} 
              onChange={(e) => setSelectedPosition(e.target.value)} 
              disabled
              style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
            >
              <option value="">{lang === 'ID' ? '-- Pilih Posisi --' : '-- Select Position --'}</option>
              {VACANCIES.map((job) => (
                <option key={job.id} value={lang === 'ID' ? job.titleId : job.titleEn}>
                  {lang === 'ID' ? job.titleId : job.titleEn}
                </option>
              ))}
            </select>
            <input type="hidden" name="position" value={selectedPosition} />
          </div>
        </div>

        {/* SECTION 6: UPLOADS */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '10px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>6. {lang === 'ID' ? 'Unggah Dokumen Pendukung' : 'Upload Supporting Documents'}</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Unggah CV Terbaru (PDF)' : 'Upload CV / Resume (PDF)'}</label>
              <input name="cv" type="file" accept=".pdf" required />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Scan KTP (PDF/JPG)' : 'Scan KTP / ID Card (PDF/JPG)'}</label>
              <input name="ktpScan" type="file" accept=".pdf,image/*" required />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: '15px' }}>
            <label>{lang === 'ID' ? 'Scan Ijazah & Transkrip Nilai Legalisir (PDF)' : 'Scan Certificate & Transcript (PDF)'}</label>
            <input name="ijazahScan" type="file" accept=".pdf" required />
          </div>
          <div className={styles.row} style={{ marginTop: '15px' }}>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Pas Foto Terbaru (JPG/PNG)' : 'Recent Pass Photo (JPG/PNG)'}</label>
              <input name="pasFoto" type="file" accept="image/*" required />
            </div>
            <div className={styles.field}>
              <label>{lang === 'ID' ? 'Foto Seluruh Badan (JPG/PNG)' : 'Full Body Photo (JPG/PNG)'}</label>
              <input name="fotoBadan" type="file" accept="image/*" required />
            </div>
          </div>
        </div>

        {/* SECTION 7: MOTIVATION */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>7. {lang === 'ID' ? 'Motivasi Kerja' : 'Career Motivation'}</h3>
          <div className={styles.field}>
            <label>{lang === 'ID' ? 'Deskripsi Alasan & Motivasi Bekerja Bersama Kami' : 'Description of Motivation & Reasons to Work with Us'}</label>
            <textarea name="motivation" rows={4} required placeholder={lang === 'ID' ? 'Tuliskan alasan mengapa Anda tertarik bergabung dan kontribusi apa yang ingin Anda berikan' : 'State your motivation and what you can contribute'} />
          </div>
        </div>

        <div className={styles.checkboxField} style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <input type="checkbox" id="agree" required style={{ marginTop: '4px' }} />
          <label htmlFor="agree" style={{ lineHeight: '1.5', cursor: 'pointer' }}>
            {lang === 'ID'
              ? 'Saya menyatakan bahwa seluruh data yang saya isikan adalah benar, otentik, dan dapat dipertanggungjawabkan di hadapan hukum.'
              : 'I declare that all the information I have filled is true, authentic, and accountable in front of the law.'}
          </label>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ padding: '15px', fontWeight: 'bold', marginTop: '25px', width: '100%' }}
          disabled={loading}
        >
          {loading 
            ? (lang === 'ID' ? 'Mengirim Lamaran...' : 'Sending Application...') 
            : (lang === 'ID' ? 'Kirim Lamaran Kerja' : 'Submit Job Application')}
        </button>
      </form>
    </div>
  );
}

export default function LamarPage() {
  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <div className="container">
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '18px', color: '#666' }}>
            Memuat Formulir Lamaran Kerja...
          </div>
        }>
          <LamarForm />
        </Suspense>
      </div>
    </div>
  );
}
