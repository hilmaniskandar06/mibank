'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitSmileUmkm } from '@/app/actions';
import TemplatePage from '@/components/TemplatePage';

export default function SmileUmkmDaftarClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const fd = new FormData(e.currentTarget);
    const res = await submitSmileUmkm(fd);

    setLoading(false);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  if (success) {
    return (
      <TemplatePage
        titleId="Pengajuan Smile UMKM Berhasil"
        contentId={
          <div style={{
            maxWidth: '600px',
            margin: '40px auto',
            textAlign: 'center',
            padding: '40px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#28a745', fontWeight: '800', marginBottom: '15px' }}>Terima Kasih!</h2>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
              Formulir pengajuan program <strong>SMILE UMKM</strong> Anda telah berhasil kami terima. Tim Mitra Perbankan Indonesia akan melakukan verifikasi data usaha Anda dalam waktu maksimal 3x24 jam kerja.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link
                href="/promo/smile-umkm"
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Kembali ke Promo
              </Link>
              <Link
                href="/"
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: 'var(--primary-color, #003366)',
                  color: 'white',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '14px',
                  boxShadow: '0 4px 10px rgba(0,51,102,0.2)'
                }}
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <TemplatePage
      titleId="Formulir Ajukan Smile UMKM"
      contentId={
        <div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Form Header Info */}
            <div style={{
              background: 'linear-gradient(135deg, #003366 0%, #0056b3 100%)',
              padding: '30px',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Formulir Digital SMILE UMKM</h2>
              <p style={{ fontSize: '13px', opacity: '0.9', lineHeight: '1.5', margin: 0 }}>
                Harap lengkapi seluruh kolom isian di bawah ini dengan data asli dan terbaru agar pengajuan mesin EDC & QRIS Anda dapat segera kami setujui.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
              
              {/* SECTION 1: DATA DIRI PEMOHON */}
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003366', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '20px' }}>
                1. Data Diri Pemohon
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Nama Lengkap Pemohon</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Masukkan nama sesuai KTP"
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Alamat Lengkap Pemohon</label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="Masukkan alamat domisili lengkap (RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos)"
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Nomor Handphone (WhatsApp)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Contoh: 08123456789"
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Alamat Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Contoh: email@anda.com"
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DETAIL USAHA */}
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003366', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '20px' }}>
                2. Detail Usaha (Merchant)
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Nama Usaha / Toko</label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      placeholder="Masukkan nama usaha Anda"
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Kegiatan Usaha / Bidang</label>
                    <input
                      type="text"
                      name="businessActivity"
                      required
                      placeholder="Contoh: Kuliner, Fashion, Toko Kelontong, dll."
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Alamat Lokasi Usaha</label>
                  <textarea
                    name="businessAddress"
                    required
                    rows={3}
                    placeholder="Masukkan alamat lokasi operasional usaha Anda secara detail"
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Foto Usaha Tampak Depan</label>
                    <input
                      type="file"
                      name="frontPhoto"
                      accept="image/*"
                      required
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Foto Produk Usaha</label>
                    <input
                      type="file"
                      name="productPhoto"
                      accept="image/*"
                      required
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: METODE PEMBAYARAN & FINANSIAL */}
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003366', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '20px' }}>
                3. Metode Pembayaran & Profil Finansial
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Pembayaran yang Digunakan</label>
                    <select
                      name="paymentMethod"
                      required
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
                    >
                      <option value="EDC">EDC (Electronic Data Capture)</option>
                      <option value="QRIS">QRIS (Quick Response Code Indonesian Standard)</option>
                      <option value="Keduanya">Keduanya (EDC + QRIS)</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Bank Penerbit Pembayaran</label>
                    <input
                      type="text"
                      name="bank"
                      required
                      placeholder="Masukkan nama bank partner resmi Anda"
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>NMID Pembayaran</label>
                  <input
                    type="text"
                    name="nmid"
                    required
                    placeholder="Masukkan Nomor NMID jika sudah memiliki QRIS sebelumnya"
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Pendapatan Transaksi Rata-Rata per Bulan</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Rp</span>
                      <input
                        type="number"
                        name="monthlyRevenue"
                        required
                        placeholder="Contoh: 15000000"
                        style={{ padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Saldo Mengendap Rata-Rata per Bulan</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Rp</span>
                      <input
                        type="number"
                        name="monthlyBalance"
                        required
                        placeholder="Contoh: 5000000"
                        style={{ padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PERNYATAAN & PERSETUJUAN */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                  <input type="checkbox" name="verifiedData" required style={{ marginTop: '3px' }} />
                  <span>Dengan ini saya menyatakan bahwa data yang kami berikan adalah data yang sebenarnya tanpa ada manipulasi atau pemalsuan data.</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                  <input type="checkbox" name="termsAccepted" required style={{ marginTop: '3px' }} />
                  <span>Dengan ini saya menyatakan telah membaca dan tunduk terhadap syarat dan ketentuan program ini.</span>
                </label>
              </div>

              {error && (
                <div style={{ padding: '12px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                  ❌ Terjadi kesalahan dalam mengirimkan pengajuan. Harap periksa berkas Anda dan coba lagi.
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  background: loading ? '#94a3b8' : 'var(--primary-color, #003366)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 51, 102, 0.2)',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Mengirim Pengajuan...' : 'Kirim Formulir Pengajuan'}
              </button>

            </form>
          </div>
        </div>
      }
    />
  );
}
