'use client';

import React from 'react';
import TemplatePage from '@/components/TemplatePage';
import { registerUser } from '../actions';

export default function RegisterPage() {
  return (
    <TemplatePage 
      titleId="Pendaftaran Akun Baru" 
      titleEn="New Account Registration" 
      contentId={
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f8f9fa', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '30px', textAlign: 'center', color: 'var(--primary-color)' }}>Formulir Pendaftaran</h2>
          <form action={async (formData) => {
            const res = await registerUser(formData);
            if (res && res.error) alert(res.error);
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nama Lengkap</label>
              <input name="name" type="text" required placeholder="Masukkan nama sesuai KTP" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
              <input name="email" type="email" required placeholder="example@mail.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nomor Telepon</label>
              <input name="phone" type="tel" required placeholder="0812..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
              <input name="password" type="password" required placeholder="Min. 8 karakter" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
                <input type="checkbox" required /> Saya menyetujui Syarat dan Ketentuan MiBANK
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontWeight: '700' }}>Daftar Sekarang</button>
          </form>
          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            Sudah punya akun? <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Login di sini</a>
          </p>
        </div>
      }
      contentEn={
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f8f9fa', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '30px', textAlign: 'center', color: 'var(--primary-color)' }}>Registration Form</h2>
          <form action={async (formData) => {
            const res = await registerUser(formData);
            if (res && res.error) alert(res.error);
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
              <input name="name" type="text" required placeholder="As shown on ID" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
              <input name="email" type="email" required placeholder="example@mail.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone Number</label>
              <input name="phone" type="tel" required placeholder="+62..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
              <input name="password" type="password" required placeholder="Min. 8 characters" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
                <input type="checkbox" required /> I agree to MiBANK's Terms and Conditions
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontWeight: '700' }}>Register Now</button>
          </form>
          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            Already have an account? <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Login here</a>
          </p>
        </div>
      }
    />
  );
}
