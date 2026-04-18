import styles from './Footer.module.css';

const LINKS = {
  Product: ['Features', 'Architecture', 'Pricing', 'Changelog', 'Status'],
  Developers: ['API Reference', 'Webhooks', 'SDKs', 'Rate Limits', 'Examples'],
  Company: ['About', 'Blog', 'Security', 'Privacy Policy', 'Terms of Service'],
  Support: ['Documentation', 'Discord Community', 'GitHub', 'Contact Us', 'SLA'],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <div className={styles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6l-8-4z" fill="url(#footerGrad)" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footerGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className={styles.logoText}>GUARD <span>IT!</span></span>
            </div>
            <p className={styles.tagline}>
              Production-grade, multi-tenant content moderation at internet scale.
              Built for teams who take trust & safety seriously.
            </p>
            <div className={styles.statusRow}>
              <div className="status-dot nominal" />
              <span className={styles.statusText}>All systems operational</span>
              <a href="#" className={styles.statusLink}>status.guardit.io →</a>
            </div>
          </div>

          <div className={styles.links}>
            {Object.entries(LINKS).map(([category, links]) => (
              <div key={category} className={styles.linkGroup}>
                <h4 className={styles.linkGroupTitle}>{category}</h4>
                <ul className={styles.linkList}>
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className={styles.link}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Ready to moderate at scale?</h3>
            <p className={styles.ctaSubtitle}>Start free. No credit card required. 10,000 jobs on the house.</p>
          </div>
          <a href="#start" className="btn btn-primary btn-lg">
            Get Your API Key
          </a>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © 2025 GUARD IT! Engineering Team · Built with ⚡
          </span>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy</a>
            <a href="#" className={styles.bottomLink}>Terms</a>
            <a href="#" className={styles.bottomLink}>Security</a>
            <a href="#" className={styles.bottomLink}>MIT License</a>
          </div>
          <div className={styles.stack}>
            {['FastAPI', 'Redis', 'PostgreSQL', 'Next.js', 'Svix'].map(t => (
              <span key={t} className={styles.stackTag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
