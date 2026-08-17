import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, Sparkles, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Exact User Dataset matched with authentic high-res Indian property photos
export const EXACT_USER_DATASET = [
  {
    id: 1,
    title: 'The Palm Court Residence',
    type: 'Family Apartment',
    location: 'Indiranagar, Bangalore',
    monthly_rent: 42000,
    income_threshold: 120000,
    description: 'Spacious 2 BHK in a quiet residential lane with balcony.',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Misty Peak Villa',
    type: 'Villa',
    location: 'Dehradun, Uttarakhand',
    monthly_rent: 55000,
    income_threshold: 165000,
    description: '3 BHK hillside villa with a private garden & valley view.',
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Urban Nest Studio',
    type: 'Bachelor House',
    location: 'Hinjewadi, Pune',
    monthly_rent: 18000,
    income_threshold: 55000,
    description: 'Compact furnished studio ideal for working professionals.',
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Amber Heights',
    type: 'Society Apartment',
    location: 'Noida Sector 137, UP',
    monthly_rent: 32000,
    income_threshold: 95000,
    description: 'Modern 2 BHK in a gated residential society.',
    image_url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Lakeview Family Home',
    type: 'Independent House',
    location: 'Bhopal, Madhya Pradesh',
    monthly_rent: 28000,
    income_threshold: 85000,
    description: 'Peaceful 3 BHK home near Upper Lake.',
    image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'The Heritage Bungalow',
    type: 'Bungalow',
    location: 'Alipore, Kolkata',
    monthly_rent: 85000,
    income_threshold: 255000,
    description: 'Spacious heritage-style bungalow with landscaped grounds.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    title: 'Coconut Grove Villa',
    type: 'Villa',
    location: 'Panaji, Goa',
    monthly_rent: 70000,
    income_threshold: 210000,
    description: 'Tropical 3 BHK villa with an open courtyard.',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Metroline Residency',
    type: 'Society Apartment',
    location: 'Andheri West, Mumbai',
    monthly_rent: 68000,
    income_threshold: 205000,
    description: 'Well-connected 2 BHK close to metro and commercial hubs.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    title: 'Aravali Garden House',
    type: 'Family House',
    location: 'Gurugram, Haryana',
    monthly_rent: 48000,
    income_threshold: 145000,
    description: 'Comfortable 3 BHK independent home in a residential area.',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    title: 'Snowline Retreat',
    type: 'Luxury Villa',
    location: 'Manali, Himachal Pradesh',
    monthly_rent: 75000,
    income_threshold: 225000,
    description: 'Mountain-facing 3 BHK villa designed for long stays.',
    image_url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 11,
    title: 'Pearl Residency',
    type: 'Family Apartment',
    location: 'Kochi, Kerala',
    monthly_rent: 30000,
    income_threshold: 90000,
    description: 'Bright 2 BHK apartment in a secure community.',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 12,
    title: 'Old City Courtyard Home',
    type: 'Independent House',
    location: 'Jaipur, Rajasthan',
    monthly_rent: 38000,
    income_threshold: 115000,
    description: 'Traditional 3 BHK home with a private courtyard.',
    image_url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 13,
    title: 'TechPark Bachelor Loft',
    type: 'Bachelor House',
    location: 'Whitefield, Bangalore',
    monthly_rent: 24000,
    income_threshold: 72000,
    description: 'Furnished 1 BHK designed for young professionals.',
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 14,
    title: 'Riverfront Heights',
    type: 'Society Apartment',
    location: 'Ahmedabad, Gujarat',
    monthly_rent: 35000,
    income_threshold: 105000,
    description: 'Modern 2 BHK apartment overlooking the Sabarmati Riverfront.',
    image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 15,
    title: 'Green Valley Bungalow',
    type: 'Bungalow',
    location: 'Chandigarh',
    monthly_rent: 62000,
    income_threshold: 185000,
    description: 'Spacious 4 BHK bungalow with a private lawn.',
    image_url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 16,
    title: 'Coral Bay Residence',
    type: 'Family Apartment',
    location: 'Chennai, Tamil Nadu',
    monthly_rent: 36000,
    income_threshold: 108000,
    description: 'Airy 2 BHK apartment in a family-friendly neighborhood.',
    image_url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 17,
    title: 'Hawa Mahal Residency',
    type: 'Heritage Apartment',
    location: 'Jaipur, Rajasthan',
    monthly_rent: 29000,
    income_threshold: 87000,
    description: 'Renovated 2 BHK combining traditional architecture with modern interiors.',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 18,
    title: 'Narmada View House',
    type: 'Family House',
    location: 'Indore, Madhya Pradesh',
    monthly_rent: 26000,
    income_threshold: 78000,
    description: 'Practical 3 BHK home suited for a small family.',
    image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  },
];

export default function TenantDashboard({ properties = [], applications = [], onApply, onWithdraw, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-applications'
  const [viewingDenialApp, setViewingDenialApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const myApplications = applications.filter(a => a.tenant_id === currentUser.id);

  // Always use exact user-provided dataset (18 properties)
  const catalogue = EXACT_USER_DATASET;

  const filteredProperties = catalogue.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = !maxRent || Number(p.monthly_rent) <= Number(maxRent);
    return matchesSearch && matchesRent;
  });

  // Calculate pagination: 8 items per page
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) || 1;
  const currentListings = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <h2 style={{ fontSize: '2.4rem', fontWeight: 600, color: '#ffffff' }}>Browse & Verify Rental Homes</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.92rem', marginTop: '4px' }}>
            Logged in as <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Rahul Sharma'}</strong> • 18 verified Indian homes.
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
            Available Homes ({filteredProperties.length})
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
                placeholder="Search Palm Court, Dehradun, Pune, Bungalow, Mumbai..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setMaxRent(e.target.value);
                  setCurrentPage(1);
                }}
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

          {/* Properties Grid with Max 8 Items Per Page */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}>
            {currentListings.map(property => {
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

          {/* Clean Pagination Bar (8 items per page) */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '16px',
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-white-pill"
                style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-white-pill"
                style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
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
                const targetProp = catalogue.find(p => p.id === app.property_id) || {
                  id: app.property_id,
                  title: app.property_title || `Property Listing #${app.property_id}`,
                  location: app.property_location || 'Prime Location',
                  monthly_rent: app.monthly_rent || 42000,
                  income_threshold: app.income_threshold || 120000,
                  description: 'Zero-Knowledge Verified Application active on Midnight Network.',
                  image_url: app.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
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
