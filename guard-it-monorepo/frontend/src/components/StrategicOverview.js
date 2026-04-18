import styles from './StrategicOverview.module.css';

const STEPS = [
  {
    step: '01',
    title: 'Submit Content via API',
    description: 'POST your text content to /api/v1/moderate/text with your X-API-Key. The API validates, writes a job record to PostgreSQL, and enqueues to Redis — all in under 50ms.',
    code: `POST /api/v1/moderate/text
X-API-Key: sk_live_xxxx
Content-Type: application/json

{
  "content": "The text to moderate...",
  "options": {
    "categories": ["hate_speech", "spam"],
    "threshold": 0.75
  }
}`,
    verdict: null,
    color: 'indigo',
  },
  {
    step: '02',
    title: 'Receive Immediate 202',
    description: 'The API responds instantly with a job_id and poll_url. Your application resumes immediately — no threads held waiting for AI inference.',
    code: `{
  "job_id": "job_01J1XKYZABC123",
  "status": "PENDING",
  "estimated_completion_ms": 2800,
  "poll_url": "/api/v1/jobs/job_01J1XKYZABC123"
}`,
    color: 'violet',
  },
  {
    step: '03',
    title: 'Workers Process Asynchronously',
    description: 'Arq workers dequeue jobs via BRPOP, route to Hugging Face (primary: roberta-hate-speech) or OpenAI (fallback: omni-moderation-latest), and handle retries with formula 5^(attempt-1) seconds.',
    code: `# Worker internals
inference → HuggingFace (timeout 8s)
  ↳ RATE_LIMIT? → retry with 5^(attempt-1)s backoff
  ↳ TIMEOUT?    → failover to OpenAI
  
scores = {
  "hate_speech": 0.94,
  "spam": 0.03
}
verdict = "FLAGGED"  # score > threshold`,
    color: 'cyan',
  },
  {
    step: '04',
    title: 'Receive Signed Webhook',
    description: 'Svix delivers the result to your endpoint within seconds. The payload is HMAC-SHA256 signed. Verify the signature, process the verdict, done.',
    code: `POST https://your-app.com/webhooks
svix-signature: v1,<hmac-sha256>

{
  "event_type": "moderation.completed",
  "data": {
    "job_id": "job_01J1XKYZABC123",
    "verdict": "FLAGGED",
    "flagged_categories": ["hate_speech"],
    "scores": {"hate_speech": 0.94}
  }
}`,
    color: 'success',
  },
];

const CATEGORIES = [
  'hate_speech', 'violence', 'self_harm', 'sexual',
  'sexual_minors', 'harassment', 'spam', 'misinformation',
  'dangerous_content', 'profanity'
];

export default function StrategicOverview() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className="section-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            How It Works
          </div>
          <h2 className={styles.title}>
            From API call to webhook<br />
            <span className="glow-text">in under 3 seconds</span>
          </h2>
          <p className={styles.subtitle}>
            Four stages. Zero coupling between them. Every failure isolated.
          </p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepMeta}>
                <div className={styles.stepNumber}>{step.step}</div>
                {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
              </div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                <div className={styles.stepCode}>
                  <pre><code>{step.code}</code></pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div className={styles.categories}>
          <div className={styles.catHeader}>
            <h3 className={styles.catTitle}>10 Moderation Categories</h3>
            <p className={styles.catSubtitle}>
              Restrict to specific categories or run all simultaneously. Scores normalized 0.0 – 1.0.
            </p>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} className={styles.catTag}>
                <span className={styles.catDot} />
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Reliability Table */}
        <div className={styles.reliabilitySection}>
          <h3 className={styles.reliTitle}>Latency Budget & Failure Modes</h3>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Stage</span>
              <span>Latency Budget</span>
              <span>Failure Mode</span>
              <span>Recovery</span>
            </div>
            {[
              { stage: 'API Ingestion', latency: '< 50ms p99', failure: 'Validation / Auth error', recovery: 'Synchronous error return' },
              { stage: 'Redis Enqueue', latency: '< 5ms', failure: 'Redis unreachable', recovery: 'In-memory fallback queue' },
              { stage: 'Worker Processing', latency: '< 8s p95', failure: 'Provider timeout / rate limit', recovery: 'Exponential backoff, 3 retries' },
              { stage: 'Webhook Delivery', latency: '< 30s', failure: 'Non-2xx client response', recovery: 'Svix retry over 72 hours' },
            ].map((row, i) => (
              <div key={i} className={styles.tableRow}>
                <span className={styles.tableStage}>{row.stage}</span>
                <span className={`${styles.tableLatency} mono`}>{row.latency}</span>
                <span className={styles.tableFailure}>{row.failure}</span>
                <span className={styles.tableRecovery}>{row.recovery}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
