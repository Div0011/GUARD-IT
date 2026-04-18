'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DashLayout.module.css';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/dashboard/jobs',
    label: 'Moderation Jobs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    badge: 'Live',
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 3v18h18" />
        <path d="M18 9l-5 5-2-2-5 5" />
      </svg>
    ),
  },
  {
    href: '/dashboard/api-keys',
    label: 'API Keys',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
  {
    href: '/dashboard/webhooks',
    label: 'Webhooks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function DashLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${styles.layout} ${isCollapsed ? styles.layoutCollapsed : ''}`}>
      {/* Sidebar */}
      <aside className={`
        ${styles.sidebar} 
        ${sidebarOpen ? styles.sidebarOpen : ''}
        ${isCollapsed ? styles.sidebarCollapsed : ''}
      `}>
        {/* Logo */}
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.sidebarLogo}>
            <div className={styles.sidebarLogoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6l-8-4z" fill="url(#dashLogoGrad)" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="dashLogoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {!isCollapsed && (
              <div className={styles.sidebarLogoText}>
                <span className={styles.logoBrand}>GUARD IT!</span>
                <span className={styles.logoSub}>Admin Dashboard</span>
              </div>
            )}
          </Link>
          <button 
            className={styles.collapseBtn} 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d={isCollapsed ? "M13 17l5-5-5-5M6 17l5-5-5-5" : "M11 17l-5-5 5-5M18 17l-5-5 5-5"} />
            </svg>
          </button>
        </div>

        {/* Tenant Badge */}
        <div className={styles.tenantBadge}>
          <div className={styles.tenantAvatar}>A</div>
          {!isCollapsed && (
            <>
              <div className={styles.tenantInfo}>
                <span className={styles.tenantName}>Acme Corp (Dev)</span>
                <span className={styles.tenantPlan}>Growth Plan</span>
              </div>
              <div className="status-dot nominal" style={{marginLeft: 'auto', flexShrink: 0}} />
            </>
          )}
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {!isCollapsed && <span className={styles.navLabel}>Main</span>}
            {NAV_ITEMS.slice(0, 3).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>

          <div className={styles.navSection}>
            {!isCollapsed && <span className={styles.navLabel}>Configuration</span>}
            {NAV_ITEMS.slice(3).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.backToSite} title={isCollapsed ? "Back to site" : ""}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {!isCollapsed && <span>Back to site</span>}
          </Link>
          {!isCollapsed && (
            <div className={styles.apiVersion}>API v1 (2024-06-01) · guardit-nlp-v2.1</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Top Bar */}
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <div className={styles.topbarRight}>
            <div className={styles.systemStatus}>
              <div className="status-dot nominal" />
              <span>All systems nominal</span>
            </div>
            <button className="btn btn-sm btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              {!isCollapsed ? 'New API Key' : 'Key'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
