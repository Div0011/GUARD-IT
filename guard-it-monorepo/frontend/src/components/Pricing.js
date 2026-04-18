import styles from './Pricing.module.css';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    tagline: 'For individuals and early-stage products.',
    limits: '60 req/min · 10K/day',
    features: [
      '10,000 moderation jobs/month',
      'All 10 violation categories',
      'Webhook delivery via Svix',
      'REST API + polling',
      'Standard support (GitHub)',
      'Community Discord',
    ],
    cta: 'Start for Free',
    ctaStyle: 'btn-secondary',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/mo',
    tagline: 'For production workloads that need reliability.',
    limits: '300 req/min · 100K/day',
    features: [
      '500,000 moderation jobs/month',
      'All 10 violation categories',
      'Priority queue processing',
      'Optimistic UI dashboard',
      'Webhook replay + delivery logs',
      'Real-time analytics',
      'Email support (24h SLA)',
      'API key management',
    ],
    cta: 'Start 14-Day Trial',
    ctaStyle: 'btn-primary',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'For platforms requiring dedicated isolation.',
    limits: 'Custom rate limits',
    features: [
      'Unlimited moderation jobs',
      'Dedicated Arq worker queue',
      'PostgreSQL read replicas',
      'SLA guarantee (99.99%)',
      'Custom AI model configuration',
      'SSO / SAML authentication',
      'Dedicated Slack channel',
      'On-site solution review',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'btn-secondary',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="section-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Pricing
          </div>
          <h2 className={styles.title}>
            Scale on your terms.<br />
            <span className="glow-text">Pay for what you use.</span>
          </h2>
          <p className={styles.subtitle}>
            No per-seat pricing. No hidden infrastructure costs. You pay for moderation jobs — that's it.
          </p>
        </div>

        <div className={styles.grid}>
          {PLANS.map((plan, i) => (
            <div key={i} className={`${styles.card} ${plan.highlighted ? styles.cardHighlighted : ''}`}>
              {plan.highlighted && (
                <div className={styles.popularBadge}>{plan.badge}</div>
              )}
              <div className={styles.cardTop}>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  {plan.period && <span className={styles.period}>{plan.period}</span>}
                </div>
                <p className={styles.tagline}>{plan.tagline}</p>
                <div className={styles.limits}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  {plan.limits}
                </div>
              </div>

              <hr className={styles.divider} />

              <ul className={styles.features}>
                {plan.features.map((f, j) => (
                  <li key={j} className={styles.feature}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#start" className={`btn ${plan.ctaStyle} ${styles.cta}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className={styles.note}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          All plans include HMAC-SHA256 webhook signing, structured logging, and full API key lifecycle management.
          No credit card required for Starter.
        </div>
      </div>
    </section>
  );
}
