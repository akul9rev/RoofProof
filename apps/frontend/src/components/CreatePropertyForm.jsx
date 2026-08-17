import React, { useState } from 'react';
import { Building2, Plus, AlertCircle, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

export default function CreatePropertyForm({ landlord, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Family Apartment');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [incomeThreshold, setIncomeThreshold] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // EMPTY initially
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

    // Default image if no file uploaded
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

  return (
    <div
      className="animate-fade-in"
      style={{
        width: '100%',
        background: 'linear-gradient(165deg, #0e1722 0%, #080e15 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        marginBottom: '32px',
        color: '#ffffff',
      }}
    >
      {/* Form Rectangle Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Building2 size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>List New Rental Property</h3>
            <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Create a new property listing with complete details & photos stored in database.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <X size={16} /> Close Form
          </button>
        )}
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Row 1: Title & Housing Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
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
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
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

        {/* Row 2: Location, Monthly Rent, Min Income */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
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
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
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
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
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

        {/* Row 3: Description */}
        <div>
          <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
            Description & Amenities *
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. 3 BHK hillside villa with a private garden, modular kitchen, and panoramic mountain views."
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

        {/* Row 4: Image File Upload (NO URL field, empty preview initially, large preview when uploaded) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
            Property Photo Upload
          </label>

          <div style={{
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.25)',
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              style={{ display: 'none' }}
              id="rectangle-form-image-file"
            />
            <label
              htmlFor="rectangle-form-image-file"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#0c141d',
                padding: '10px 24px',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <Upload size={16} /> {imageFile ? 'Change Photo File' : 'Upload Property Photo'}
            </label>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px' }}>
              {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)` : 'Select a JPG, PNG, or WebP photo from your computer.'}
            </div>
          </div>

          {/* Large Image Preview Container - EMPTY initially, renders ONLY when user uploads */}
          {imagePreview && (
            <div style={{
              marginTop: '16px',
              width: '100%',
              height: '300px',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '2px solid rgba(74, 124, 89, 0.5)',
              position: 'relative',
              background: '#060a0f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            }}>
              <img
                src={imagePreview}
                alt="Property Full Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(12, 18, 25, 0.88)',
                color: '#6B9B76',
                border: '1px solid rgba(107, 155, 118, 0.4)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Check size={13} color="#22c55e" /> Photo Preview (Whole Image Fitted)
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {onClose && (
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
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: '#ffffff',
              color: '#0c141d',
              padding: '12px 28px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <Plus size={18} /> {isSubmitting ? 'Publishing to DB...' : 'Publish Listing to Database'}
          </button>
        </div>
      </form>
    </div>
  );
}
