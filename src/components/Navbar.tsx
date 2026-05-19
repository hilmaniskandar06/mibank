'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { translations } from '@/lib/translations';
import { logoutUser } from '@/app/actions';

const Navbar = ({ session }: { session: any }) => {
  const lang = 'ID';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[lang].nav;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* 1. Top Tier (Grey Bar) */}
      <div className={styles.topTier}>
        <div className={styles.topTierContent}>
          <div className={styles.langSwitch}></div>
          {session ? (
            <>
              <span className={styles.topLink}>Hi, {session.role === 'admin' ? 'Admin' : 'Member'}</span>
              {session.role === 'admin' && <Link href="/admin" className={styles.topLink}>Dashboard</Link>}
              <button onClick={() => logoutUser()} className={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/register" className={styles.topLink}>Register</Link>
              <Link href="/login" className={styles.loginBtnTop}>{t.login}</Link>
            </>
          )}
        </div>
      </div>

      {/* 2. Main Tier (White Bar) */}
      <div className={styles.mainTier}>
        <div className={styles.mainTierContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>M</div>
            <span>Mitra Perbankan</span>
          </Link>

          {/* Nav Links */}
          <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
            <Link href="/produk" onClick={() => setIsOpen(false)}>{t.produk}</Link>
            <Link href="/layanan" onClick={() => setIsOpen(false)}>{t.layanan}</Link>
            <Link href="/promo" onClick={() => setIsOpen(false)}>{t.promo}</Link>
            <Link href="/webform" onClick={() => setIsOpen(false)}>{t.webform}</Link>
            <Link href="/karir" onClick={() => setIsOpen(false)}>{t.karir}</Link>
            <Link href="/chat" onClick={() => setIsOpen(false)}>{t.chat}</Link>
            
            {/* Mobile Actions (Hidden on Desktop) */}
            <div className={styles.mobileActions}>
              <Link href="/login" className={styles.loginBtnTop} style={{ textAlign: 'center' }}>{t.login}</Link>
              <Link href="/register" style={{ textAlign: 'center', color: '#00468b', fontWeight: '700' }}>Register</Link>
            </div>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Cari..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Hamburger */}
          <div className={styles.hamburger} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
