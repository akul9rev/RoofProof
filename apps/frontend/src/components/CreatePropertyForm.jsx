import React, { useState } from 'react';
import { Building2, Plus, AlertCircle, Upload, X, Check, Loader, Star, Trash2, PlusCircle } from 'lucide-react';
import { uploadImageToCloudinaryApi } from '../services/api.js';

const ROOM_TYPE_OPTIONS = [
  'Main Facade / Exterior',
  'Spacious Living Room',
  'Master Bedroom',
  'Modular Kitchen',
  'Luxury Washroom / Bathroom',
  'Private Balcony / Terrace',
  'Dining Area',
  'Garden / Backyard',
  'Other Room',
];

export default function CreatePropertyForm({ landlord, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Family Apartment');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [incomeThreshold, setIncomeThreshold] = useState('');
  const [description, setDescription] = useState('');

  // Multi-Photo Management State
  const [photos, setPhotos] = useState([
    {
      id: 'default_thumb',
      preview: '/houses/house1.jpg',
      label: 'Main Facade / Exterior',
      isThumbnail: true,
      file: null,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError(null);
    const labelOrder = ['Main Facade / Exterior', 'Spacious Living Room', 'Master Bedroom', 'Modular Kitchen', 'Luxury Washroom / Bathroom', 'Private Balcony / Terrace'];

    files.forEach((file, idx) => {
      if (!file.type.startsWith('image/')) {
        setError('Please select valid image files (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be under 10 MB per image.');
        return;
      }

      const reader = new FileReader();
      const tempId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      reader.onloadend = () => {
        setPhotos(prev => {
          const filtered = prev.filter(p => p.id !== 'default_thumb');
          const isFirst = filtered.length === 0;
          const defaultLabel = labelOrder[filtered.length % labelOrder.length] || 'Room Photo';

          return [
            ...filtered,
            {
              id: tempId,
              file,
              preview: reader.result,
              label: defaultLabel,
              isThumbnail: isFirst,
            },
          ];
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const setAsThumbnail = (id) => {
    setPhotos(prev =>
      prev.map(p => ({
        ...p,
        isThumbnail: p.id === id,
      }))
    );
  };

  const updatePhotoLabel = (id, newLabel) => {
    setPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, label: newLabel } : p))
    );
  };

  const removePhoto = (id) => {
    if (photos.length <= 1) {
      setError('Please keep at least 1 photo for your listing thumbnail.');
      return;
    }
    setPhotos(prev => {
      const remaining = prev.filter(p => p.id !== id);
      const hadThumb = prev.find(p => p.id === id)?.isThumbnail;
      if (hadThumb && remaining.length > 0) {
        remaining[0].isThumbnail = true;
      }
      return remaining;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !location || !monthlyRent || !incomeThreshold || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    if (photos.length === 0) {
      setError('Please upload at least 1 property photo for the cover thumbnail.');
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedGallery = await Promise.all(
        photos.map(async (photo) => {
          let url = photo.preview;
          if (photo.file) {
            try {
              const uploadRes = await uploadImageToCloudinaryApi(photo.file);
              if (uploadRes?.url && !uploadRes.isFallback) {
                url = uploadRes.url;
              }
            } catch (err) {
              console.warn('[Cloudinary Upload Fallback]', err);
            }
          }
          return {
            label: photo.label || 'Property Photo',
            url,
            isThumbnail: photo.isThumbnail,
          };
        })
      );

      const mainThumb = uploadedGallery.find(p => p.isThumbnail) || uploadedGallery[0];
      const finalImageUrl = mainThumb?.url || '/houses/house1.jpg';

      await onSuccess({
        landlord_id: landlord?.id || 1,
        title: title.trim(),
        property_type: propertyType,
        location: location.trim(),
        monthly_rent: Number(monthlyRent),
        income_threshold: Number(incomeThreshold),
        description: description.trim(),
        image_url: finalImageUrl,
        gallery: uploadedGallery,
      });

      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to publish property listing to database.');
    }
  };

  return (
    <div
      className="luxury-modal-container animate-modal-scale"
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
      {/* Form Header */}
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
              Upload property photos (Living Room, Washroom, Kitchen, Bedroom) and set your main cover thumbnail.
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

        {/* Row 4: Multi-Photo Studio */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '18px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                📸 Property Photos & Thumbnail Studio
              </div>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', margin: '2px 0 0' }}>
                Upload multiple room photos (Facade, Living Room, Washroom, Kitchen, Bedroom). Choose <strong>one picture as Cover Thumbnail</strong>.
              </p>
            </div>

            <label
              htmlFor="modal-multi-photo-upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#4A7C59',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(74, 124, 89, 0.4)',
              }}
            >
              <PlusCircle size={15} /> Add Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFiles}
              style={{ display: 'none' }}
              id="modal-multi-photo-upload"
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '14px',
          }}>
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: photo.isThumbnail ? '2px solid #EBA834' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '110px', position: 'relative', background: '#000' }}>
                  <img
                    src={photo.preview}
                    alt={photo.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {photo.isThumbnail && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: '#EBA834',
                      color: '#0c141d',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}>
                      <Star size={10} fill="#0c141d" /> COVER THUMBNAIL
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    title="Remove photo"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <select
                    value={photo.label}
                    onChange={(e) => updatePhotoLabel(photo.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      fontSize: '0.76rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      background: '#0e1722',
                      fontWeight: 600,
                      color: '#ffffff',
                      outline: 'none',
                    }}
                  >
                    {ROOM_TYPE_OPTIONS.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>{opt}</option>
                    ))}
                  </select>

                  {!photo.isThumbnail && (
                    <button
                      type="button"
                      onClick={() => setAsThumbnail(photo.id)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        padding: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'rgba(255, 255, 255, 0.9)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <Star size={11} color="#EBA834" /> Set as Cover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
              padding: '12px 32px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <Plus size={18} /> {isSubmitting ? 'Publishing Property...' : 'List Property Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
