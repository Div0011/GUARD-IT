'use client';

import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

const LIVE_STATS = [
  { label: 'Jobs Processed', value: '2.4B+', delta: '+12K/hr' },
  { label: 'Avg Latency', value: '2.8s', delta: 'p95' },
  { label: 'Uptime', value: '99.97%', delta: '30d SLA' },
  { label: 'Tenants', value: '4,200+', delta: 'Active' },
];

const VERDICTS = [
  { id: 'job_01J1XK', content: 'promotional spam detected in user bio...', verdict: 'FLAGGED', score: 0.96, cat: 'spam', time: '2s ago' },
  { id: 'job_01J1XL', content: 'This is a great product, highly recommend!', verdict: 'CLEAN', score: 0.03, cat: '—', time: '5s ago' },
  { id: 'job_01J1XM', content: 'inappropriate content targeting user group...', verdict: 'FLAGGED', score: 0.91, cat: 'hate_speech', time: '8s ago' },
  { id: 'job_01J1XN', content: 'Thanks for the quick support team, love it!', verdict: 'CLEAN', score: 0.01, cat: '—', time: '12s ago' },
  { id: 'job_01J1XO', content: 'violent content showing graphic imagery...', verdict: 'FLAGGED', score: 0.88, cat: 'violence', time: '15s ago' },
];

function LiveJobTicker() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex(i => (i + 1) % VERDICTS.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.ticker}>
      <div className={styles.tickerHeader}>
        <div className="status-dot nominal" />
        <span className="caption">Live moderation stream</span>
        <span className={styles.liveTag}>LIVE</span>
      </div>
      <div className={styles.tickerBody}>
        {VERDICTS.map((job, i) => (
          <div
            key={job.id}
            className={`${styles.tickerRow} ${i === activeIndex ? styles.tickerRowActive : ''}`}
          >
            <span className={`badge ${job.verdict === 'FLAGGED' ? 'badge-flagged' : 'badge-clean'}`}>
              {job.verdict}
            </span>
            <span className={styles.tickerContent}>{job.content}</span>
            <span className={styles.tickerCat}>{job.cat}</span>
            <span className={`${styles.tickerScore} ${job.verdict === 'FLAGGED' ? styles.scoreHigh : styles.scoreLow}`}>
              {job.score.toFixed(2)}
            </span>
            <span className={styles.tickerTime}>{job.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchDiagram() {
  return (
    <div className={styles.archDiagram}>
      <div className={styles.archLabel}>Request Lifecycle</div>
      <div className={styles.archFlow}>
        <div className={`${styles.archNode} ${styles.nodeClient}`}>
          <div className={styles.nodeIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <span>Client App</span>
        </div>
        <div className={styles.archArrow}>
          <div className={styles.arrowLine} />
          <span className={styles.arrowLabel}>POST /moderate</span>
        </div>
        <div className={`${styles.archNode} ${styles.nodeApi}`}>
          <div className={styles.nodeIcon}>⚡</div>
          <span>FastAPI</span>
          <span className={styles.nodeDetail}>202 ms</span>
        </div>
        <div className={styles.archArrow}>
          <div className={styles.arrowLine} />
          <span className={styles.arrowLabel}>LPUSH</span>
        </div>
        <div className={`${styles.archNode} ${styles.nodeQueue}`}>
          <div className={styles.nodeIcon}>⟳</div>
          <span>Redis</span>
          <span className={styles.nodeDetail}>Arq Queue</span>
        </div>
        <div className={styles.archArrow}>
          <div className={styles.arrowLine} />
          <span className={styles.arrowLabel}>BRPOP</span>
        </div>
        <div className={`${styles.archNode} ${styles.nodeWorker}`}>
          <div className={styles.nodeIcon}>🤖</div>
          <span>Worker</span>
          <span className={styles.nodeDetail}>HF + OpenAI</span>
        </div>
        <div className={styles.archArrow}>
          <div className={styles.arrowLine} />
          <span className={styles.arrowLabel}>Webhook</span>
        </div>
        <div className={`${styles.archNode} ${styles.nodeWebhook}`}>
          <div className={styles.nodeIcon}>📡</div>
          <span>Svix</span>
          <span className={styles.nodeDetail}>Signed</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background Effects */}
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgOrb1} aria-hidden />
      <div className={styles.bgOrb2} aria-hidden />

      <div className={styles.container}>
        {/* Left Column: Copy */}
        <div className={styles.content}>
          <div className={styles.topBadge}>
            <div className="status-dot nominal" />
            <span>All systems nominal · 99.97% uptime</span>
          </div>

          <h1 className={styles.headline}>
            Content Moderation<br />
            at <span className={`${styles.gradientText}`}>Internet Scale</span>
          </h1>

          <p className={styles.subheadline}>
            Production-grade, multi-tenant Safety-as-a-Service. Asynchronous by design —
            never block a thread waiting for AI inference. Integrate in minutes, scale to billions.
          </p>

          <div className={styles.codeSnippet}>
            <div className={styles.codeHeader}>
              <span className={styles.codeDot} style={{background: '#ef4444'}} />
              <span className={styles.codeDot} style={{background: '#f59e0b'}} />
              <span className={styles.codeDot} style={{background: '#10b981'}} />
              <span>Quick Integration — api_reference.md</span>
            </div>
            <pre className={styles.codeBody}>
              <span style={{color: '#a78bfa'}}>curl</span>{' '}<span style={{color: '#6ee7b7'}}>-X POST</span>{' '}https://api.guardit.io/api/v1/moderate/text {'\n'}
              {'  '}<span style={{color: '#6ee7b7'}}>-H</span>{' '}<span style={{color: '#fde68a'}}>"X-API-Key: sk_live_xxxx"</span>{'\n'}
              {'  '}<span style={{color: '#6ee7b7'}}>-d</span>{' '}<span style={{color: '#fde68a'}}>{'\'{"content":"...","options":{"threshold":0.75}}\''}</span>{'\n\n'}
              <span style={{color: '#60a5fa'}}># ← 202 Accepted (never blocks on inference)</span>{'\n'}
              <span style={{color: '#a78bfa'}}>{`{`}</span>{'\n'}
              {'  '}<span style={{color: '#6ee7b7'}}>"job_id"</span>: <span style={{color: '#fde68a'}}>"job_01J1XKYZABC123DEF456"</span>,{'\n'}
              {'  '}<span style={{color: '#6ee7b7'}}>"status"</span>: <span style={{color: '#fde68a'}}>"PENDING"</span>,{'\n'}
              {'  '}<span style={{color: '#6ee7b7'}}>"estimated_completion_ms"</span>: <span style={{color: '#a78bfa'}}>2800</span>,{'\n'}
              {'  '}<span style={{color: '#6ee7b7'}}>"poll_url"</span>: <span style={{color: '#fde68a'}}>"...jobs/job_01J1XKY..."</span>{'\n'}
              <span style={{color: '#a78bfa'}}>{`}`}</span>
            </pre>
          </div>

          <div className={styles.ctas}>
            <a href="#start" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              Start Free — Get API Key
            </a>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              View Architecture
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Trust badges */}
          <div className={styles.trustRow}>
            {['SOC 2 Type II', 'GDPR Ready', 'HMAC-SHA256', '99.97% SLA'].map(t => (
              <span key={t} className={styles.trustBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Live Demo Panel */}
        <div className={styles.visual}>
          {/* Stats Row */}
          <div className={styles.statsGrid}>
            {LIVE_STATS.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statDelta}>{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <ArchDiagram />

          {/* Live Ticker */}
          <LiveJobTicker />
        </div>
      </div>
    </section>
  );
}
