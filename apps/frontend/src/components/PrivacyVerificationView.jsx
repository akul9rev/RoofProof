import React from 'react';
import { ShieldCheck, Lock, Layers, Database, Cpu, CheckCircle2, ArrowRight, EyeOff, Sparkles } from 'lucide-react';
import { MIDNIGHT_CONTRACT_INFO } from '../services/zkProofService';

export default function PrivacyVerificationView() {
  return (
    <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge-pill badge-midnight" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> Zero-Knowledge Cryptography
        </span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Your Income Stays 100% Private</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
          How RoofProof protects tenant financial privacy using the Midnight blockchain Compact circuits.
        </p>
      </div>

      {/* Interactive Cryptographic Pipeline Diagram */}
      <div className="glass-card" style={{ padding: '36px', marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '24px', textAlign: 'center' }}>
          RoofProof ZK Proof Verification Pipeline
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'center',
          position: 'relative',
        }}>
          {/* Step 1 */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Lock size={20} color="#ffffff" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Step 1: Local Device</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Private Income</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              e.g. ₹74,500 (Never transmitted)
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Cpu size={20} color="#ffffff" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--midnight-accent)', fontWeight: 700, textTransform: 'uppercase' }}>Step 2: ZK Prover</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Compact Circuit</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <code>income &ge; threshold</code>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Layers size={20} color="#ffffff" />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>Step 3: Midnight</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>On-Chain Ledger</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Public status verification
            </div>
          </div>

          {/* Step 4 */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <CheckCircle2 size={20} color="#ffffff" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 700, textTransform: 'uppercase' }}>Step 4: Landlord</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px', color: 'var(--success-text)' }}>Eligible ✓</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Zero leaks guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed On-Chain Evidence Box */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem' }}>Live Midnight Preview Deployment Evidence</h3>
          <span className="badge-pill badge-eligible">100% On-Chain Verified</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Midnight Contract Address
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--midnight-accent)', wordBreak: 'break-all' }}>
              {MIDNIGHT_CONTRACT_INFO.contractAddress}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Deployment Transaction ID
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
              {MIDNIGHT_CONTRACT_INFO.deployTx}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              verifyEligibility Transaction ID
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
              {MIDNIGHT_CONTRACT_INFO.verifiedSampleTx}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Public Income Disclosure Check
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success-text)' }}>
              NO (0 Bytes Exchanged)
            </div>
          </div>
        </div>
      </div>

      {/* Security Principles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <EyeOff size={24} color="var(--accent-secondary)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No Server-Side Stored Income</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            The PostgreSQL database schema strictly excludes any columns for tenant income, payslips, or financial attachments.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <Lock size={24} color="var(--midnight-accent)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Compact Smart Contracts</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Compiled with Midnight Compact 0.27.0 into zero-knowledge circuits with private witnesses and public ledger state.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <ShieldCheck size={24} color="var(--success-text)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Anti-Discrimination</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Landlords cannot cherry-pick tenants based on exact wealth brackets or employer names. All applicants meeting the threshold are objectively verified.
          </p>
        </div>
      </div>
    </div>
  );
}
