/**
 * apps/backend/src/services/anomalyDetector/index.js
 *
 * RoofProof Form 16 Anomaly & Modification Detector Engine.
 *
 * OUTPUT FORMAT:
 * {
 *   "tamperingRisk": "LOW | MEDIUM | HIGH | UNKNOWN",
 *   "anomalyScore": 0.0,
 *   "flags": [],
 *   "status": "PASS | REVIEW_REQUIRED | REJECTED",
 *   "message": "...",
 *   "features": { ... }
 * }
 */

import { extractDocumentFeatures } from './featureExtractor.js';
import { predictAnomalyScore } from './trainModel.js';

export function analyzeDocumentAnomalies(pdfBuffer, rawText = '', extractedSalary = null) {
  // 1. Extract 8 Anomaly Features
  const features = extractDocumentFeatures(pdfBuffer, rawText);

  // 2. Predict Anomaly Score via ML Model Weights
  let anomalyScore = predictAnomalyScore(features);
  const flags = [];

  // Check 0: Is this even a Form 16 document?
  if (features.is_form_16_flag === 0) {
    flags.push('Invalid document structure: Official Form 16 Part B structural markers not found.');
    anomalyScore = Math.max(anomalyScore, 0.85);
  }

  // Check 1: Font Inconsistencies
  if (features.font_inconsistency_score > 0.50) {
    flags.push('Font inconsistency detected near salary text streams.');
  }

  // Check 2: OCR vs PDF Stream Text Mismatch
  if (features.ocr_text_mismatch_score > 0.30) {
    flags.push('Mismatch between OCR text layer and underlying PDF character stream.');
  }

  // Check 3: Modified Income Field
  if (features.income_field_modified_flag === 1) {
    flags.push('Salary field modification or text overlay annotation detected.');
  }

  // Check 4: Suspicious Overlay Objects
  if (features.suspicious_overlay_flag === 1) {
    flags.push('Suspicious overlay object / duplicate text bounding box detected.');
  }

  // Check 5: Layout Anomaly
  if (features.layout_anomaly_score > 0.50) {
    flags.push('Layout spacing or salary row structure anomaly detected.');
  }

  // Check 6: Arithmetic Inconsistencies
  if (features.arithmetic_inconsistency_flag === 1) {
    flags.push('Form 16 arithmetic calculation mismatch: salary breakdown lines do not add up to Total Salary.');
  }

  // Check 7: PDF Object Anomaly
  if (features.pdf_object_anomaly_flag === 1) {
    flags.push('PDF revision stream anomaly or incremental modification xref detected.');
  }

  // Check 8: Third-Party Editor Metadata
  if (features.metadata_anomaly_flag === 1) {
    flags.push('Document created or modified using unauthorized PDF editing software (Canva, Photoshop, Sejda, etc.).');
  }

  // Check Outliers for 1(d) Total salary
  if (extractedSalary !== null) {
    if (extractedSalary > 30000000) {
      flags.push('Income figure exceeds realistic threshold (> ₹3,00,00,000/yr).');
      anomalyScore = Math.max(anomalyScore, 0.65);
    } else if (extractedSalary < 50000) {
      flags.push('Income figure below minimum baseline (< ₹50,000/yr).');
      anomalyScore = Math.max(anomalyScore, 0.65);
    }
  }

  anomalyScore = Number(Math.min(1.0, Math.max(0.0, anomalyScore)).toFixed(2));

  // 3. Determine Tampering Risk Level & User Flow Status
  let tamperingRisk = 'LOW';
  let status = 'PASS';

  const isFakeOrTampered =
    features.is_form_16_flag === 0 ||
    features.arithmetic_inconsistency_flag === 1 ||
    features.income_field_modified_flag === 1 ||
    features.metadata_anomaly_flag === 1 ||
    features.suspicious_overlay_flag === 1 ||
    features.font_inconsistency_score >= 0.80 ||
    anomalyScore >= 0.35;

  if (isFakeOrTampered) {
    tamperingRisk = 'HIGH';
    status = 'REJECTED';
  } else if (extractedSalary === null) {
    tamperingRisk = 'UNKNOWN';
    status = 'REVIEW_REQUIRED';
    flags.push('1(d) Total salary field could not be confidently located in Form 16.');
  } else if (anomalyScore >= 0.20) {
    tamperingRisk = 'MEDIUM';
    status = 'REVIEW_REQUIRED';
  }

  const message = tamperingRisk === 'HIGH'
    ? 'Document verification failed: Artificial intelligence detected document tampering or non-standard Form 16 structure.'
    : tamperingRisk === 'MEDIUM' || tamperingRisk === 'UNKNOWN'
    ? 'Possible document modification or unconfirmed field detected. Manual review required.'
    : 'Document analysis completed successfully: Verified authentic Form 16.';

  return {
    tamperingRisk,
    anomalyScore,
    flags,
    status,
    message,
    features,
  };
}
