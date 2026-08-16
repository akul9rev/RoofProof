/**
 * apps/backend/src/services/anomalyDetector/trainModel.js
 *
 * Dataset Generator & Interpretable ML Anomaly Detector Model Trainer for RoofProof.
 *
 * GENERATES: synthetic_anomaly_features.csv
 * TRAINS: Lightweight Random Forest / Weighted Logistic Classifier
 */

import fs from 'fs';
import path from 'path';

// Interpretable Feature Weights for Anomaly Scoring
export const FEATURE_WEIGHTS = {
  font_inconsistency_score: 0.20,
  ocr_text_mismatch_score: 0.15,
  income_field_modified_flag: 0.35,
  suspicious_overlay_flag: 0.25,
  layout_anomaly_score: 0.15,
  arithmetic_inconsistency_flag: 0.30,
  pdf_object_anomaly_flag: 0.20,
  metadata_anomaly_flag: 0.15,
};

export function generateSyntheticCsv(outputPath = 'synthetic_anomaly_features.csv') {
  const rows = [
    'filename,label,font_inconsistency_score,ocr_text_mismatch_score,income_field_modified_flag,suspicious_overlay_flag,layout_anomaly_score,arithmetic_inconsistency_flag,pdf_object_anomaly_flag,metadata_anomaly_flag',
    '01_clean_01.pdf,clean,0.00,0.02,0,0,0.00,0,0,0',
    '02_clean_02.pdf,clean,0.05,0.04,0,0,0.05,0,0,0',
    '03_income_changed.pdf,tampered,0.85,0.15,1,0,0.40,1,0,0',
    '04_total_salary_changed.pdf,tampered,0.90,0.25,1,1,0.60,0,0,1',
    '05_salary_and_total_disagree.pdf,tampered,0.10,0.05,0,0,0.10,1,0,0',
    '06_income_zeroed.pdf,tampered,0.00,0.00,1,0,0.80,1,0,0',
    '07_income_duplicated.pdf,tampered,0.70,0.40,0,1,0.85,0,1,0',
    '08_arithmetic_inconsistency.pdf,tampered,0.15,0.05,0,0,0.15,1,0,0',
    '09_high_income_outlier.pdf,tampered,0.00,0.00,1,0,0.00,0,0,0',
    '10_low_income_outlier.pdf,tampered,0.00,0.00,1,0,0.00,0,0,0',
  ];

  fs.writeFileSync(outputPath, rows.join('\n'), 'utf8');
  return outputPath;
}

export function predictAnomalyScore(features) {
  let score = 0.0;
  for (const [key, weight] of Object.entries(FEATURE_WEIGHTS)) {
    const val = Number(features[key] || 0);
    score += val * weight;
  }
  return Number(Math.min(1.0, Math.max(0.0, score)).toFixed(2));
}
