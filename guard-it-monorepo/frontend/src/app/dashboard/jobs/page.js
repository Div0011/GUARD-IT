'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

const STATUS_OPTS = ['All', 'COMPLETED', 'PROCESSING', 'PENDING', 'FAILED'];
const VERDICT_OPTS = ['All', 'FLAGGED', 'CLEAN'];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [verdictFilter, setVerdictFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  async function fetchJobs() {
    try {
      const data = await api.getJobs();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  }

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = jobs.filter(j => {
    if (statusFilter !== 'All' && j.status !== statusFilter) return false;
    if (verdictFilter !== 'All' && j.verdict !== verdictFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!j.job_id.toLowerCase().includes(q) &&
          !j.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (loading && jobs.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="mono" style={{ color: 'var(--brand-primary)', fontSize: '1.2rem' }}>FETCHING JOB PIPELINE...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">Moderation Jobs</h1>
            <p className="page-subtitle">
              All jobs for tenant <span className="mono" style={{ color: 'var(--brand-primary)' }}>ten_01J0MNPQ789</span>.
              Filtered by status and verdict. Click any row to inspect.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {filtered.length} results
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input"
          style={{ maxWidth: '280px' }}
          placeholder="Search job_id, content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input" style={{ maxWidth: '160px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input" style={{ maxWidth: '160px' }} value={verdictFilter} onChange={e => setVerdictFilter(e.target.value)}>
          {VERDICT_OPTS.map(v => <option key={v}>{v}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => { setStatusFilter('All'); setVerdictFilter('All'); setSearch(''); }}>
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: '960px' }}>
            <thead>
              <tr>
                <th>job_id</th>
                <th>status</th>
                <th>verdict</th>
                <th>content preview</th>
                <th>flagged_categories</th>
                <th>processing_time_ms</th>
                <th>model_version</th>
                <th>created_at</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedJob(job)}>
                  <td>
                    <span className="mono" style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                      {job.job_id}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${job.status === 'COMPLETED' ? 'badge-completed' : job.status === 'FAILED' ? 'badge-failed' : 'badge-processing'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    {job.verdict
                      ? <span className={`badge badge-${job.verdict.toLowerCase()}`}>{job.verdict}</span>
                      : <span style={{ color: 'var(--text-disabled)', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  <td>
                    <span style={{ display: 'block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem' }}>
                      {job.content}
                    </span>
                  </td>
                  <td>
                    {job.flaggedCategories && JSON.parse(job.flaggedCategories)?.length > 0
                      ? <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--brand-warning)' }}>
                          {JSON.parse(job.flaggedCategories).join(', ')}
                        </span>
                      : <span style={{ color: 'var(--text-disabled)', fontSize: '0.78rem' }}>—</span>}
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: '0.78rem', color: (job.processing_time_ms || 0) > 7000 ? 'var(--brand-warning)' : 'var(--text-secondary)' }}>
                      {job.processing_time_ms != null ? `${job.processing_time_ms.toLocaleString()}ms` : '—'}
                    </span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {job.model_version || '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Detail Drawer */}
      {selectedJob && (
        <>
          <div onClick={() => setSelectedJob(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: '520px',
            background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
            zIndex: 101, overflowY: 'auto', padding: '32px',
            display: 'flex', flexDirection: 'column', gap: '20px',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Job Inspection</h2>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedJob.job_id}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedJob(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${selectedJob.status === 'COMPLETED' ? 'badge-completed' : 'badge-processing'}`}>{selectedJob.status}</span>
              {selectedJob.verdict && <span className={`badge badge-${selectedJob.verdict.toLowerCase()}`}>{selectedJob.verdict}</span>}
            </div>

            {selectedJob.scores && (
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  intelligence scores
                </div>
                {Object.entries(selectedJob.scores).map(([cat, score]) => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '130px' }}>{cat}</span>
                    <div className="score-track" style={{ flex: 1, height: '6px' }}>
                      <div
                        className={score >= 0.75 ? 'score-fill-flagged' : 'score-fill-clean'}
                        style={{ width: `${score * 100}%`, height: '100%', borderRadius: '999px' }}
                      />
                    </div>
                    <span className="mono" style={{ fontSize: '0.78rem', fontWeight: '700', minWidth: '36px', color: score >= 0.75 ? 'var(--brand-danger)' : 'var(--brand-success)' }}>
                      {(score).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>content preview</div>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{selectedJob.content}</p>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>system metadata</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { k: 'id', v: selectedJob.id },
                  { k: 'job_id', v: selectedJob.job_id },
                  { k: 'model', v: selectedJob.model_version },
                  { k: 'latency', v: `${selectedJob.processing_time_ms}ms` },
                  { k: 'created_at', v: new Date(selectedJob.createdAt).toLocaleString() },
                  { k: 'updated_at', v: new Date(selectedJob.updatedAt).toLocaleString() },
                ].map(({ k, v }) => (
                  <div key={k} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                    <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{k}</div>
                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                SDK Payload Preview
              </div>
              <div style={{ background: 'rgba(9,9,15,0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px', overflowX: 'auto' }}>
                <pre className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
{JSON.stringify({
  api_version: '2024-06-01',
  event: `moderation.${selectedJob.status.toLowerCase()}`,
  data: {
    job_id: selectedJob.job_id,
    status: selectedJob.status,
    verdict: selectedJob.verdict,
    scores: selectedJob.scores,
    flagged_categories: selectedJob.flaggedCategories,
    processing_time_ms: selectedJob.processing_time_ms
  }
}, null, 2)}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Replay Job</button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Copy Payload</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
