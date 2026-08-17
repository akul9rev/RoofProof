import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, ShieldCheck, Sparkles, AlertCircle, XCircle, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TenantDashboard({ properties = [], applications = [], onApply, onWithdraw, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-applications'
  const [viewingDenialApp, setViewingDenialApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const myApplications = applications.filter(a => a.tenant_id === currentUser.id);

  // 20 Diverse India-Specific Properties across various budgets and home types
  const defaultProperties = [
    {
      id: 1,
      title: 'Himalayan Pine Wooden Villa',
      location: 'Manali, Himachal Pradesh',
      monthly_rent: 45000,
      income_threshold: 135000,
      description: 'Cozy 2 BHK pine wood villa with mountain view balcony, fireplace, and private apple orchard yard.',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Cozy 1 BHK Bachelor Pad',
      location: 'Koramangala, Bangalore',
      monthly_rent: 18000,
      income_threshold: 54000,
      description: 'Compact fully-furnished 1 BHK apartment close to tech parks with high-speed fiber internet and power backup.',
      image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Seaside Portuguese Villa',
      location: 'Anjuna, Goa',
      monthly_rent: 65000,
      income_threshold: 195000,
      description: 'Vibrant restored Portuguese bungalow with high ceilings, private swimming pool, and 5-min walk to beach.',
      image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'Comfortable 2 BHK Family Home',
      location: 'Viman Nagar, Pune',
      monthly_rent: 25000,
      income_threshold: 75000,
      description: 'Spacious 2 BHK family flat in gated society with children play park, gym, covered parking, and 24/7 security.',
      image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      title: 'Modern Techie Studio Room',
      location: 'HSR Layout, Bangalore',
      monthly_rent: 15000,
      income_threshold: 45000,
      description: 'Sleek budget studio room with kitchenette, balcony, and walking distance to cafes and workspace hubs.',
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      title: 'Traditional Kerala Courtyard House',
      location: 'Wayanad, Kerala',
      monthly_rent: 35000,
      income_threshold: 105000,
      description: 'Authentic Nalukettu style 3 BHK home surrounded by tea plantations and peaceful green valleys.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 7,
      title: '3 BHK High-Rise Family Apartment',
      location: 'Andheri West, Mumbai',
      monthly_rent: 70000,
      income_threshold: 210000,
      description: 'Bright 3 BHK apartment on the 18th floor with city skyline views, sea breeze, and modern modular kitchen.',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 8,
      title: 'Independent Garden Bungalow',
      location: 'Banjara Hills, Hyderabad',
      monthly_rent: 55000,
      income_threshold: 165000,
      description: 'Charming 3 BHK independent bungalow featuring private lawn, verandah, servant quarter, and solar heating.',
      image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 9,
      title: 'Compact 1 RK Student Studio',
      location: 'North Campus, Delhi',
      monthly_rent: 12000,
      income_threshold: 36000,
      description: 'Affordable 1 Room-Kitchen studio unit near Delhi University, fully air-conditioned with study desk.',
      image_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 10,
      title: 'Heritage Lake View House',
      location: 'Udaipur, Rajasthan',
      monthly_rent: 40000,
      income_threshold: 120000,
      description: 'Traditional Rajasthani stone home with Jharokha windows overlooking Lake Pichola.',
      image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 11,
      title: '2 BHK Gated Society Flat',
      location: 'Noida Sector 62, Uttar Pradesh',
      monthly_rent: 22000,
      income_threshold: 66000,
      description: 'Well-ventilated 2 BHK flat near metro station with clubhouse access, swimming pool, and grocery store inside.',
      image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 12,
      title: 'Luxury Glass Penthouse',
      location: 'Golf Course Road, Gurugram',
      monthly_rent: 110000,
      income_threshold: 330000,
      description: '4 BHK luxury duplex penthouse with floor-to-ceiling glass windows and private rooftop terrace garden.',
      image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 13,
      title: 'Quiet Hilltop Cottage',
      location: 'Kodaikanal, Tamil Nadu',
      monthly_rent: 30000,
      income_threshold: 90000,
      description: 'Serene 2 BHK stone cottage surrounded by eucalyptus trees with cozy fireplace and private driveway.',
      image_url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 14,
      title: '1 BHK Working Professional Flat',
      location: 'Gachibowli, Hyderabad',
      monthly_rent: 20000,
      income_threshold: 60000,
      description: 'Furnished 1 BHK apartment close to IT hubs, with modern kitchen fittings, gym, and 24-hr water supply.',
      image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 15,
      title: 'Colonial Style Villa',
      location: 'Whitefield, Bangalore',
      monthly_rent: 60000,
      income_threshold: 180000,
      description: 'Spacious colonial style 3 BHK villa with wooden flooring, large backyard lawn, and garage space.',
      image_url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 16,
      title: 'Compact 2 BHK Apartment',
      location: 'Salt Lake City, Kolkata',
      monthly_rent: 19000,
      income_threshold: 57000,
      description: 'Charming 2 BHK flat near IT park, quiet green neighborhood with dual balconies.',
      image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 17,
      title: 'Beachside Studio Room',
      location: 'ECR Chennai, Tamil Nadu',
      monthly_rent: 24000,
      income_threshold: 72000,
      description: 'Cozy beachside studio apartment with sea views, rooftop access, and 24/7 security guard.',
      image_url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 18,
      title: 'Spacious 3 BHK Duplex House',
      location: 'C-Scheme, Jaipur',
      monthly_rent: 38000,
      income_threshold: 114000,
      description: 'Elegant 3 BHK duplex home with traditional pink-city stonework and terrace garden.',
      image_url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 19,
      title: 'Budget 1 BHK Bachelor Flat',
      location: 'Kalyani Nagar, Pune',
      monthly_rent: 16000,
      income_threshold: 48000,
      description: 'Clean 1 BHK apartment for bachelors or young couples near software parks and dining spots.',
      image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 20,
      title: 'Luxury Lake View Villa',
      location: 'Lavasa, Maharashtra',
      monthly_rent: 50000,
      income_threshold: 150000,
      description: 'Picturesque 3 BHK waterfront villa with private garden, barbecue pit, and lake panorama.',
      image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const catalogue = properties.length >= 20 ? properties : defaultProperties;

  const filteredProperties = catalogue.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            Logged in as <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Rahul Sharma'}</strong> • 20 curated homes (bachelor rooms, flats, cottages & villas).
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
                placeholder="Search bachelor rooms, 2 BHK, villa, Manali, Mumbai..."
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
                style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'totalPages' : 'pointer' }}
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
