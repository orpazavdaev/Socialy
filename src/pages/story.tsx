import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { X, MoreHorizontal, Send, VolumeX, Heart, Music } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import { useApi } from '@/hooks/useApi';

interface Story {
  id: string;
  image: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface StoryGroup {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  stories: Story[];
}

// Fallback stories for demo
const fallbackStories = [
  {
    id: '1',
    username: 'gal_gadot',
    avatar: 'https://i.pravatar.cc/150?img=5',
    image: 'https://picsum.photos/seed/story1/720/1280',
    time: '2h',
  },
  {
    id: '2',
    username: 'anna.zak',
    avatar: 'https://i.pravatar.cc/150?img=9',
    image: 'https://picsum.photos/seed/story2/720/1280',
    time: '3h',
  },
  {
    id: '3',
    username: 'leomessi',
    avatar: 'https://i.pravatar.cc/150?img=12',
    image: 'https://picsum.photos/seed/story3/720/1280',
    time: '5h',
  },
  {
    id: '4',
    username: 'noakirel',
    avatar: 'https://i.pravatar.cc/150?img=16',
    image: 'https://picsum.photos/seed/story4/720/1280',
    time: '7h',
  },
  {
    id: '5',
    username: 'selenagomez',
    avatar: 'https://i.pravatar.cc/150?img=20',
    image: 'https://picsum.photos/seed/story5/720/1280',
    time: '9h',
  },
];

function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export default function StoryPage() {
  const router = useRouter();
  const { get } = useApi();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    if (allStories.length > 0 || useFallback) {
      startProgress();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStoryIndex, allStories, useFallback]);

  const loadStories = async () => {
    const data = await get<StoryGroup[]>('/api/stories');
    if (data && data.length > 0) {
      setStoryGroups(data);
      // Flatten all stories
      const flat = data.flatMap(group => group.stories);
      setAllStories(flat);
    } else {
      setUseFallback(true);
    }
  };

  const startProgress = () => {
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          handleNextStory();
          return 100;
        }
        return prev + 0.5;
      });
    }, 25);
  };

  const handleNextStory = () => {
    const stories = useFallback ? fallbackStories : allStories;
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      router.push('/');
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { offsetWidth } = currentTarget;
    if (clientX < offsetWidth / 2) {
      handlePrevStory();
    } else {
      handleNextStory();
    }
  };

  const stories = useFallback ? fallbackStories : allStories;
  const currentStory = stories[currentStoryIndex];

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const username = useFallback 
    ? (currentStory as typeof fallbackStories[0]).username 
    : (currentStory as Story).user.username;
  const avatar = useFallback 
    ? (currentStory as typeof fallbackStories[0]).avatar 
    : (currentStory as Story).user.avatar;
  const time = useFallback 
    ? (currentStory as typeof fallbackStories[0]).time 
    : getTimeAgo((currentStory as Story).createdAt);

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      onClick={handleScreenClick}
    >
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ 
                width: `${index === currentStoryIndex ? progress : (index < currentStoryIndex ? 100 : 0)}%` 
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="relative flex-1 flex items-center justify-center">
        <Image
          src={currentStory.image}
          alt={`Story by ${username}`}
          fill
          className="object-contain"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/70 to-transparent z-0" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent z-0" />

        {/* Story Header */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-4 py-2 z-10">
          {/* Left side controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                router.push('/');
              }} 
              className="p-1 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <button onClick={(e) => e.stopPropagation()} className="p-1 text-white">
              <MoreHorizontal className="w-6 h-6" />
            </button>
            <button onClick={(e) => e.stopPropagation()} className="p-1 text-white">
              <VolumeX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Right side - user info */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-xs">{time}</span>
                <span className="text-white font-semibold text-sm">{username}</span>
              </div>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <span>BTS · Black Swan</span>
                <Music className="w-3 h-3" />
              </div>
            </div>
            <Avatar src={avatar || 'https://i.pravatar.cc/150'} alt={username} size="sm" />
          </div>
        </div>
      </div>

      {/* Story Input */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3 bg-black z-10"
      >
        <button className="text-white">
          <Send className="w-6 h-6" />
        </button>
        <button className="text-white">
          <Heart className="w-6 h-6" />
        </button>
        <input
          type="text"
          placeholder={`Reply to ${username}...`}
          className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white text-sm placeholder-gray-400 focus:ring-0 outline-none"
        />
      </div>
    </div>
  );
}
