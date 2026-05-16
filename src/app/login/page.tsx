'use client';

import React from 'react';
import TemplatePage from '@/components/TemplatePage';
import { loginUser } from '../actions';

export default function LoginPage() {
  return (
    <TemplatePage 
      titleId="Login e-Banking" 
      titleEn="e-Banking Login" 
      contentId={
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#f8f9fa', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--primary-color)' }}>Akses Akun Anda</h2>
          <form action={loginUser}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
              <input name="email" type="email" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Password</label>
              <input name="password" type="password" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontWeight: '700' }}>Login</button>
          </form>
          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            Belum punya akun? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Daftar di sini</a>
          </p>
          <div style={{ marginTop: '15px', padding: '10px', background: '#e7f3ff', borderRadius: '8px', fontSize: '12px', color: '#00468b' }}>
            <strong>Demo Admin:</strong> admin@mibank.com / admin123
          </div>
        </div>
      }
      contentEn={
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#f8f9fa', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--primary-color)' }}>Access Your Account</h2>
          <form action={loginUser}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
              <input name="email" type="email" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Password</label>
              <input name="password" type="password" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontWeight: '700' }}>Login</button>
          </form>
          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            Don't have an account? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Register here</a>
          </p>
          <div style={{ marginTop: '15px', padding: '10px', background: '#e7f3ff', borderRadius: '8px', fontSize: '12px', color: '#00468b' }}>
            <strong>Demo Admin:</strong> admin@mibank.com / admin123
          </div>
        </div>
      }
    />
  );
}
