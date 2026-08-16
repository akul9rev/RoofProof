/**
 * apps/backend/src/routes/pdfExtract.js
 *
 * REST API Route for PDF Text & Basic OCR Extraction.
 * Endpoints:
 *   POST /api/pdf/extract
 *   POST /api/pdf/analyze
 *   POST /api/form16/analyze (aliased via server.js)
 */

import express from 'express';
import multer from 'multer';
import { extractTextFromPdf } from '../services/pdfExtractor/index.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const handlePdfExtraction = (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          errorCode: 'FILE_TOO_LARGE',
          error: 'The uploaded file exceeds the 10 MB size limit.',
          pageCount: 0,
          extractionMethod: 'NONE',
          ocrUsed: false,
          confidence: 0.0,
          pages: [],
          text: '',
        });
      }
      return res.status(400).json({
        success: false,
        errorCode: 'UNSUPPORTED_FILE_TYPE',
        error: err.message || 'Only .pdf files are accepted.',
        pageCount: 0,
        extractionMethod: 'NONE',
        ocrUsed: false,
        confidence: 0.0,
        pages: [],
        text: '',
      });
    }

    const file = req.files && req.files.length > 0 ? req.files[0] : req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({
        success: false,
        errorCode: 'MISSING_FILE',
        error: 'Please select a valid PDF file to upload.',
        pageCount: 0,
        extractionMethod: 'NONE',
        ocrUsed: false,
        confidence: 0.0,
        pages: [],
        text: '',
      });
    }

    try {
      const result = await extractTextFromPdf(file.buffer, file.originalname, file.mimetype);
      return res.json(result);
    } catch (extractErr) {
      return res.status(500).json({
        success: false,
        errorCode: 'EXTRACTION_FAILED',
        error: `An unexpected error occurred: ${extractErr.message || String(extractErr)}`,
        pageCount: 0,
        extractionMethod: 'NONE',
        ocrUsed: false,
        confidence: 0.0,
        pages: [],
        text: '',
      });
    }
  });
};

router.post('/extract', handlePdfExtraction);
router.post('/analyze', handlePdfExtraction);

export default router;
