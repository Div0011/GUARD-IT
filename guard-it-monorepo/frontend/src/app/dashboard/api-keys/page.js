'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function APIKeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState('production');
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  async function fetchKeys() {
    try {
      const data = await api.getApiKeys();
      setKeys(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  async function handleCreate() {
    if (!newKeyName) return;
    try {
      const data = await api.createApiKey({ 
        name: newKeyName, 
        environment: newKeyEnv 
      });
      setCreatedKey(data.rawKey);
      fetchKeys(); // Refresh list to see the masked version
      setNewKeyName('');
      setShowCreate(false);
    } catch (error) {
      console.error('Failed to create key:', error);
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">API Keys</h1>
            <p className="page-subtitle">Manage authentication keys for your tenant. Keys are stored as HMAC-SHA256 hashes — never in plaintext.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            Create New Key
          </button>
        </div>
      </div>

      {/* Security Note */}
      <div style={{
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        padding: '14px 16px',
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '24px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
        </svg>
        <span>
          <strong style={{ color: 'var(--text-primary)' }}>Security: </strong>
          Raw API keys are displayed <strong>once</strong> at creation and then hashed with HMAC-SHA256.
          We cannot recover your plaintext key. Rotate immediately if exposed.
        </span>
      </div>

      {/* Keys Table */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">API Keys ({keys.filter(k => k.status === 'active').length} active)</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: '700px' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Environment</th>
                <th>Last Used</th>
                <th>Total Requests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && keys.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }} className="mono">LOADING...</td></tr>
              ) : keys.map(key => (
                <tr key={key.id}>
                  <td>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{key.name}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {key.maskedKey}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      background: key.environment === 'production' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)',
                      color: key.environment === 'production' ? 'var(--brand-primary)' : 'var(--brand-warning)',
                      border: `1px solid ${key.environment === 'production' ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    }}>
                      {key.environment.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: '0.82rem' }}>{key.requests.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`badge ${key.status === 'active' ? 'badge-completed' : 'badge-failed'}`}>
                      {key.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Creation Modal */}
      {showCreate && (
        <>
          <div onClick={() => setShowCreate(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '480px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-2xl)',
            padding: '32px', zIndex: 101,
            display: 'flex', flexDirection: 'column', gap: '20px',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Create API Key</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                The plaintext key will be shown once. Copy it immediately.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Key Name
                </label>
                <input
                  className="input"
                  placeholder="e.g. Production API Key"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Environment
                </label>
                <select className="input" value={newKeyEnv} onChange={e => setNewKeyEnv(e.target.value)}>
                  <option value="production">Production (sk_live_)</option>
                  <option value="test">Test/Staging (sk_test_)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate} disabled={!newKeyName}>
                Create Key
              </button>
            </div>
          </div>
        </>
      )}

      {/* Created Key Banner */}
      {createdKey && (
        <>
          <div onClick={() => setCreatedKey(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '520px', background: 'var(--bg-surface)',
            border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-2xl)',
            padding: '32px', zIndex: 101,
            display: 'flex', flexDirection: 'column', gap: '20px',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-success)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>API Key Created</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--brand-danger)' }}>
                  ⚠️ Copy this key now — it will never be shown again.
                </p>
              </div>
            </div>
            <div style={{
              background: 'var(--bg-overlay)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)', padding: '16px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <span className="mono" style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {createdKey}
              </span>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleCopy(createdKey)}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setCreatedKey(null)}>
              I've saved my key
            </button>
          </div>
        </>
      )}
    </div>
  );
}
