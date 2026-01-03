import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { withLogging } from '@/lib/apiHandler';
import logger from '@/lib/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getPosts(req, res);
  } else if (req.method === 'POST') {
    return createPost(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

export default withLogging(handler);

async function getPosts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = getUserFromRequest(req);
    const currentUserId = payload?.userId;

    // For POC/demo: Show all posts from all users
    // In production, you might want to filter by followed users only
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 posts for performance
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        savedBy: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
      },
    });

    const postsWithCounts = posts.map((post) => {
      // Handle savedBy which can be array or undefined depending on auth state
      const savedByArray = post.savedBy as { userId: string }[] | undefined;
      const isSaved = currentUserId && savedByArray ? savedByArray.length > 0 : false;
      
      return {
        id: post.id,
        image: post.image,
        caption: post.caption,
        createdAt: post.createdAt,
        user: post.user,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        likedByUser: post.likes.map((like) => like.userId),
        isSaved,
      };
    });

    logger.info('Posts fetched', { metadata: { count: postsWithCounts.length } });
    res.status(200).json(postsWithCounts);
  } catch (error) {
    logger.error('Get posts error', { error: error instanceof Error ? error.message : 'Unknown error' });
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });

    if (!userExists) {
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }

    const { image, caption } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const post = await prisma.post.create({
      data: {
        image,
        caption,
        userId: payload.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
