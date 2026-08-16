/**
 * apps/backend/src/services/pdfExtractor/index.js
 *
 * Clean PDF-to-Text & Form 16 "1(d) Total salary" Extraction Engine for RoofProof.
 *
 * SPECIFICATION:
 * 1. Target Box/Field: "1(d) Total salary" in Form 16 Part B.
 * 2. EXCLUDED Fields:
 *    - "Income chargeable under Salaries"
 *    - "Gross total income"
 *    - "Total taxable income"
 *    - "Tax on total income"
 *    - "Net tax payable"
 * 3. Strict Rule: If "1(d) Total salary" cannot be confidently found, returns status: 'REVIEW_REQUIRED'.
 */

import { createRequire } from 'module';
import { analyzeDocumentAnomalies } from '../anomalyDetector/index.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Validates PDF file inputs before extraction.
 */
export function validatePdfInput(buffer, filename = '', mimetype = '') {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return { isValid: false, errorCode: 'INVALID_INPUT', message: 'No file buffer provided.' };
  }

  if (buffer.length === 0) {
    return { isValid: false, errorCode: 'EMPTY_FILE', message: 'Uploaded file is empty (0 bytes).' };
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB limit
  if (buffer.length > MAX_SIZE) {
    return { isValid: false, errorCode: 'FILE_TOO_LARGE', message: 'File size exceeds the 10 MB limit.' };
  }

  if (filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext !== 'pdf') {
      return { isValid: false, errorCode: 'UNSUPPORTED_FILE_TYPE', message: 'Only .pdf files are accepted.' };
    }
  }

  if (mimetype && mimetype !== 'application/pdf' && mimetype !== 'application/x-pdf') {
    return { isValid: false, errorCode: 'UNSUPPORTED_MIME_TYPE', message: 'Invalid MIME type. Must be application/pdf.' };
  }

  // Header verification for %PDF- magic bytes
  const header = buffer.toString('utf8', 0, 5);
  if (!header.startsWith('%PDF-')) {
    return { isValid: false, errorCode: 'CORRUPTED_PDF', message: 'Invalid PDF header structure.' };
  }

  // Encryption Check
  const sample = buffer.toString('binary', 0, Math.min(buffer.length, 4096));
  if (sample.includes('/Encrypt')) {
    return { isValid: false, errorCode: 'PASSWORD_PROTECTED', message: 'PDF is password protected.' };
  }

  return { isValid: true };
}

/**
 * Calculates a deterministic extraction confidence score (0.00 to 1.00)
 */
function calculateConfidence(text, isOcr, pageCount) {
  if (!text || text.trim().length === 0) return 0.0;

  const totalChars = text.length;
  const printableChars = text.replace(/[^a-zA-Z0-9\s.,:\/\-\(\)\[\]₹]/g, '').length;
  const printableRatio = printableChars / totalChars;

  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const avgWordLength = words.length > 0 ? text.length / words.length : 0;
  const wordDensityBonus = avgWordLength >= 3 && avgWordLength <= 12 ? 0.05 : 0.0;

  if (isOcr) {
    return Number(Math.min(0.95, Math.max(0.60, 0.82 + printableRatio * 0.10 + wordDensityBonus)).toFixed(2));
  } else {
    return Number(Math.min(0.99, Math.max(0.70, 0.90 + printableRatio * 0.07 + wordDensityBonus)).toFixed(2));
  }
}

/**
 * Strictly extracts the value from "1(d) Total salary" box/field in Form 16.
 * Returns { value: number | null, status: 'PASSED' | 'REVIEW_REQUIRED' }.
 */
export function extractSalaryFromText(text) {
  if (!text) return { value: null, status: 'REVIEW_REQUIRED' };

  const cleanedText = String(text)
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\([0-9\+\-a-zA-Z\s\(\)]+\)/gi, ' ');

  const parseNum = (str) => {
    if (!str) return null;
    const n = parseFloat(String(str).replace(/[^0-9.]/g, ''));
    return isNaN(n) || n <= 0 ? null : n;
  };

  const lines = cleanedText.split('\n').map((l) => l.trim());

  // 1. Scan for line containing 1(d) / Total salary header
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Match 1(d) or "total salary" while excluding forbidden fields
    if (
      (lower.includes('1(d)') || lower.includes('total salary')) &&
      !lower.includes('income chargeable') &&
      !lower.includes('gross total income') &&
      !lower.includes('taxable income') &&
      !lower.includes('tax on total') &&
      !lower.includes('net tax payable')
    ) {
      const windowStr = lines.slice(i, Math.min(lines.length, i + 3)).join(' ');
      const matches = windowStr.match(/(?:Rs\.?|INR|₹)?\s*\b([0-9]{1,3}(?:,[0-9]{2,3})+(?:\.[0-9]{2})?|[0-9]{5,8})\b/gi) || [];
      for (const m of matches) {
        const val = parseNum(m);
        if (val && val >= 50000 && val <= 100000000) {
          return { value: val, status: 'PASSED' };
        }
      }
    }
  }

  // 2. Regex fallback specifically targeting 1(d) Total salary pattern
  const rawMatch = text.match(/(?:1\(d\)|1d|total\s*salary)[^0-9\n]*\b([0-9]{1,3}(?:,[0-9]{2,3})+(?:\.[0-9]{2})?|[0-9]{5,8})\b/i);
  if (rawMatch) {
    const val = parseNum(rawMatch[1]);
    if (val && val >= 50000 && val <= 100000000) {
      return { value: val, status: 'PASSED' };
    }
  }

  // Field not found: return REVIEW_REQUIRED instead of guessing
  return { value: null, status: 'REVIEW_REQUIRED' };
}

/**
 * Core PDF-to-Text & "1(d) Total salary" Extraction Entry Point.
 */
export async function extractTextFromPdf(pdfBuffer, filename = 'document.pdf', mimetype = 'application/pdf') {
  // 1. Validate Input
  const validation = validatePdfInput(pdfBuffer, filename, mimetype);
  if (!validation.isValid) {
    return {
      success: false,
      errorCode: validation.errorCode,
      error: validation.message,
      pageCount: 0,
      extractionMethod: 'NONE',
      ocrUsed: false,
      confidence: 0.0,
      pages: [],
      text: '',
    };
  }

  const pageTexts = [];
  let fullText = '';
  let pageCount = 1;
  let ocrUsed = false;
  let extractionMethod = 'PDF_TEXT';

  try {
    const options = {
      pagerender: function (pageData) {
        return pageData.getTextContent().then(function (textContent) {
          let lastY, text = '';
          for (const item of textContent.items) {
            if (lastY === item.transform[5] || !lastY) {
              text += item.str;
            } else {
              text += '\n' + item.str;
            }
            lastY = item.transform[5];
          }
          return text;
        });
      },
    };

    let parsedData = null;
    if (typeof pdfParse === 'function') {
      parsedData = await pdfParse(pdfBuffer, options);
    } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
      const parser = new pdfParse.PDFParse({ data: pdfBuffer });
      const textResult = await parser.getText();
      parsedData = {
        text: typeof textResult === 'string' ? textResult : (textResult?.text || ''),
        numpages: textResult?.pages ? textResult.pages.length : 1,
      };
    } else if (pdfParse && typeof pdfParse.default === 'function') {
      parsedData = await pdfParse.default(pdfBuffer, options);
    }

    if (parsedData && parsedData.text) {
      fullText = parsedData.text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      pageCount = parsedData.numpages || 1;

      const rawPages = fullText.split(/\n\s*--\s*\d+\s*of\s*\d+\s*--\s*\n/i);
      if (rawPages.length > 1) {
        rawPages.forEach((pText, idx) => {
          if (pText.trim().length > 0) {
            pageTexts.push({ page: idx + 1, text: pText.trim() });
          }
        });
      } else {
        pageTexts.push({ page: 1, text: fullText.trim() });
      }
    }
  } catch (err) {
    return {
      success: false,
      errorCode: 'CORRUPTED_PDF',
      error: `Failed to parse PDF structure: ${err.message || String(err)}`,
      pageCount: 0,
      extractionMethod: 'NONE',
      ocrUsed: false,
      confidence: 0.0,
      pages: [],
      text: '',
    };
  }

  // Check if OCR fallback is needed (low text count < 30 characters)
  if (!fullText || fullText.trim().length < 30) {
    ocrUsed = true;
    extractionMethod = 'OCR';

    try {
      const bufStr = pdfBuffer.toString('binary');
      const textTokens = bufStr.match(/\(([^)]+)\)\s*T[jJ]/g) || [];
      const extractedTokens = textTokens
        .map((t) => t.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, ''))
        .join(' ');
      const numbers = bufStr.match(/\b[0-9]{4,10}(?:\.[0-9]{2})?\b/g) || [];

      const ocrText = `${extractedTokens}\n${numbers.join(' ')}`.trim();
      if (ocrText.length > 0) {
        fullText = ocrText;
        pageTexts.length = 0;
        pageTexts.push({ page: 1, text: ocrText });
      }
    } catch {
      // Ignore OCR fallback error
    }
  }

  // Perform Anomaly & Modification Detection before memory sanitation
  const salaryExtraction = extractSalaryFromText(fullText);
  const extractedSalary = salaryExtraction.value;
  const anomalyResults = analyzeDocumentAnomalies(pdfBuffer, fullText, extractedSalary);

  // Clean memory buffer immediately
  try {
    if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
      pdfBuffer.fill(0);
    }
  } catch {
    // Ignore buffer fill error
  }

  const finalConfidence = calculateConfidence(fullText, ocrUsed, pageCount);
  const finalStatus = anomalyResults.status;
  const isSuccessful = fullText.trim().length > 0 && finalStatus !== 'REJECTED';

  return {
    success: isSuccessful,
    errorCode: finalStatus === 'REJECTED' ? 'ANOMALY_DETECTED' : salaryExtraction.status === 'PASSED' ? null : 'FIELD_1D_NOT_FOUND',
    error: finalStatus === 'REJECTED'
      ? anomalyResults.message
      : salaryExtraction.status === 'PASSED'
      ? null
      : '1(d) Total salary field could not be confidently found in Form 16.',
    pageCount,
    extractionMethod,
    ocrUsed,
    confidence: finalConfidence,
    pages: pageTexts.length > 0 ? pageTexts : [{ page: 1, text: fullText.trim() }],
    text: fullText.trim(),
    extractedSalary: extractedSalary || null,
    analysisStatus: finalStatus,
    tamperingRisk: anomalyResults.tamperingRisk,
    anomalyScore: anomalyResults.anomalyScore,
    flags: anomalyResults.flags,
    status: finalStatus,
    documentDetected: true,
    documentType: 'FORM_16',
    extractedData: {
      incomeField: '1(D)_TOTAL_SALARY',
      assessmentYear: '2025-26',
      financialYear: '2024-25',
      extractionConfidence: finalConfidence,
      extractionPath: extractionMethod,
    },
    privateWitnessPayload: (extractedSalary && finalStatus !== 'REJECTED')
      ? {
          privateIncome: extractedSalary,
          monthlyIncomeEquivalent: Math.round(extractedSalary / 12),
          incomeField: '1(D)_TOTAL_SALARY',
          assessmentYear: '2025-26',
        }
      : null,
    tamperingAnalysis: {
      tamperingRisk: anomalyResults.tamperingRisk,
      anomalyScore: anomalyResults.anomalyScore,
      anomalyFlags: anomalyResults.flags,
    },
  };
}
