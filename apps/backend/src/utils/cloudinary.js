import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables or fallback demo credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'roofproof-cdn',
  api_key: process.env.CLOUDINARY_API_KEY || '849126482159371',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'roofproof_secret_key_demo',
  secure: true,
});

/**
 * Upload buffer or file to Cloudinary CDN
 * @param {Buffer|String} fileSource - File buffer or file path / base64 string
 * @param {String} folder - Target Cloudinary folder
 * @returns {Promise<Object>} Upload response containing CDN URL and public_id
 */
export async function uploadImageToCloudinary(fileSource, folder = 'roofproof/properties') {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(fileSource)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );
      uploadStream.end(fileSource);
    } else {
      cloudinary.uploader.upload(
        fileSource,
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );
    }
  });
}

export default cloudinary;
