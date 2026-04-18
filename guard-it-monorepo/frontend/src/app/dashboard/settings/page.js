'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(0.75);
  const [maxRetries, setMaxRetries] = useState(3);
  const [categories, setCategories] = useState({
    hate_speech: true, violence: true, self_harm: true,
    sexual: true, sexual_minors: true, harassment: true,
    spam: true, misinformation: false, dangerous_content: true, profanity: false,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleCat(cat) {
    setCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure moderation behavior, rate limits, and tenant preferences.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>

        {/* Tenant Info */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Tenant Information</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Tenant ID', value: 'ten_01J0MNPQ789', mono: true },
              { label: 'Display Name', value: 'Acme Corp (Dev)', mono: false },
              { label: 'Plan', value: 'Growth', mono: false },
              { label: 'Rate Limit', value: '300 req/min · 100K/day', mono: true },
            ].map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{f.label}</label>
                <span className={f.mono ? 'mono' : ''} style={{ fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-elevated)', padding: '8px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation Config */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Moderation Configuration</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Changes apply to new jobs only</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Threshold */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <span>Default Flagging Threshold</span>
                <span className="mono" style={{ color: 'var(--brand-primary)' }}>{threshold.toFixed(2)}</span>
              </label>
              <input
                type="range" min="0.5" max="0.99" step="0.01"
                value={threshold}
                onChange={e => setThreshold(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>0.50 (Sensitive)</span>
                <span>0.75 (Default)</span>
                <span>0.99 (Strict)</span>
              </div>
            </div>

            {/* Max Retries */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Max Retries per Job
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setMaxRetries(n)}
                    style={{
                      width: '44px', height: '44px', border: '1px solid',
                      borderColor: maxRetries === n ? 'var(--brand-primary)' : 'var(--border-subtle)',
                      background: maxRetries === n ? 'rgba(99,102,241,0.1)' : 'var(--bg-elevated)',
                      color: maxRetries === n ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: '700',
                      cursor: 'pointer', fontFamily: 'var(--font-mono)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Backoff formula: <span className="mono" style={{ color: 'var(--brand-primary)' }}>5^(attempt-1)</span> seconds, capped at 10 minutes.
              </p>
            </div>

            {/* Enabled Categories */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Enabled Moderation Categories (api_reference.md)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  'hate_speech', 'violence', 'self_harm', 'sexual',
                  'sexual_minors', 'harassment', 'spam', 'misinformation',
                  'dangerous_content', 'profanity'
                ].map(cat => (
                  <label
                    key={cat}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 12px', cursor: 'pointer',
                      background: categories[cat] ? 'rgba(99,102,241,0.06)' : 'var(--bg-elevated)',
                      border: `1px solid ${categories[cat] ? 'rgba(99,102,241,0.2)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => toggleCat(cat)}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
                      border: `2px solid ${categories[cat] ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                      background: categories[cat] ? 'var(--brand-primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}>
                      {categories[cat] && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <span className="mono" style={{ fontSize: '0.78rem', color: categories[cat] ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="panel" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
          <div className="panel-header" style={{ borderBottomColor: 'rgba(239,68,68,0.15)' }}>
            <span className="panel-title" style={{ color: 'var(--brand-danger)' }}>Danger Zone</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>Rotate Webhook Secret</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Invalidates existing signatures. Update your endpoint immediately.
                </div>
              </div>
              <button className="btn btn-danger btn-sm">Rotate Secret</button>
            </div>
            <hr className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--brand-danger)' }}>Delete Tenant Data</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Permanently deletes all jobs, results, and API keys. Irreversible.
                </div>
              </div>
              <button className="btn btn-danger btn-sm">Delete All Data</button>
            </div>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            {saved ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg> Saved!</>
            ) : 'Save Changes'}
          </button>
          <button className="btn btn-ghost">Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
}
