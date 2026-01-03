import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';

// Increase body size limit for video uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = getUserFromRequest(req);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { image, video } = req.body;
    const media = image || video;
    const isVideo = !!video || media?.startsWith('data:video/');

    if (!media) {
      return res.status(400).json({ error: 'Media data is required' });
    }

    // Validate format
    if (!media.startsWith('data:image/') && !media.startsWith('data:video/')) {
      return res.status(400).json({ error: 'Invalid format. Must be a base64 data URL.' });
    }

    // Check if Cloudinary is configured
    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured) {
      if (isVideo) {
        // Upload video to Cloudinary
        const result = await uploadVideo(media, 'socialy-reels');
        return res.status(200).json({ 
          url: result.url, 
          publicId: result.publicId,
          thumbnail: result.thumbnail,
        });
      } else {
        // Upload image to Cloudinary
        const result = await uploadImage(media, 'socialy-posts');
        return res.status(200).json({ url: result.url, publicId: result.publicId });
      }
    } else {
      // Fallback: return base64 directly (for development without Cloudinary)
      console.warn('Cloudinary not configured. Using base64 storage (not recommended for production).');
      return res.status(200).json({ url: media });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
}
