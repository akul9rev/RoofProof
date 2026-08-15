import React, { useState } from 'react';
import { X, Building2, Plus, AlertCircle } from 'lucide-react';

export default function CreatePropertyModal({ landlord, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [incomeThreshold, setIncomeThreshold] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !location || !monthlyRent || !incomeThreshold || !description) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess({
        landlord_id: landlord.id,
        title,
        location,
        monthly_rent: Number(monthlyRent),
        income_threshold: Number(incomeThreshold),
        description,
      });
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to create property listing.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="glass-card animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '32px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Building2 size={18} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>List a New Rental Property</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Property Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Modern 2BHK Garden Apartment"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Location / City</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Indiranagar, Bangalore"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Monthly Rent (₹)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={e => setMonthlyRent(e.target.value)}
                placeholder="25000"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Min. Income Threshold (₹)</label>
              <input
                type="number"
                value={incomeThreshold}
                onChange={e => setIncomeThreshold(e.target.value)}
                placeholder="60000"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Description & Amenities</label>
            <textarea
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide details about the home, furnishing, parking, and community..."
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Plus size={16} /> Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
