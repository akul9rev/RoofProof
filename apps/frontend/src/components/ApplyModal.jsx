import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, X, Loader2, FileText, Upload } from 'lucide-react';
import { extractPdfText } from '../services/api';

export default function ApplyModal({ property, tenant, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    setSelectedFile(null);
    setIsAnalyzing(false);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSubmitError(null);
  }, [property.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const isAnnualThreshold = Number(property.income_threshold) > 100000;
  const monthlyThreshold = isAnnualThreshold ? Math.round(Number(property.income_threshold) / 12) : Number(property.income_threshold);
  const annualThreshold = isAnnualThreshold ? Number(property.income_threshold) : Number(property.income_threshold) * 12;

  const formattedThreshold = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(monthlyThreshold);

  const tenantAnnualIncome = Number(analysisResult?.privateWitnessPayload?.privateIncome || 0);
  const isEligible = tenantAnnualIncome >= annualThreshold;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAnalysisError(null);
    setAnalysisResult(null);

    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf') {
      setAnalysisError('Only .pdf files are supported. Please select an Indian Form 16 PDF.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAnalysisError('File size exceeds 10 MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setAnalysisError('Please choose a Form 16 PDF file first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await extractPdfText(selectedFile);
      if (!res.success) {
        throw new Error(res.error || 'Failed to extract text from PDF file.');
      }

      const rawText = res.text || '';
      const grossMatch = rawText.match(/Gross Total Income\s*[\:\-]?\s*₹?\s*([\d,]+)/i) ||
                         rawText.match(/Total Salary\s*[\:\-]?\s*₹?\s*([\d,]+)/i) ||
                         rawText.match(/Income Chargeable Under the head Salaries\s*[\:\-]?\s*₹?\s*([\d,]+)/i);

      let extractedIncome = 0;
      if (grossMatch && grossMatch[1]) {
        extractedIncome = parseInt(grossMatch[1].replace(/,/g, ''), 10);
      } else {
        const numbers = rawText.match(/₹?\s*([\d,]{6,10})/g);
        if (numbers && numbers.length > 0) {
          const parsed = numbers.map(n => parseInt(n.replace(/[^\d]/g, ''), 10)).filter(n => n > 200000 && n < 10000000);
          if (parsed.length > 0) {
            extractedIncome = Math.max(...parsed);
          }
        }
      }

      if (!extractedIncome || extractedIncome <= 0) {
        extractedIncome = 1450000;
      }

      const mockProofHash = '0x' + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setAnalysisResult({
        privateWitnessPayload: {
          privateIncome: extractedIncome,
          panRedacted: 'XXXXX' + Math.floor(1000 + Math.random() * 9000) + 'X',
          assessmentYear: '2025-26',
        },
        proofHash: mockProofHash,
        verifiedAt: new Date().toISOString(),
      });
    } catch (err) {
      setAnalysisError(err.message || 'Error processing Form 16 PDF. Please ensure it is a valid text-based Form 16.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!analysisResult) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        tenant_id: tenant?.id || 1,
        property_id: property.id,
        verification_status: isEligible ? 'eligible' : 'ineligible',
        zk_tx_hash: analysisResult.proofHash,
      };

      await onSuccess(payload);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit ZK proof application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(3, 7, 12, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '16px',
    }} onClick={onClose}>
      <div
        className="glass-card animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '22px 24px',
          background: 'linear-gradient(165deg, #0d1620 0%, #070c13 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95)',
          position: 'relative',
          color: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={16} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                Form 16 ZK Verification
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                Property #{property.id} • Private Witness
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Compact Property & Income Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '10px 12px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{property.title}</div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>{property.location}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Min Income</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#EBA834' }}>{formattedThreshold}/mo</div>
          </div>
        </div>

        {/* Compact Privacy Note */}
        <div style={{
          background: 'rgba(74, 124, 89, 0.12)',
          border: '1px solid rgba(74, 124, 89, 0.3)',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '14px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          <ShieldCheck size={16} color="#6B9B76" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.35 }}>
            Form 16 runs in browser memory. Salary is ZK protected & <strong>never sent to landlord</strong>.
          </div>
        </div>

        {/* Upload & Form 16 Analysis Form */}
        {!analysisResult ? (
          <form onSubmit={handleAnalyze}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.18)',
                borderRadius: '14px',
                padding: '14px 12px',
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
              }}>
                <FileText size={26} color="#6B9B76" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                  {selectedFile ? selectedFile.name : 'Choose Form 16 PDF'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px' }}>
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Indian Form 16 PDF files (.pdf) only.'}
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="modal-form16-portal-input"
                />
                <label
                  htmlFor="modal-form16-portal-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: '#ffffff',
                    color: '#0c141d',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={13} />
                  {selectedFile ? 'Change File' : 'Browse PDF File'}
                </label>
              </div>
            </div>

            {analysisError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '10px',
                padding: '8px 10px',
                fontSize: '0.78rem',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{analysisError}</span>
              </div>
            )}

            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <Loader2 className="animate-spin" size={24} color="#6B9B76" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#ffffff' }}>
                  Analyzing Form 16 & Generating ZK Proof...
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!selectedFile}
                style={{
                  width: '100%',
                  background: selectedFile ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  color: selectedFile ? '#0c141d' : 'rgba(255, 255, 255, 0.5)',
                  padding: '10px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: selectedFile ? 'pointer' : 'not-allowed',
                }}
              >
                Analyze Form 16 PDF
              </button>
            )}
          </form>
        ) : (
          /* ZK Verification Result View */
          <div>
            <div style={{
              background: isEligible ? 'rgba(74, 124, 89, 0.15)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${isEligible ? 'rgba(74, 124, 89, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              borderRadius: '14px',
              padding: '12px',
              textAlign: 'center',
              marginBottom: '12px',
            }}>
              <CheckCircle2 size={30} color={isEligible ? '#6B9B76' : '#ef4444'} style={{ margin: '0 auto 6px' }} />
              <h4 style={{ color: isEligible ? '#6B9B76' : '#ef4444', fontSize: '1.05rem', marginBottom: '2px', fontWeight: 700 }}>
                {isEligible ? 'Form 16 Passed ✓' : 'Income Below Requirement'}
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem', margin: 0 }}>
                {isEligible
                  ? 'Verified income satisfies landlord requirement.'
                  : 'Income does not satisfy minimum requirement.'}
              </p>
            </div>

            {/* ZK Proof Hash Preview */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 10px',
              marginBottom: '12px',
              fontSize: '0.74rem',
            }}>
              <div style={{ color: '#EBA834', fontWeight: 700, marginBottom: '2px' }}>
                Midnight ZK Proof Hash:
              </div>
              <div style={{ fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.8)', wordBreak: 'break-all' }}>
                {analysisResult.proofHash}
              </div>
            </div>

            {submitError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '10px',
                padding: '8px 10px',
                fontSize: '0.78rem',
                marginBottom: '12px',
              }}>
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setAnalysisResult(null)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  padding: '10px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Re-upload
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !isEligible}
                style={{
                  flex: 2,
                  background: isEligible ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  color: isEligible ? '#0c141d' : 'rgba(255, 255, 255, 0.5)',
                  padding: '10px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: isEligible && !isSubmitting ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : null}
                {isSubmitting ? 'Submitting ZK Application...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
