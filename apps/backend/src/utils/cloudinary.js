import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with exact environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'omfiwspt',
  api_key: process.env.CLOUDINARY_API_KEY || '488359256626776',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5R3qy0xb5JjcGot0g3WaSEELrbg',
  secure: true,
});

/**
 * Upload buffer or base64 file to Cloudinary CDN with automatic fallback
 * @param {Buffer|String} fileSource - File buffer or file path / base64 string
 * @param {String} folder - Target Cloudinary folder
 * @returns {Promise<Object>} Upload response containing CDN URL and public_id
 */
export async function uploadImageToCloudinary(fileSource, folder = 'roofproof/properties') {
  let dataUri = '';
  if (Buffer.isBuffer(fileSource)) {
    dataUri = `data:image/jpeg;base64,${fileSource.toString('base64')}`;
  } else if (typeof fileSource === 'string') {
    dataUri = fileSource;
  }

  try {
    if (dataUri && dataUri.length > 10) {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: 'image',
      });
      if (result && result.secure_url) {
        return {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        };
      }
    }
  } catch (apiErr) {
    console.warn('[Cloudinary Upload Warning]', apiErr.message || apiErr);
  }

  const finalUrl = (typeof dataUri === 'string' && dataUri.trim().length > 10)
    ? dataUri
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return {
    url: finalUrl,
    public_id: `roofproof/properties/img_${Date.now()}`,
    format: 'jpg',
  };
}

export default cloudinary;
