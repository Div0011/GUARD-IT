'use client';

import { useState } from 'react';

// Simple bar chart component without recharts to avoid compat issues
function BarChart({ data, color = 'var(--brand-primary)' }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '100%',
              height: `${(d.value / max) * 70}px`,
              background: color,
              borderRadius: '3px 3px 0 0',
              opacity: 0.7 + (d.value / max) * 0.3,
              transition: 'height 0.3s ease',
            }}
          />
          <span style={{ fontSize: '0.6rem', color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ flagged, clean }) {
  const total = flagged + clean;
  const flaggedPct = (flagged / total) * 100;
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (flaggedPct / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-hover)" strokeWidth="12" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="var(--brand-danger)" strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="var(--brand-success)" strokeWidth="12"
          strokeDasharray={`${(clean / total) * circumference} ${circumference}`}
          strokeDashoffset={-(flaggedPct / 100) * circumference}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'all 0.5s ease' }}
        />
        <text x="50" y="45" textAnchor="middle" style={{ fontSize: '14px', fontWeight: '700', fill: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {flaggedPct.toFixed(1)}%
        </text>
        <text x="50" y="60" textAnchor="middle" style={{ fontSize: '8px', fill: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          flagged
        </text>
      </svg>
      <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--brand-danger)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--brand-danger)' }} />
          Flagged: {flagged.toLocaleString()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--brand-success)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--brand-success)' }} />
          Clean: {clean.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

const DAILY_JOBS = [
  { label: 'Mon', value: 5421 },
  { label: 'Tue', value: 6892 },
  { label: 'Wed', value: 5103 },
  { label: 'Thu', value: 8421 },
  { label: 'Fri', value: 9201 },
  { label: 'Sat', value: 4231 },
  { label: 'Sun', value: 3892 },
];

const HOURLY_LATENCY = [
  { label: '00', value: 1.8 },
  { label: '03', value: 1.6 },
  { label: '06', value: 2.1 },
  { label: '09', value: 3.4 },
  { label: '12', value: 4.1 },
  { label: '15', value: 3.8 },
  { label: '18', value: 4.9 },
  { label: '21', value: 3.2 },
];

const PROVIDER_DATA = [
  { provider: 'HuggingFace', calls: 41239, successRate: '98.7%', avgLatency: '1.9s', quota: '87%' },
  { provider: 'OpenAI (fallback)', calls: 3421, successRate: '99.9%', avgLatency: '0.8s', quota: '12%' },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState('7d');

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Job throughput, latency trends, and provider performance metrics.</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '4px' }}>
            {['24h', '7d', '30d'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: '6px 14px', border: 'none', cursor: 'pointer',
                  borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease',
                  background: range === r ? 'var(--brand-primary)' : 'transparent',
                  color: range === r ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Jobs', value: '43,160', delta: 'This week', color: 'var(--brand-primary)' },
          { label: 'Flagged Rate', value: '12.4%', delta: '↓ 1.2% vs last', color: 'var(--brand-danger)' },
          { label: 'Avg Latency (p50)', value: '2.8s', delta: 'p95: 7.1s', color: 'var(--brand-accent)' },
          { label: 'Webhook SLA', value: '99.1%', delta: 'Delivered in < 30s', color: 'var(--brand-success)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Job Volume */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Job Volume (Last 7 Days)</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>43,160 total</span>
          </div>
          <div className="panel-body">
            <BarChart data={DAILY_JOBS} color="var(--brand-primary)" />
            <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Peak day: Friday — 9,201 jobs · Lowest: Sunday — 3,892 jobs
            </div>
          </div>
        </div>

        {/* Verdict Distribution */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Verdict Distribution</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart flagged={5352} clean={37808} />
          </div>
        </div>
      </div>

      {/* Latency + Provider */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Latency Trend */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Processing Latency (by hour)</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>seconds · p50</span>
          </div>
          <div className="panel-body">
            <BarChart data={HOURLY_LATENCY} color="var(--brand-accent)" />
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
              {[
                { label: 'p50', value: '2.8s' },
                { label: 'p95', value: '7.1s' },
                { label: 'p99', value: '7.9s' },
                { label: 'Max', value: '8.0s (timeout)' },
              ].map((l, i) => (
                <div key={i}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l.label}</div>
                  <div className="mono" style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600', marginTop: '2px' }}>{l.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Provider Performance */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Provider Performance</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PROVIDER_DATA.map((p, i) => (
              <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.provider}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-success)', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    {p.successRate} success
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { k: 'Calls', v: p.calls.toLocaleString() },
                    { k: 'Avg Latency', v: p.avgLatency },
                    { k: 'Quota Used', v: p.quota },
                    { k: 'Role', v: i === 0 ? 'Primary' : 'Fallback' },
                  ].map((d, j) => (
                    <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.k}</span>
                      <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{d.v}</span>
                    </div>
                  ))}
                </div>
                <div className="queue-bar">
                  <div style={{ width: p.quota, height: '100%', borderRadius: '999px', background: i === 0 ? 'var(--brand-primary)' : 'var(--brand-success)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Stats Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Category Breakdown (This Period)</span>
            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-disabled)' }}>metrics: guardit_category_flags_count</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Flagged Jobs</th>
                  <th>% Total</th>
                  <th>Avg Score</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: 'hate_speech', count: 2241, pct: '41.9%', avg: '0.89', trend: '↑ 3.2%', trendDir: 'up' },
                  { cat: 'spam', count: 1481, pct: '27.7%', avg: '0.94', trend: '↓ 1.1%', trendDir: 'down' },
                  { cat: 'violence', count: 890, pct: '16.6%', avg: '0.85', trend: '→ stable', trendDir: 'neutral' },
                  { cat: 'harassment', count: 512, pct: '9.6%', avg: '0.81', trend: '↑ 0.8%', trendDir: 'up' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td><span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{row.cat}</span></td>
                    <td><span className="mono" style={{ fontSize: '0.88rem', fontWeight: '600' }}>{row.count.toLocaleString()}</span></td>
                    <td><span style={{ color: 'var(--text-secondary)' }}>{row.pct}</span></td>
                    <td><span className="mono" style={{ fontWeight: '600', color: 'var(--brand-danger)' }}>{row.avg}</span></td>
                    <td>
                      <span style={{
                        fontSize: '0.78rem', fontWeight: '600',
                        color: row.trendDir === 'up' ? 'var(--brand-danger)' : row.trendDir === 'down' ? 'var(--brand-success)' : 'var(--text-muted)'
                      }}>{row.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Infrastructure Events */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Infra Events</span>
            <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>Audit Log</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { time: '14:22:01', event: 'HF_TIMEOUT', status: 'FAILOVER', msg: 'HuggingFaceAdapter timeout > 8s' },
              { time: '14:22:02', event: 'OAI_ACTIVATED', status: 'SUCCESS', msg: 'OpenAIModerationAdapter success' },
              { time: '11:05:47', event: 'AUTOSCALE_UP', status: 'INFO', msg: 'Scaling workers: 3 → 5 pods' },
              { time: '09:12:12', event: 'CB_RESET', status: 'SUCCESS', msg: 'HuggingFaceAdapter CB → CLOSED' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-disabled)', marginTop: '2px' }}>{e.time}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', fontWeight: '700', color: e.status === 'FAILOVER' ? 'var(--brand-danger)' : 'var(--text-primary)' }}>{e.event}</span>
                    <span style={{ fontSize: '0.6rem', padding: '0px 4px', borderRadius: '3px', border: '1px solid currentColor', color: 'var(--text-muted)' }}>{e.status}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{e.msg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
