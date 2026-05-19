'use client';

import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { 
  addPromo, 
  deletePromo, 
  updatePromo, 
  updateSettings, 
  adminAddUser, 
  adminUpdateUserRole, 
  adminDeleteUser, 
  updateApplicationStatus, 
  updateSavingsSettings, 
  uploadBankLogo,
  updateCreditSettings,
  updateLoanSettings,
  updateDigitalSettings,
  updateCareersSettings,
  uploadCareerImage,
  updateSmileUmkmStatus
} from '../actions';

interface AdminDashboardProps {
  initialPromos: any[];
  initialSubmissions: any[];
  initialUsers: any[];
  initialSettings: any;
  initialApplications: any[];
  initialSavingsSettings: any;
  initialCreditSettings: any;
  initialLoanSettings: any;
  initialDigitalSettings: any;
  initialCareersSettings: any;
  initialSmileUmkmSubmissions: any[];
}

export default function AdminDashboard({ 
  initialPromos, 
  initialSubmissions, 
  initialUsers, 
  initialSettings,
  initialApplications,
  initialSavingsSettings,
  initialCreditSettings,
  initialLoanSettings,
  initialDigitalSettings,
  initialCareersSettings,
  initialSmileUmkmSubmissions
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('submissions');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);
  const [smileSubmissions, setSmileSubmissions] = useState(initialSmileUmkmSubmissions || []);
  const [expandedSmileId, setExpandedSmileId] = useState<number | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const selectedApp = initialApplications.find(a => a.id === selectedAppId);
  const editingPromo = initialPromos.find(p => p.id === editingPromoId);

  // Savings settings states
  const [savingsTitleId, setSavingsTitleId] = useState(initialSavingsSettings?.title_id || '');
  const [savingsDescId, setSavingsDescId] = useState(initialSavingsSettings?.desc_id || '');
  const [savingsBanks, setSavingsBanks] = useState<any[]>(initialSavingsSettings?.banks || []);
  const [savingsMsg, setSavingsMsg] = useState('');

  // Credit card settings states
  const [creditTitleId, setCreditTitleId] = useState(initialCreditSettings?.title_id || '');
  const [creditDescId, setCreditDescId] = useState(initialCreditSettings?.desc_id || '');
  const [creditBanks, setCreditBanks] = useState<any[]>(initialCreditSettings?.banks || []);
  const [creditMsg, setCreditMsg] = useState('');

  // Loan settings states
  const [loanTitleId, setLoanTitleId] = useState(initialLoanSettings?.title_id || '');
  const [loanDescId, setLoanDescId] = useState(initialLoanSettings?.desc_id || '');
  const [loanBanks, setLoanBanks] = useState<any[]>(initialLoanSettings?.banks || []);
  const [loanMsg, setLoanMsg] = useState('');

  // Digital banking settings states
  const [digitalTitleId, setDigitalTitleId] = useState(initialDigitalSettings?.title_id || '');
  const [digitalDescId, setDigitalDescId] = useState(initialDigitalSettings?.desc_id || '');
  const [digitalBanks, setDigitalBanks] = useState<any[]>(initialDigitalSettings?.banks || []);
  const [digitalMsg, setDigitalMsg] = useState('');

  // Careers settings states
  const [careersSubTab, setCareersSubTab] = useState('applicants');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [careersTitleId, setCareersTitleId] = useState(initialCareersSettings?.title_id || 'Bangun Karir Bersama Kami');
  const [careersDescId, setCareersDescId] = useState(initialCareersSettings?.desc_id || '');
  const [careersVacancies, setCareersVacancies] = useState<any[]>(initialCareersSettings?.vacancies || []);
  const [careersMsg, setCareersMsg] = useState('');

  const handleSaveCareers = async (e: React.FormEvent) => {
    e.preventDefault();
    setCareersMsg('Menyimpan...');
    const result = await updateCareersSettings({
      title_id: careersTitleId,
      desc_id: careersDescId,
      vacancies: careersVacancies
    });
    if (result.success) {
      setCareersMsg('Berhasil memperbarui pengaturan karir!');
    } else {
      setCareersMsg(result.error || 'Terjadi kesalahan.');
    }
  };



  useEffect(() => {
    const saved = localStorage.getItem('mibank_admin_dark_mode');
    if (saved === 'true') setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('mibank_admin_dark_mode', newMode.toString());
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleSaveSavings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingsMsg('Sedang menyimpan...');
    const payload = {
      title_id: savingsTitleId,
      desc_id: savingsDescId,
      banks: savingsBanks
    };
    const res = await updateSavingsSettings(payload);
    if (res.success) {
      setSavingsMsg('✅ Pengaturan Simpanan Berhasil Diperbarui!');
      setTimeout(() => setSavingsMsg(''), 4000);
    } else {
      setSavingsMsg('❌ Gagal memperbarui pengaturan simpanan.');
    }
  };

  const handleSaveCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreditMsg('Sedang menyimpan...');
    const payload = {
      title_id: creditTitleId,
      desc_id: creditDescId,
      banks: creditBanks
    };
    const res = await updateCreditSettings(payload);
    if (res.success) {
      setCreditMsg('✅ Pengaturan Kartu Kredit Berhasil Diperbarui!');
      setTimeout(() => setCreditMsg(''), 4000);
    } else {
      setCreditMsg('❌ Gagal memperbarui pengaturan kartu kredit.');
    }
  };

  const handleSaveLoans = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoanMsg('Sedang menyimpan...');
    const payload = {
      title_id: loanTitleId,
      desc_id: loanDescId,
      banks: loanBanks
    };
    const res = await updateLoanSettings(payload);
    if (res.success) {
      setLoanMsg('✅ Pengaturan Pinjaman Berhasil Diperbarui!');
      setTimeout(() => setLoanMsg(''), 4000);
    } else {
      setLoanMsg('❌ Gagal memperbarui pengaturan pinjaman.');
    }
  };

  const handleSaveDigital = async (e: React.FormEvent) => {
    e.preventDefault();
    setDigitalMsg('Sedang menyimpan...');
    const payload = {
      title_id: digitalTitleId,
      desc_id: digitalDescId,
      banks: digitalBanks
    };
    const res = await updateDigitalSettings(payload);
    if (res.success) {
      setDigitalMsg('✅ Pengaturan Digital Banking Berhasil Diperbarui!');
      setTimeout(() => setDigitalMsg(''), 4000);
    } else {
      setDigitalMsg('❌ Gagal memperbarui pengaturan digital banking.');
    }
  };

  const exportApplicationsToCSV = () => {
    if (initialApplications.length === 0) {
      alert("Tidak ada data lamaran untuk diekspor.");
      return;
    }

    // Define column headers
    const headers = [
      "Tanggal",
      "Nama Pelamar",
      "NIK / KTP",
      "Posisi Dilamar",
      "Status",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Jenis Kelamin",
      "Agama",
      "Status Pernikahan",
      "Alamat Domisili",
      "No. WhatsApp",
      "No. Alternatif",
      "Email Utama",
      "Pendidikan Terakhir",
      "Fakultas",
      "Jurusan / Prodi",
      "Tahun Pendidikan",
      "IPK / GPA",
      "Prestasi & Beasiswa",
      "Pengalaman Kerja & Organisasi",
      "Siap Ditempatkan",
      "Tidak Ada Hubungan Keluarga Inti",
      "Motivasi",
      "Tautan CV",
      "Tautan KTP",
      "Tautan Ijazah",
      "Tautan Pas Foto",
      "Tautan Foto Badan"
    ];

    // Helper to sanitize CSV field
    const sanitizeField = (val: any, forceFormulaText = false) => {
      if (val === undefined || val === null) return '""';
      let str = String(val);
      // Double quote escaping for CSV
      str = str.replace(/"/g, '""');
      // Keep it neat: remove newlines so the whole candidate's data is on one row
      str = str.replace(/\r?\n|\r/g, " ");
      
      if (forceFormulaText) {
        // Excel formula text wrapper to preserve large numbers (NIK) and leading zeros (Phone numbers)
        return `="` + str + `"`;
      } else {
        return `"` + str + `"`;
      }
    };

    // Build rows
    const rows = initialApplications.map(app => [
      sanitizeField(app.date),
      sanitizeField(app.name),
      sanitizeField(app.nik, true), // Force text formula for NIK to prevent E+15 notation
      sanitizeField(app.position),
      sanitizeField(app.status),
      sanitizeField(app.birthPlace),
      sanitizeField(app.birthDate),
      sanitizeField(app.gender),
      sanitizeField(app.religion),
      sanitizeField(app.maritalStatus),
      sanitizeField(app.address),
      sanitizeField(app.phone, true), // Force text formula for WhatsApp Phone to keep leading 0
      sanitizeField(app.phoneAlt, true), // Force text formula for Alternate Phone to keep leading 0
      sanitizeField(app.email),
      sanitizeField(app.eduUniv),
      sanitizeField(app.eduFaculty),
      sanitizeField(app.eduMajor),
      sanitizeField(app.eduYears),
      sanitizeField(app.eduGpa),
      sanitizeField(app.achievements),
      sanitizeField(app.experience),
      sanitizeField(app.willingPlacement),
      sanitizeField(app.noFamilyRelation),
      sanitizeField(app.motivation),
      sanitizeField(app.cv ? `${window.location.origin}${app.cv}` : ""),
      sanitizeField(app.ktpScan ? `${window.location.origin}${app.ktpScan}` : ""),
      sanitizeField(app.ijazahScan ? `${window.location.origin}${app.ijazahScan}` : ""),
      sanitizeField(app.pasFoto ? `${window.location.origin}${app.pasFoto}` : ""),
      sanitizeField(app.fotoBadan ? `${window.location.origin}${app.fotoBadan}` : "")
    ]);

    // Construct CSV content with BOM for Excel compatibility and semicolon delimiter
    const csvContent = "\ufeff" + [
      headers.join(";"),
      ...rows.map(r => r.join(";"))
    ].join("\n");

    // Download trigger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    // File name: daftar_pelamar_mibank_YYYY-MM-DD.csv
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `daftar_pelamar_mibank_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSmileStatusUpdate = async (id: number, status: string) => {
    const res = await updateSmileUmkmStatus(id, status);
    if (res.success) {
      setSmileSubmissions(smileSubmissions.map((sub: any) => sub.id === id ? { ...sub, status } : sub));
    } else {
      alert(res.error || "Gagal memperbarui status");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'submissions':
        return (
          <div>
            <div className={styles.header}>
              <h2>Daftar Pengajuan Nasabah</h2>
            </div>
            <div className={styles.card}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama</th>
                    <th>NIK</th>
                    <th>Tipe Layanan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {initialSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.date}</td>
                      <td>{sub.name}</td>
                      <td>{sub.nik}</td>
                      <td>{sub.type}</td>
                      <td>
                        <span className={`${styles.status} ${styles[sub.status.toLowerCase()]}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.btnAction} style={{ background: '#28a745', color: 'white', marginRight: '5px' }}>✓</button>
                        <button className={styles.btnAction} style={{ background: '#dc3545', color: 'white' }}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {initialSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Belum ada pengajuan masuk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'promos':
        return (
          <div>
            <div className={styles.header}>
              <h2>Manajemen Promo</h2>
            </div>
            
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{editingPromo ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                {editingPromo && (
                  <button onClick={() => setEditingPromoId(null)} className="btn btn-secondary" style={{ padding: '5px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Batal Edit</button>
                )}
              </div>
              <form action={async (formData) => {
                if (editingPromo) {
                  await updatePromo(formData);
                  setEditingPromoId(null);
                } else {
                  await addPromo(formData);
                }
              }} style={{ marginTop: '20px' }}>
                {editingPromo && <input type="hidden" name="id" value={editingPromo.id} />}
                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Judul Promo</label>
                    <input name="title_id" required defaultValue={editingPromo ? editingPromo.title_id : ''} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Deskripsi Promo</label>
                  <textarea name="desc_id" rows={3} required defaultValue={editingPromo ? editingPromo.desc_id : ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>Gambar Promo {editingPromo ? '(Upload Baru jika ingin ganti)' : ''}</label>
                  <input type="file" name="promo_image" accept="image/*" required={!editingPromo} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
                  {editingPromo && <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Current: {editingPromo.image}</p>}
                </div>
                <button type="submit" className="btn btn-primary">{editingPromo ? 'Update Promo' : 'Simpan Promo'}</button>
              </form>
            </div>

            <div className={styles.card}>
              <h3>Daftar Promo</h3>
              <table className={styles.table} style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {initialPromos.map((promo) => (
                    <tr key={promo.id}>
                      <td style={{ fontWeight: '600' }}>{promo.title_id}</td>
                      <td style={{ fontSize: '13px', color: '#666' }}>{promo.desc_id.substring(0, 50)}...</td>
                      <td>
                        <button onClick={() => setEditingPromoId(promo.id)} className={`${styles.btnAction}`} style={{ background: '#007bff', color: 'white', marginRight: '5px' }}>Edit</button>
                        <button onClick={() => {
                          if (confirm('Yakin ingin menghapus promo ini?')) {
                            deletePromo(promo.id);
                          }
                        }} className={`${styles.btnAction} ${styles.btnDelete}`}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <div className={styles.header}>
              <h2>Manajemen Pengguna</h2>
            </div>

            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Daftar Pengguna</h3>
                <button 
                  onClick={() => setShowAddUserForm(!showAddUserForm)} 
                  className={styles.btnAction}
                  style={{ 
                    backgroundColor: showAddUserForm ? '#6c757d' : 'var(--primary-color, #003366)', 
                    color: 'white', 
                    fontWeight: 'bold', 
                    padding: '8px 16px', 
                    fontSize: '13px', 
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {showAddUserForm ? '✕ Tutup Form' : '＋ Tambah Anggota'}
                </button>
              </div>

              {showAddUserForm && (
                <div style={{ borderLeft: '4px solid var(--primary-color, #003366)', backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', marginBottom: '25px', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ color: 'var(--primary-color, #003366)', fontWeight: 'bold', marginTop: 0 }}>Tambah Pengguna Baru</h3>
                  <form action={async (formData) => { 
                    await adminAddUser(formData); 
                    setShowAddUserForm(false);
                  }} style={{ marginTop: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className={styles.formGroup}>
                        <label>Nama Lengkap</label>
                        <input name="name" required style={{ background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input name="email" type="email" required style={{ background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Nomor HP</label>
                        <input name="phone" type="tel" style={{ background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Password</label>
                        <input name="password" type="password" required style={{ background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Role / Level</label>
                        <select name="role" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>Simpan Pengguna</button>
                  </form>
                </div>
              )}

              <table className={styles.table} style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No. HP</th>
                    <th>Role / Level</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {initialUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        <form action={async (formData) => { await adminUpdateUserRole(formData); }} style={{ display: 'flex', gap: '10px' }}>
                          <input type="hidden" name="id" value={user.id} />
                          <select 
                            name="role" 
                            defaultValue={user.role} 
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                            onChange={(e) => {
                              const form = e.target.closest('form');
                              if (form) form.requestSubmit();
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </form>
                      </td>
                      <td>
                        <button 
                          onClick={() => {
                            if(confirm('Yakin ingin menghapus pengguna ini?')) {
                              adminDeleteUser(user.id);
                            }
                          }}
                          className={`${styles.btnAction} ${styles.btnDelete}`}
                          style={{ background: '#dc3545', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <div className={styles.header}>
              <h2>Pengaturan Website</h2>
            </div>
            {/* Simple status feedback */}
            <div id="status-message" style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', display: 'none' }}></div>
            
            <form 
              action={async (formData) => {
                const res = await updateSettings(formData);
                const msg = document.getElementById('status-message');
                if (msg) {
                  msg.style.display = 'block';
                  if (res?.success) {
                    msg.innerText = '✅ Pengaturan berhasil diperbarui!';
                    msg.style.background = '#d4edda';
                    msg.style.color = '#155724';
                  } else {
                    msg.innerText = '❌ Error: ' + (res?.error || 'Gagal memperbarui');
                    msg.style.background = '#f8d7da';
                    msg.style.color = '#721c24';
                  }
                  setTimeout(() => { msg.style.display = 'none'; }, 5000);
                }
              }}
            >
              <div className={styles.card}>
                <h3>Konten Hero Section</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Judul Hero (ID)</label>
                    <input name="hero_title_id" defaultValue={initialSettings.hero.title_id} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Judul Hero (EN)</label>
                    <input name="hero_title_en" defaultValue={initialSettings.hero.title_en} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Deskripsi Hero (ID)</label>
                  <textarea name="hero_desc_id" rows={2} defaultValue={initialSettings.hero.desc_id} />
                </div>
                <div className={styles.formGroup}>
                  <label>Deskripsi Hero (EN)</label>
                  <textarea name="hero_desc_en" rows={2} defaultValue={initialSettings.hero.desc_en} />
                </div>
                <div className={styles.formGroup}>
                  <label>Gambar Hero (Upload Baru)</label>
                  <input type="file" name="hero_image" accept="image/*" />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', background: '#f8f9fa', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--primary-color)' }}>
                    <strong>Rekomendasi:</strong> Format lanskap (contoh: 1920x1080px), tipe file JPG/PNG/WEBP. Pastikan objek utama berada di area tengah atau kanan. Hindari gambar yang terpotong di sisi kiri.
                  </div>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Current: {initialSettings.images?.hero}</p>
                </div>
              </div>

              <div className={styles.card}>
                <h3>Visi & Misi</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Visi (ID)</label>
                    <textarea name="visi_id" rows={2} defaultValue={initialSettings.about.visi_id} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Visi (EN)</label>
                    <textarea name="visi_en" rows={2} defaultValue={initialSettings.about.visi_en} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Misi (ID)</label>
                    <textarea name="misi_id" rows={2} defaultValue={initialSettings.about.misi_id} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Misi (EN)</label>
                    <textarea name="misi_en" rows={2} defaultValue={initialSettings.about.misi_en} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Gambar Company / Gedung (Upload Baru)</label>
                  <input type="file" name="about_image" accept="image/*" />
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Current: {initialSettings.images?.about}</p>
                </div>
              </div>

              <div className={styles.card}>
                <h3>Informasi Kontak (Footer)</h3>
                <div className={styles.formGroup}>
                  <label>Alamat Kantor</label>
                  <input name="contact_address" defaultValue={initialSettings.contact?.address} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Nomor Telepon</label>
                    <input name="contact_phone" defaultValue={initialSettings.contact?.phone} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Support</label>
                    <input name="contact_email" defaultValue={initialSettings.contact?.email} />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '15px 40px' }}>Update Konten Website</button>
            </form>
          </div>
        );

      case 'careers':
        return (
          <div>
            {/* Sub Tabs Bar */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
              <button 
                onClick={() => setCareersSubTab('applicants')} 
                className={styles.btnAction} 
                style={{ 
                  background: careersSubTab === 'applicants' ? 'var(--primary-color, #003366)' : '#e2e8f0', 
                  color: careersSubTab === 'applicants' ? 'white' : '#333',
                  fontWeight: 'bold',
                  boxShadow: careersSubTab === 'applicants' ? '0 2px 6px rgba(0, 51, 102, 0.3)' : 'none',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                💼 Daftar Pelamar Kerja
              </button>
              <button 
                onClick={() => setCareersSubTab('settings')} 
                className={styles.btnAction} 
                style={{ 
                  background: careersSubTab === 'settings' ? 'var(--primary-color, #003366)' : '#e2e8f0', 
                  color: careersSubTab === 'settings' ? 'white' : '#333',
                  fontWeight: 'bold',
                  boxShadow: careersSubTab === 'settings' ? '0 2px 6px rgba(0, 51, 102, 0.3)' : 'none',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ⚙️ Pengaturan Halaman & Lowongan
              </button>
            </div>

            {careersSubTab === 'applicants' ? (
              <div>
                <div className={styles.header}>
                  <h2>Daftar Lamaran Pekerjaan (Karir)</h2>
                  <button 
                    onClick={exportApplicationsToCSV}
                    className={styles.btnAction}
                    style={{ 
                      background: '#28a745', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(40, 167, 69, 0.3)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    📥 Eksport ke Excel / CSV
                  </button>
                </div>
                <div className={styles.card}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Nama Pelamar</th>
                        <th>No. HP (WA)</th>
                        <th>Posisi Yang Dilamar</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialApplications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.date}</td>
                          <td>{app.name}</td>
                          <td>{app.phone}</td>
                          <td><strong>{app.position}</strong></td>
                          <td>
                            <span className={`${styles.status} ${styles[app.status.toLowerCase()] || ''}`}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                              onClick={() => setSelectedAppId(app.id)}
                              className={styles.btnAction}
                              style={{ background: 'var(--primary-color)', color: 'white' }}
                            >
                              Detail 🔍
                            </button>
                            <select 
                              value={app.status} 
                              onChange={async (e) => {
                                await updateApplicationStatus(app.id, e.target.value);
                              }}
                              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Interview">Interview</option>
                              <option value="Diterima">Diterima</option>
                              <option value="Ditolak">Ditolak</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {initialApplications.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Belum ada lamaran masuk.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Dossier Detail Modal */}
                {selectedApp && (
                  <div className={styles.modalOverlay} onClick={() => setSelectedAppId(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.modalHeader}>
                        <h2>Dossier Pelamar: {selectedApp.name}</h2>
                        <button className={styles.closeModalBtn} onClick={() => setSelectedAppId(null)}>&times;</button>
                      </div>
                      <div className={styles.modalBody}>
                        <div className={styles.dossierGrid}>
                          <div>
                            {/* 1. DATA PRIBADI */}
                            <div className={styles.detailSection}>
                              <h4>1. Data Pribadi</h4>
                              <div className={styles.detailRow}>
                                <strong>Nama Lengkap:</strong>
                                <span>{selectedApp.name}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>No. KTP / NIK:</strong>
                                <span>{selectedApp.nik || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Tempat & Tgl Lahir:</strong>
                                <span>{selectedApp.birthPlace || '-'}, {selectedApp.birthDate || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Jenis Kelamin:</strong>
                                <span>{selectedApp.gender || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Agama:</strong>
                                <span>{selectedApp.religion || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Status Pernikahan:</strong>
                                <span>{selectedApp.maritalStatus || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Alamat Domisili:</strong>
                                <span>{selectedApp.address || '-'}</span>
                              </div>
                            </div>

                            {/* 2. KONTAK */}
                            <div className={styles.detailSection}>
                              <h4>2. Informasi Kontak</h4>
                              <div className={styles.detailRow}>
                                <strong>No. WhatsApp (Aktif):</strong>
                                <span>{selectedApp.phone}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>No. Telp Alternatif:</strong>
                                <span>{selectedApp.phoneAlt || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Email Utama:</strong>
                                <span>{selectedApp.email}</span>
                              </div>
                            </div>

                            {/* 3. PENDIDIKAN */}
                            <div className={styles.detailSection}>
                              <h4>3. Riwayat Pendidikan</h4>
                              <div className={styles.detailRow}>
                                <strong>Universitas/Sekolah:</strong>
                                <span>{selectedApp.eduUniv || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Fakultas:</strong>
                                <span>{selectedApp.eduFaculty || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Jurusan/Prodi:</strong>
                                <span>{selectedApp.eduMajor || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Tahun Masuk & Lulus:</strong>
                                <span>{selectedApp.eduYears || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>IPK (GPA) / Nilai:</strong>
                                <span>{selectedApp.eduGpa || '-'}</span>
                              </div>
                            </div>

                            {/* 4. PRESTASI & PENGALAMAN */}
                            <div className={styles.detailSection}>
                              <h4>4. Pengalaman & Prestasi</h4>
                              <div className={styles.detailRow}>
                                <strong>Prestasi & Beasiswa:</strong>
                                <span>{selectedApp.achievements || '-'}</span>
                              </div>
                              <div className={styles.detailRow} style={{ marginTop: '10px' }}>
                                <strong>Organisasi & Kerja:</strong>
                                <span>{selectedApp.experience || '-'}</span>
                              </div>
                            </div>

                            {/* 5. PERNYATAAN KHUSUS */}
                            <div className={styles.detailSection}>
                              <h4>5. Pernyataan Khusus</h4>
                              <div className={styles.detailRow}>
                                <strong>Siap Ditempatkan:</strong>
                                <span>{selectedApp.willingPlacement || '-'}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <strong>Hubungan Keluarga Inti:</strong>
                                <span>{selectedApp.noFamilyRelation || '-'}</span>
                              </div>
                              <div className={styles.detailRow} style={{ marginTop: '10px' }}>
                                <strong>Motivasi Bekerja:</strong>
                                <span>{selectedApp.motivation || '-'}</span>
                              </div>
                            </div>

                            {/* 6. DOKUMEN PENDUKUNG */}
                            <div className={styles.detailSection}>
                              <h4>6. Dokumen Pendukung (PDF)</h4>
                              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                {selectedApp.cv && (
                                  <a href={selectedApp.cv} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                                    📄 CV / Resume Terbaru
                                  </a>
                                )}
                                {selectedApp.ktpScan && (
                                  <a href={selectedApp.ktpScan} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                                    📄 Scan KTP
                                  </a>
                                )}
                                {selectedApp.ijazahScan && (
                                  <a href={selectedApp.ijazahScan} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                                    📄 Scan Ijazah & Transkrip
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* PHOTOS COLUMN */}
                          <div className={styles.profilePhotos}>
                            {selectedApp.pasFoto && (
                              <div className={styles.photoWrapper}>
                                <div className={styles.photoLabel}>Pas Foto Terbaru</div>
                                <img src={selectedApp.pasFoto} alt="Pas Foto" />
                              </div>
                            )}
                            {selectedApp.fotoBadan && (
                              <div className={styles.photoWrapper}>
                                <div className={styles.photoLabel}>Foto Seluruh Badan</div>
                                <img src={selectedApp.fotoBadan} alt="Foto Seluruh Badan" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className={styles.header}>
                  <h2>Pengaturan Halaman Karir & Lowongan Kerja</h2>
                </div>

                {careersMsg && (
                  <div style={{ 
                    padding: '15px', 
                    borderRadius: '8px', 
                    backgroundColor: careersMsg.includes('Berhasil') ? '#d4edda' : '#f8d7da', 
                    color: careersMsg.includes('Berhasil') ? '#155724' : '#721c24',
                    marginBottom: '20px',
                    fontWeight: '600'
                  }}>
                    {careersMsg}
                  </div>
                )}

                <form onSubmit={handleSaveCareers}>
                  {/* CARD 1: HEADER TEXTS */}
                  <div className={styles.card}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>1. Judul & Deskripsi Halaman Karir</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div className={styles.formGroup}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Judul Halaman</label>
                        <input 
                          type="text" 
                          value={careersTitleId} 
                          onChange={(e) => setCareersTitleId(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div className={styles.formGroup}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Deskripsi Halaman</label>
                        <textarea 
                          rows={3} 
                          value={careersDescId} 
                          onChange={(e) => setCareersDescId(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: VACANCIES CMS */}
                  <div className={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ color: 'var(--primary-color, #003366)', fontWeight: 'bold', margin: 0 }}>2. Daftar Lowongan Pekerjaan</h3>
                      <button
                        type="button"
                        className={styles.btnAction}
                        onClick={() => {
                          const newId = `job_${Date.now()}`;
                          setCareersVacancies([...careersVacancies, {
                            id: newId,
                            titleId: '',
                            titleEn: '',
                            locId: '',
                            locEn: '',
                            typeId: 'Penuh Waktu',
                            typeEn: 'Full Time',
                            code: '',
                            image: ''
                          }]);
                        }}
                        style={{ background: 'var(--primary-color)', color: 'white', fontWeight: 'bold' }}
                      >
                        + Tambah Lowongan
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className={styles.table} style={{ minWidth: '1000px' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '120px' }}>Gambar / Ilustrasi</th>
                            <th style={{ width: '100px' }}>Kode</th>
                            <th>Nama Lowongan (ID / EN)</th>
                            <th>Lokasi Kerja (ID / EN)</th>
                            <th style={{ width: '150px' }}>Tipe</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {careersVacancies.map((job, index) => (
                            <React.Fragment key={job.id}>
                              <tr>
                                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                  <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '8px', 
                                    overflow: 'hidden', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    margin: '0 auto 8px auto',
                                    background: '#f8f9fa'
                                  }}>
                                    {job.image ? (
                                      <img src={job.image} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                      <span style={{ fontSize: '24px' }}>💼</span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className={styles.btnAction}
                                    style={{ padding: '4px 8px', fontSize: '11px', width: '100%' }}
                                    onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*';
                                      input.onchange = async (e: any) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const fd = new FormData();
                                          fd.append('image', file);
                                          const res = await uploadCareerImage(fd);
                                          if (res.success && res.path) {
                                            const list = [...careersVacancies];
                                            list[index].image = res.path;
                                            setCareersVacancies(list);
                                          } else {
                                            alert(res.error || "Gagal unggah");
                                          }
                                        }
                                      };
                                      input.click();
                                    }}
                                  >
                                    Upload
                                  </button>
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                  <input 
                                    type="text" 
                                    value={job.code} 
                                    placeholder="Contoh: TLR"
                                    onChange={(e) => {
                                      const list = [...careersVacancies];
                                      list[index].code = e.target.value;
                                      setCareersVacancies(list);
                                    }}
                                    required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                                  />
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                  <input 
                                    type="text" 
                                    value={job.titleId} 
                                    placeholder="Nama (Indonesian)"
                                    onChange={(e) => {
                                      const list = [...careersVacancies];
                                      list[index].titleId = e.target.value;
                                      setCareersVacancies(list);
                                    }}
                                    required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                                  />
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                  <input 
                                    type="text" 
                                    value={job.locId} 
                                    placeholder="Lokasi (Indonesian)"
                                    onChange={(e) => {
                                      const list = [...careersVacancies];
                                      list[index].locId = e.target.value;
                                      setCareersVacancies(list);
                                    }}
                                    required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                                  />
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                  <input 
                                    type="text" 
                                    value={job.typeId} 
                                    placeholder="Tipe (Indonesian)"
                                    onChange={(e) => {
                                      const list = [...careersVacancies];
                                      list[index].typeId = e.target.value;
                                      setCareersVacancies(list);
                                    }}
                                    required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                                  />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                                    <button 
                                      type="button" 
                                      className={styles.btnAction}
                                      style={{ backgroundColor: expandedJobIndex === index ? '#f39c12' : '#0284c7', color: 'white', padding: '5px 8px', fontSize: '11px', width: '100%', border: 'none', borderRadius: '4px', whiteSpace: 'nowrap' }}
                                      onClick={() => setExpandedJobIndex(expandedJobIndex === index ? null : index)}
                                    >
                                      {expandedJobIndex === index ? 'Tutup' : '📝 Detail'}
                                    </button>
                                    <button 
                                      type="button" 
                                      className={`${styles.btnAction} ${styles.btnDelete}`}
                                      style={{ padding: '5px 8px', fontSize: '11px', width: '100%', borderRadius: '4px' }}
                                      onClick={() => {
                                        if (expandedJobIndex === index) setExpandedJobIndex(null);
                                        setCareersVacancies(careersVacancies.filter((_, idx) => idx !== index));
                                      }}
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expandedJobIndex === index && (
                                <tr style={{ background: isDarkMode ? '#1e293b' : '#f8fafc' }}>
                                  <td colSpan={6} style={{ padding: '20px', borderBottom: '2px solid #0284c7' }}>
                                    <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '15px' }}>
                                      <h4 style={{ marginBottom: '15px', color: 'var(--primary-color, #003366)', fontWeight: 'bold', fontSize: '15px' }}>
                                        📝 Edit Deskripsi Detail: {job.titleId || 'Lowongan Baru'}
                                      </h4>
                                      
                                      {/* Overview */}
                                      <div style={{ marginBottom: '15px' }}>
                                        <div>
                                          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', color: '#475569' }}>
                                            Deskripsi Pekerjaan / Overview (Bahasa Indonesia)
                                          </label>
                                          <textarea 
                                            rows={3} 
                                            value={job.overviewId || ''} 
                                            onChange={(e) => {
                                              const list = [...careersVacancies];
                                              list[index].overviewId = e.target.value;
                                              setCareersVacancies(list);
                                            }}
                                            placeholder="Tulis ringkasan pekerjaan..."
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000', fontSize: '13px', lineHeight: '1.5' }}
                                          />
                                        </div>
                                      </div>

                                      {/* Responsibilities */}
                                      <div style={{ marginBottom: '15px' }}>
                                        <div>
                                          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', color: '#475569' }}>
                                            Tanggung Jawab Utama (Bahasa Indonesia - Satu Per Baris / Tekan Enter)
                                          </label>
                                          <textarea 
                                            rows={5} 
                                            value={(job.responsibilitiesId || []).join('\n')} 
                                            onChange={(e) => {
                                              const list = [...careersVacancies];
                                              list[index].responsibilitiesId = e.target.value.split('\n');
                                              setCareersVacancies(list);
                                            }}
                                            placeholder="Contoh:&#10;Melayani penarikan dana nasabah.&#10;Melakukan verifikasi tanda tangan."
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000', fontSize: '13px', lineHeight: '1.5', fontFamily: 'monospace' }}
                                          />
                                        </div>
                                      </div>

                                      {/* Requirements */}
                                      <div>
                                        <div>
                                          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', color: '#475569' }}>
                                            Persyaratan Pelamar (Bahasa Indonesia - Satu Per Baris / Tekan Enter)
                                          </label>
                                          <textarea 
                                            rows={5} 
                                            value={(job.requirementsId || []).join('\n')} 
                                            onChange={(e) => {
                                              const list = [...careersVacancies];
                                              list[index].requirementsId = e.target.value.split('\n');
                                              setCareersVacancies(list);
                                            }}
                                            placeholder="Contoh:&#10;Pendidikan minimal S1.&#10;IPK minimal 3.00."
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000', fontSize: '13px', lineHeight: '1.5', fontFamily: 'monospace' }}
                                          />
                                        </div>
                                      </div>

                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                          {careersVacancies.length === 0 && (
                            <tr>
                              <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#95a5a6' }}>Belum ada lowongan pekerjaan. Klik '+ Tambah Lowongan' untuk membuat lowongan baru.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '15px 40px', fontWeight: 'bold' }}>
                    Simpan Pengaturan Karir
                  </button>
                </form>
              </div>
            )}
          </div>
        );

      case 'savings':
        return (
          <div>
            <div className={styles.header}>
              <h2>Pengaturan Halaman Simpanan (Partner Bank)</h2>
            </div>
            
            {savingsMsg && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                backgroundColor: savingsMsg.includes('Berhasil') ? '#d4edda' : '#f8d7da', 
                color: savingsMsg.includes('Berhasil') ? '#155724' : '#721c24',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                {savingsMsg}
              </div>
            )}

            <form onSubmit={handleSaveSavings}>
              {/* CARD 1: GENERAL TEXTS */}
              <div className={styles.card}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>1. Judul & Deskripsi Halaman</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Judul Halaman</label>
                    <input 
                      type="text" 
                      value={savingsTitleId} 
                      onChange={(e) => setSavingsTitleId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Deskripsi Halaman</label>
                    <textarea 
                      rows={4} 
                      value={savingsDescId} 
                      onChange={(e) => setSavingsDescId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: BANK PARTNERS */}
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>2. Daftar Bank Partner Simpanan</h3>
                  <button 
                    type="button" 
                    className={styles.btnAction} 
                    style={{ background: '#28a745', color: 'white', fontWeight: '600' }}
                    onClick={() => {
                      setSavingsBanks([...savingsBanks, { name: '', code: '', url: '', logo: '' }]);
                    }}
                  >
                    ➕ Tambah Partner Bank
                  </button>
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '12%', textAlign: 'center' }}>Logo Bank</th>
                      <th style={{ width: '13%' }}>Kode Singkat</th>
                      <th style={{ width: '30%' }}>Nama Bank Partner</th>
                      <th style={{ width: '35%' }}>Tautan Resmi Buka Rekening</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savingsBanks.map((bank, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {bank.logo ? (
                              <img 
                                src={bank.logo} 
                                alt="Logo" 
                                style={{ height: '30px', maxWidth: '80px', objectFit: 'contain', background: '#f8f9fa', padding: '3px', borderRadius: '4px', border: '1px solid #ddd' }} 
                              />
                            ) : (
                              <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>No Logo</div>
                            )}
                            <button
                              type="button"
                              className={styles.btnAction}
                              style={{ padding: '3px 8px', fontSize: '11px', background: 'var(--primary-color, #003366)', color: 'white' }}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e: any) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fd = new FormData();
                                    fd.append('logo', file);
                                    const res = await uploadBankLogo(fd);
                                    if (res.success && res.path) {
                                      const list = [...savingsBanks];
                                      list[index].logo = res.path;
                                      setSavingsBanks(list);
                                    } else {
                                      alert(res.error || "Gagal unggah");
                                    }
                                  }
                                };
                                input.click();
                              }}
                            >
                              Upload
                            </button>
                          </div>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.code} 
                            placeholder="Contoh: BCA"
                            onChange={(e) => {
                              const list = [...savingsBanks];
                              list[index].code = e.target.value;
                              setSavingsBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.name} 
                            placeholder="Contoh: Bank Central Asia"
                            onChange={(e) => {
                              const list = [...savingsBanks];
                              list[index].name = e.target.value;
                              setSavingsBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="url" 
                            value={bank.url} 
                            placeholder="https://..."
                            onChange={(e) => {
                              const list = [...savingsBanks];
                              list[index].url = e.target.value;
                              setSavingsBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            onClick={() => {
                              setSavingsBanks(savingsBanks.filter((_, idx) => idx !== index));
                            }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {savingsBanks.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Belum ada bank partner terdaftar. Klik tombol Tambah Partner Bank di atas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </form>
          </div>
        );

      case 'credit':
        return (
          <div>
            <div className={styles.header}>
              <h2>Pengaturan Halaman Kartu Kredit (Partner Bank)</h2>
            </div>
            
            {creditMsg && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                backgroundColor: creditMsg.includes('Berhasil') ? '#d4edda' : '#f8d7da', 
                color: creditMsg.includes('Berhasil') ? '#155724' : '#721c24',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                {creditMsg}
              </div>
            )}

            <form onSubmit={handleSaveCredit}>
              {/* CARD 1: GENERAL TEXTS */}
              <div className={styles.card}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>1. Judul & Deskripsi Halaman</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Judul Halaman</label>
                    <input 
                      type="text" 
                      value={creditTitleId} 
                      onChange={(e) => setCreditTitleId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Deskripsi Halaman</label>
                    <textarea 
                      rows={4} 
                      value={creditDescId} 
                      onChange={(e) => setCreditDescId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: BANK PARTNERS */}
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>2. Daftar Bank Partner Kartu Kredit</h3>
                  <button 
                    type="button" 
                    className={styles.btnAction} 
                    style={{ background: '#28a745', color: 'white', fontWeight: '600' }}
                    onClick={() => {
                      setCreditBanks([...creditBanks, { name: '', code: '', url: '', logo: '' }]);
                    }}
                  >
                    ➕ Tambah Partner Bank
                  </button>
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '12%', textAlign: 'center' }}>Logo Bank</th>
                      <th style={{ width: '13%' }}>Kode Singkat</th>
                      <th style={{ width: '30%' }}>Nama Bank Partner</th>
                      <th style={{ width: '35%' }}>Tautan Resmi Pengajuan</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditBanks.map((bank, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {bank.logo ? (
                              <img 
                                src={bank.logo} 
                                alt="Logo" 
                                style={{ height: '30px', maxWidth: '80px', objectFit: 'contain', background: '#f8f9fa', padding: '3px', borderRadius: '4px', border: '1px solid #ddd' }} 
                              />
                            ) : (
                              <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>No Logo</div>
                            )}
                            <button
                              type="button"
                              className={styles.btnAction}
                              style={{ padding: '3px 8px', fontSize: '11px', background: 'var(--primary-color, #003366)', color: 'white' }}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e: any) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fd = new FormData();
                                    fd.append('logo', file);
                                    const res = await uploadBankLogo(fd);
                                    if (res.success && res.path) {
                                      const list = [...creditBanks];
                                      list[index].logo = res.path;
                                      setCreditBanks(list);
                                    } else {
                                      alert(res.error || "Gagal unggah");
                                    }
                                  }
                                };
                                input.click();
                              }}
                            >
                              Upload
                            </button>
                          </div>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.code} 
                            placeholder="Contoh: BCA"
                            onChange={(e) => {
                              const list = [...creditBanks];
                              list[index].code = e.target.value;
                              setCreditBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.name} 
                            placeholder="Contoh: Bank Central Asia"
                            onChange={(e) => {
                              const list = [...creditBanks];
                              list[index].name = e.target.value;
                              setCreditBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="url" 
                            value={bank.url} 
                            placeholder="https://..."
                            onChange={(e) => {
                              const list = [...creditBanks];
                              list[index].url = e.target.value;
                              setCreditBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            onClick={() => {
                              setCreditBanks(creditBanks.filter((_, idx) => idx !== index));
                            }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {creditBanks.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Belum ada bank partner terdaftar. Klik tombol Tambah Partner Bank di atas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* SAVE BUTTON BAR */}
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className={styles.btnAction} 
                  style={{ background: 'var(--primary-color, #003366)', color: 'white', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold' }}
                >
                  Simpan Seluruh Perubahan Halaman Kartu Kredit 💾
                </button>
              </div>
            </form>
          </div>
        );

      case 'loans':
        return (
          <div>
            <div className={styles.header}>
              <h2>Pengaturan Halaman Pinjaman (Partner Bank)</h2>
            </div>
            
            {loanMsg && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                backgroundColor: loanMsg.includes('Berhasil') ? '#d4edda' : '#f8d7da', 
                color: loanMsg.includes('Berhasil') ? '#155724' : '#721c24',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                {loanMsg}
              </div>
            )}

            <form onSubmit={handleSaveLoans}>
              {/* CARD 1: GENERAL TEXTS */}
              <div className={styles.card}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>1. Judul & Deskripsi Halaman</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Judul Halaman</label>
                    <input 
                      type="text" 
                      value={loanTitleId} 
                      onChange={(e) => setLoanTitleId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Deskripsi Halaman</label>
                    <textarea 
                      rows={4} 
                      value={loanDescId} 
                      onChange={(e) => setLoanDescId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: BANK PARTNERS */}
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>2. Daftar Bank Partner Pinjaman</h3>
                  <button 
                    type="button" 
                    className={styles.btnAction} 
                    style={{ background: '#28a745', color: 'white', fontWeight: '600' }}
                    onClick={() => {
                      setLoanBanks([...loanBanks, { name: '', code: '', url: '', logo: '' }]);
                    }}
                  >
                    ➕ Tambah Partner Bank
                  </button>
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '12%', textAlign: 'center' }}>Logo Bank</th>
                      <th style={{ width: '13%' }}>Kode Singkat</th>
                      <th style={{ width: '30%' }}>Nama Bank Partner</th>
                      <th style={{ width: '35%' }}>Tautan Resmi Pengajuan</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanBanks.map((bank, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {bank.logo ? (
                              <img 
                                src={bank.logo} 
                                alt="Logo" 
                                style={{ height: '30px', maxWidth: '80px', objectFit: 'contain', background: '#f8f9fa', padding: '3px', borderRadius: '4px', border: '1px solid #ddd' }} 
                              />
                            ) : (
                              <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>No Logo</div>
                            )}
                            <button
                              type="button"
                              className={styles.btnAction}
                              style={{ padding: '3px 8px', fontSize: '11px', background: 'var(--primary-color, #003366)', color: 'white' }}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e: any) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fd = new FormData();
                                    fd.append('logo', file);
                                    const res = await uploadBankLogo(fd);
                                    if (res.success && res.path) {
                                      const list = [...loanBanks];
                                      list[index].logo = res.path;
                                      setLoanBanks(list);
                                    } else {
                                      alert(res.error || "Gagal unggah");
                                    }
                                  }
                                };
                                input.click();
                              }}
                            >
                              Upload
                            </button>
                          </div>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.code} 
                            placeholder="Contoh: BTN"
                            onChange={(e) => {
                              const list = [...loanBanks];
                              list[index].code = e.target.value;
                              setLoanBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.name} 
                            placeholder="Contoh: Bank Tabungan Negara"
                            onChange={(e) => {
                              const list = [...loanBanks];
                              list[index].name = e.target.value;
                              setLoanBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="url" 
                            value={bank.url} 
                            placeholder="https://..."
                            onChange={(e) => {
                              const list = [...loanBanks];
                              list[index].url = e.target.value;
                              setLoanBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            onClick={() => {
                              setLoanBanks(loanBanks.filter((_, idx) => idx !== index));
                            }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {loanBanks.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Belum ada bank partner terdaftar. Klik tombol Tambah Partner Bank di atas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* SAVE BUTTON BAR */}
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className={styles.btnAction} 
                  style={{ background: 'var(--primary-color, #003366)', color: 'white', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold' }}
                >
                  Simpan Seluruh Perubahan Halaman Pinjaman 💾
                </button>
              </div>
            </form>
          </div>
        );

      case 'digital':
        return (
          <div>
            <div className={styles.header}>
              <h2>Pengaturan Halaman Digital Banking (Partner Bank)</h2>
            </div>
            
            {digitalMsg && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                backgroundColor: digitalMsg.includes('Berhasil') ? '#d4edda' : '#f8d7da', 
                color: digitalMsg.includes('Berhasil') ? '#155724' : '#721c24',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                {digitalMsg}
              </div>
            )}

            <form onSubmit={handleSaveDigital}>
              {/* CARD 1: GENERAL TEXTS */}
              <div className={styles.card}>
                <h3 style={{ marginBottom: '20px', color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>1. Judul & Deskripsi Halaman</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Judul Halaman</label>
                    <input 
                      type="text" 
                      value={digitalTitleId} 
                      onChange={(e) => setDigitalTitleId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className={styles.formGroup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Deskripsi Halaman</label>
                    <textarea 
                      rows={4} 
                      value={digitalDescId} 
                      onChange={(e) => setDigitalDescId(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: BANK PARTNERS */}
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--primary-color, #003366)', fontWeight: 'bold' }}>2. Daftar Bank Partner Digital Banking</h3>
                  <button 
                    type="button" 
                    className={styles.btnAction} 
                    style={{ background: '#28a745', color: 'white', fontWeight: '600' }}
                    onClick={() => {
                      setDigitalBanks([...digitalBanks, { name: '', code: '', url: '', logo: '' }]);
                    }}
                  >
                    ➕ Tambah Partner Bank
                  </button>
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '12%', textAlign: 'center' }}>Logo Bank</th>
                      <th style={{ width: '13%' }}>Kode Singkat</th>
                      <th style={{ width: '30%' }}>Nama Bank Partner</th>
                      <th style={{ width: '35%' }}>Tautan Resmi Buka Rekening</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {digitalBanks.map((bank, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {bank.logo ? (
                              <img 
                                src={bank.logo} 
                                alt="Logo" 
                                style={{ height: '30px', maxWidth: '80px', objectFit: 'contain', background: '#f8f9fa', padding: '3px', borderRadius: '4px', border: '1px solid #ddd' }} 
                              />
                            ) : (
                              <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>No Logo</div>
                            )}
                            <button
                              type="button"
                              className={styles.btnAction}
                              style={{ padding: '3px 8px', fontSize: '11px', background: 'var(--primary-color, #003366)', color: 'white' }}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e: any) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fd = new FormData();
                                    fd.append('logo', file);
                                    const res = await uploadBankLogo(fd);
                                    if (res.success && res.path) {
                                      const list = [...digitalBanks];
                                      list[index].logo = res.path;
                                      setDigitalBanks(list);
                                    } else {
                                      alert(res.error || "Gagal unggah");
                                    }
                                  }
                                };
                                input.click();
                              }}
                            >
                              Upload
                            </button>
                          </div>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.code} 
                            placeholder="Contoh: BLU"
                            onChange={(e) => {
                              const list = [...digitalBanks];
                              list[index].code = e.target.value;
                              setDigitalBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={bank.name} 
                            placeholder="Contoh: Blu by BCA Digital"
                            onChange={(e) => {
                              const list = [...digitalBanks];
                              list[index].name = e.target.value;
                              setDigitalBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="url" 
                            value={bank.url} 
                            placeholder="https://..."
                            onChange={(e) => {
                              const list = [...digitalBanks];
                              list[index].url = e.target.value;
                              setDigitalBanks(list);
                            }}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: isDarkMode ? '#2c2c2c' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            onClick={() => {
                              setDigitalBanks(digitalBanks.filter((_, idx) => idx !== index));
                            }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {digitalBanks.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Belum ada bank partner terdaftar. Klik tombol Tambah Partner Bank di atas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* SAVE BUTTON BAR */}
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className={styles.btnAction} 
                  style={{ background: 'var(--primary-color, #003366)', color: 'white', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold' }}
                >
                  Simpan Seluruh Perubahan Halaman Digital Banking 💾
                </button>
              </div>
            </form>
          </div>
        );

      case 'smileUmkm':
        return (
          <div>
            <div className={styles.header}>
              <h2>Daftar Pengajuan Program SMILE UMKM</h2>
            </div>
            
            <div className={styles.card}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Pemohon</th>
                    <th>Nama Usaha</th>
                    <th>No. HP</th>
                    <th>Pembayaran</th>
                    <th>Rata-rata Transaksi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {smileSubmissions.map((sub: any) => (
                    <React.Fragment key={sub.id}>
                      <tr>
                        <td>{sub.date}</td>
                        <td style={{ fontWeight: '600' }}>{sub.name}</td>
                        <td>{sub.businessName}</td>
                        <td>{sub.phone}</td>
                        <td>{sub.paymentMethod}</td>
                        <td>Rp {sub.monthlyRevenue?.toLocaleString('id-ID')}</td>
                        <td>
                          <span className={`${styles.status} ${styles[sub.status.toLowerCase()]}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={styles.btnAction} 
                            style={{ background: '#17a2b8', color: 'white', marginRight: '5px' }}
                            onClick={() => setExpandedSmileId(expandedSmileId === sub.id ? null : sub.id)}
                          >
                            {expandedSmileId === sub.id ? 'Tutup Detail' : 'Detail'}
                          </button>
                          {sub.status === 'Pending' && (
                            <>
                              <button 
                                className={styles.btnAction} 
                                style={{ background: '#28a745', color: 'white', marginRight: '5px' }}
                                onClick={() => handleSmileStatusUpdate(sub.id, 'Disetujui')}
                              >
                                ✓ Setujui
                              </button>
                              <button 
                                className={styles.btnAction} 
                                style={{ background: '#dc3545', color: 'white' }}
                                onClick={() => handleSmileStatusUpdate(sub.id, 'Ditolak')}
                              >
                                ✕ Tolak
                              </button>
                            </>
                          )}
                        </td>
                      </tr>

                      {/* Detail Expansion */}
                      {expandedSmileId === sub.id && (
                        <tr>
                          <td colSpan={8} style={{ background: isDarkMode ? '#1e1e1e' : '#f8fafc', padding: '25px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                              
                              {/* Left Column: Data Diri & Usaha */}
                              <div>
                                <h4 style={{ color: 'var(--primary-color, #003366)', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '15px', fontWeight: '700' }}>
                                  Detail Pemohon & Usaha
                                </h4>
                                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                  <tbody>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', width: '35%', fontWeight: '600' }}>Alamat Pemohon</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: {sub.address}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', fontWeight: '600' }}>Email Pemohon</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: {sub.email}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', fontWeight: '600' }}>Kegiatan Usaha</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: {sub.businessActivity}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', fontWeight: '600' }}>Alamat Usaha</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: {sub.businessAddress}</td>
                                    </tr>
                                  </tbody>
                                </table>

                                <h4 style={{ color: 'var(--primary-color, #003366)', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginTop: '20px', marginBottom: '15px', fontWeight: '700' }}>
                                  Metode Pembayaran & Keuangan
                                </h4>
                                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                  <tbody>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', width: '35%', fontWeight: '600' }}>Bank Penerbit</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: {sub.bank}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', fontWeight: '600' }}>NMID QRIS</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: {sub.nmid || '-'}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '6px 0', color: '#666', fontWeight: '600' }}>Saldo Mengendap</td>
                                      <td style={{ padding: '6px 0', color: '#333' }}>: Rp {sub.monthlyBalance?.toLocaleString('id-ID')} / bulan</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              {/* Right Column: Uploaded Photos */}
                              <div>
                                <h4 style={{ color: 'var(--primary-color, #003366)', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '15px', fontWeight: '700' }}>
                                  Foto Berkas Lampiran Usaha
                                </h4>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                  <div style={{ flex: '1', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: '600' }}>Tampak Depan Usaha</div>
                                    {sub.frontPhoto ? (
                                      <a href={sub.frontPhoto} target="_blank" rel="noopener noreferrer">
                                        <img 
                                          src={sub.frontPhoto} 
                                          alt="Foto Depan Usaha" 
                                          style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} 
                                        />
                                      </a>
                                    ) : (
                                      <div style={{ padding: '30px 10px', background: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Tidak Ada Foto</div>
                                    )}
                                  </div>

                                  <div style={{ flex: '1', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: '600' }}>Foto Produk Usaha</div>
                                    {sub.productPhoto ? (
                                      <a href={sub.productPhoto} target="_blank" rel="noopener noreferrer">
                                        <img 
                                          src={sub.productPhoto} 
                                          alt="Foto Produk Usaha" 
                                          style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} 
                                        />
                                      </a>
                                    ) : (
                                      <div style={{ padding: '30px 10px', background: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Tidak Ada Foto</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {smileSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>Belum ada pengajuan Smile UMKM masuk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${styles.adminLayout} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.sidebar}>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'submissions' ? styles.active : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📄 Pengajuan
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'smileUmkm' ? styles.active : ''}`}
          onClick={() => setActiveTab('smileUmkm')}
        >
          🛍️ Smile UMKM
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'promos' ? styles.active : ''}`}
          onClick={() => setActiveTab('promos')}
        >
          🎁 Promo
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Pengguna
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'careers' ? styles.active : ''}`}
          onClick={() => setActiveTab('careers')}
        >
          💼 Lamaran Karir
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'savings' ? styles.active : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          🏦 Partner Simpanan
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'credit' ? styles.active : ''}`}
          onClick={() => setActiveTab('credit')}
        >
          💳 Partner Kartu Kredit
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'loans' ? styles.active : ''}`}
          onClick={() => setActiveTab('loans')}
        >
          💸 Partner Pinjaman
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'digital' ? styles.active : ''}`}
          onClick={() => setActiveTab('digital')}
        >
          📱 Partner Digital Banking
        </div>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Pengaturan
        </div>
        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <button 
            onClick={toggleDarkMode}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: isDarkMode ? '1px solid #444' : '1px solid #ddd',
              background: isDarkMode ? '#2c2c2c' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
}
