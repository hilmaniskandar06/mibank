'use client';

import React, { useState } from 'react';
import styles from './Admin.module.css';
import { addPromo, deletePromo, updateSettings } from '../actions';

interface AdminDashboardProps {
  initialPromos: any[];
  initialSubmissions: any[];
  initialUsers: any[];
  initialSettings: any;
}

export default function AdminDashboard({ 
  initialPromos, 
  initialSubmissions, 
  initialUsers, 
  initialSettings 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('submissions');

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
              <h3>Tambah Promo Baru</h3>
              <form action={addPromo} style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className={styles.formGroup}>
                    <label>Judul (ID)</label>
                    <input name="title_id" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Judul (EN)</label>
                    <input name="title_en" required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Deskripsi (ID)</label>
                  <textarea name="desc_id" rows={3} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Deskripsi (EN)</label>
                  <textarea name="desc_en" rows={3} required />
                </div>
                <button type="submit" className="btn btn-primary">Simpan Promo</button>
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
                        <button onClick={() => deletePromo(promo.id)} className={`${styles.btnAction} ${styles.btnDelete}`}>Hapus</button>
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
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {initialUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button className={styles.btnAction} style={{ border: '1px solid #ddd' }}>Ubah Password</button>
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

      default:
        return null;
    }
  };

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebar}>
        <div 
          className={`${styles.sidebarItem} ${activeTab === 'submissions' ? styles.active : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📄 Pengajuan
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
          className={`${styles.sidebarItem} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Pengaturan
        </div>
      </div>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
}
