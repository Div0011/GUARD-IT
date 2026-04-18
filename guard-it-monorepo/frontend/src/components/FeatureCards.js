import styles from './FeatureCards.module.css';

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    label: 'Asynchronous by Design',
    title: 'Zero-Blocking Ingestion',
    description: 'POST your content and immediately receive a 202 Accepted. AI inference runs asynchronously in Arq workers — your API thread is never held waiting for a model response.',
    detail: '< 50ms p99 ingestion',
    color: 'indigo',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: 'Multi-Tenant Isolation',
    title: 'Row-Level Security',
    description: 'Every query is scoped by tenant_id at the ORM layer and enforced by PostgreSQL RLS policies. One tenant\'s data is architecturally inaccessible to another — even via raw SQL.',
    detail: 'Defense-in-depth isolation',
    color: 'violet',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    label: 'Reliability Engineering',
    title: 'Circuit Breaker Pattern',
    description: 'When Hugging Face fails, the system automatically fails over to OpenAI\'s moderation API. Circuit breakers prevent cascading failures. Every failure mode is an expected input.',
    detail: 'Max 3 retries + fallback',
    color: 'cyan',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    label: 'Managed Webhook Delivery',
    title: 'Svix-Powered Webhooks',
    description: 'Results delivered via HMAC-SHA256 signed webhooks with automatic retries over 72 hours. No polling required — your systems get notified the moment a verdict is ready.',
    detail: '72-hour retry schedule',
    color: 'success',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h18M12 3l9 9-9 9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    label: 'Horizontal Scaling',
    title: 'Independent Scale Units',
    description: 'API pods scale on request rate. Worker pods scale on queue depth. Each layer has an independent autoscaling axis. Go from 2 to 50 replicas with zero coordination.',
    detail: '10 concurrent jobs/worker',
    color: 'warning',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 13h6M9 17h4" />
      </svg>
    ),
    label: 'Full Observability',
    title: 'Prometheus + Structured Logs',
    description: 'Every request carries an X-Request-ID traced through ingestion, queue, worker, and webhook delivery. Prometheus metrics expose queue depth, job duration, and provider latency.',
    detail: 'JSON logs + distributed traces',
    color: 'indigo',
  },
];

const COLOR_MAP = {
  indigo: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', text: '#6366f1' },
  violet: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: '#8b5cf6' },
  cyan:   { bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.2)',  text: '#06b6d4' },
  success:{ bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
  warning:{ bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b' },
};

export default function FeatureCards() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="section-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
            Platform Capabilities
          </div>
          <h2 className={styles.title}>
            Engineering decisions that<br />
            <span className="glow-text">matter at production scale</span>
          </h2>
          <p className={styles.subtitle}>
            Every architectural choice in GUARD IT! is documented, reasoned, and built to 
            handle the failure modes that actually occur — not the ones from your happy path.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => {
            const colors = COLOR_MAP[f.color] || COLOR_MAP.indigo;
            return (
              <div key={i} className={styles.card}>
                <div
                  className={styles.cardIconWrap}
                  style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
                >
                  {f.icon}
                </div>
                <div className={styles.cardLabel}>{f.label}</div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardDetail} style={{ color: colors.text }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
