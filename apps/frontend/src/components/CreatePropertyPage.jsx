import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, ArrowLeft, Upload, Check, ShieldCheck, MapPin, Sparkles,
  AlertCircle, Home, Layers, CheckSquare, Square, Trash2, Star, Image as ImageIcon,
  Camera, PlusCircle
} from 'lucide-react';
import { uploadImageToCloudinaryApi } from '../services/api.js';

const AVAILABLE_AMENITIES = [
  'Private Balcony',
  'Modular Kitchen',
  '24/7 Power Backup',
  '24/7 Security & CCTV',
  'Private Garden',
  'Covered Car Parking',
  'Swimming Pool',
  'Gym & Fitness Center',
  'High-Speed Fiber Ready',
  'Pet Friendly',
  'Gated Community',
  'Mountain / City Views',
];

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

export default function CreatePropertyPage({ landlord, onBack, onSuccess }) {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Family Apartment');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [incomeThreshold, setIncomeThreshold] = useState('');
  const [description, setDescription] = useState('');

  // Extended Specs
  const [bedrooms, setBedrooms] = useState('3 BHK');
  const [bathrooms, setBathrooms] = useState('3 Bathrooms');
  const [furnishing, setFurnishing] = useState('Fully Furnished');
  const [areaSqft, setAreaSqft] = useState('1,850 sq.ft');
  const [parking, setParking] = useState('Covered Parking (1 Car + 1 Bike)');
  const [deposit, setDeposit] = useState('');
  const [preferredTenants, setPreferredTenants] = useState('Families & Working Professionals');
  const [availableFrom, setAvailableFrom] = useState('Immediate Move-in');
  const [selectedAmenities, setSelectedAmenities] = useState([
    'Private Balcony',
    'Modular Kitchen',
    '24/7 Power Backup',
    '24/7 Security & CCTV',
  ]);

  // Multi-Photo Management State (Empty by default)
  const [photos, setPhotos] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Find currently designated thumbnail
  const currentThumbnail = photos.find(p => p.isThumbnail) || photos[0];

  // Add multiple files from file input
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

    // Reset file input target so user can re-click and upload more photos immediately
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

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
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
      // Process and upload all photos
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
        title: title.trim(),
        property_type: propertyType,
        location: location.trim(),
        monthly_rent: Number(monthlyRent),
        income_threshold: Number(incomeThreshold),
        description: description.trim(),
        image_url: finalImageUrl,
        gallery: uploadedGallery,
        // Extended specs
        bedrooms,
        bathrooms,
        furnishing,
        area_sqft: areaSqft.trim(),
        parking,
        deposit: deposit.trim() || `₹${(Number(monthlyRent) * 2).toLocaleString('en-IN')}`,
        preferred_tenants: preferredTenants,
        available_from: availableFrom,
        amenities: selectedAmenities,
      });

      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to publish property listing.');
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

      {/* Main 2-Column Split Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 380px) 1fr',
        gap: '28px',
        alignItems: 'start',
      }}>
        {/* Left Column: Live Card Preview with Designated Thumbnail */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="white-property-card" style={{
            padding: '22px',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
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
                border: '1px solid rgba(74, 124, 89, 0.25)',
              }}>
                <Sparkles size={13} /> LIVE CARD PREVIEW
              </div>

              <span style={{ fontSize: '0.74rem', color: '#666', fontWeight: 600 }}>
                {photos.length} Photo{photos.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Thumbnail Photo Box */}
            <div style={{
              height: '210px',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#FAF9F5',
              marginBottom: '16px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {currentThumbnail ? (
                <>
                  <img
                    src={currentThumbnail.preview}
                    alt="Property Thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(12, 18, 25, 0.88)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    color: '#EBA834',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(235, 168, 52, 0.4)',
                  }}>
                    <Star size={11} fill="#EBA834" color="#EBA834" /> Main Thumbnail
                  </span>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  <ImageIcon size={38} color="#ccc" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#666' }}>No Cover Photo Uploaded</div>
                  <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '2px' }}>Upload photos below to set thumbnail</div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: '#1a221b', lineHeight: 1.25 }}>
              {title || 'Property Title'}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555e56', fontSize: '0.82rem', marginBottom: '14px' }}>
              <MapPin size={14} color="#4A7C59" />
              <span>{location || 'City, State'}</span>
              <span style={{ margin: '0 4px', color: '#ccc' }}>•</span>
              <span style={{ color: '#EBA834', fontWeight: 700 }}>{bedrooms} {propertyType}</span>
            </div>

            <div style={{
              background: '#FAF9F5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '14px',
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

        {/* Right Column: Listing Form Container */}
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
              Upload property photos (Living Room, Washroom, Kitchen, Bedroom) and specify which image is the cover thumbnail.
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
            {/* Section 1: Basic Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
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
                    padding: '11px 14px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    color: '#1a221b',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Housing Type *
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    color: '#1a221b',
                    fontSize: '0.9rem',
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

            {/* Section 2: Location, Rent, Income Requirement */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Location / City *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Coorg, Karnataka"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    color: '#1a221b',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(e.target.value)}
                  placeholder="65000"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    color: '#1a221b',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                  Min. Income Req. (₹) *
                </label>
                <input
                  type="number"
                  value={incomeThreshold}
                  onChange={e => setIncomeThreshold(e.target.value)}
                  placeholder="195000"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#FAF9F5',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    color: '#1a221b',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            {/* Section 3: Multi-Photo Upload Studio & Thumbnail Selection */}
            <div style={{
              background: '#FAF9F5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '18px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1a221b' }}>
                    📸 Property Photos & Thumbnail Studio
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#666', margin: '2px 0 0' }}>
                    Upload multiple room photos (Facade, Living Room, Washroom, Kitchen, Bedroom). Choose <strong>one picture as the Cover Thumbnail</strong>.
                  </p>
                </div>

                <label
                  htmlFor="multi-photo-upload-input"
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
                    boxShadow: '0 2px 8px rgba(74, 124, 89, 0.3)',
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
                  id="multi-photo-upload-input"
                />
              </div>

              {/* Uploaded Photos Grid & Management */}
              {photos.length === 0 ? (
                <div style={{
                  border: '2px dashed rgba(0, 0, 0, 0.15)',
                  borderRadius: '14px',
                  padding: '24px',
                  textAlign: 'center',
                  marginTop: '14px',
                  background: '#ffffff',
                }}>
                  <Camera size={32} color="#4A7C59" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1a221b' }}>No Property Photos Added Yet</div>
                  <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>
                    Click <strong>"+ Add Photos"</strong> to upload images for Living Room, Washroom, Kitchen, and Bedroom.
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                  marginTop: '14px',
                }}>
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        background: '#ffffff',
                        border: photo.isThumbnail ? '2px solid #EBA834' : '1px solid #e5e5e5',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: photo.isThumbnail ? '0 0 14px rgba(235, 168, 52, 0.35)' : '0 2px 6px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Image Preview */}
                      <div style={{ height: '115px', position: 'relative', background: '#000' }}>
                        <img
                          src={photo.preview}
                          alt={photo.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Thumbnail Badge */}
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

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          title="Remove this photo"
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

                      {/* Photo Label Selector & Actions */}
                      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <select
                          value={photo.label}
                          onChange={(e) => updatePhotoLabel(photo.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '5px 8px',
                            fontSize: '0.76rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: '#FAF9F5',
                            fontWeight: 600,
                            color: '#1a221b',
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
                              background: '#FAF9F5',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              padding: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#555',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <Star size={11} color="#EBA834" /> Set as Cover Thumbnail
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Specifications */}
            <div style={{
              background: '#FAF9F5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '18px',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A7C59', marginBottom: '14px' }}>
                Home Detail Specifications (Displayed in Detail Popup)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Bedrooms / Config
                  </label>
                  <select
                    value={bedrooms}
                    onChange={e => setBedrooms(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="5+ BHK">5+ BHK / Villa</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Bathrooms / Washrooms
                  </label>
                  <select
                    value={bathrooms}
                    onChange={e => setBathrooms(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="1 Bathroom">1 Bathroom</option>
                    <option value="2 Bathrooms">2 Bathrooms</option>
                    <option value="3 Bathrooms">3 Bathrooms</option>
                    <option value="4+ Bathrooms">4+ Bathrooms</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Furnishing Status
                  </label>
                  <select
                    value={furnishing}
                    onChange={e => setFurnishing(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Super Area (Sq.Ft)
                  </label>
                  <input
                    type="text"
                    value={areaSqft}
                    onChange={e => setAreaSqft(e.target.value)}
                    placeholder="e.g. 2,150 sq.ft"
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Parking
                  </label>
                  <input
                    type="text"
                    value={parking}
                    onChange={e => setParking(e.target.value)}
                    placeholder="e.g. Covered Parking (1 Car)"
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Security Deposit
                  </label>
                  <input
                    type="text"
                    value={deposit}
                    onChange={e => setDeposit(e.target.value)}
                    placeholder="e.g. ₹1,30,000 (2 Months)"
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Preferred Tenants
                  </label>
                  <input
                    type="text"
                    value={preferredTenants}
                    onChange={e => setPreferredTenants(e.target.value)}
                    placeholder="e.g. Families & Professionals"
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                    Available From
                  </label>
                  <input
                    type="text"
                    value={availableFrom}
                    onChange={e => setAvailableFrom(e.target.value)}
                    placeholder="e.g. Immediate Move-in"
                    style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Amenities */}
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '8px' }}>
                Select Amenities & Highlights
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                {AVAILABLE_AMENITIES.map((amenity, idx) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAmenity(amenity)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: isChecked ? 'rgba(74, 124, 89, 0.12)' : '#FAF9F5',
                        border: isChecked ? '1px solid #4A7C59' : '1px solid #e5e5e5',
                        color: isChecked ? '#4A7C59' : '#555',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: isChecked ? 700 : 500,
                        userSelect: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isChecked ? <CheckSquare size={16} color="#4A7C59" /> : <Square size={16} color="#999" />}
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1a221b', marginBottom: '6px' }}>
                Description & Detailed Overview *
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. 3 BHK hillside villa with a private garden, modular kitchen, and panoramic mountain views."
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#FAF9F5',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '14px',
                  color: '#1a221b',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            {/* Submit Action Bar with "List Property Now" Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '14px',
              marginTop: '12px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: '#FAF9F5',
                  color: '#1a221b',
                  padding: '13px 28px',
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
                  background: 'linear-gradient(135deg, #141a15 0%, #1f2a21 100%)',
                  color: '#ffffff',
                  padding: '13px 36px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
                  letterSpacing: '-0.01em',
                }}
              >
                <Plus size={19} /> {isSubmitting ? 'Publishing Property...' : 'List Property Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
