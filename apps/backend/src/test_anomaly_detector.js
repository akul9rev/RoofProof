/**
 * apps/backend/src/test_anomaly_detector.js
 *
 * Test Suite & Evaluation Runner for RoofProof Form 16 Anomaly Detector.
 */

import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { extractTextFromPdf } from './services/pdfExtractor/index.js';
import { generateSyntheticCsv } from './services/anomalyDetector/trainModel.js';

const DATASET_DIR = path.resolve('apps/backend/src/test_data/dataset');

async function createSyntheticDatasetPdf(filename, options = {}) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([600, 800]);

  // Draw Standard Form 16 Header
  page.drawText('FORM 16 — SYNTHETIC TEST SAMPLE', { x: 50, y: 750, size: 14, font: fontBold });
  page.drawText('SAMPLE — NOT VALID. Fictional document for software testing only.', { x: 50, y: 735, size: 9, font, color: rgb(1, 0, 0) });

  page.drawText('PART A — Synthetic Certificate Details', { x: 50, y: 700, size: 12, font: fontBold });
  page.drawText('Certificate No: SYN-TEST-2026-001', { x: 50, y: 680, size: 9, font });
  page.drawText('Assessment Year: 2025-26', { x: 50, y: 665, size: 9, font });

  page.drawText('PART B — Synthetic Salary / Tax Fields', { x: 50, y: 630, size: 12, font: fontBold });

  const val1a = options.val1a || '750,000';
  const val1b = options.val1b || '25,000';
  const val1d = options.val1d !== undefined ? options.val1d : '775,000';
  const val2 = options.val2 || '50,000';
  const val3 = options.val3 || '725,000';
  const val6 = options.val6 || '700,000';

  page.drawText(`1(a) Salary under section 17(1): Rs. ${val1a}`, { x: 50, y: 600, size: 9, font });
  page.drawText(`1(b) Value of perquisites: Rs. ${val1b}`, { x: 50, y: 585, size: 9, font });

  if (val1d !== null) {
    page.drawText(`1(d) Total salary: Rs. ${val1d}`, { x: 50, y: 570, size: 9, font: options.fontInconsistent ? fontBold : font });
  }

  page.drawText(`2(i) Total exemption under section 10: Rs. ${val2}`, { x: 50, y: 550, size: 9, font });
  page.drawText(`3. Total salary from current employer: Rs. ${val3}`, { x: 50, y: 535, size: 9, font });
  page.drawText('4(a) Standard deduction: Rs. 50,000', { x: 50, y: 520, size: 9, font });
  page.drawText(`6. Income chargeable under "Salaries": Rs. ${val6}`, { x: 50, y: 505, size: 9, font: fontBold });

  if (options.overlayText) {
    page.drawText(options.overlayText, { x: 180, y: 570, size: 10, font: fontBold, color: rgb(0, 0, 1) });
  }

  if (options.comment) {
    page.drawText(`TEST CONDITION: ${options.comment}`, { x: 50, y: 460, size: 8, font, color: rgb(0.8, 0, 0) });
  }

  const bytes = await pdfDoc.save();
  const filePath = path.join(DATASET_DIR, filename);
  fs.mkdirSync(DATASET_DIR, { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(bytes));
  return { filePath, buffer: Buffer.from(bytes) };
}

async function runAnomalyDetectorTests() {
  console.log('======================================================');
  console.log('ROOFPROOF FORM 16 ANOMALY DETECTOR SPECIFICATION TEST');
  console.log('======================================================\n');

  // 1. Generate Synthetic Features CSV
  const csvPath = generateSyntheticCsv('synthetic_anomaly_features.csv');
  console.log(`✓ Training dataset CSV generated: ${csvPath}\n`);

  // 2. Generate Synthetic PDFs
  const pdfSpecs = [
    { file: '01_clean_01.pdf', opts: {} },
    { file: '02_clean_02.pdf', opts: { val1a: '920,000', val1d: '945,000', val3: '895,000', val6: '870,000' } },
    { file: '03_income_changed.pdf', opts: { val1d: '1,525,000', comment: '03_income_changed' } },
    { file: '04_total_salary_changed.pdf', opts: { val1d: '1,525,000', overlayText: 'Rs. 1,525,000', fontInconsistent: true, comment: '04_total_salary_changed' } },
    { file: '05_salary_and_total_disagree.pdf', opts: { val1a: '750,000', val1b: '25,000', val1d: '1,200,000', comment: '05_salary_and_total_disagree' } },
    { file: '06_income_zeroed.pdf', opts: { val1d: null, comment: '06_income_zeroed' } },
    { file: '07_income_duplicated.pdf', opts: { val1d: '775,000', comment: '07_income_duplicated' } },
    { file: '08_arithmetic_inconsistency.pdf', opts: { val1d: '775,000', val2: '50,000', val3: '1,200,000', comment: '08_arithmetic_inconsistency' } },
    { file: '09_high_income_outlier.pdf', opts: { val1d: '50,000,000', comment: '09_high_income_outlier' } },
    { file: '10_low_income_outlier.pdf', opts: { val1d: '10,000', comment: '10_low_income_outlier' } },
  ];

  console.log('EVALUATION RESULTS FOR EVERY SYNTHETIC TEST PDF:\n');
  console.log('---------------------------------------------------------------------------------------------------------');
  console.log(
    'Filename'.padEnd(32) +
    'Extracted Salary'.padEnd(20) +
    'Anomaly Score'.padEnd(16) +
    'Risk'.padEnd(12) +
    'Status'
  );
  console.log('---------------------------------------------------------------------------------------------------------');

  for (const item of pdfSpecs) {
    const { buffer } = await createSyntheticDatasetPdf(item.file, item.opts);
    const result = await extractTextFromPdf(buffer, item.file, 'application/pdf');

    const salaryStr = result.extractedSalary ? `₹${result.extractedSalary.toLocaleString('en-IN')}` : 'NULL';
    const scoreStr = result.anomalyScore.toFixed(2);
    const riskStr = result.tamperingRisk;
    const statusStr = result.status;

    console.log(
      item.file.padEnd(32) +
      salaryStr.padEnd(20) +
      scoreStr.padEnd(16) +
      riskStr.padEnd(12) +
      statusStr
    );

    if (result.flags && result.flags.length > 0) {
      console.log('   └─ Flags: ' + result.flags.join(' | '));
    }
  }

  console.log('---------------------------------------------------------------------------------------------------------\n');
  console.log('✓ All 10 Synthetic Dataset PDF Anomaly Tests Executed Successfully.');
}

runAnomalyDetectorTests().catch((err) => {
  console.error('[Anomaly Detector Test Error]', err);
  process.exit(1);
});
