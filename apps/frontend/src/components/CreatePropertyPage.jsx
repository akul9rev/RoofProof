import React, { useState } from 'react';
import { Building2, Plus, ArrowLeft, Upload, Check, ShieldCheck, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export default function CreatePropertyPage({ landlord, onBack, onSuccess }) {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Family Apartment');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [incomeThreshold, setIncomeThreshold] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be under 10 MB.');
      return;
    }

    setError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !location || !monthlyRent || !incomeThreshold || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    const finalImage = imagePreview || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

    setIsSubmitting(true);
    try {
      await onSuccess({
        landlord_id: landlord?.id || 2,
        title: title.trim(),
        property_type: propertyType,
        location: location.trim(),
        monthly_rent: Number(monthlyRent),
        income_threshold: Number(incomeThreshold),
        description: description.trim(),
        image_url: finalImage,
      });
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to publish property listing to database.');
    }
  };

  const formattedRent = monthlyRent ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(monthlyRent) : '₹0';
  const formattedThreshold = incomeThreshold ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(incomeThreshold) : '₹0';

  return (
    <div className="animate-fade-in" style={{ width: '100%', padding: '10px 0 60px' }}>
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={onBack}
          className="btn-white-pill"
          style={{ padding: '8px 18px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Landlord Portal
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B9B76', fontSize: '0.82rem', fontWeight: 700 }}>
          <ShieldCheck size={16} /> MIDNIGHT ZK PROTECTED LISTING CREATION
        </div>
      </div>

      {/* Main Professional 2-Column Split Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Left Side: Live Card Preview & Publisher Badge */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(107, 155, 118, 0.18)',
              color: '#6B9B76',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              <Sparkles size={13} /> LIVE CARD PREVIEW
            </div>

            {/* Photo Box */}
            <div style={{
              height: '240px',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#070c13',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Property Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '20px' }}>
                  <Building2 size={40} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <div style={{ fontSize: '0.85rem' }}>No Photo Uploaded Yet</div>
                  <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>Upload a file on the right to preview</div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              {title || 'Property Title Here'}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '16px' }}>
              <MapPin size={15} color="#4A7C59" />
              <span>{location || 'City / Location'}</span>
              <span style={{ margin: '0 4px' }}>•</span>
              <span style={{ color: '#EBA834', fontWeight: 700 }}>{propertyType}</span>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Rent</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{formattedRent}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Min Income</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6B9B76' }}>{formattedThreshold}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Structured Rectangle Form */}
        <div style={{
          background: 'linear-gradient(165deg, #0e1722 0%, #080e15 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
        }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>List New Rental Property</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', marginTop: '4px' }}>
              Publish listing directly to PostgreSQL database with Midnight Zero-Knowledge income privacy bounds.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '14px',
              marginBottom: '20px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Title & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                  Property Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Palm Court Residency"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                  Housing Type *
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0e1722',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                >
                  <option value="Family Apartment">Family Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Bachelor House">Bachelor House</option>
                  <option value="Society Apartment">Society Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Heritage Apartment">Heritage Apartment</option>
                </select>
              </div>
            </div>

            {/* Location & Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                  Location / City *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bangalore"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(e.target.value)}
                  placeholder="42000"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                  Min. Income Req. (₹) *
                </label>
                <input
                  type="number"
                  value={incomeThreshold}
                  onChange={e => setIncomeThreshold(e.target.value)}
                  placeholder="120000"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                Description & Amenities *
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Spacious 2 BHK in a quiet residential lane with modular kitchen and covered parking."
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            {/* Image File Upload Dropzone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
                Upload Property Photo File
              </label>

              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '18px',
                padding: '28px',
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                  id="page-form-image-file"
                />
                <label
                  htmlFor="page-form-image-file"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#ffffff',
                    color: '#0c141d',
                    padding: '12px 28px',
                    borderRadius: '999px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  }}
                >
                  <Upload size={18} /> {imageFile ? 'Change Selected Photo' : 'Upload Property Photo'}
                </label>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '10px' }}>
                  {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)` : 'Supported formats: JPG, PNG, WebP (Max 10 MB).'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '14px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: '#ffffff',
                  color: '#0c141d',
                  padding: '12px 32px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                }}
              >
                <Plus size={18} /> {isSubmitting ? 'Publishing to Database...' : 'Publish Listing to Database'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
