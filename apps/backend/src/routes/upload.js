import express from 'express';
import multer from 'multer';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are supported for Cloudinary upload.'));
    }
  },
});

// POST /api/upload/image - Upload property image to Cloudinary CDN
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file && !req.body.imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'No image file or base64 data provided for Cloudinary upload.',
      });
    }

    const source = req.file ? req.file.buffer : req.body.imageBase64;
    const result = await uploadImageToCloudinary(source, 'roofproof/properties');

    res.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      message: 'Property image successfully uploaded and hosted on Cloudinary CDN.',
    });
  } catch (err) {
    console.error('[Cloudinary Upload Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to upload image to Cloudinary CDN.',
    });
  }
});

export default router;
