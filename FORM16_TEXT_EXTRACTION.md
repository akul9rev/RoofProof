# RoofProof PDF Text Extraction Engine Specification

## 1. Overview & Goal
The RoofProof PDF Text Extraction module provides a clean, privacy-preserving PDF-to-Text conversion pipeline. Its sole responsibility is accepting valid `.pdf` files, extracting embedded digital text or rendering scanned pages via OCR fallback, and returning raw, structured page-by-page text.

This stage does **NOT** interpret Form 16 rules, extract salary amounts, assess tampering, or calculate eligibility.

---

## 2. Architecture & Pipeline

```
PDF File Input (Memory Buffer)
       │
       ▼
1. Validation Engine ──► MIME check, .pdf extension, 10MB limit, %PDF- header, /Encrypt check
       │
       ▼
2. Auto-Detection ───► Evaluates text density (>30 chars)
       │                  ├── Path A: Embedded PDF Text Stream Extraction (PDF_TEXT)
       │                  └── Path B: Binary Stream / Image Token OCR Fallback (OCR)
       ▼
3. Structured Output ─► Pages array, confidence scoring, page boundaries, raw text
       │
       ▼
4. Memory Sanitation ─► Node Buffer zeroing (pdfBuffer.fill(0))
```

---

## 3. PDF Validation Rules
* **Format**: Strictly `.pdf` extension and `application/pdf` or `application/x-pdf` MIME type.
* **Header Magic Bytes**: Enforces `%PDF-` prefix at offset 0.
* **Size Boundary**: Maximum 10 MB.
* **Encryption**: Detects password protection `/Encrypt` flags and rejects gracefully with `PASSWORD_PROTECTED` status.

---

## 4. Extraction Methods & OCR Fallback
* **PDF_TEXT (Embedded Text Stream)**: Uses page Y-transform rendering to preserve line breaks, headers, tables, numbers, and punctuation.
* **OCR (Scanned / Image Fallback)**: Automatically triggered when extracted embedded text length is < 30 characters.
* **Confidence Scoring**: Computed deterministically from character density, printable ratio, and word density signals:
  * `PDF_TEXT`: 0.90 – 0.99
  * `OCR`: 0.60 – 0.95

---

## 5. Output Format
```json
{
  "success": true,
  "errorCode": null,
  "error": null,
  "pageCount": 3,
  "extractionMethod": "PDF_TEXT",
  "ocrUsed": false,
  "confidence": 0.98,
  "pages": [
    {
      "page": 1,
      "text": "Header content...\nLine 2..."
    }
  ],
  "text": "Full extracted text content across all pages..."
}
```

---

## 6. Privacy & Security Boundary
1. **Memory Processing**: Uploaded files use `multer.memoryStorage()` in RAM.
2. **Zero Storage**: PDF contents and extracted text are NEVER saved to PostgreSQL or disk.
3. **Zero Log Leaks**: Extracted text and document contents are omitted from server logs.
4. **Immediate Sanitation**: Node `Buffer.fill(0)` is executed immediately after extraction.

---

## 7. Test Results (10-Scenario Test Suite)
```text
=== RoofProof PDF Text Extraction Specification Test Suite ===

✓ TEST 1 — Text-Based PDF: Extracted embedded text (Confidence: 99%)
✓ TEST 2 — Scanned PDF: Triggered OCR fallback path cleanly
✓ TEST 3 — Multi-Page PDF: Preserved page count (3 pages detected)
✓ TEST 4 — PDF Containing Tables: Preserved line breaks and table data structure
✓ TEST 5 — PDF Containing Numbers: Preserved exact numeric values without rewriting
✓ TEST 6 — Empty PDF: Safely rejected 0-byte file buffer
✓ TEST 7 — Corrupted PDF: Safely handled invalid header bytes without throwing unhandled exceptions
✓ TEST 8 — Non-Pdf File Upload: Safely rejected non-PDF extension/MIME
✓ TEST 9 — Oversized File: Safely rejected file exceeding 10 MB limit
✓ TEST 10 — Repeated Upload Isolation: Confirmed zero cross-contamination between successive extractions

=== TEST SUITE RESULTS: 10/10 PASSED (100%) ===
```
