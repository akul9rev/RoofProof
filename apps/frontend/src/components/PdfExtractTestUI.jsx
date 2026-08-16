import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { extractPdfText } from '../services/api';

export default function PdfExtractTestUI() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only .pdf files are supported.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a PDF file first.');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setResult(null);

    try {
      const res = await extractPdfText(selectedFile);
      setIsExtracting(false);

      if (!res || res.success === false) {
        setError(res?.error || 'Extraction failed.');
        return;
      }

      setResult(res);
    } catch (err) {
      setIsExtracting(false);
      setError(err.message || 'Error extracting text from PDF.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>FORM 16 TEXT EXTRACTION</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Development / Testing UI • PDF → Text Pipeline Only</p>

      <form onSubmit={handleExtract} style={{ marginBottom: '24px' }}>
        <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: '8px', padding: '24px', textAlign: 'center', background: 'var(--bg-primary)', marginBottom: '16px' }}>
          <FileText size={36} color="var(--accent-secondary)" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
            {selectedFile ? selectedFile.name : 'Choose PDF File'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Accepts PDF files up to 10 MB.'}
          </div>
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} id="test-pdf-input" style={{ display: 'none' }} />
          <label htmlFor="test-pdf-input" className="btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer', fontSize: '0.85rem' }}>
            <Upload size={16} style={{ marginRight: '6px' }} />
            {selectedFile ? 'Change File' : 'Upload PDF'}
          </label>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isExtracting ? (
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <Loader2 className="animate-spin" size={28} color="var(--accent-secondary)" style={{ margin: '0 auto 8px' }} />
            <div>Extracting PDF text...</div>
          </div>
        ) : (
          <button type="submit" className="btn-primary" disabled={!selectedFile} style={{ width: '100%', justifyContent: 'center', opacity: selectedFile ? 1 : 0.5 }}>
            Extract Text
          </button>
        )}
      </form>

      {result && (
        <div style={{ background: 'var(--bg-primary)', borderRadius: '8px', padding: '20px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-text)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>
            <CheckCircle2 size={22} />
            <span>✓ Extraction successful</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <div>Pages: <strong>{result.pageCount}</strong></div>
            <div>Method: <strong>{result.extractionMethod}</strong></div>
            <div>OCR Used: <strong>{result.ocrUsed ? 'Yes' : 'No'}</strong></div>
            <div>Confidence: <strong>{Math.round(result.confidence * 100)}%</strong></div>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Extracted Text:</div>
          <pre style={{ background: '#090d16', padding: '16px', borderRadius: '6px', fontSize: '0.82rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace' }}>
            {result.text}
          </pre>
        </div>
      )}
    </div>
  );
}
