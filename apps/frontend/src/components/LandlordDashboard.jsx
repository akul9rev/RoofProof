import React, { useState } from 'react';
import { Building2, Plus, ShieldCheck, Check, X, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LandlordDashboard({ properties, applications, onOpenCreateModal, onUpdateStatus, currentUser }) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'properties'

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div>
          <span className="badge-pill badge-midnight" style={{ marginBottom: '8px' }}>
            <Building2 size={14} /> Landlord Management Portal
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Tenant Applications & Listings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review mathematical Zero-Knowledge eligibility proofs without handling sensitive financial paperwork.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={onOpenCreateModal} style={{ padding: '12px 24px' }}>
            <Plus size={18} /> List New Property
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Active Listings</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{properties.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Applications Received</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{applications.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Zero-Knowledge Verified</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--success-text)' }}>
            {applications.filter(a => a.verification_status === 'eligible').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        paddingBottom: '12px',
      }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'applications' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'applications' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          Applications Inbox ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'properties' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'properties' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          My Listed Properties ({properties.length})
        </button>
      </div>

      {activeTab === 'applications' ? (
        /* Applications Table */
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ fontSize: '1.1rem' }}>Applicant Verification Records</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <EyeOff size={14} /> Zero Private Income Values Stored or Disclosed
            </span>
          </div>

          {applications.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tenant applications submitted yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '16px 24px' }}>Tenant</th>
                    <th style={{ padding: '16px 24px' }}>Applied Property</th>
                    <th style={{ padding: '16px 24px' }}>Required Threshold</th>
                    <th style={{ padding: '16px 24px' }}>Midnight ZK Status</th>
                    <th style={{ padding: '16px 24px' }}>Application Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ fontWeight: 600 }}>{app.tenant_name || `Tenant #${app.tenant_id}`}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.tenant_email}</div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ fontWeight: 600 }}>{app.property_title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.property_location}</div>
                      </td>
                      <td style={{ padding: '18px 24px', fontWeight: 600, color: 'var(--midnight-accent)' }}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(app.income_threshold)}/mo
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        {app.verification_status === 'eligible' ? (
                          <div>
                            <span className="badge-pill badge-eligible">
                              <CheckCircle2 size={12} /> Eligible ✓
                            </span>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              Midnight Verified
                            </div>
                          </div>
                        ) : (
                          <span className="badge-pill badge-unverified">
                            {app.verification_status}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <span className={`badge-pill ${app.status === 'approved' ? 'badge-eligible' : (app.status === 'rejected' ? 'badge-ineligible' : 'badge-unverified')}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => onUpdateStatus(app.id, 'approved')}
                            disabled={app.status === 'approved'}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              background: app.status === 'approved' ? 'var(--bg-tertiary)' : 'var(--success-bg)',
                              color: 'var(--success-text)',
                              border: '1px solid var(--success-border)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => onUpdateStatus(app.id, 'rejected')}
                            disabled={app.status === 'rejected'}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              background: app.status === 'rejected' ? 'var(--bg-tertiary)' : 'var(--danger-bg)',
                              color: 'var(--danger-text)',
                              border: '1px solid var(--danger-border)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Listed Properties Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {properties.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-pill badge-midnight">ID #{p.id}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.total_applications || 0} Applications</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{p.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>{p.location}</p>
              
              <div style={{
                background: 'var(--bg-primary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>RENT</span>
                  <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.monthly_rent)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>THRESHOLD</span>
                  <strong style={{ color: 'var(--midnight-accent)' }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.income_threshold)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
