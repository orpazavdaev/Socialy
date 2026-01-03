import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  isFollowing?: boolean;
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="w-24 h-4 bg-gray-200 rounded mb-1" />
        <div className="w-32 h-3 bg-gray-200 rounded" />
      </div>
      <div className="w-20 h-8 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function FollowingPage() {
  const router = useRouter();
  const { username } = router.query;
  const { get, post } = useApi();
  const { user: currentUser, token } = useAuth();
  
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
      loadFollowing();
    }
  }, [username]);

  const loadFollowing = async () => {
    setIsLoading(true);
    
    const followingData = await get<User[]>(`/api/users/${username}/following`);

    if (followingData) {
      setFollowing(followingData);
    }

    setIsLoading(false);
  };

  const handleFollow = async (userId: string, targetUsername: string) => {
    // Optimistic update
    setFollowing(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));

    const result = await post<{ following: boolean }>(`/api/users/${targetUsername}/follow`, {});
    
    if (result) {
      setFollowing(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing: result.following } : user
      ));
    } else {
      // Revert on error
      setFollowing(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      ));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b sticky top-0 bg-white z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-semibold">Following</h1>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>
      </div>

      {/* Following List */}
      <div className="pb-20">
        {isLoading ? (
          <>
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </>
        ) : following.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Not following anyone yet</p>
          </div>
        ) : (
          following.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-4 border-b">
              <Link href={`/user/${user.username}`}>
                <Avatar 
                  src={user.avatar || 'https://i.pravatar.cc/150'} 
                  alt={user.username} 
                  size="md" 
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/user/${user.username}`}>
                  <p className="font-semibold text-sm truncate">{user.username}</p>
                  {user.fullName && (
                    <p className="text-sm text-gray-500 truncate">{user.fullName}</p>
                  )}
                </Link>
              </div>
              {token && user.id !== currentUser?.id && (
                <button
                  className={`px-4 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
                    user.isFollowing 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => handleFollow(user.id, user.username)}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

