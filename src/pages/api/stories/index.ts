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

    // If user is logged in, get IDs of users they follow
    let followedUserIds: string[] = [];
    if (currentUserId) {
      const follows = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      });
      followedUserIds = follows.map(f => f.followingId);
      // Also include the current user's own stories
      followedUserIds.push(currentUserId);
    }

    const stories = await prisma.story.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo,
        },
        // Only get stories from followed users (if logged in)
        ...(currentUserId && followedUserIds.length > 0 ? {
          userId: { in: followedUserIds },
        } : {}),
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
      },
    });

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
          isOwnStories: userId === currentUserId,
        };
      }
      
      // Add isViewed flag
      // For own stories: mark as viewed so they don't interfere with navigation
      // For other users' stories: check if actually viewed
      const isOwnStory = userId === currentUserId;
      const isViewed = isOwnStory ? true : (currentUserId && story.views ? story.views.length > 0 : false);
      
      acc[userId].stories.push({
        id: story.id,
        image: story.image,
        music: story.music,
        createdAt: story.createdAt.toISOString(),
        isViewed,
      });
      
      return acc;
    }, {} as Record<string, { 
      user: { id: string; username: string; avatar: string | null }; 
      stories: Array<{ id: string; image: string; music: string | null; createdAt: string; isViewed: boolean }>;
      isOwnStories: boolean;
    }>);

    // Convert to array and add allViewed flag
    // Own stories: allViewed = false so the border is purple (active story indicator)
    const result = Object.values(groupedStories).map(group => ({
      user: group.user,
      stories: group.stories,
      allViewed: group.isOwnStories ? false : group.stories.every(s => s.isViewed),
      isOwnStories: group.isOwnStories,
    }));

    // Sort: unviewed first, then viewed
    result.sort((a, b) => {
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
