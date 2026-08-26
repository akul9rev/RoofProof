import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, MapPin, ShieldCheck, Home, CheckCircle2,
  ChevronLeft, ChevronRight, Maximize2, Sparkles, Check,
  Camera, Eye, Lock, ArrowRight, Bath, Bed, Square, Layers, Car, Users
} from 'lucide-react';

const DEFAULT_GALLERIES = {
  1: [
    { label: 'Villa Exterior & Mountain View', url: '/houses/house1.jpg' },
    { label: 'Spacious Living Room', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Master Bedroom Suite', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modular Kitchen & Dining', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Luxury Ensuite Washroom', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80' },
  ],
  2: [
    { label: 'Heritage Residence Exterior', url: '/houses/house2.jpg' },
    { label: 'Royal Courtyard & Living', url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Traditional Master Bedroom', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Stone & Marble Washroom', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80' },
  ],
  3: [
    { label: 'Garden Bungalow Exterior', url: '/houses/house3.jpg' },
    { label: 'Warm Wooden Living with Fireplace', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Botanical Garden Bedroom', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modern Cottage Washroom', url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80' },
  ],
  4: [
    { label: 'Family Home Exterior', url: '/houses/house4.jpg' },
    { label: 'Bright Sunlit Living Room', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Contemporary Kitchen & Island', url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Balcony Facing Master Bedroom', url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modern Ceramic Washroom', url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80' },
  ],
  5: [
    { label: 'Palace Residence Facade', url: '/houses/house5.jpg' },
    { label: 'Ornate Grand Living Room', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Palatial Master Suite', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Italian Marble Luxury Washroom', url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1200&q=80' },
  ],
  6: [
    { label: 'Glassfront Villa Exterior', url: '/houses/house6.jpg' },
    { label: 'Open-Concept Glass Living Area', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Designer Minimalist Kitchen', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Glass Enclosed Shower Washroom', url: 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&w=1200&q=80' },
  ],
};

export default function PropertyDetailModal({
  property,
  onClose,
  onApply,
  hasApplied,
  isDenied,
  application,
  userRole,
  onWithdraw,
}) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!property) return null;

  const propId = Number(property.id) || 1;

  // Robust parsing for gallery (handles arrays, JSON strings, or single cover)
  let parsedGallery = [];
  if (Array.isArray(property.gallery)) {
    parsedGallery = property.gallery;
  } else if (typeof property.gallery === 'string' && property.gallery.trim().startsWith('[')) {
    try {
      parsedGallery = JSON.parse(property.gallery);
    } catch (e) {}
  }

  let photos = [];
  if (parsedGallery && parsedGallery.length > 0) {
    // Landlord uploaded custom photos -> Use ONLY these uploaded photos!
    photos = parsedGallery;
  } else if (property.image_url && typeof property.image_url === 'string' && property.image_url.trim().length > 5) {
    // Single cover image uploaded
    photos = [{ label: 'Main Property Cover', url: property.image_url }];
  } else if (DEFAULT_GALLERIES[property.id]) {
    // Fallback ONLY for the initial 6 pre-seeded demo houses
    photos = DEFAULT_GALLERIES[property.id];
  } else {
    photos = [{ label: 'No Cover Photo Uploaded', url: '' }];
  }

  const currentPhoto = photos[activePhotoIdx] || photos[0];

  const formatListingDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return `Listed ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } catch {
      return '';
    }
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.monthly_rent);

  const formattedThreshold = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.income_threshold);

  const annualRent = Number(property.monthly_rent || 0) * 12;
  const annualDiscounted = Math.round(annualRent * 0.9);

  // Specs
  const bedrooms = property.bedrooms || (property.property_type?.includes('Villa') ? '3 BHK' : '2 BHK');
  const bathrooms = property.bathrooms || (bedrooms.includes('3') ? '3 Bathrooms' : '2 Bathrooms');
  const furnishing = property.furnishing || 'Fully Furnished';
  const areaSqft = property.area_sqft || (bedrooms.includes('3') ? '2,150 sq.ft' : '1,450 sq.ft');
  const parking = property.parking || 'Covered Parking (1 Car + 2 Bikes)';
  const deposit = property.deposit || `₹${(Number(property.monthly_rent || 50000) * 2).toLocaleString('en-IN')}`;
  const preferredTenants = property.preferred_tenants || 'Families & Working Professionals';
  const availableFrom = property.available_from || 'Immediate Move-in';

  const defaultAmenities = [
    'Private Balcony with Views',
    'Modular Kitchen & Chimney',
    '24/7 Power Backup',
    '24/7 Security & CCTV',
    'High-Speed Fiber Ready',
    'Gated Community',
    'Dedicated Water Supply',
    'Visitor Parking',
  ];

  const amenities = Array.isArray(property.amenities) && property.amenities.length > 0
    ? property.amenities
    : defaultAmenities;

  const isApprovedStatus = application?.status === 'approved';
  const isRejectedStatus = application?.status === 'rejected' || isDenied;
  const isPendingStatus = application?.status === 'pending' || (hasApplied && !isApprovedStatus && !isRejectedStatus);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-surface animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '100%',
          padding: '0',
          borderRadius: '26px',
          overflow: 'hidden',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(175deg, #0e1722 0%, #080d14 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.75)',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 30,
            background: 'rgba(12, 18, 25, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          <X size={18} />
        </button>

        {/* Scrollable Content */}
        <div style={{ overflowY: 'auto', maxHeight: '94vh', padding: '0 0 28px' }}>
          {/* Large Hero Image Stage (380px Height with Gallery Controls) */}
          <div style={{
            height: '380px',
            width: '100%',
            position: 'relative',
            background: '#060a0f',
            overflow: 'hidden',
          }}>
            <img
              src={currentPhoto.url}
              alt={currentPhoto.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.3s ease',
              }}
              onError={(e) => {
                e.target.src = '/houses/house1.jpg';
              }}
            />

            {/* Gradient Overlays */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(12, 18, 25, 0.3) 0%, rgba(12, 18, 25, 0.05) 50%, rgba(12, 18, 25, 0.92) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Top Badges */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              zIndex: 10,
            }}>
              <span style={{
                background: 'rgba(12, 18, 25, 0.88)',
                backdropFilter: 'blur(10px)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                color: '#EBA834',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(235, 168, 52, 0.4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}>
                <ShieldCheck size={14} /> Midnight ZK Verified
              </span>
              <span style={{
                background: 'rgba(74, 124, 89, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                color: '#ffffff',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Home size={14} /> {bedrooms} • {property.property_type || 'Residence'}
              </span>
            </div>

            {/* Gallery Left & Right Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '14px',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    background: 'rgba(12, 18, 25, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                  title="Previous Photo"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={handleNextPhoto}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '14px',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    background: 'rgba(12, 18, 25, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                  title="Next Photo"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Active Photo Label & Counter Badge */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '24px',
              right: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              zIndex: 10,
            }}>
              <div>
                <span style={{
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <Camera size={13} color="#EBA834" /> {currentPhoto.label}
                </span>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.2,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                }}>
                  {property.title}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.88rem',
                  marginTop: '4px',
                  textShadow: '0 1px 6px rgba(0, 0, 0, 0.9)',
                }}>
                  <MapPin size={15} color="#4A7C59" />
                  <span>{property.location}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span style={{ color: '#EBA834', fontWeight: 600 }}>Listed by {property.landlord_name || 'Property Owner'}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>📅 {formatListingDate(property.created_at)}</span>
                </div>
              </div>

              {/* Photo Counter Pill */}
              <div style={{
                background: 'rgba(12, 18, 25, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.74rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                {activePhotoIdx + 1} / {photos.length} Photos
              </div>
            </div>
          </div>

          {/* Interactive Photo Thumbnail Strip */}
          {photos.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 28px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}>
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  style={{
                    flexShrink: 0,
                    width: '84px',
                    height: '56px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: idx === activePhotoIdx ? '2px solid #EBA834' : '1px solid rgba(255, 255, 255, 0.15)',
                    opacity: idx === activePhotoIdx ? 1 : 0.6,
                    cursor: 'pointer',
                    padding: 0,
                    background: '#000',
                    transition: 'all 0.2s ease',
                    boxShadow: idx === activePhotoIdx ? '0 0 12px rgba(235, 168, 52, 0.4)' : 'none',
                    position: 'relative',
                  }}
                  title={p.label}
                >
                  <img
                    src={p.url}
                    alt={p.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/houses/house1.jpg'; }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '2px',
                    right: '2px',
                    background: 'rgba(0,0,0,0.7)',
                    fontSize: '0.55rem',
                    color: '#fff',
                    textAlign: 'center',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '1px 2px',
                  }}>
                    {p.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: '24px 28px 0' }}>
            {/* Rent & Threshold Financial Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '16px 20px',
              marginBottom: '22px',
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Monthly Rent
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {formattedRent}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)' }}>/ month</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Min. Income Req.
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#4ade80', marginTop: '2px' }}>
                  {formattedThreshold}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6B9B76', fontWeight: 600 }}>Zero-Knowledge Verified</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Annual Advance
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#EBA834', marginTop: '2px' }}>
                  ₹{annualDiscounted.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(235, 168, 52, 0.8)' }}>10% annual discount</div>
              </div>
            </div>

            {/* Quick Specs 4x2 Grid */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 700,
                marginBottom: '12px',
              }}>
                Property Specifications
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Configuration</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{bedrooms}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Washrooms / Baths</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{bathrooms}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Furnishing Status</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{furnishing}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Super Area</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{areaSqft}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Parking</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{parking}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Security Deposit</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{deposit}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Preferred Tenant</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{preferredTenants}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Available From</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{availableFrom}</div>
                </div>
              </div>
            </div>

            {/* Description & Overview */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 700,
                marginBottom: '8px',
              }}>
                Property Overview
              </h4>
              <p style={{
                fontSize: '0.92rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Cloud */}
            <div style={{ marginBottom: '26px' }}>
              <h4 style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 700,
                marginBottom: '10px',
              }}>
                Amenities & Features
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(74, 124, 89, 0.14)',
                      border: '1px solid rgba(74, 124, 89, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Check size={13} color="#22c55e" /> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar at Bottom */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>

              {userRole === 'landlord' ? (
                <div style={{ fontSize: '0.84rem', color: '#6B9B76', fontWeight: 700 }}>
                  Active Listing in Your Portfolio
                </div>
              ) : isApprovedStatus ? (
                <div style={{
                  padding: '12px 24px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                }}>
                  <CheckCircle2 size={16} color="#ffffff" /> Application Approved
                </div>
              ) : isPendingStatus ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (typeof onWithdraw === 'function') {
                        onWithdraw(application?.id || property.id, property.id);
                      }
                    }}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '999px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                    }}
                  >
                    Withdraw Application
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (typeof onApply === 'function') {
                      onApply(property);
                    }
                  }}
                  className="btn-white-pill"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  Apply with ZK Proof <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
