import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, ShieldCheck, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function TenantDashboard({ properties, applications, onApply, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-applications'

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myApplications = applications.filter(a => a.tenant_id === currentUser.id);

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
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
            <ShieldCheck size={14} /> Tenant Portal
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Explore Verified Rental Homes</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Apply with cryptographic income eligibility proofs without giving away your financial identity.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          display: 'flex',
          gap: '4px',
        }}>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'browse' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'browse' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Available Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'my-applications' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'my-applications' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            My Applications ({myApplications.length})
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Search bar */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '32px',
          }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by city, neighborhood, or property title (e.g. Bangalore, Penthouse)..."
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No rental properties match your search.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '28px',
            }}>
              {filteredProperties.map(property => {
                const applied = myApplications.some(a => a.property_id === property.id);
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onApply={onApply}
                    hasApplied={applied}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`badge-pill ${app.verification_status === 'eligible' ? 'badge-eligible' : 'badge-unverified'}`}>
                        {app.verification_status === 'eligible' ? 'Eligible ✓ (ZK Verified)' : app.verification_status}
                      </span>
                      <span className={`badge-pill ${app.status === 'approved' ? 'badge-eligible' : (app.status === 'rejected' ? 'badge-ineligible' : 'badge-unverified')}`}>
                        Landlord Status: {app.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{app.property_title || `Property #${app.property_id}`}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                      {app.zk_tx_hash && <span>Midnight Tx: {app.zk_tx_hash.slice(0, 14)}...</span>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Privacy Guarantee</div>
                    <div style={{ color: 'var(--success-text)', fontSize: '0.85rem', fontWeight: 600 }}>
                      🔒 Zero financial figures exposed
                    </div>
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
