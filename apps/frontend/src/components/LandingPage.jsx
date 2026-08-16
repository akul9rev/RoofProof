import React from 'react';
import { Star, Edit3, Calendar } from 'lucide-react';

export default function LandingPage({ properties = [], onApplyToProperty }) {
  const featuredProp = properties[0] || {
    id: 1,
    title: 'Evergreen Pine Family Lodge',
    location: 'Manali, Himachal Pradesh',
    monthly_rent: 75000,
    income_threshold: 225000,
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', position: 'relative' }}>
      {/* WoodNest / RoofProof Hero Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '10px 0 20px',
      }}>
        {/* Left Column: Hero Typography matching reference image */}
        <div>
          <h1 className="hero-title">
            Private <br />
            <span className="text-accent-slate">Rental</span> <br />
            Verification
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '40px',
            marginTop: '2.5rem',
            flexWrap: 'wrap',
          }}>
            <p style={{
              maxWidth: '310px',
              fontSize: '0.92rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.55,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            }}>
              Discover handpicked luxury cabins in breathtaking locations. Unplug, verify privately with Form 16, and reconnect with what matters most.
            </p>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#ffffff',
                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              }}>
                <Star size={20} fill="#EBA834" color="#EBA834" />
                4.7
              </div>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400 }}>
                from 1,800+ stays
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Dark Glass Booking/Verification Card matching reference image */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="glass-card" style={{
            maxWidth: '410px',
            width: '100%',
            padding: '26px',
            borderRadius: '26px',
            background: 'rgba(12, 18, 25, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  marginBottom: '4px',
                }}>
                  {featuredProp.title}
                </h3>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Edit3 size={15} color="rgba(255,255,255,0.7)" />
              </div>
            </div>

            {/* Date / Check-in Pills */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '14px',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Calendar size={15} color="rgba(255,255,255,0.5)" />
                <span style={{ fontSize: '0.85rem', color: '#ffffff' }}>Feb 11</span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Calendar size={15} color="rgba(255,255,255,0.5)" />
                <span style={{ fontSize: '0.85rem', color: '#ffffff' }}>Mar 25</span>
              </div>
            </div>

            {/* Check-in / Check-out Times */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Check-in</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>After 2:00 PM</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Check-out</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>Until 12:00 PM</div>
              </div>
            </div>

            {/* Price & Guests */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#ffffff' }}>
                  ₹{(featuredProp.monthly_rent || 75000).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>/night</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>2–5 guests</span>
            </div>

            <button
              onClick={() => onApplyToProperty(featuredProp)}
              className="btn-white-pill"
              style={{ width: '100%' }}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
