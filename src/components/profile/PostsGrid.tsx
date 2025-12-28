import Link from 'next/link';
import PostImage from '@/components/shared/PostImage';

interface Post {
  id: string;
  image: string;
}

interface PostsGridProps {
  posts: Post[];
  username?: string;
}

export default function PostsGrid({ posts, username }: PostsGridProps) {
  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={username ? `/post/${post.id}?username=${username}` : `/post/${post.id}`}
          className="relative aspect-square"
        >
          <PostImage
            src={post.image}
            alt={`Post ${post.id}`}
          />
        </Link>
      ))}
    </div>
  );
}




