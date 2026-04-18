'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6l-8-4z" fill="url(#logoGrad)" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>GUARD <span>IT!</span></span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          <a href="#features" className={styles.link}>Features</a>
          <a href="#how-it-works" className={styles.link}>Architecture</a>
          <a href="#pricing" className={styles.link}>Pricing</a>
          <a href="#api" className={styles.link}>Docs</a>
        </div>

        {/* CTA */}
        <div className={styles.actions}>
          <Link href="/dashboard" className={`btn btn-secondary ${styles.dashBtn}`}>
            Dashboard
          </Link>
          <a href="#start" className={`btn btn-primary ${styles.ctaBtn}`}>
            Get API Key
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.bar3Open : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="#features" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Architecture</a>
          <a href="#pricing" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="#api" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Docs</a>
          <div className={styles.mobileDivider} />
          <Link href="/dashboard" className={`btn btn-secondary ${styles.mobileBtn}`} onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <a href="#start" className={`btn btn-primary ${styles.mobileBtn}`} onClick={() => setMobileOpen(false)}>Get API Key</a>
        </div>
      )}
    </nav>
  );
}
