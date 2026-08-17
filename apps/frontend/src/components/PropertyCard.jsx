import React from 'react';
import { MapPin, ShieldCheck, ArrowRight, AlertCircle, Info, XCircle } from 'lucide-react';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
];

export default function PropertyCard({ property, onApply, hasApplied, isDenied, onViewDenial, onWithdraw, application, userRole }) {
  const formattedRent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.monthly_rent);
  const formattedThreshold = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.income_threshold);

  const imageUrl = property.image_url || UNSPLASH_IMAGES[(property.id || 0) % UNSPLASH_IMAGES.length];

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
        {/* Unsplash Property Photo Header - Matching User Image */}
        <div style={{
          height: '210px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '18px',
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
        </div>

        <h3 style={{ fontSize: '1.35rem', marginBottom: '6px', lineHeight: 1.25, color: '#1a221b', fontWeight: 700 }}>
          {property.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555e56', fontSize: '0.88rem', marginBottom: '12px' }}>
          <MapPin size={15} color="#4A7C59" />
          <span>{property.location}</span>
        </div>

        <p style={{ color: '#4a524b', fontSize: '0.88rem', marginBottom: '18px', lineHeight: 1.5 }}>
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
          marginBottom: '18px',
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

        {/* Action button */}
        {hasApplied ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              disabled 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '999px',
                background: 'rgba(74, 124, 89, 0.12)',
                color: '#4A7C59',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'default',
                border: '1px solid rgba(74, 124, 89, 0.3)',
                fontSize: '0.88rem',
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
                  border: '1px solid rgba(239, 68, 68, 0.3)',
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
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'not-allowed',
                border: '1px solid rgba(239, 68, 68, 0.3)',
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
                  color: '#555',
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
            onClick={() => onApply(property)}
            style={{
              width: '100%',
              background: '#141a15',
              color: '#ffffff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
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
            Apply Privately (ZK Proof) <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
