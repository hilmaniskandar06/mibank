'use client';

import React from 'react';
import Link from 'next/link';
import TemplatePage from '@/components/TemplatePage';

export default function SmileUmkmPromoPage() {
  return (
    <TemplatePage
      titleId="SMILE UMKM - Solusi Transaksi Digital & Cashback Melimpah"
      contentId={
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
          {/* Header Banner */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
            padding: '40px',
            color: 'white',
            textAlign: 'center'
          }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: '15px'
            }}>
              Program Unggulan Pemberdayaan Usaha
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px', color: '#ffffff' }}>
              Beralih ke Transaksi Digital Lebih Mudah & Untung!
            </h2>
            <p style={{ fontSize: '16px', opacity: '0.9', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 30px auto' }}>
              Dapatkan mesin EDC dan QRIS Mitra Perbankan Indonesia tanpa biaya sewa bulanan dan dapatkan cashback langsung setiap bulan dari volume transaksi usaha Anda.
            </p>
            <Link 
              href="/promo/smile-umkm/daftar" 
              style={{
                display: 'inline-block',
                background: '#f39c12',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(243, 156, 18, 0.4)',
                transition: 'all 0.2s',
                transform: 'scale(1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e67e22';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f39c12';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ajukan Smile UMKM Sekarang
            </Link>
          </div>

          {/* Program Benefits */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#003366', borderBottom: '2px solid #eaeaea', paddingBottom: '10px', marginBottom: '20px', fontWeight: '700' }}>
              Keunggulan Program SMILE UMKM
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #0056b3' }}>
                <h4 style={{ color: '#0056b3', fontWeight: '700', marginBottom: '8px' }}>💳 Gratis Biaya Sewa EDC & QRIS</h4>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: 0 }}>
                  Gunakan perangkat EDC premium dan QRIS berstandar nasional (QRIS) tanpa biaya sewa bulanan atau tahunan. 100% didukung bank partner.
                </p>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #f39c12' }}>
                <h4 style={{ color: '#f39c12', fontWeight: '700', marginBottom: '8px' }}>💰 Cashback Transaksi Bulanan</h4>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: 0 }}>
                  Dapatkan pengembalian dana hingga 0.5% dari akumulasi volume penjualan usaha Anda setiap bulannya langsung ke rekening penampung.
                </p>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #28a745' }}>
                <h4 style={{ color: '#28a745', fontWeight: '700', marginBottom: '8px' }}>⚡ Pencairan Dana Real-Time</h4>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: 0 }}>
                  Dana hasil penjualan usaha Anda akan dicairkan ke rekening partner terpilih hingga 3x sehari tanpa potongan tersembunyi.
                </p>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #6f42c1' }}>
                <h4 style={{ color: '#6f42c1', fontWeight: '700', marginBottom: '8px' }}>📈 Laporan & Analitik Keuangan</h4>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: 0 }}>
                  Pantau pertumbuhan bisnis Anda melalui dashboard analitik merchant yang lengkap dan informatif melalui aplikasi digital banking partner kami.
                </p>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div style={{ background: '#fcfcfc', border: '1px solid #eaeaea', borderRadius: '12px', padding: '25px', marginBottom: '40px' }}>
            <h3 style={{ color: '#333', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>
              Syarat & Ketentuan Umum
            </h3>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
              <li>Merupakan pelaku usaha aktif (UMKM) baik perorangan maupun badan usaha di wilayah Republik Indonesia.</li>
              <li>Memiliki lokasi fisik usaha tetap yang dapat dibuktikan dengan foto tampak depan usaha.</li>
              <li>Wajib melampirkan foto salah satu produk/jasa yang ditawarkan di lokasi usaha.</li>
              <li>Memiliki rekening simpanan aktif di salah satu bank penerbit partner kami sebagai rekening penampung dana penjualan.</li>
              <li>Mematuhi batas nominal minimum transaksi per bulan untuk mempertahankan kepesertaan gratis sewa EDC.</li>
              <li>Tunduk sepenuhnya terhadap syarat operasional merchant berstandar Bank Indonesia.</li>
            </ul>
          </div>

          {/* CTA Section */}
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '15px' }}>
              Siap memajukan bisnis Anda ke tingkat berikutnya?
            </h4>
            <Link 
              href="/promo/smile-umkm/daftar" 
              style={{
                display: 'inline-block',
                background: 'var(--primary-color, #003366)',
                color: 'white',
                padding: '14px 40px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(0, 51, 102, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#002244';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-color, #003366)';
              }}
            >
              Isi Formulir Pengajuan
            </Link>
          </div>
        </div>
      }
    />
  );
}
