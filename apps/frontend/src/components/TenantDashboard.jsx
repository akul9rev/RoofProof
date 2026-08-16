import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, ShieldCheck, Sparkles, AlertCircle, CheckCircle2, Info, X, MapPin } from 'lucide-react';

export default function TenantDashboard({ properties = [], applications = [], onApply, onWithdraw, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-applications'
  const [viewingDenialApp, setViewingDenialApp] = useState(null);

  const myApplications = applications.filter(a => a.tenant_id === currentUser.id);

  // Unsplash fallback properties if database is empty
  const defaultProperties = [
    {
      id: 1,
      title: 'Evergreen Pine Luxury Villa',
      location: 'Manali, Himachal Pradesh',
      monthly_rent: 75000,
      income_threshold: 225000,
      description: 'Handpicked 3 BHK luxury wooden sanctuary surrounded by pine tree forests with private balcony and heated floors.',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Skyline Glass Penthouse',
      location: 'Gurugram, Haryana',
      monthly_rent: 120000,
      income_threshold: 360000,
      description: 'Ultra-modern 4 BHK duplex penthouse with 360-degree glass wrap-around views and private infinity plunge pool.',
      image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Modern Serenity Studio',
      location: 'Bangalore, Karnataka',
      monthly_rent: 45000,
      income_threshold: 135000,
      description: 'Sleek eco-friendly studio apartment in Indiranagar featuring smart home controls and private garden patio.',
      image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const displayProperties = properties.length > 0 ? properties : defaultProperties;

  const filteredProperties = displayProperties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = !maxRent || Number(p.monthly_rent) <= Number(maxRent);
    return matchesSearch && matchesRent;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0 60px', width: '100%' }}>
      {/* Denial Reason Popup Modal */}
      {viewingDenialApp && (
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
        }} onClick={() => setViewingDenialApp(null)}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '30px',
            borderRadius: '24px',
            background: 'rgba(14, 22, 31, 0.94)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} /> Application Status Note
              </h3>
              <button
                onClick={() => setViewingDenialApp(null)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '14px 16px',
              borderRadius: '14px',
              marginBottom: '16px',
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff', marginBottom: '4px' }}>
                {viewingDenialApp.property_title || `Property #${viewingDenialApp.property_id}`}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                {viewingDenialApp.property_location}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '14px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Owner's Feedback:
              </div>
              <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {viewingDenialApp.rejection_reason || 'Property requirements or preferred applicant criteria were not met for this listing.'}
              </p>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '20px' }}>
              🔒 <em>Your private financial details were <strong>never shared</strong> and remain fully Zero-Knowledge protected on Midnight.</em>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-white-pill" onClick={() => setViewingDenialApp(null)} style={{ padding: '8px 20px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(235, 168, 52, 0.1)',
            border: '1px solid rgba(235, 168, 52, 0.25)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '12px',
            fontSize: '0.78rem',
            color: '#EBA834',
            fontWeight: 600,
          }}>
            <Sparkles size={13} /> Tenant Privacy Portal
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 600, color: '#ffffff' }}>Browse & Verify Luxury Rentals</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.92rem', marginTop: '4px' }}>
            Logged in as <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Rahul Sharma'}</strong> • Zero financial statements required.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '4px',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: activeTab === 'browse' ? '#ffffff' : 'transparent',
              color: activeTab === 'browse' ? '#0c141d' : '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Available Homes ({displayProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: activeTab === 'my-applications' ? '#ffffff' : 'transparent',
              color: activeTab === 'my-applications' ? '#0c141d' : '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            My Applications ({myApplications.length})
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-card" style={{
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
            borderRadius: '20px',
            background: 'rgba(12, 18, 25, 0.75)',
          }}>
            <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Search size={16} color="rgba(255,255,255,0.5)" />
              <input
                type="text"
                placeholder="Search location, title, or amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100%',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div style={{ flex: '0 1 200px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Filter size={16} color="rgba(255,255,255,0.5)" />
              <input
                type="number"
                placeholder="Max Rent (₹)"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100%',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          {/* Properties Grid with Unsplash Images */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
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
        </>
      ) : (
        /* My Applications Tab */
        <div>
          {myApplications.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.05rem', marginBottom: '20px' }}>
                You haven't submitted any Zero-Knowledge rental applications yet.
              </p>
              <button className="btn-white-pill" onClick={() => setActiveTab('browse')}>
                Browse Available Properties
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myApplications.map(app => (
                <div key={app.id} className="glass-card" style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: 'rgba(12, 18, 25, 0.82)',
                }}>
                  <div style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}>
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <ShieldCheck size={12} /> ZK Verified (Form 16)
                        </span>
                        {app.status === 'rejected' ? (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            Owner Denied
                          </span>
                        ) : app.status === 'approved' ? (
                          <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            Application Approved
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(235, 168, 52, 0.15)', color: '#EBA834', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            Pending Owner Review
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '4px' }}>{app.property_title || `Property #${app.property_id}`}</h3>
                      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.82rem' }}>
                        Submitted on {new Date(app.created_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2px' }}>Midnight Proof Status</div>
                      <div style={{ color: '#6B9B76', fontSize: '0.85rem', fontWeight: 600 }}>
                        🔒 Zero financial figures exposed
                      </div>
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
