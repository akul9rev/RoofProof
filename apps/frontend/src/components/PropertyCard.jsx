import React from 'react';
import { MapPin, ShieldCheck, ArrowRight, AlertCircle, Info, XCircle, Trash2, User, CheckCircle2 } from 'lucide-react';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
];

export default function PropertyCard({ property, onApply, onDelete, hasApplied, isDenied, onViewDenial, onWithdraw, application, userRole }) {
  const formattedRent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.monthly_rent);
  const formattedThreshold = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.income_threshold);

  const imageUrl = property.image_url || UNSPLASH_IMAGES[(property.id || 0) % UNSPLASH_IMAGES.length];
  const landlordName = property.landlord_name || 'Ananya Verma';

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
    if (window.confirm(`Withdraw your rental application for "${property.title}"?`)) {
      if (typeof onWithdraw === 'function') {
        onWithdraw(appId);
      }
    }
  };

  return (
    <div className="white-property-card" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div>
        {/* Unsplash Property Photo Header */}
        <div style={{
          height: '210px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '16px',
          position: 'relative',
        }}>
          <img
            src={imageUrl}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(12, 18, 25, 0.88)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            color: '#EBA834',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            border: '1px solid rgba(235, 168, 52, 0.35)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            <ShieldCheck size={14} /> ZK Eligible
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
                top: '12px',
                left: '12px',
                background: 'rgba(239, 68, 68, 0.9)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '4px', lineHeight: 1.25, color: '#1a221b', fontWeight: 700 }}>
          {property.title}
        </h3>

        {/* Listed By Landlord Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555e56', fontSize: '0.8rem', marginBottom: '8px' }}>
          <User size={13} color="#4A7C59" />
          <span>Listed by: <strong style={{ color: '#1a221b', fontWeight: 700 }}>{landlordName}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555e56', fontSize: '0.85rem', marginBottom: '14px' }}>
          <MapPin size={15} color="#4A7C59" />
          <span>{property.location}</span>
        </div>

        <p style={{ color: '#4a524b', fontSize: '0.88rem', marginBottom: '16px', lineHeight: 1.45 }}>
          {property.description}
        </p>
      </div>

      <div>
        {/* Pricing & Requirement Box */}
        <div style={{
          background: '#FAF9F5',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>
              Monthly Rent
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#1a221b' }}>
              {formattedRent}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>
              Min. Income Req.
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#4A7C59' }}>
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
                onClick={() => {
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
                  fontSize: '0.85rem',
                  padding: '12px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Trash2 size={15} /> Delete Listing
              </button>
            )}
          </div>
        ) : isApprovedStatus ? (
          /* Approved State - Locked, No Actions Allowed */
          <div style={{
            width: '100%',
            padding: '12px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: '#ffffff',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            boxShadow: '0 6px 18px rgba(22, 101, 52, 0.3)',
          }}>
            <CheckCircle2 size={18} color="#ffffff" /> Application Accepted 🎉
          </div>
        ) : isRejectedStatus ? (
          /* Rejected State - Locked with Small Reason Box */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.86rem',
            }}>
              <AlertCircle size={16} /> Application Declined
            </div>
            <div style={{
              fontSize: '0.78rem',
              color: '#dc2626',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '8px 12px',
              lineHeight: 1.4,
            }}>
              <strong>Landlord Note:</strong> {application?.rejection_reason || 'Owner Denied: Property requirements or move-in timeline criteria not met.'}
            </div>
          </div>
        ) : isPendingStatus ? (
          /* Pending State - Show Applied Pill + Withdraw Button */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(74, 124, 89, 0.12)',
              color: '#4A7C59',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: '1px solid rgba(74, 124, 89, 0.3)',
              fontSize: '0.85rem',
            }}>
              <ShieldCheck size={16} /> Applied with ZK Proof
            </div>
            <button
              type="button"
              onClick={handleWithdrawClick}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
              }}
            >
              <XCircle size={14} /> Withdraw Application
            </button>
          </div>
        ) : (
          /* Initial Apply Button */
          <button
            type="button"
            onClick={handleApplyClick}
            style={{
              width: '100%',
              background: '#141a15',
              color: '#ffffff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              fontWeight: 700,
              padding: '14px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            Apply <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
