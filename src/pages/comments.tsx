import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Heart, Send } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface Post {
  id: string;
  caption: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export default function CommentsPage() {
  const router = useRouter();
  const { postId } = router.query;
  const { user } = useAuth();
  const { get, post: apiPost, isLoading } = useApi();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [postData, setPostData] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const loadComments = async () => {
    const data = await get<Comment[]>(`/api/posts/${postId}/comments`);
    if (data) {
      setComments(data);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !postId) return;
    
    setIsSubmitting(true);
    
    const result = await apiPost<Comment>(`/api/posts/${postId}/comments`, {
      text: newComment,
    });
    
    if (result) {
      setComments([result, ...comments]);
      setNewComment('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <Link href="/" className="p-1">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <span className="font-semibold text-lg">Comments</span>
        <div className="w-8" />
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {comments.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-8">
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3 px-4 py-3">
              <Avatar 
                src={comment.user.avatar || 'https://i.pravatar.cc/150'} 
                alt={comment.user.username} 
                size="sm" 
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold mr-1">{comment.user.username}</span>
                  {comment.text}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{getTimeAgo(comment.createdAt)}</span>
                  <button className="font-semibold">Reply</button>
                </div>
              </div>
              <button className="p-1">
                <Heart className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form 
        onSubmit={handleSubmitComment}
        className="fixed bottom-0 left-0 right-0 border-t border-gray-100 p-4 flex items-center gap-3 bg-white max-w-[430px] mx-auto"
      >
        <Avatar 
          src={user?.avatar || 'https://i.pravatar.cc/150?img=33'} 
          size="sm" 
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
        />
        <button 
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="text-blue-500 font-semibold text-sm disabled:opacity-50"
        >
          {isSubmitting ? '...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
