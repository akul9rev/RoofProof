import React from 'react';
import { MapPin, ShieldCheck, ArrowRight, AlertCircle, Info, XCircle } from 'lucide-react';

export default function PropertyCard({ property, onApply, hasApplied, isDenied, onViewDenial, onWithdraw, application, userRole }) {
  const formattedRent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.monthly_rent);
  const formattedThreshold = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.income_threshold);

  return (
    <div className="glass-card" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span className="badge-pill badge-midnight">
            <ShieldCheck size={14} /> Zero-Knowledge Verified
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ID #{property.id}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: 1.3 }}>
          {property.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
          <MapPin size={16} color="var(--accent-secondary)" />
          <span>{property.location}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
          {property.description}
        </p>
      </div>

      <div>
        {/* Pricing & Requirement Box */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Monthly Rent
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formattedRent}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Min. Income Req.
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--midnight-accent)' }}>
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
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                color: 'var(--success-text)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'default',
                border: '1px solid var(--success-border)',
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
                  borderRadius: 'var(--radius-md)',
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
                borderRadius: 'var(--radius-md)',
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
                  color: 'var(--accent-secondary)',
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
            className="btn-primary"
            onClick={() => onApply(property)}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
            }}
          >
            Apply Privately (ZK Proof) <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
