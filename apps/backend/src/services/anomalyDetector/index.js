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
 *   "status": "PASS | REVIEW_REQUIRED | REJECTED"
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

  if (features.font_inconsistency_score > 0.50) {
    flags.push('Font inconsistency detected near 1(d) Total salary line.');
  }

  if (features.ocr_text_mismatch_score > 0.30) {
    flags.push('Mismatch between OCR text stream and embedded PDF stream.');
  }

  if (features.income_field_modified_flag === 1) {
    flags.push('Salary field modification or text layer edit detected.');
  }

  if (features.suspicious_overlay_flag === 1) {
    flags.push('Suspicious text overlay object detected.');
  }

  if (features.layout_anomaly_score > 0.50) {
    flags.push('Layout spacing or table structure anomaly detected.');
  }

  if (features.arithmetic_inconsistency_flag === 1) {
    flags.push('Salary field inconsistency detected: related salary values do not add up.');
  }

  if (features.pdf_object_anomaly_flag === 1) {
    flags.push('PDF revision stream or duplicate object anomaly detected.');
  }

  if (features.metadata_anomaly_flag === 1) {
    flags.push('Document produced using non-standard PDF creation/modification software.');
  }

  // Check Outliers for 1(d) Total salary
  if (extractedSalary !== null) {
    if (extractedSalary > 30000000) {
      flags.push('High income outlier detected (exceeds ₹3,00,00,000/yr).');
      anomalyScore = Math.max(anomalyScore, 0.65);
    } else if (extractedSalary < 50000) {
      flags.push('Low income outlier detected (below ₹50,000/yr).');
      anomalyScore = Math.max(anomalyScore, 0.65);
    }
  }

  anomalyScore = Number(Math.min(1.0, Math.max(0.0, anomalyScore)).toFixed(2));

  // 3. Determine Tampering Risk Level & User Flow Status
  let tamperingRisk = 'LOW';
  let status = 'PASS';

  if (extractedSalary === null) {
    tamperingRisk = 'UNKNOWN';
    status = 'REVIEW_REQUIRED';
    flags.push('1(d) Total salary field could not be confidently found.');
  } else if (
    anomalyScore >= 0.40 ||
    features.arithmetic_inconsistency_flag === 1 ||
    features.income_field_modified_flag === 1 ||
    features.pdf_object_anomaly_flag === 1 ||
    features.suspicious_overlay_flag === 1
  ) {
    tamperingRisk = 'HIGH';
    status = 'REJECTED';
  } else if (anomalyScore >= 0.20) {
    tamperingRisk = 'MEDIUM';
    status = 'REVIEW_REQUIRED';
  }

  const message = tamperingRisk === 'HIGH'
    ? 'Document verification could not be completed because significant anomalies were detected.'
    : tamperingRisk === 'MEDIUM' || tamperingRisk === 'UNKNOWN'
    ? 'Possible document modification or unconfirmed field detected. Manual review required.'
    : 'Document analysis found no significant modification indicators.';

  return {
    tamperingRisk,
    anomalyScore,
    flags,
    status,
    message,
    features,
  };
}
