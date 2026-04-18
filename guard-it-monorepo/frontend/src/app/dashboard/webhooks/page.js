'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const SVIX_RETRY_SCHEDULE = [
  { attempt: '1 (initial)', delay: 'Immediate' },
  { attempt: '2', delay: '~5 seconds' },
  { attempt: '3', delay: '~30 seconds' },
  { attempt: '4', delay: '~5 minutes' },
  { attempt: '5', delay: '~30 minutes' },
  { attempt: '6', delay: '~2 hours' },
  { attempt: '7', delay: '~6 hours' },
  { attempt: 'Final (8)', delay: '~24 hours' },
];

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  async function fetchEndpoints() {
    try {
      const data = await api.getWebhooks();
      setEndpoints(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch endpoints:', error);
    }
  }

  useEffect(() => {
    fetchEndpoints();
  }, []);

  async function handleAdd() {
    if (!newUrl) return;
    try {
      await api.createWebhook({ url: newUrl });
      fetchEndpoints();
      setNewUrl('');
      setShowAdd(false);
    } catch (error) {
      console.error('Failed to create endpoint:', error);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">Webhooks</h1>
            <p className="page-subtitle">Managed delivery via Svix — at-least-once with HMAC-SHA256 signing and 72-hour retries.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Add Endpoint
          </button>
        </div>
      </div>

      {/* Endpoints */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {loading && endpoints.length === 0 ? (
          <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
            <span className="mono">LOADING ENDPOINTS...</span>
          </div>
        ) : endpoints.length === 0 ? (
          <div className="panel" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>No endpoints configured</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>Configure first endpoint</button>
          </div>
        ) : endpoints.map(ep => (
          <div key={ep.id} className="panel">
            <div className="panel-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className={`badge badge-completed`}>{ep.status}</span>
                    <span className="mono" style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600' }}>{ep.url}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-neutral">moderation.completed</span>
                    <span className="badge badge-neutral">moderation.failed</span>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>
                      <span style={{ color: 'var(--brand-success)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>0</span> delivered
                    </span>
                    <span>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>0</span> failures
                    </span>
                    <span>Last: Never</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-overlay)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      {ep.secret}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm">Edit</button>
                  <button className="btn btn-ghost btn-sm">Test</button>
                  <button className="btn btn-danger btn-sm">Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Deliveries</span>
            <button className="btn btn-ghost btn-sm">View all logs →</button>
          </div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Svix delivery data will appear here as jobs process.</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Svix Retry Schedule</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '4px' }}>
              When your endpoint returns a non-2xx, Svix automatically retries with exponential backoff + jitter for up to <strong>72 hours</strong>.
            </p>
            {SVIX_RETRY_SCHEDULE.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Attempt {r.attempt}</span>
                <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--brand-primary)' }}>{r.delay}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <>
          <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '480px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-2xl)', padding: '32px', zIndex: 101,
            display: 'flex', flexDirection: 'column', gap: '20px',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Add Webhook Endpoint</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Must be an HTTPS URL. Svix will sign all payloads.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Endpoint URL
                </label>
                <input
                  className="input"
                  placeholder="https://your-app.com/webhooks/guardit"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Events
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['moderation.completed', 'moderation.failed'].map(e => (
                    <label key={e} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-primary)' }} />
                      {e}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd} disabled={!newUrl}>Add Endpoint</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
