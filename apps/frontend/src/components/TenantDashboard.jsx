import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, ShieldCheck, Sparkles, AlertCircle, XCircle, Info, X } from 'lucide-react';

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
    {
      id: 4,
      title: 'Heritage Courtyard Residence',
      location: 'Udaipur, Rajasthan',
      monthly_rent: 85000,
      income_threshold: 255000,
      description: 'Restored royal courtyard villa overlooking Lake Pichola with marble archways and private terrace.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const allAvailableProperties = properties.length > 0 ? properties : defaultProperties;
  // Reduce listing from 50 to max 8 listings
  const displayProperties = allAvailableProperties.slice(0, 8);

  const filteredProperties = displayProperties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = !maxRent || Number(p.monthly_rent) <= Number(maxRent);
    return matchesSearch && matchesRent;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0 50px', width: '100%' }}>
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
            background: '#ffffff',
            color: '#1a221b',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} /> Application Status Note
              </h3>
              <button
                onClick={() => setViewingDenialApp(null)}
                style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: '#F9F8F3',
              padding: '14px 16px',
              borderRadius: '14px',
              marginBottom: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a221b', marginBottom: '4px' }}>
                {viewingDenialApp.property_title || `Property #${viewingDenialApp.property_id}`}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#555' }}>
                {viewingDenialApp.property_location}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '14px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Owner's Feedback:
              </div>
              <p style={{ color: '#1a221b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {viewingDenialApp.rejection_reason || 'Property requirements or preferred applicant criteria were not met for this listing.'}
              </p>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '20px' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(107, 155, 118, 0.15)',
            border: '1px solid rgba(107, 155, 118, 0.35)',
            padding: '5px 14px',
            borderRadius: '999px',
            marginBottom: '12px',
            fontSize: '0.78rem',
            color: '#6B9B76',
            fontWeight: 700,
          }}>
            <Sparkles size={13} /> TENANT PRIVACY PORTAL
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 600, color: '#ffffff' }}>Browse & Verify Luxury Rentals</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.92rem', marginTop: '4px' }}>
            Logged in as <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Rahul Sharma'}</strong> • Showing up to 8 exclusive properties.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '4px',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              background: activeTab === 'browse' ? '#ffffff' : 'transparent',
              color: activeTab === 'browse' ? '#0c141d' : 'rgba(255, 255, 255, 0.75)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
            }}
          >
            Available Homes ({displayProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              background: activeTab === 'my-applications' ? '#ffffff' : 'transparent',
              color: activeTab === 'my-applications' ? '#0c141d' : 'rgba(255, 255, 255, 0.75)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
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
            padding: '14px 18px',
            marginBottom: '24px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
            borderRadius: '20px',
            background: 'rgba(12, 18, 25, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
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

          {/* Properties Grid with White Cards */}
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
        /* My Applications Tab showing Available Applied Properties */
        <div>
          {myApplications.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px', background: 'rgba(12, 18, 25, 0.85)' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '1.05rem', marginBottom: '20px' }}>
                You haven't submitted any Zero-Knowledge rental applications yet.
              </p>
              <button className="btn-white-pill" onClick={() => setActiveTab('browse')}>
                Browse Available Properties
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '24px',
            }}>
              {myApplications.map(app => {
                const targetProp = allAvailableProperties.find(p => p.id === app.property_id) || {
                  id: app.property_id,
                  title: app.property_title || `Property Listing #${app.property_id}`,
                  location: app.property_location || 'Prime Location',
                  monthly_rent: app.monthly_rent || 75000,
                  income_threshold: app.income_threshold || 225000,
                  description: 'Zero-Knowledge Verified Application active on Midnight Network.',
                  image_url: app.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
                };

                const isDenied = app.status === 'rejected';
                const hasApplied = app.status === 'pending' || app.status === 'approved';

                return (
                  <PropertyCard
                    key={app.id}
                    property={targetProp}
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
        </div>
      )}
    </div>
  );
}
