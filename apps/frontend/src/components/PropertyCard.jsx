import React from 'react';
import { MapPin, ShieldCheck, ArrowRight, AlertCircle, Info, XCircle } from 'lucide-react';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
];

export default function PropertyCard({ property, onApply, hasApplied, isDenied, onViewDenial, onWithdraw, application, userRole }) {
  const formattedRent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.monthly_rent);
  const formattedThreshold = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.income_threshold);

  const imageUrl = property.image_url || UNSPLASH_IMAGES[(property.id || 0) % UNSPLASH_IMAGES.length];

  return (
    <div className="glass-card" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
    }}>
      <div>
        {/* Unsplash Property Photo Header */}
        <div style={{
          height: '190px',
          borderRadius: '16px',
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
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.74rem',
            color: '#EBA834',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(235, 168, 52, 0.3)',
          }}>
            <ShieldCheck size={13} /> ZK Eligible
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', lineHeight: 1.3, color: '#ffffff', fontWeight: 600 }}>
          {property.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.86rem', marginBottom: '12px' }}>
          <MapPin size={15} color="#EBA834" />
          <span>{property.location}</span>
        </div>

        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.86rem', marginBottom: '18px', lineHeight: 1.5 }}>
          {property.description}
        </p>
      </div>

      <div>
        {/* Pricing & Requirement Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '18px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 600 }}>
              Monthly Rent
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              {formattedRent}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 600 }}>
              Min. Income Req.
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#EBA834' }}>
              {formattedThreshold}
            </div>
          </div>
        </div>

        {/* Action button */}
        {hasApplied ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              disabled 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '999px',
                background: 'rgba(107, 155, 118, 0.15)',
                color: '#6B9B76',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'default',
                border: '1px solid rgba(107, 155, 118, 0.3)',
                fontSize: '0.85rem',
              }}
            >
              <ShieldCheck size={16} /> Applied with ZK Proof
            </button>
            {onWithdraw && application && application.status === 'pending' && (
              <button
                type="button"
                onClick={() => onWithdraw(application.id)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '999px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <XCircle size={14} /> Withdraw Application
              </button>
            )}
          </div>
        ) : isDenied ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              disabled
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'not-allowed',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <AlertCircle size={18} /> Owner Denied Application
            </button>
            {onViewDenial && (
              <button
                type="button"
                onClick={onViewDenial}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Info size={12} /> View Why Owner Denied
              </button>
            )}
          </div>
        ) : (
          <button
            className="btn-white-pill"
            onClick={() => onApply(property)}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '0.88rem',
            }}
          >
            Apply Privately (ZK Proof) <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
