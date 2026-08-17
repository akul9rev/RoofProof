import React from 'react';
import { Edit3, MapPin, Home, ShieldCheck, Cpu, Lock, Plus, ArrowRight } from 'lucide-react';

export default function LandingPage({ properties = [], onApplyToProperty, onListProperty }) {
  const hasProperties = properties && properties.length > 0;
  const featuredProp = hasProperties ? properties[0] : null;

  const formattedRent = featuredProp
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(featuredProp.monthly_rent)
    : '₹0';

  const annualRent = featuredProp
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(featuredProp.monthly_rent * 12)
    : '₹0';

  const discountAnnualRent = featuredProp
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(featuredProp.monthly_rent * 12 * 0.9))
    : '₹0';

  return (
    <div className="animate-fade-in" style={{ width: '100%', position: 'relative' }}>
      {/* 1. Hero Landing Page Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '10px 0 20px',
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

        {/* Right Column: Dynamic House Booking Card from Live Properties */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="glass-card" style={{
            maxWidth: '420px',
            width: '100%',
            padding: '26px',
            borderRadius: '26px',
            background: 'rgba(12, 18, 25, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
          }}>
            {featuredProp ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.25,
                      marginBottom: '4px',
                    }}>
                      {featuredProp.title}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                      {featuredProp.location} • {featuredProp.property_type || featuredProp.type || 'Verified Property'}
                    </span>
                  </div>
                </div>

                {/* Location & Config Input Pills */}
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
                      <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>{featuredProp.location.split(',')[0]}</div>
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
                      <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>{featuredProp.property_type || featuredProp.type || 'Rental Home'}</div>
                    </div>
                  </div>
                </div>

                {/* Annual Rent Discount Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Annual Rent Option
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <span style={{ textDecoration: 'line-through', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>
                      {annualRent}
                    </span>
                    <span style={{ fontSize: '1.18rem', fontWeight: 700, color: '#ffffff' }}>
                      {discountAnnualRent} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>/ yr</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#6B9B76', marginTop: '4px', fontWeight: 600 }}>
                    10% annual payment discount available
                  </div>
                </div>

                {/* Pricing & Apply Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                      {formattedRent}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}> / month</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    ZK Eligible
                  </span>
                </div>

                <button
                  onClick={() => onApplyToProperty(featuredProp)}
                  className="btn-white-pill"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                  }}
                >
                  Book / Apply Now <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'rgba(235, 168, 52, 0.15)', border: '1px solid rgba(235, 168, 52, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                }}>
                  <Plus size={24} color="#EBA834" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  No Active Listings Yet
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.45, marginBottom: '20px' }}>
                  Be the first landlord to publish a property listing! Your new listing will immediately display on this live hero card.
                </p>
                <button
                  onClick={onListProperty}
                  className="btn-white-pill"
                  style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <Plus size={16} /> List New Property Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. About Section - Light Cream Card Container */}
      <div id="about-section" className="about-box-light animate-fade-in" style={{ scrollMarginTop: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(74, 124, 89, 0.12)',
              color: '#4A7C59',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              <ShieldCheck size={14} /> ABOUT ROOFPROOF
            </div>
            <h2 className="serif-heading-light" style={{ marginBottom: '16px' }}>
              Solving the rental <em>privacy dilemma</em>.
            </h2>
            <p style={{ color: '#4a524b', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Traditional landlords demand raw bank statements, Form 16 PDFs, and salary slips — exposing full financial histories, employer details, and personal transactions.
            </p>
            <p style={{ color: '#4a524b', fontSize: '0.98rem', lineHeight: 1.6 }}>
              RoofProof combines local AI document extraction with Midnight Compact Zero-Knowledge circuits to prove <code>income &ge; threshold</code> with 100% cryptographic certainty without exposing exact numbers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <Cpu size={24} color="#4A7C59" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#1a221b', marginBottom: '4px' }}>Local Witness Extraction</h4>
              <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.4 }}>Form 16 PDFs are parsed inside browser RAM only.</p>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <Lock size={24} color="#EBA834" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#1a221b', marginBottom: '4px' }}>Zero-Knowledge Proof</h4>
              <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.4 }}>Generates Midnight ZK proof (PASS / FAIL only).</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reviews & Testimonials Section - Dark Box Container */}
      <div id="reviews-section" className="reviews-box-dark animate-fade-in" style={{ scrollMarginTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.78rem', color: '#EBA834', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
            USER TESTIMONIALS
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
            Trusted by Landlords & Tenants
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px', fontStyle: 'italic' }}>
              "As a tenant, I hated sending PDF bank statements to strangers. RoofProof let me verify my income in 10 seconds without revealing my savings."
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Rahul Sharma</div>
            <div style={{ fontSize: '0.75rem', color: '#EBA834' }}>Software Engineer, Tenant</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px', fontStyle: 'italic' }}>
              "I get instant ZK verified proof that applicants earn above requirement. Eliminates fake salary slips completely."
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Ananya Verma</div>
            <div style={{ fontSize: '0.75rem', color: '#6B9B76' }}>Property Owner, Landlord</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px', fontStyle: 'italic' }}>
              "Midnight zero-knowledge integration makes this the safest property rental platform in India."
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Vikram Patel</div>
            <div style={{ fontSize: '0.75rem', color: '#EBA834' }}>Web3 Enthusiast</div>
          </div>
        </div>
      </div>
    </div>
  );
}
