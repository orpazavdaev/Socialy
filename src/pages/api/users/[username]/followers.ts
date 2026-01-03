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

    // Get followers (users who follow this user)
    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: {
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

    const result = followers.map(f => ({
      id: f.follower.id,
      username: f.follower.username,
      fullName: f.follower.fullName,
      avatar: f.follower.avatar,
      isFollowing: currentUserFollowingIds.has(f.follower.id),
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching followers:', error);
    return res.status(500).json({ error: 'Failed to fetch followers' });
  }
}

