import React, { useState, useEffect } from 'react';
import { Building2, Plus, ArrowLeft, Upload, Check, ShieldCheck, MapPin, Sparkles, AlertCircle, Home, FileText } from 'lucide-react';

import { uploadImageToCloudinaryApi } from '../services/api.js';

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

    setIsSubmitting(true);
    let finalImageUrl = imagePreview || 'https://res.cloudinary.com/omfiwspt/image/upload/v1723900001/roofproof/properties/house1_colonial_mansion.jpg';

    try {
      if (imageFile || imagePreview) {
        try {
          const uploadRes = await uploadImageToCloudinaryApi(imageFile || imagePreview);
          if (uploadRes?.url && !uploadRes.isFallback) {
            finalImageUrl = uploadRes.url;
          } else if (imagePreview) {
            finalImageUrl = imagePreview;
          }
        } catch (uploadErr) {
          console.warn('[Cloudinary Upload Fallback]', uploadErr);
          if (imagePreview) {
            finalImageUrl = imagePreview;
          }
        }
      }

      await onSuccess({
        landlord_id: landlord?.id || 2,
        title: title.trim(),
        property_type: propertyType,
        location: location.trim(),
        monthly_rent: Number(monthlyRent),
        income_threshold: Number(incomeThreshold),
        description: description.trim(),
        image_url: finalImageUrl,
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
    <div className="animate-fade-in" id="create-property-form-container" style={{ width: '100%', padding: '10px 0 60px' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={onBack}
          className="btn-white-pill"
          style={{ padding: '9px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Landlord Portal
        </button>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(107, 155, 118, 0.18)',
          border: '1px solid rgba(107, 155, 118, 0.35)',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          color: '#6B9B76',
          fontWeight: 700,
        }}>
          <ShieldCheck size={15} /> MIDNIGHT ZK LISTING CREATION
        </div>
      </div>

      {/* Main 2-Column Luxury Split Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 400px) 1fr',
        gap: '28px',
        alignItems: 'start',
      }}>
        {/* Left Column: Live Card Preview matching site's white card design */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="white-property-card" style={{
            padding: '22px',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(74, 124, 89, 0.12)',
              color: '#4A7C59',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              marginBottom: '16px',
              border: '1px solid rgba(74, 124, 89, 0.25)',
            }}>
              <Sparkles size={13} /> LIVE CARD PREVIEW
            </div>

            {/* Photo Box */}
            <div style={{
              height: '230px',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#FAF9F5',
              marginBottom: '16px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
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
                <div style={{ textAlign: 'center', color: '#666666', padding: '20px' }}>
                  <Building2 size={42} color="#4A7C59" style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a221b' }}>No Photo Uploaded Yet</div>
                  <div style={{ fontSize: '0.76rem', color: '#777' }}>Upload photo file on right to view</div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px', color: '#1a221b', lineHeight: 1.25 }}>
              {title || 'Property Title'}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555e56', fontSize: '0.85rem', marginBottom: '16px' }}>
              <MapPin size={15} color="#4A7C59" />
              <span>{location || 'City, State'}</span>
              <span style={{ margin: '0 4px', color: '#ccc' }}>•</span>
              <span style={{ color: '#EBA834', fontWeight: 700 }}>{propertyType}</span>
            </div>

            <div style={{
              background: '#FAF9F5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Rent</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a221b' }}>{formattedRent}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>Min Income</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4A7C59' }}>{formattedThreshold}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Luxury White Rectangle Form Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '26px',
          padding: '36px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.18)',
          color: '#1a221b',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', paddingBottom: '18px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#1a221b' }}>List New Rental Property</h2>
            <p style={{ color: '#555e56', fontSize: '0.92rem', marginTop: '4px', margin: '4px 0 0' }}>
              Publish listing directly to PostgreSQL database with Midnight Zero-Knowledge income privacy bounds.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
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
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Property Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Misty Peak Villa"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '14px',
                    color: '#1a221b',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Housing Type *
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '14px',
                    color: '#1a221b',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 600,
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

            {/* Location, Rent, Income */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Location / City *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Dehradun, Uttarakhand"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '14px',
                    color: '#1a221b',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(e.target.value)}
                  placeholder="55000"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '14px',
                    color: '#1a221b',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Min. Income Req. (₹) *
                </label>
                <input
                  type="number"
                  value={incomeThreshold}
                  onChange={e => setIncomeThreshold(e.target.value)}
                  placeholder="165000"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '14px',
                    color: '#1a221b',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                Description & Amenities *
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. 3 BHK hillside villa with a private garden, modular kitchen, and panoramic mountain views."
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#FAF9F5',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '14px',
                  color: '#1a221b',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            {/* Photo Upload Dropzone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1a221b', marginBottom: '8px' }}>
                Property Photo Upload
              </label>

              <div style={{
                border: '2px dashed rgba(74, 124, 89, 0.35)',
                borderRadius: '18px',
                padding: '28px',
                textAlign: 'center',
                background: '#FAF9F5',
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                  id="luxury-form-image-file"
                />
                <label
                  htmlFor="luxury-form-image-file"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#141a15',
                    color: '#ffffff',
                    padding: '12px 28px',
                    borderRadius: '999px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <Upload size={18} /> {imageFile ? 'Change Selected Photo' : 'Upload Property Photo'}
                </label>
                <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '10px' }}>
                  {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)` : 'Select a JPG, PNG, or WebP photo file.'}
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '14px', paddingTop: '20px', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: '#FAF9F5',
                  color: '#1a221b',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
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
                  background: '#141a15',
                  color: '#ffffff',
                  padding: '12px 32px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
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
