import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, ShieldCheck, Sparkles, AlertCircle, RotateCcw, XCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function TenantDashboard({ properties, applications, onApply, onWithdraw, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-applications'
  const [viewingDenialApp, setViewingDenialApp] = useState(null); // Application object for denial popup

  const myApplications = applications.filter(a => a.tenant_id === currentUser.id);

  // Filter properties
  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = !maxRent || Number(p.monthly_rent) <= Number(maxRent);
    return matchesSearch && matchesRent;
  });

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Denial Reason Popup Modal */}
      {viewingDenialApp && (
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
            background: 'var(--bg-secondary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={22} /> Why Owner Denied Application
              </h3>
              <button
                onClick={() => setViewingDenialApp(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                {viewingDenialApp.property_title || `Property #${viewingDenialApp.property_id}`}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {viewingDenialApp.property_location}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--danger-text)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Owner's Explanation:
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {viewingDenialApp.rejection_reason || 'Property requirements or preferred applicant criteria were not met for this listing.'}
              </p>
            </div>

            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}>
              🔒 <em>Note: Your private financial details (salary, bank statements) were <strong>never shared</strong> with the owner and remain fully Zero-Knowledge protected.</em>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setViewingDenialApp(null)}
                style={{ padding: '8px 24px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge-pill badge-midnight" style={{ marginBottom: '8px' }}>
          <Sparkles size={14} /> RoofProof — "Proof before roof."
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Prove you're eligible. Don't prove your entire financial life.</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '6px' }}>
          Apply with zero-knowledge mathematical proofs. Prove your income meets the rent threshold without sharing your salary or bank statements.
        </p>

        {/* Traditional vs RoofProof Comparison Card */}
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            padding: '16px 20px',
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
          }}>
            <div style={{ color: 'var(--danger-text)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.78rem' }}>
              ❌ Traditional Rental Process
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Hand over bank statements, salary slips, tax forms, and transaction history &rarr; Landlord sees your entire private financial history.
            </div>
          </div>

          <div style={{
            padding: '16px 20px',
            background: 'rgba(34, 197, 94, 0.06)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
          }}>
            <div style={{ color: 'var(--success-text)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.78rem' }}>
              ✓ RoofProof Privacy-Preserving Process
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Evaluate local private witness &rarr; Midnight ZK Circuit &rarr; Landlord sees only: <strong style={{ color: 'var(--success-text)' }}>"Requirement satisfied ✓"</strong>.
            </div>
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
          onClick={() => setActiveTab('browse')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'browse' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'browse' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          Available Properties ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('my-applications')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'my-applications' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'my-applications' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          My Applications ({myApplications.length})
        </button>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-card" style={{
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by city, title, or amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  width: '100%',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ flex: '0 1 200px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              <Filter size={18} color="var(--text-muted)" />
              <input
                type="number"
                placeholder="Max Rent (₹)"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  width: '100%',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No rental properties found matching your criteria.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px',
            }}>
              {filteredProperties.map(property => {
                const app = myApplications.find(a => a.property_id === property.id);
                const hasApplied = app && (app.status === 'pending' || app.status === 'approved');
                const isDenied = app && app.status === 'rejected';

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onApply={onApply}
                    hasApplied={hasApplied}
                    isDenied={isDenied}
                    onViewDenial={() => setViewingDenialApp(app)}
                    onWithdraw={onWithdraw}
                    application={app}
                    userRole="tenant"
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Applications Tab */
        <div>
          {myApplications.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px' }}>
                You haven't submitted any rental applications yet.
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('browse')}>
                Browse Available Properties
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myApplications.map(app => (
                <div key={app.id} className="glass-card" style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className={`badge-pill ${app.verification_status === 'eligible' ? 'badge-eligible' : 'badge-unverified'}`}>
                          {app.verification_status === 'eligible' ? 'Eligible ✓ (ZK Verified)' : app.verification_status}
                        </span>
                        {app.status === 'rejected' ? (
                          <span className="badge-pill badge-ineligible" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                            <AlertCircle size={12} /> Owner Denied
                          </span>
                        ) : app.status === 'approved' ? (
                          <span className="badge-pill badge-eligible">
                            <CheckCircle2 size={12} /> Application Approved
                          </span>
                        ) : (
                          <span className="badge-pill badge-unverified">
                            Application Pending Review
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{app.property_title || `Property #${app.property_id}`}</h3>
                      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                        {app.zk_tx_hash && <span>Lace Sig: {app.zk_tx_hash.slice(0, 14)}...</span>}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Privacy Guarantee</div>
                      <div style={{ color: 'var(--success-text)', fontSize: '0.85rem', fontWeight: 600 }}>
                        🔒 Zero financial figures exposed
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Tenant */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Want to withdraw and re-apply with adjusted income?
                        </span>
                        <button
                          onClick={() => onWithdraw(app.id)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <XCircle size={15} /> Withdraw Application
                        </button>
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <button
                        onClick={() => setViewingDenialApp(app)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Info size={14} /> Why Owner Denied
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
