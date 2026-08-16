import React from 'react';
import { Edit3, MapPin, Home, ShieldCheck, Cpu, Lock } from 'lucide-react';

export default function LandingPage({ properties = [], onApplyToProperty }) {
  const featuredProp = properties[0] || {
    id: 1,
    title: 'Evergreen Pine Luxury Villa',
    location: 'Manali, Himachal Pradesh',
    monthly_rent: 75000,
    income_threshold: 225000,
  };

  return (
    <>
      {/* 1. Hero Landing Page Section - Sitting inside hero-glass-frame */}
      <div className="animate-fade-in" style={{ width: '100%' }}>
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

            <div style={{ marginTop: '2rem' }}>
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

              {/* Annual Rent Box with 10% Discount */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '12px 14px',
                marginBottom: '20px',
                color: '#ffffff',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                  Annual Rent
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '0.88rem',
                    color: 'rgba(255, 255, 255, 0.45)',
                    textDecoration: 'line-through',
                  }}>
                    ₹9,00,000
                  </span>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}>
                    ₹8,10,000 / yr
                  </span>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 500,
                }}>
                  10% annual payment discount
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

      {/* 2. About Section - 100% Full-Width Clean White Background matching Image 2 */}
      <section id="about-section" className="about-white-section">
        <div className="about-content-wrapper">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
            {/* Badge with horizontal lines */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#4A7C59',
              fontWeight: 700,
              marginBottom: '24px',
            }}>
              <span style={{ width: '40px', height: '1px', background: '#4A7C59', opacity: 0.6 }}></span>
              PRIVACY FIRST
              <span style={{ width: '40px', height: '1px', background: '#4A7C59', opacity: 0.6 }}></span>
            </div>

            <h2 className="serif-heading-light">
              Stop finding problems <br />
              <em>after</em> they happen.
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#4a524b',
              lineHeight: 1.65,
              margin: '24px auto 36px',
              maxWidth: '620px',
              fontWeight: 400,
            }}>
              RoofProof gives your tenancy applications the visibility and zero-knowledge privacy it needs to prevent expired disclosures, avoid fraud, and run with confidence — every single day.
            </p>

            <button 
              onClick={() => onApplyToProperty(featuredProp)}
              style={{
                background: '#141a15',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                letterSpacing: '0.18em',
                fontWeight: 700,
                padding: '16px 40px',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transition: 'all 0.2s ease',
              }}
            >
              START PRIVACY VERIFICATION
            </button>
          </div>

          {/* 3 Clean Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '64px',
          }}>
            <div style={{
              background: '#F9F8F3',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(74, 124, 89, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <ShieldCheck size={22} color="#4A7C59" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1a221b', marginBottom: '8px' }}>
                Private Income Witnesses
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#555e56', lineHeight: 1.55 }}>
                Form 16 income data stays strictly in browser RAM. Zero raw salary digits are transmitted over the network or stored in databases.
              </p>
            </div>

            <div style={{
              background: '#F9F8F3',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(74, 124, 89, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Cpu size={22} color="#4A7C59" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1a221b', marginBottom: '8px' }}>
                AI Anomaly Detector
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#555e56', lineHeight: 1.55 }}>
                8-feature OCR stream scanner checks layout, arithmetic, and font stream consistency before generating cryptographic proofs.
              </p>
            </div>

            <div style={{
              background: '#F9F8F3',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(74, 124, 89, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Lock size={22} color="#4A7C59" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1a221b', marginBottom: '8px' }}>
                Midnight On-Chain Proofs
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#555e56', lineHeight: 1.55 }}>
                Midnight Compact smart contracts record binary true/false verification state on-chain, linked to your property application hash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Reviews Section - 100% Full-Width Rich Black Background matching Image 1 */}
      <section id="reviews-section" className="reviews-black-section">
        <div className="reviews-content-wrapper">
          <div style={{ marginBottom: '48px' }}>
            <h2 className="serif-heading-dark">
              Built for the people <br />
              who value <em>privacy.</em>
            </h2>
          </div>

          {/* 3 Column Grid Cards matching Image 1 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {/* Card 1 */}
            <div className="editorial-review-card">
              <div style={{ color: '#6B9B76', fontSize: '1.1rem', letterSpacing: '4px' }}>
                ★★★★★
              </div>

              <p className="editorial-quote">
                "Before RoofProof, we discovered expired disclosures only when a tenant complained. Now we get verified proofs in seconds. That alone changed everything."
              </p>

              <div className="editorial-author">
                RAVI M. · TENANT APPLICANT
              </div>
            </div>

            {/* Card 2 */}
            <div className="editorial-review-card">
              <div style={{ color: '#6B9B76', fontSize: '1.1rem', letterSpacing: '4px' }}>
                ★★★★★
              </div>

              <p className="editorial-quote">
                "The AI anomaly tracking is the feature I didn't know I needed. Knowing exactly which document stream passes — without storing 300 tenants' salary slips — is a completely different level of control."
              </p>

              <div className="editorial-author">
                PRIYA L. · HEAD PROPERTY MANAGER
              </div>
            </div>

            {/* Card 3 */}
            <div className="editorial-review-card">
              <div style={{ color: '#6B9B76', fontSize: '1.1rem', letterSpacing: '4px' }}>
                ★★★★★
              </div>

              <p className="editorial-quote">
                "We stopped running out of verified applicants completely. Midnight zero-knowledge proofs give us enough confidence to approve instantly — it genuinely runs smoother than any system we've had."
              </p>

              <div className="editorial-author">
                JAMES K. · LANDLORD
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
