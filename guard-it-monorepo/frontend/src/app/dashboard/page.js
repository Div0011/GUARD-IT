'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

function StatCard({ label, value, delta, deltaType, icon, iconBg }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {delta && (
        <div className={`stat-delta ${deltaType === 'up' ? 'trend-up' : deltaType === 'down' ? 'trend-down' : ''}`}>
          {deltaType === 'up' && '↑'}
          {deltaType === 'down' && '↓'}
          <span style={{ fontSize: '0.78rem' }}>{delta}</span>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, jobsData] = await Promise.all([
          api.getStats(),
          api.getJobs()
        ]);
        setStats(statsData);
        setActiveJobs(jobsData.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="mono" style={{ color: 'var(--brand-primary)', fontSize: '1.2rem' }}>INITIALIZING DATA FEEDS...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-title">Overview</h1>
            <p className="page-subtitle">Real-time view of your moderation infrastructure and job pipeline.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', fontSize: '0.8rem', color: 'var(--brand-success)' }}>
              <div className="status-dot nominal" style={{ width: '6px', height: '6px' }} />
              NOMINAL
            </div>
            <Link href="/dashboard/jobs" className="btn btn-secondary btn-sm">
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Requests (All Time)"
          value={stats.total_requests.toLocaleString()}
          delta="+847 today"
          deltaType="up"
          iconBg="rgba(99,102,241,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>}
        />
        <StatCard
          label="Active Jobs"
          value={activeJobs.filter(j => j.status === 'PENDING').length}
          delta="Real-time queue depth"
          deltaType="neutral"
          iconBg="rgba(239,68,68,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-danger)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>}
        />
        <StatCard
          label="Avg Latency (System)"
          value={stats.avg_latency}
          delta="p95 < 8s"
          deltaType="up"
          iconBg="rgba(6,182,212,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
        />
        <StatCard
          label="Available Units"
          value={stats.active_workers}
          delta="Growth Plan"
          deltaType="neutral"
          iconBg="rgba(245,158,11,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-warning)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
        />
      </div>

      {/* System Health & Infrastructure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', marginBottom: '24px' }}>
        {/* Worker Cluster */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Worker Cluster Status</span>
            <span className="badge badge-completed">Nominal</span>
          </div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scaling units</div>
                <div className="mono" style={{ fontSize: '1.1rem', fontWeight: '700' }}>{stats.active_workers} Pods</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Concurrency</div>
                <div className="mono" style={{ fontSize: '1.1rem', fontWeight: '700' }}>50 Jobs</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</div>
                <div className="mono" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brand-success)' }}>{stats.uptime}</div>
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>WorkerSettings.max_jobs</span>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--brand-primary)' }}>10</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>health_check_interval</span>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-primary)' }}>10s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>job_timeout</span>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-primary)' }}>30s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Infrastructure */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Arq Queue Infrastructure</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Threshold: 500 jobs → Autoscale</span>
          </div>
          <div className="panel-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'arq:queue:guardit:priority', depth: 0, status: 'nominal', latency: '0.1s', color: 'var(--brand-secondary)' },
                { name: 'arq:queue:guardit:standard', depth: activeJobs.filter(j => j.status === 'PENDING').length, status: 'nominal', latency: '1.4s', color: 'var(--brand-primary)' },
              ].map((q, i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>{q.name}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Est. Drain Latency: {q.latency}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: q.depth > 100 ? 'var(--brand-warning)' : 'var(--text-primary)' }}>{q.depth} jobs</div>
                    </div>
                  </div>
                  <div className="queue-bar" style={{ height: '4px' }}>
                    <div style={{ width: `${Math.min((q.depth / 500) * 100, 100)}%`, height: '100%', background: q.color, borderRadius: '99px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Recent Jobs Table */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Moderation Jobs</span>
            <Link href="/dashboard/jobs" style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '500px' }}>
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Content Preview</th>
                  <th>Verdict</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {activeJobs.map(job => (
                  <tr key={job.job_id}>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-primary)' }}>
                        {job.job_id}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <span style={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.8rem'
                      }}>
                        {job.content}
                      </span>
                    </td>
                    <td>
                      {job.status === 'COMPLETED' ? (
                        <span className={`badge ${job.verdict === 'FLAGGED' ? 'badge-flagged' : 'badge-clean'}`}>
                          {job.verdict}
                        </span>
                      ) : (
                        <span className="badge badge-pending">PENDING</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${job.status === 'COMPLETED' ? 'badge-completed' : 'badge-processing'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Active Security Thresholds</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { cat: 'hate_speech', limit: '0.75', active: true },
                { cat: 'violence', limit: '0.80', active: true },
                { cat: 'sexual', limit: '0.85', active: true },
                { cat: 'misinformation', limit: '0.90', active: false },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{c.cat}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Threshold: {c.limit}</span>
                  </div>
                  <div className={`status-dot ${c.active ? 'nominal' : 'warning'}`} style={{ width: '6px', height: '6px' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Circuit Breaker States</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'HuggingFaceAdapter', state: 'CLOSED', failures: '0/5' },
                { label: 'OpenAIModerationAdapter', state: 'CLOSED', failures: '0/5' },
              ].map((cb, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="status-dot nominal" style={{ width: '6px', height: '6px' }} />
                    <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{cb.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-completed" style={{ fontSize: '0.6rem' }}>{cb.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

