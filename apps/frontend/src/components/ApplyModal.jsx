import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, X, ArrowRight, Loader2, Sparkles, Wallet, Info } from 'lucide-react';
import { executeMidnightZKVerification, getLaceWallet } from '../services/zkProofService';

export default function ApplyModal({ property, tenant, onClose, onSuccess }) {
  const [income, setIncome] = useState('74500');
  const [isProving, setIsProving] = useState(false);
  const [proofResult, setProofResult] = useState(null);
  const [error, setError] = useState(null);
  const [proofSteps, setProofSteps] = useState([]);

  const formattedThreshold = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.income_threshold);
  const hasLace = !!getLaceWallet();

  const handleGenerateAndSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProving(true);
    setProofSteps([]);

    try {
      const result = await executeMidnightZKVerification({
        applicationId: property.id,
        incomeThreshold: property.income_threshold,
        privateIncome: income,
        onStepProgress: (step) => setProofSteps((prev) => [...prev, step]),
      });

      setIsProving(false);
      setProofResult(result);
    } catch (err) {
      setIsProving(false);
      setError(err.message || 'Error executing Midnight Zero-Knowledge verification.');
    }
  };

  const handleFinalSubmit = () => {
    // SECURITY AUDIT: Send ONLY non-sensitive payload to backend (NO income!)
    onSuccess({
      propertyId: property.id,
      tenant_id: tenant.id,
      verification_status: proofResult.verificationStatus,
      zk_tx_hash: proofResult.zkTxHash,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="glass-card animate-slide-up" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          width: '100%',
          padding: '32px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Lock size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Private ZK Rental Verification</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: Property #{property.id} • Midnight Preview</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Property Summary */}
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '1.05rem' }}>{property.title}</h4>
            <span className="badge-pill badge-midnight">App Target ID #{property.id}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>{property.location}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Required Income Threshold:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--midnight-accent)' }}>{formattedThreshold}/mo</span>
          </div>
        </div>

        {/* Mandatory Privacy Explanation Banner */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
        }}>
          <ShieldCheck size={22} color="var(--accent-secondary)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            <strong>Privacy Guarantee:</strong> Your income is used privately to prove eligibility. RoofProof does not send your income to the landlord or store it in the backend.
          </div>
        </div>

        {/* Input Form */}
        {!proofResult ? (
          <form onSubmit={handleGenerateAndSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                Enter Monthly Income (₹) <span style={{ color: 'var(--success-text)', fontSize: '0.8rem' }}>🔒 Stays in browser memory</span>
              </label>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(e.target.value)}
                placeholder="e.g. 74500"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>Try <strong>₹74,500</strong> (Eligible) or <strong>₹40,000</strong> (Ineligible)</span>
                {hasLace ? (
                  <span style={{ color: 'var(--midnight-accent)' }}>✓ Midnight Lace detected</span>
                ) : (
                  <span style={{ color: 'var(--warning-text)' }}>⚠️ Lace not installed (Local Prover Mode)</span>
                )}
              </div>
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger-text)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {isProving ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <Loader2 className="animate-spin" size={32} color="var(--accent-secondary)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
                  Evaluating Midnight Zero-Knowledge Constraints...
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {proofSteps.map((s, i) => (
                    <div key={i} style={{ color: 'var(--accent-secondary)' }}>{s}</div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              >
                <Sparkles size={18} /> Run Midnight Proof & Verify
              </button>
            )}
          </form>
        ) : (
          /* Result View */
          <div>
            <div style={{
              background: proofResult.isEligible ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${proofResult.isEligible ? 'var(--success-border)' : 'var(--danger-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              {proofResult.isEligible ? (
                <>
                  <CheckCircle2 size={40} color="var(--success-text)" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ color: 'var(--success-text)', fontSize: '1.3rem', marginBottom: '6px' }}>Income Requirement Satisfied ✓</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Zero-Knowledge constraint check passed: <code>income &ge; threshold</code>.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle size={40} color="var(--danger-text)" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ color: 'var(--danger-text)', fontSize: '1.3rem', marginBottom: '6px' }}>Income Below Required Threshold</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Entered income does not meet the minimum monthly requirement ({formattedThreshold}).
                  </p>
                </>
              )}
            </div>

            {/* Proof Metadata & Transparency */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Midnight Circuit:</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>verifyEligibility</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Application ID:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>#{property.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Threshold Required:</span>
                <span style={{ color: 'var(--midnight-accent)', fontWeight: 600 }}>{formattedThreshold}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Actual Income:</span>
                <span style={{ color: 'var(--success-text)', fontWeight: 800 }}>NEVER DISCLOSED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Execution Mode:</span>
                <span style={{ color: proofResult.executionMode === 'LACE_WALLET_PREVIEW' ? 'var(--success-text)' : 'var(--warning-text)', fontWeight: 600 }}>
                  {proofResult.executionMode === 'LACE_WALLET_PREVIEW' ? 'Midnight Lace (Preview)' : 'Local Prover (Demo)'}
                </span>
              </div>
              {proofResult.notice && (
                <div style={{ marginTop: '4px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Info size={12} style={{ display: 'inline', marginRight: '4px' }} /> {proofResult.notice}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-secondary"
                onClick={() => setProofResult(null)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Re-test Income
              </button>
              <button
                className="btn-primary"
                onClick={handleFinalSubmit}
                disabled={!proofResult.isEligible}
                style={{ flex: 2, justifyContent: 'center', opacity: proofResult.isEligible ? 1 : 0.5 }}
              >
                Submit Application <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
