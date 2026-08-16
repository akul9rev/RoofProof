import React, { useState } from 'react';
import { Building2, Plus, ShieldCheck, Check, X, EyeOff, CheckCircle2, AlertCircle, MessageSquare, FileText, Lock, Award, ExternalLink } from 'lucide-react';
import { MIDNIGHT_CONTRACT_INFO } from '../services/zkProofService';

export default function LandlordDashboard({ properties, applications, onOpenCreateModal, onUpdateStatus, currentUser }) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'properties'
  const [rejectingApp, setRejectingApp] = useState(null); // Application object being rejected
  const [inspectingApp, setInspectingApp] = useState(null); // Application object being inspected for ZK proof
  const [rejectionReason, setRejectionReason] = useState('Property already leased to an earlier applicant.');
  const [customReason, setCustomReason] = useState('');

  const handleConfirmReject = () => {
    if (!rejectingApp) return;
    const finalReason = customReason.trim() || rejectionReason;
    onUpdateStatus(rejectingApp.id, 'rejected', finalReason);
    setRejectingApp(null);
    setCustomReason('');
  };

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

      {/* Stats Row */}
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
            color: activeTab === 'applications' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
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
            color: activeTab === 'properties' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          My Listed Properties ({properties.length})
        </button>
      </div>

      {/* Inspection Modal: Zero-Knowledge Verification Certificate */}
      {inspectingApp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div className="glass-card" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '32px',
            border: '1px solid var(--border-glow)',
            background: 'var(--bg-secondary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShieldCheck size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Zero-Knowledge Proof Certificate</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Application #{inspectingApp.id} • Verified via Midnight Compact</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingApp(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <CheckCircle2 size={36} color="var(--success-text)" style={{ margin: '0 auto 8px' }} />
              <h4 style={{ color: 'var(--success-text)', fontSize: '1.15rem', marginBottom: '4px' }}>Mathematical Eligibility Verified ✓</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                The tenant has mathematically proven: <code>income &ge; {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inspectingApp.income_threshold)}</code>
              </p>
            </div>

            {/* Evidence Breakdown */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Applicant:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{inspectingApp.tenant_name} ({inspectingApp.tenant_email})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Target Listing:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{inspectingApp.property_title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Required Threshold:</span>
                <strong style={{ color: 'var(--midnight-accent)' }}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inspectingApp.income_threshold)}/mo
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Actual Tenant Income:</span>
                <strong style={{ color: 'var(--success-text)', fontWeight: 800 }}>NEVER DISCLOSED (0 Bytes Stored)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Compact ZK Circuit:</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>verifyEligibility</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Deployed Contract (Midnight Preview):</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {MIDNIGHT_CONTRACT_INFO.contractAddress}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Verified On-Chain Tx Hash:</span>
                <span style={{ color: 'var(--midnight-accent)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {MIDNIGHT_CONTRACT_INFO.verifiedTxHash}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setInspectingApp(null)}
                style={{ padding: '8px 24px' }}
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingApp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div className="glass-card" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '32px',
            border: '1px solid var(--danger-border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} /> Deny Application #{rejectingApp.id}
              </h3>
              <button
                onClick={() => setRejectingApp(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Provide a reason for denying <strong>{rejectingApp.tenant_name || `Tenant #${rejectingApp.tenant_id}`}</strong> for <strong>{rejectingApp.property_title}</strong>. This description will be shown on the tenant's portal so they can understand and re-apply if appropriate.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                SELECT QUICK REASON:
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}
              >
                <option value="Property already leased to an earlier applicant.">Property already leased to an earlier applicant.</option>
                <option value="Move-in timeline or preferred lease duration mismatch.">Move-in timeline or preferred lease duration mismatch.</option>
                <option value="Occupancy criteria or pet policy mismatch for this unit.">Occupancy criteria or pet policy mismatch for this unit.</option>
                <option value="Property undergoing maintenance/renovation; temporarily unlisted.">Property undergoing maintenance/renovation; temporarily unlisted.</option>
              </select>

              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                OR CUSTOM EXPLANATION (OPTIONAL):
              </label>
              <textarea
                placeholder="Type custom explanation to the applicant..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setRejectingApp(null)}
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                style={{
                  padding: '8px 20px',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger-text)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Confirm Denial & Send Reason
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' ? (
        /* Applications Table */
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Applicant Verification Records
                <span className="badge-pill badge-midnight" style={{ fontSize: '0.7rem' }}>
                  Contract: 94010caedf80...
                </span>
              </h3>
            </div>
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
                            <button
                              onClick={() => setInspectingApp(app)}
                              className="badge-pill badge-eligible"
                              style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <CheckCircle2 size={12} /> Eligible ✓ (Inspect Proof)
                            </button>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              Midnight Compact Verified
                            </div>
                          </div>
                        ) : (
                          <span className="badge-pill badge-unverified">
                            {app.verification_status}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        {app.status === 'rejected' ? (
                          <div>
                            <span className="badge-pill badge-ineligible">
                              Owner Denied
                            </span>
                            {app.rejection_reason && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '200px' }}>
                                Note: {app.rejection_reason.slice(0, 40)}...
                              </div>
                            )}
                          </div>
                        ) : app.status === 'approved' ? (
                          <span className="badge-pill badge-eligible">
                            Approved
                          </span>
                        ) : (
                          <span className="badge-pill badge-unverified">
                            Pending Review
                          </span>
                        )}
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
                              cursor: app.status === 'approved' ? 'default' : 'pointer',
                              opacity: app.status === 'approved' ? 0.6 : 1,
                            }}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => setRejectingApp(app)}
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
                              cursor: app.status === 'rejected' ? 'default' : 'pointer',
                              opacity: app.status === 'rejected' ? 0.6 : 1,
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
