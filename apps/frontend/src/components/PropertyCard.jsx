import React from 'react';
import { MapPin, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';

export default function PropertyCard({ property, onApply, hasApplied, userRole }) {
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
          <button 
            disabled 
            style={{
              width: '100%',
              padding: '12px',
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
            }}
          >
            <ShieldCheck size={18} /> Applied with ZK Proof
          </button>
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
