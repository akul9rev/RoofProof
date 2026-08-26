import React, { useState } from 'react';
import { MapPin, ShieldCheck, ArrowRight, AlertCircle, Info, XCircle, Trash2, User, CheckCircle2, Eye } from 'lucide-react';
import PropertyDetailModal from './PropertyDetailModal.jsx';

const HOUSE_IMAGES = [
  '/houses/house1.jpg',
  '/houses/house2.jpg',
  '/houses/house3.jpg',
  '/houses/house4.jpg',
  '/houses/house5.jpg',
  '/houses/house6.jpg',
];

export default function PropertyCard({
  property,
  onApply,
  onDelete,
  hasApplied,
  isDenied,
  onViewDenial,
  onWithdraw,
  application,
  userRole,
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  // Consistent fallback image
  const getImageUrl = (prop) => {
    if (prop.image_url && typeof prop.image_url === 'string' && prop.image_url.trim().length > 5) {
      if (
        prop.image_url.startsWith('http://') ||
        prop.image_url.startsWith('https://') ||
        prop.image_url.startsWith('data:image/') ||
        prop.image_url.startsWith('blob:') ||
        prop.image_url.startsWith('/houses/')
      ) {
        return prop.image_url;
      }
    }
    const idStr = String(prop.id || '1');
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash * 31 + idStr.charCodeAt(i)) & 0xffffffff;
    }
    const idx = Math.abs(hash) % HOUSE_IMAGES.length;
    return HOUSE_IMAGES[idx];
  };

  const imageUrl = getImageUrl(property);
  const landlordName = property.landlord_name || 'Property Owner';

  const isApprovedStatus = application?.status === 'approved';
  const isRejectedStatus = application?.status === 'rejected' || isDenied;
  const isPendingStatus = application?.status === 'pending' || (hasApplied && !isApprovedStatus && !isRejectedStatus);

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onApply === 'function') {
      onApply(property);
    }
  };

  const handleWithdrawClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const appId = application?.id || property.id;
    if (typeof onWithdraw === 'function') {
      onWithdraw(appId, property.id);
    }
  };

  const handleCardClick = () => {
    setIsDetailOpen(true);
  };

  return (
    <>
      <div
        className="white-property-card"
        onClick={handleCardClick}
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          cursor: 'pointer',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <div>
          {/* House Photo Header */}
          <div
            style={{
              height: '160px',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '12px',
              position: 'relative',
            }}
          >
            <img
              src={imageUrl}
              alt={property.title}
              onError={(e) => {
                const idStr = String(property.id || '1');
                let hash = 0;
                for (let i = 0; i < idStr.length; i++) {
                  hash = (hash * 31 + idStr.charCodeAt(i)) & 0xffffffff;
                }
                e.target.src = HOUSE_IMAGES[Math.abs(hash) % HOUSE_IMAGES.length];
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* ZK Badge */}
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(12, 18, 25, 0.88)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                color: '#EBA834',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid rgba(235, 168, 52, 0.35)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              <ShieldCheck size={13} /> ZK Eligible
            </span>

            {/* Quick View Details Badge */}
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                padding: '3px 9px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                color: '#0c141d',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <Eye size={11} /> Details
            </span>

            {/* Landlord Delete Button Overlay */}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete listing "${property.title}"?`)) {
                    onDelete(property.id);
                  }
                }}
                title="Delete Listing"
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Trash2 size={12} /> Delete
              </button>
            )}
          </div>

          <h3 style={{ fontSize: '1.15rem', marginBottom: '3px', lineHeight: 1.25, color: '#1a221b', fontWeight: 700 }}>
            {property.title}
          </h3>

          {/* Listed By Landlord Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555e56', fontSize: '0.78rem', marginBottom: '4px' }}>
            <User size={12} color="#4A7C59" />
            <span>Listed by: <strong style={{ color: '#1a221b', fontWeight: 700 }}>{landlordName}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555e56', fontSize: '0.8rem', marginBottom: '8px' }}>
            <MapPin size={13} color="#4A7C59" />
            <span>{property.location}</span>
          </div>

          <p style={{
            color: '#4a524b',
            fontSize: '0.82rem',
            marginBottom: '10px',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {property.description}
          </p>
        </div>

        <div>
          {/* Compact Pricing & Requirement Box */}
          <div style={{
            background: '#FAF9F5',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '14px',
            padding: '10px 12px',
            marginBottom: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>
                Monthly Rent
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1a221b' }}>
                {formattedRent}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>
                Min. Income Req.
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4A7C59' }}>
                {formattedThreshold}
              </div>
            </div>
          </div>

          {/* Action Button States */}
          {userRole === 'landlord' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete listing "${property.title}"?`)) {
                      onDelete(property.id);
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '10px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Trash2 size={14} /> Delete Listing
                </button>
              )}
            </div>
          ) : isApprovedStatus ? (
            <div style={{
              width: '100%',
              padding: '10px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
              color: '#ffffff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)',
            }}>
              <CheckCircle2 size={16} color="#ffffff" /> Application Accepted
            </div>
          ) : isRejectedStatus ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.82rem',
              }}>
                <AlertCircle size={15} /> Application Declined
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#dc2626',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '6px 10px',
                lineHeight: 1.3,
              }}>
                <strong>Landlord Note:</strong> {application?.rejection_reason || 'Owner Denied: Criteria not met.'}
              </div>
            </div>
          ) : isPendingStatus ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '999px',
                background: 'rgba(74, 124, 89, 0.12)',
                color: '#4A7C59',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: '1px solid rgba(74, 124, 89, 0.3)',
                fontSize: '0.82rem',
              }}>
                <ShieldCheck size={15} /> Applied with ZK Proof
              </div>
              <button
                type="button"
                onClick={handleWithdrawClick}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '999px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease',
                }}
              >
                <XCircle size={13} /> Withdraw Application
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleApplyClick}
              style={{
                width: '100%',
                background: '#141a15',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: 700,
                padding: '10px 14px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              Apply <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Aesthetic Property Detail Popup Modal */}
      {isDetailOpen && (
        <PropertyDetailModal
          property={property}
          onClose={() => setIsDetailOpen(false)}
          onApply={onApply}
          hasApplied={hasApplied}
          isDenied={isDenied}
          application={application}
          userRole={userRole}
          onWithdraw={onWithdraw}
        />
      )}
    </>
  );
}
