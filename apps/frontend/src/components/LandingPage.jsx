import React from 'react';
import { Edit3, MapPin, Home } from 'lucide-react';

export default function LandingPage({ properties = [], onApplyToProperty }) {
  const featuredProp = properties[0] || {
    id: 1,
    title: 'Evergreen Pine Luxury Villa',
    location: 'Manali, Himachal Pradesh',
    monthly_rent: 75000,
    income_threshold: 225000,
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', position: 'relative' }}>
      {/* RoofProof Hero Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '10px 0 10px',
      }}>
        {/* Left Column: Hero Title & AI/ZK Subtext */}
        <div>
          <h1 className="hero-title">
            Prove your <br />
            <span className="text-accent-slate">income. Keep</span> <br />
            your privacy.
          </h1>

          <div style={{
            marginTop: '2rem',
          }}>
            <p style={{
              maxWidth: '420px',
              fontSize: '0.96rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)',
            }}>
              RoofProof uses AI-powered document verification and Midnight zero-knowledge proofs to verify rental income without revealing the tenant's exact salary.
            </p>
          </div>
        </div>

        {/* Right Column: House Booking & Verification Card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="glass-card" style={{
            maxWidth: '420px',
            width: '100%',
            padding: '26px',
            borderRadius: '26px',
            background: 'rgba(12, 18, 25, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <h3 style={{
                  fontSize: '1.45rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  marginBottom: '4px',
                }}>
                  {featuredProp.title}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                  {featuredProp.location} • 3 BHK Luxury Villa
                </span>
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

            {/* Location & BHK Input Pills */}
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
                <MapPin size={15} color="rgba(255,255,255,0.5)" />
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>Location</div>
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 500 }}>Manali, HP</div>
                </div>
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
                <Home size={15} color="rgba(255,255,255,0.5)" />
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>Config</div>
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 500 }}>3 BHK Villa</div>
                </div>
              </div>
            </div>

            {/* Min Income Requirement Box */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              background: 'rgba(235, 168, 52, 0.06)',
              border: '1px solid rgba(235, 168, 52, 0.2)',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Estimated Rent</div>
                <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>₹75,000 / month</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Min Annual Income</div>
                <div style={{ fontSize: '0.88rem', color: '#EBA834', fontWeight: 700 }}>₹2,25,000 / yr</div>
              </div>
            </div>

            {/* Rent & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#ffffff' }}>
                  ₹{(featuredProp.monthly_rent || 75000).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}> / month</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>3 BHK • 6 guests</span>
            </div>

            <button
              onClick={() => onApplyToProperty(featuredProp)}
              className="btn-white-pill"
              style={{ width: '100%' }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
