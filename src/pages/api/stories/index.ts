import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getStories(req, res);
  } else if (req.method === 'POST') {
    return createStory(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function getStories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = getUserFromRequest(req);
    const currentUserId = payload?.userId;

    // Get stories from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // For POC/demo: Show all stories from all users
    const stories = await prisma.story.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo,
        },
      },
      orderBy: { createdAt: 'asc' }, // Oldest first within each user
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        views: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
        likes: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
      },
    });

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user.id;
      const isOwnStory = userId === currentUserId;
      
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
          isOwnStories: isOwnStory,
        };
      }
      
      // isViewed is based on actual view records for ALL users (including own stories)
      const isViewed = currentUserId && story.views ? story.views.length > 0 : false;
      const isLiked = currentUserId && story.likes ? story.likes.length > 0 : false;
      
      acc[userId].stories.push({
        id: story.id,
        image: story.image,
        music: story.music,
        createdAt: story.createdAt.toISOString(),
        isViewed,
        isLiked,
      });
      
      return acc;
    }, {} as Record<string, { 
      user: { id: string; username: string; avatar: string | null }; 
      stories: Array<{ id: string; image: string; music: string | null; createdAt: string; isViewed: boolean; isLiked: boolean }>;
      isOwnStories: boolean;
    }>);

    // Convert to array and add allViewed flag
    const result = Object.values(groupedStories).map(group => {
      const allStoriesViewed = group.stories.every(s => s.isViewed);
      return {
        user: group.user,
        stories: group.stories,
        // For own stories: allViewed should be false if there are any unviewed (so border is purple)
        // For others: allViewed based on actual view status
        allViewed: allStoriesViewed,
        isOwnStories: group.isOwnStories,
      };
    });

    // Sort: own stories first, then unviewed, then viewed
    result.sort((a, b) => {
      // Own stories always first
      if (a.isOwnStories && !b.isOwnStories) return -1;
      if (!a.isOwnStories && b.isOwnStories) return 1;
      // Then unviewed before viewed
      if (a.allViewed && !b.allViewed) return 1;
      if (!a.allViewed && b.allViewed) return -1;
      return 0;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createStory(req: NextApiRequest, res: NextApiResponse) {
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

    const { image, music } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const story = await prisma.story.create({
      data: {
        image,
        music,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
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

    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
