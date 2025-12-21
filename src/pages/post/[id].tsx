import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, X } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';

interface Post {
  id: string;
  image: string;
  caption: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  likesCount: number;
  isLiked: boolean;
}

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      <div className="aspect-square w-full bg-gray-200" />
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-4 mb-3">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded mb-2" />
        <div className="w-48 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
}

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { get, post: apiPost, del } = useApi();
  const { user } = useAuth();
  
  const [postData, setPostData] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    setIsLoading(true);
    const [postResult, commentsResult] = await Promise.all([
      get<Post>(`/api/posts/${id}`),
      get<Comment[]>(`/api/posts/${id}/comments`),
    ]);

    if (postResult) {
      setPostData(postResult);
      setIsLiked(postResult.isLiked);
      setLikesCount(postResult.likesCount);
    }

    if (commentsResult) {
      setComments(commentsResult);
    }

    setIsLoading(false);
  };

  const handleLike = async () => {
    if (!postData) return;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    const result = await apiPost<{ liked: boolean }>(`/api/posts/${postData.id}/like`, {});
    if (result) {
      setIsLiked(result.liked);
    } else {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !postData) return;

    const result = await apiPost<Comment>(`/api/posts/${postData.id}/comments`, { text: newComment });
    if (result) {
      setComments(prev => [result, ...prev]);
      setNewComment('');
    }
  };

  const handleDelete = async () => {
    if (!postData) return;
    
    setIsDeleting(true);
    const result = await del(`/api/posts/${postData.id}`);
    setIsDeleting(false);
    
    if (result) {
      router.push('/profile');
    }
  };

  const isOwner = user?.id === postData?.user?.id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b sticky top-0 bg-white z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-semibold">Post</span>
      </div>

      {isLoading ? (
        <PostSkeleton />
      ) : postData ? (
        <>
          {/* Post Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href={`/user/${postData.user.username}`}>
                <Avatar 
                  src={postData.user.avatar || 'https://i.pravatar.cc/150'} 
                  alt={postData.user.username} 
                  size="sm" 
                />
              </Link>
              <div>
                <Link href={`/user/${postData.user.username}`}>
                  <span className="font-semibold text-sm">{postData.user.username}</span>
                </Link>
              </div>
            </div>
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button className="p-1" onClick={() => setShowMenu(!showMenu)}>
                  <MoreHorizontal className="w-5 h-5 text-gray-700" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border z-20 min-w-[150px]">
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Image */}
          <div className="relative aspect-square w-full bg-gray-100">
            <Image
              src={postData.image}
              alt={`Post by ${postData.user.username}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Post Actions */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button onClick={handleLike} className="flex items-center gap-1">
                  <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                </button>
                <Link href={`/comments?postId=${postData.id}`}>
                  <MessageCircle className="w-6 h-6" />
                </Link>
                <button>
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <button>
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* Likes count */}
            <p className="font-semibold text-sm mb-1">{likesCount} likes</p>

            {/* Caption */}
            {postData.caption && (
              <p className="text-sm mb-1">
                <Link href={`/user/${postData.user.username}`} className="font-semibold mr-1">
                  {postData.user.username}
                </Link>
                {postData.caption}
              </p>
            )}

            {/* View all comments */}
            {postData.commentsCount > 0 && (
              <Link 
                href={`/comments?postId=${postData.id}`}
                className="text-sm text-gray-500 mb-1 block"
              >
                View all {postData.commentsCount} comments
              </Link>
            )}

            {/* Time */}
            <p className="text-xs text-gray-400 uppercase">{getTimeAgo(postData.createdAt)}</p>
          </div>

          {/* Recent Comments Preview */}
          {comments.length > 0 && (
            <div className="px-4 pb-4">
              {comments.slice(0, 3).map(comment => (
                <div key={comment.id} className="flex gap-2 mb-2">
                  <Link href={`/user/${comment.user.username}`} className="font-semibold text-sm">
                    {comment.user.username}
                  </Link>
                  <p className="text-sm flex-1">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="border-t px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="text-blue-500 font-semibold text-sm disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Post not found</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full overflow-hidden">
            <div className="p-6 text-center">
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Delete Post?</h3>
              <p className="text-gray-500 text-sm">
                This action cannot be undone. The post will be permanently deleted.
              </p>
            </div>
            <div className="border-t flex">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 font-semibold text-red-500 hover:bg-red-50 border-l"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

