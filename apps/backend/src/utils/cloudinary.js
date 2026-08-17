import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with exact environment variables or fallback credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'omfiwspt',
  api_key: process.env.CLOUDINARY_API_KEY || '488359256626776',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5R3qy0xb5JjcGot0g3WaSEELrbg',
  secure: true,
});

/**
 * Upload buffer or file to Cloudinary CDN with automatic error handling & fallback
 * @param {Buffer|String} fileSource - File buffer or file path / base64 string
 * @param {String} folder - Target Cloudinary folder
 * @returns {Promise<Object>} Upload response containing CDN URL and public_id
 */
export async function uploadImageToCloudinary(fileSource, folder = 'roofproof/properties') {
  try {
    if (Buffer.isBuffer(fileSource)) {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
            });
          }
        );
        uploadStream.end(fileSource);
      });
    } else {
      const result = await cloudinary.uploader.upload(fileSource, {
        folder,
        resource_type: 'image',
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      };
    }
  } catch (err) {
    console.warn('[Cloudinary Upload Service Warning]', err.message || err);
    // If Cloudinary API returns permission or network error, return structured fallback
    return {
      url: typeof fileSource === 'string' && fileSource.startsWith('http') 
        ? fileSource 
        : 'https://res.cloudinary.com/demo/image/upload/v1723900001/roofproof/properties/house1_colonial_mansion.jpg',
      public_id: 'roofproof/fallback_property',
      format: 'jpg',
      isFallback: true,
    };
  }
}

export default cloudinary;
