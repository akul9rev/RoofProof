import React from 'react';
import { Star, Lock, Calendar, Building2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage({ properties = [], onApplyToProperty, onListProperty }) {
  const featuredProp = properties[0] || {
    id: 1,
    title: 'Evergreen Pine Family Lodge',
    location: 'Manali, Himachal Pradesh',
    monthly_rent: 75000,
    income_threshold: 225000,
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* RoofProof Hero Section - Crisp Text directly over background image */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '10px 0 60px',
      }}>
        {/* Left Column: Private Rental Verification */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            padding: '6px 14px',
            borderRadius: '999px',
            marginBottom: '20px',
            fontSize: '0.8rem',
            color: '#EBA834',
            fontWeight: 600,
          }}>
            <Sparkles size={14} /> Zero-Knowledge Privacy on Midnight Network
          </div>

          <h1 className="hero-title">
            Private <br />
            <span className="text-accent-slate">Rental</span> <br />
            Verification
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '40px',
            marginTop: '2.2rem',
            flexWrap: 'wrap',
          }}>
            <p style={{
              maxWidth: '320px',
              fontSize: '0.98rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
            }}>
              Discover handpicked luxury properties. Prove rent income eligibility privately via Form 16 Zero-Knowledge proofs — without sharing payslips or bank statements.
            </p>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}>
                <Star size={22} fill="#EBA834" color="#EBA834" />
                4.9
              </div>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                from 1,800+ ZK proofs
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Dark Glass Booking/Verification Card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="glass-card" style={{
            maxWidth: '430px',
            width: '100%',
            padding: '28px',
            borderRadius: '28px',
            background: 'rgba(12, 19, 27, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: '6px',
                }}>
                  {featuredProp.title}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {featuredProp.location}
                </span>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Lock size={16} color="rgba(255,255,255,0.85)" />
              </div>
            </div>

            {/* Check-in / Check-out Input Pills */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Calendar size={16} color="rgba(255,255,255,0.6)" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Check-in</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>After 2:00 PM</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Calendar size={16} color="rgba(255,255,255,0.6)" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Check-out</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Until 12:00 PM</div>
                </div>
              </div>
            </div>

            {/* Min Annual Income Requirement */}
            <div style={{
              background: 'rgba(235, 168, 52, 0.08)',
              border: '1px solid rgba(235, 168, 52, 0.25)',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '22px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Min Income Threshold</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#EBA834' }}>
                  ₹{(featuredProp.income_threshold || 225000).toLocaleString('en-IN')}/yr
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#ffffff', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '999px', fontWeight: 600 }}>
                Form 16 ZK
              </span>
            </div>

            {/* Price & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>
                  ₹{(featuredProp.monthly_rent || 75000).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}> / month</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>2–5 guests</span>
            </div>

            <button
              onClick={() => onApplyToProperty(featuredProp)}
              className="btn-white-pill"
              style={{ width: '100%' }}
            >
              Book Now (ZK Proof)
            </button>
          </div>
        </div>
      </div>

      {/* Featured Properties Grid */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 600, color: '#ffffff' }}>Available Locations</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
              Select a luxury property to verify eligibility privately via Zero-Knowledge proof.
            </p>
          </div>
          <button onClick={onListProperty} className="btn-glass">
            + List a Property
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
        }}>
          {properties.map((prop) => (
            <div key={prop.id} className="glass-card" style={{ padding: '20px', borderRadius: '24px' }}>
              <div style={{
                height: '200px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '16px',
                position: 'relative',
              }}>
                <img
                  src={prop.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                  alt={prop.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(12, 20, 29, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  color: '#EBA834',
                  fontWeight: 600,
                }}>
                  ZK Eligible
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                {prop.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
                {prop.location}
              </p>

              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                    ₹{(prop.monthly_rent || 0).toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}> / mo</span>
                </div>
                <button
                  onClick={() => onApplyToProperty(prop)}
                  className="btn-white-pill"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
