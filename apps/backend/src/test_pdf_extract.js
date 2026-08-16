/**
 * apps/backend/src/test_pdf_extract.js
 *
 * 10-Scenario Specification Test Suite for RoofProof PDF Text Extraction Engine.
 */

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { extractTextFromPdf, validatePdfInput } from './services/pdfExtractor/index.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  }
  console.log(`✓ ${message}`);
}

async function createSyntheticPdf({
  pages = 1,
  text = '1(d) Total salary 775,000\nSample document content for text extraction testing.',
  table = false,
  scanned = false,
  corrupt = false,
} = {}) {
  if (corrupt) {
    return Buffer.from('HEADER_CORRUPTED_NOT_A_VALID_PDF_BYTES');
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < pages; i++) {
    const page = pdfDoc.addPage([600, 800]);

    if (!scanned) {
      page.drawText(`Page ${i + 1} of ${pages}`, { x: 50, y: 750, size: 12, font });
      page.drawText(text, { x: 50, y: 720, size: 10, font });

      if (table) {
        page.drawText('Table Summary Data:', { x: 50, y: 680, size: 11, font });
        page.drawText('Item 1 | Description Alpha | Amount 750000.00', { x: 50, y: 660, size: 9, font });
        page.drawText('Item 2 | Description Beta  | Amount 50000.00', { x: 50, y: 640, size: 9, font });
        page.drawText('Total  | Net Calculation   | Amount 700000.00', { x: 50, y: 620, size: 9, font });
      }
    }
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

async function runPdfExtractTestSuite() {
  console.log('=== RoofProof PDF Text Extraction Specification Test Suite ===\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: Text-Based PDF
  const pdf1 = await createSyntheticPdf({ text: '1(d) Total salary 775,000\nStandard text extraction content line 1.\nLine 2.' });
  const res1 = await extractTextFromPdf(pdf1, 'TextDoc.pdf');
  assert(
    res1.success && res1.extractionMethod === 'PDF_TEXT' && res1.confidence > 0.85 && res1.text.includes('Standard text extraction'),
    `TEST 1 — Text-Based PDF: Extracted embedded text (Confidence: ${Math.round(res1.confidence * 100)}%)`
  );
  passed++;

  // TEST 2: Scanned / Image PDF
  const pdf2 = await createSyntheticPdf({ scanned: true });
  const res2 = await extractTextFromPdf(pdf2, 'ScannedDoc.pdf');
  assert(
    res2.extractionMethod === 'OCR' || res2.ocrUsed === true,
    `TEST 2 — Scanned PDF: Triggered OCR fallback path cleanly`
  );
  passed++;

  // TEST 3: Multi-Page PDF
  const pdf3 = await createSyntheticPdf({ pages: 3, text: '1(d) Total salary 775,000\nMulti-page test paragraph content.' });
  const res3 = await extractTextFromPdf(pdf3, 'MultiPage.pdf');
  assert(
    res3.success && res3.pageCount === 3,
    `TEST 3 — Multi-Page PDF: Preserved page count (${res3.pageCount} pages detected)`
  );
  passed++;

  // TEST 4: PDF Containing Tables
  const pdf4 = await createSyntheticPdf({ table: true, text: '1(d) Total salary 775,000\nTable data.' });
  const res4 = await extractTextFromPdf(pdf4, 'TableDoc.pdf');
  assert(
    res4.success && res4.text.includes('Item 1') && res4.text.includes('750000.00'),
    'TEST 4 — PDF Containing Tables: Preserved line breaks and table data structure'
  );
  passed++;

  // TEST 5: PDF Containing Numbers
  const pdf5 = await createSyntheticPdf({ text: '1(d) Total salary 775,000\nReference ID 94010 and Amount 2874510.00 recorded.' });
  const res5 = await extractTextFromPdf(pdf5, 'NumbersDoc.pdf');
  assert(
    res5.success && res5.text.includes('94010') && res5.text.includes('2874510.00'),
    'TEST 5 — PDF Containing Numbers: Preserved exact numeric values without rewriting'
  );
  passed++;

  // TEST 6: Empty PDF File (0 Bytes)
  const emptyBuffer = Buffer.alloc(0);
  const res6 = await extractTextFromPdf(emptyBuffer, 'Empty.pdf');
  assert(
    !res6.success && res6.errorCode === 'EMPTY_FILE',
    'TEST 6 — Empty PDF: Safely rejected 0-byte file buffer'
  );
  passed++;

  // TEST 7: Corrupted PDF File
  const pdf7 = await createSyntheticPdf({ corrupt: true });
  const res7 = await extractTextFromPdf(pdf7, 'Corrupt.pdf');
  assert(
    !res7.success && (res7.errorCode === 'CORRUPTED_PDF' || res7.errorCode === 'UNREADABLE_TEXT'),
    'TEST 7 — Corrupted PDF: Safely handled invalid header bytes without throwing unhandled exceptions'
  );
  passed++;

  // TEST 8: Non-PDF File Upload
  const txtBuffer = Buffer.from('PLAIN_TEXT_CONTENT_NOT_A_PDF');
  const res8 = await extractTextFromPdf(txtBuffer, 'Document.txt', 'text/plain');
  assert(
    !res8.success && res8.errorCode === 'UNSUPPORTED_FILE_TYPE',
    'TEST 8 — Non-PDF File Upload: Safely rejected non-PDF extension/MIME'
  );
  passed++;

  // TEST 9: Oversized File (> 10 MB)
  const hugeBuffer = Buffer.alloc(11 * 1024 * 1024);
  hugeBuffer.write('%PDF-1.4\n', 0, 'utf8');
  const val9 = validatePdfInput(hugeBuffer, 'Large.pdf', 'application/pdf');
  assert(
    !val9.isValid && val9.errorCode === 'FILE_TOO_LARGE',
    'TEST 9 — Oversized File: Safely rejected file exceeding 10 MB limit'
  );
  passed++;

  // TEST 10: Repeated Upload Isolation
  const pdf10a = await createSyntheticPdf({ text: '1(d) Total salary 775,000\nUnique Payload Alpha 123' });
  const pdf10b = await createSyntheticPdf({ text: '1(d) Total salary 775,000\nUnique Payload Beta 999' });
  const res10a = await extractTextFromPdf(pdf10a, 'DocA.pdf');
  const res10b = await extractTextFromPdf(pdf10b, 'DocB.pdf');
  assert(
    res10a.text.includes('Alpha 123') && res10b.text.includes('Beta 999') && !res10b.text.includes('Alpha 123'),
    'TEST 10 — Repeated Upload Isolation: Confirmed zero cross-contamination between successive extractions'
  );
  passed++;

  // TEST 11: Strict 1(d) Total Salary Extraction & REVIEW_REQUIRED Fallback
  const pdf11a = await createSyntheticPdf({
    text: '1(a) Salary under section 17(1) 750,000\n1(b) Value of perquisites 25,000\n1(d) Total salary 775,000\n6. Income chargeable under "Salaries" 700,000',
  });
  const res11a = await extractTextFromPdf(pdf11a, 'Form16_1d.pdf');
  assert(
    res11a.success && res11a.extractedSalary === 775000 && (res11a.status === 'PASS' || res11a.analysisStatus === 'PASSED'),
    `TEST 11a — Strict 1(d) Total Salary Extraction: Extracted exact 1(d) figure (₹${res11a.extractedSalary?.toLocaleString('en-IN')})`
  );
  passed++;

  const pdf11b = await createSyntheticPdf({ text: 'Income chargeable under Salaries 700,000\nGross total income 700,000' });
  const res11b = await extractTextFromPdf(pdf11b, 'Form16_No1d.pdf');
  assert(
    res11b.analysisStatus === 'REVIEW_REQUIRED' && res11b.extractedSalary === null,
    'TEST 11b — Missing 1(d) Total Salary: Correctly returned REVIEW_REQUIRED instead of guessing from other fields'
  );
  passed++;

  console.log(`\n=== TEST SUITE RESULTS: ${passed}/${passed + failed} PASSED (${Math.round((passed / (passed + failed)) * 100)}%) ===`);
  if (failed > 0) process.exit(1);
}

runPdfExtractTestSuite().catch((err) => {
  console.error('[PDF Extract Test Suite Error]', err);
  process.exit(1);
});
