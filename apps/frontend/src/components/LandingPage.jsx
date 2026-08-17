import React from 'react';
import { Edit3, MapPin, Home, ShieldCheck, Cpu, Lock, Star, Sparkles, ArrowRight } from 'lucide-react';

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
      {/* 1. Hero Landing Page Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '10px 0 40px',
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
              maxWidth: '460px',
              fontSize: '1rem',
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
          <div style={{
            maxWidth: '420px',
            width: '100%',
            padding: '26px',
            borderRadius: '26px',
            background: 'rgba(14, 23, 34, 0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <h3 style={{
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  marginBottom: '4px',
                }}>
                  {featuredProp.title}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)' }}>
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

            {/* Quick Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <MapPin size={15} color="#EBA834" />
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Location</div>
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>Manali, HP</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Home size={15} color="#6B9B76" />
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Config</div>
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>3 BHK Villa</div>
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
                color: '#6B9B76',
                fontWeight: 600,
              }}>
                10% annual payment discount
              </div>
            </div>

            {/* Rent & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
                  ₹{(featuredProp.monthly_rent || 75000).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}> / month</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>3 BHK • 6 guests</span>
            </div>

            <button
              onClick={() => onApplyToProperty(featuredProp)}
              className="btn-white-pill"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
            >
              Apply with ZK Proof
            </button>
          </div>
        </div>
      </div>

      {/* 2. About Section - Transparent Glass Container */}
      <section id="about-section" style={{
        background: 'rgba(14, 23, 34, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '32px',
        padding: '50px 36px',
        margin: '40px 0',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        color: '#ffffff',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.75rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#6B9B76',
            fontWeight: 700,
            marginBottom: '20px',
          }}>
            <span style={{ width: '40px', height: '1px', background: '#6B9B76', opacity: 0.6 }}></span>
            PRIVACY FIRST VERIFICATION
            <span style={{ width: '40px', height: '1px', background: '#6B9B76', opacity: 0.6 }}></span>
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            lineHeight: 1.25,
            color: '#ffffff',
            margin: '0 0 16px',
          }}>
            Know what's real. <br />
            <em style={{ color: '#EBA834', fontStyle: 'normal' }}>Before</em> you sign.
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.65,
            margin: '20px auto 32px',
            maxWidth: '640px',
          }}>
            RoofProof gives your tenancy applications the visibility and zero-knowledge privacy it needs to prevent expired disclosures, avoid fraud, and run with confidence — every single day.
          </p>
        </div>

        {/* 3 Clean Transparent Glass Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginTop: '40px',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '24px',
            color: '#ffffff',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(235, 168, 52, 0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px', border: '1px solid rgba(235, 168, 52, 0.3)',
            }}>
              <Lock size={20} color="#EBA834" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              Zero-Knowledge Privacy
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
              Form 16 PDFs and salary statements are processed in local memory. Only cryptographic mathematical proofs reach the landlord.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '24px',
            color: '#ffffff',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(107, 155, 118, 0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px', border: '1px solid rgba(107, 155, 118, 0.3)',
            }}>
              <ShieldCheck size={20} color="#6B9B76" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              Midnight Compact ZK Engine
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
              Powered by Midnight Network ZK-SNARK witness execution proving salary exceeds minimum rent threshold without revealing total net worth.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '24px',
            color: '#ffffff',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px', border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Cpu size={20} color="#ffffff" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              Instant Verification
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
              Instant PASS/FAIL verification badges allow landlords to approve verified tenants in seconds with zero paperwork overhead.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Reviews Section - Transparent Glass Layout */}
      <section id="reviews-section" style={{
        padding: '40px 0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(235, 168, 52, 0.15)',
            border: '1px solid rgba(235, 168, 52, 0.35)',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            color: '#EBA834',
            fontWeight: 700,
            marginBottom: '12px',
          }}>
            <Star size={13} fill="#EBA834" /> TENANT & LANDLORD REVIEWS
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Trusted by Privacy-Conscious Renters
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <div style={{
            background: 'rgba(14, 23, 34, 0.45)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '24px',
            color: '#ffffff',
          }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#EBA834" color="#EBA834" />)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.55, marginBottom: '16px' }}>
              "I never felt comfortable sharing my full Form 16 PDF with random brokers. RoofProof let me prove my income threshold instantly with 100% privacy."
            </p>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>Rahul Sharma</div>
            <div style={{ fontSize: '0.75rem', color: '#EBA834' }}>Verified Tenant • Bangalore</div>
          </div>

          <div style={{
            background: 'rgba(14, 23, 34, 0.45)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '24px',
            color: '#ffffff',
          }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#EBA834" color="#EBA834" />)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.55, marginBottom: '16px' }}>
              "As a landlord, receiving cryptographically verified tenant applications makes background checks seamless. No more manual income math!"
            </p>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>Ananya Verma</div>
            <div style={{ fontSize: '0.75rem', color: '#6B9B76' }}>Verified Landlord • Mumbai</div>
          </div>

          <div style={{
            background: 'rgba(14, 23, 34, 0.45)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '24px',
            color: '#ffffff',
          }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#EBA834" color="#EBA834" />)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.55, marginBottom: '16px' }}>
              "The Midnight ZK integration is brilliant. It feels like the future of web3 real estate verification in India."
            </p>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>Vikramaditya K.</div>
            <div style={{ fontSize: '0.75rem', color: '#EBA834' }}>Web3 Enthusiast • Pune</div>
          </div>
        </div>
      </section>
    </div>
  );
}
