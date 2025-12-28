import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  thumbnail?: string;
}

/**
 * Upload a base64 image to Cloudinary
 * @param base64Image - The base64 encoded image (with data:image/... prefix)
 * @param folder - Optional folder name in Cloudinary
 * @returns The uploaded image URL and public ID
 */
export async function uploadImage(base64Image: string, folder = 'instagram'): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: 'image',
    transformation: [
      { width: 1080, height: 1080, crop: 'limit' }, // Max size
      { quality: 'auto:good' }, // Optimize quality
      { fetch_format: 'auto' }, // Auto format (webp when supported)
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Upload a base64 video to Cloudinary
 * @param base64Video - The base64 encoded video (with data:video/... prefix)
 * @param folder - Optional folder name in Cloudinary
 * @returns The uploaded video URL, public ID, and thumbnail
 */
export async function uploadVideo(base64Video: string, folder = 'instagram'): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(base64Video, {
    folder,
    resource_type: 'video',
    eager: [
      { width: 480, height: 854, crop: 'limit', format: 'mp4' }, // Mobile optimized
    ],
    eager_async: true,
  });

  // Generate thumbnail URL from video
  const thumbnailUrl = cloudinary.url(result.public_id, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width: 480, height: 854, crop: 'fill' },
      { start_offset: '0' }, // First frame
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    thumbnail: thumbnailUrl,
  };
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;

