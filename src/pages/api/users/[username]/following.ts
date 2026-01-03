import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;
  const payload = getUserFromRequest(req);

  if (typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid username' });
  }

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get following (users that this user follows)
    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get list of users the current user is following
    let currentUserFollowingIds: Set<string> = new Set();
    if (payload) {
      const currentUserFollowing = await prisma.follow.findMany({
        where: { followerId: payload.userId },
        select: { followingId: true },
      });
      currentUserFollowingIds = new Set(currentUserFollowing.map(f => f.followingId));
    }

    const result = following.map(f => ({
      id: f.following.id,
      username: f.following.username,
      fullName: f.following.fullName,
      avatar: f.following.avatar,
      isFollowing: currentUserFollowingIds.has(f.following.id),
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching following:', error);
    return res.status(500).json({ error: 'Failed to fetch following' });
  }
}

