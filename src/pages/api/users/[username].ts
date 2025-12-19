import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.query;

    const user = await prisma.user.findUnique({
      where: { username: username as string },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        avatar: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            image: true,
          },
        },
        highlights: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      ...user,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


