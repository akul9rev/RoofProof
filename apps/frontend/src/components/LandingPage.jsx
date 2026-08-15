import React from 'react';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, ArrowRight, FileCheck, Layers, Award, Sparkles } from 'lucide-react';

export default function LandingPage({ onExploreHomes, onListProperty, onLearnPrivacy }) {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
            <span className="badge-pill badge-midnight" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
              <Sparkles size={14} /> Built & Verified on Midnight Network Preview
            </span>
          </div>

          <h1 style={{
            fontSize: '3.6rem',
            lineHeight: 1.15,
            marginBottom: '24px',
            fontWeight: 800,
          }}>
            Rent without revealing your <br />
            <span style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              bank statements or salary
            </span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            lineHeight: 1.6,
          }}>
            RoofProof leverages Zero-Knowledge smart contracts on Midnight to let tenants prove they meet rent income thresholds — without handing over sensitive payslips, bank balances, or tax returns.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onExploreHomes} style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Find a Home (Tenant) <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={onListProperty} style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              List a Property (Landlord)
            </button>
          </div>
        </div>
      </section>

      {/* The Problem vs RoofProof Solution */}
      <section className="container" style={{ margin: '40px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Why Traditional Rental Verification is Broken</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Tenants sacrifice total financial privacy just to rent an apartment.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}>
          {/* Traditional Way */}
          <div className="glass-card" style={{
            padding: '32px',
            border: '1px solid var(--danger-border)',
            background: 'rgba(30, 15, 20, 0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--danger-text)'
              }}>
                ✕
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--danger-text)' }}>Traditional Rental Verification</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--danger-text)' }}>•</span> Landlords demand 3–6 months of complete unredacted bank statements.
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--danger-text)' }}>•</span> Exposes exact salaries, employer bonuses, account balances, and spending habits.
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--danger-text)' }}>•</span> High risk of identity theft, data leaks, and arbitrary landlord discrimination.
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--danger-text)' }}>•</span> Data stored insecurely in landlord email inboxes or WhatsApp chats.
              </li>
            </ul>
          </div>

          {/* RoofProof ZK Way */}
          <div className="glass-card" style={{
            padding: '32px',
            border: '1px solid var(--success-border)',
            background: 'rgba(10, 30, 25, 0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--success-text)'
              }}>
                <CheckCircle2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--success-text)' }}>RoofProof (Zero-Knowledge)</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--success-text)' }}>✓</span> Income is evaluated strictly in the tenant's browser memory.
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--success-text)' }}>✓</span> ZK SNARK cryptographic proof submitted to the Midnight blockchain.
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--success-text)' }}>✓</span> Landlord only receives a cryptographic verification: <strong>"Eligible ✓"</strong>.
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--success-text)' }}>✓</span> <strong>Zero</strong> financial figures, account numbers, or documents are stored or disclosed.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="container" style={{ margin: '80px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill badge-midnight" style={{ marginBottom: '12px' }}>How it Works</span>
          <h2 style={{ fontSize: '2.2rem' }}>Cryptographic Proof in 3 Simple Steps</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Lock size={26} color="#ffffff" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>1. Local Evaluation</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Tenant enters their private income. The computation happens strictly in local memory and never touches our servers.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Layers size={26} color="#ffffff" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>2. Midnight ZK Circuit</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              The Compact circuit <code style={{ color: 'var(--midnight-accent)' }}>verifyEligibility</code> proves <code style={{ color: 'var(--midnight-accent)' }}>income &ge; threshold</code> on the Midnight Preview blockchain.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Award size={26} color="#ffffff" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>3. Verified Rental Status</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Landlord reviews the application and sees the on-chain verified status: <span style={{ color: 'var(--success-text)', fontWeight: 700 }}>Eligible ✓</span>.
            </p>
          </div>
        </div>
      </section>

      {/* On-Chain Verified Details CTA */}
      <section className="container">
        <div className="glass-card" style={{
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(22, 29, 46, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid var(--border-glow)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-pill badge-eligible">Live on Preview</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contract: 94010caedf...</span>
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Inspect RoofProof Zero-Knowledge Architecture</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Explore the deployed Midnight Compact contract, proof generation metrics, and privacy ledger state.
            </p>
          </div>
          <button className="btn-secondary" onClick={onLearnPrivacy} style={{ padding: '12px 24px' }}>
            View ZK Details <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
