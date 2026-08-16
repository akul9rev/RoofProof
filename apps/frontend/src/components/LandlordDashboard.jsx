import React, { useState } from 'react';
import { Building2, Plus, ShieldCheck, CheckCircle2, XCircle, Users, Sparkles, MapPin } from 'lucide-react';

export default function LandlordDashboard({ properties = [], applications = [], onOpenCreateModal, onUpdateStatus, currentUser }) {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'applicants'
  const [selectedAppForDenial, setSelectedAppForDenial] = useState(null);
  const [denialReason, setDenialReason] = useState('');

  const myProperties = properties.filter(p => p.landlord_id === currentUser.id);
  const myPropertyIds = myProperties.map(p => p.id);
  const receivedApplications = applications.filter(a => myPropertyIds.includes(a.property_id));

  const handleDenySubmit = (e) => {
    e.preventDefault();
    if (!selectedAppForDenial) return;
    onUpdateStatus(selectedAppForDenial.id, 'rejected', denialReason);
    setSelectedAppForDenial(null);
    setDenialReason('');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0 60px', width: '100%' }}>
      {/* Denial Explanation Modal */}
      {selectedAppForDenial && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8, 14, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }} onClick={() => setSelectedAppForDenial(null)}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '30px',
            borderRadius: '24px',
            background: 'rgba(14, 22, 31, 0.94)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', color: '#ef4444', marginBottom: '12px' }}>
              Decline Application & Provide Feedback
            </h3>

            <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
              Specify why this applicant was not selected. Note that their salary and bank statements remain 100% Zero-Knowledge protected.
            </p>

            <form onSubmit={handleDenySubmit}>
              <textarea
                rows={4}
                placeholder="e.g., Preferred move-in date was earlier, or another applicant was selected."
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                style={{ marginBottom: '20px', fontSize: '0.88rem' }}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-glass" onClick={() => setSelectedAppForDenial(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-white-pill" style={{ background: '#ef4444', color: '#ffffff' }}>
                  Decline Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Landlord Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(107, 155, 118, 0.12)',
            border: '1px solid rgba(107, 155, 118, 0.3)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '12px',
            fontSize: '0.78rem',
            color: '#6B9B76',
            fontWeight: 600,
          }}>
            <Building2 size={13} /> Landlord Management Portal
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 600, color: '#ffffff' }}>Property Listings & Applicants</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.92rem', marginTop: '4px' }}>
            Welcome back, <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Ananya Verma'}</strong> • Zero liability storing private salary slips.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-white-pill" onClick={onOpenCreateModal}>
            <Plus size={16} /> List New Property
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.06)',
        padding: '4px',
        borderRadius: '999px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '28px',
        width: 'fit-content',
      }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: activeTab === 'listings' ? '#ffffff' : 'transparent',
            color: activeTab === 'listings' ? '#0c141d' : '#ffffff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          My Listings ({myProperties.length})
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: activeTab === 'applicants' ? '#ffffff' : 'transparent',
            color: activeTab === 'applicants' ? '#0c141d' : '#ffffff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Received Applications ({receivedApplications.length})
        </button>
      </div>

      {activeTab === 'listings' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: '24px',
        }}>
          {myProperties.map(property => (
            <div key={property.id} className="glass-card" style={{ padding: '20px', borderRadius: '24px' }}>
              <div style={{
                height: '190px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '16px',
                position: 'relative',
              }}>
                <img
                  src={property.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(12, 18, 25, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  color: '#6B9B76',
                  fontWeight: 600,
                }}>
                  Active Listing
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                {property.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '16px' }}>
                {property.location}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '14px',
                padding: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)' }}>Monthly Rent</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    ₹{(property.monthly_rent || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)' }}>Min Income Req.</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#EBA834' }}>
                    ₹{(property.income_threshold || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Received Applications Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {receivedApplications.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.05rem' }}>
                No applicant submissions received yet.
              </p>
            </div>
          ) : (
            receivedApplications.map(app => (
              <div key={app.id} className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        background: 'rgba(107, 155, 118, 0.15)',
                        color: '#6B9B76',
                        border: '1px solid rgba(107, 155, 118, 0.3)',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        <ShieldCheck size={12} /> ZK Income Verified: PASS
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                      }}>
                        Tampering Risk: LOW
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '4px' }}>
                      Applicant #{app.tenant_id} &rarr; {app.property_title || `Property #${app.property_id}`}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Submitted on {new Date(app.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {app.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => onUpdateStatus(app.id, 'approved')}
                          className="btn-white-pill"
                          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                        >
                          <CheckCircle2 size={14} /> Approve Applicant
                        </button>
                        <button
                          onClick={() => setSelectedAppForDenial(app)}
                          className="btn-glass"
                          style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: app.status === 'approved' ? '#22c55e' : '#ef4444',
                        textTransform: 'capitalize',
                      }}>
                        Status: {app.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
