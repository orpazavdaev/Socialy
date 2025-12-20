import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { X, MoreHorizontal, Send, Heart, VolumeX, Volume2, Music } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import { useApi } from '@/hooks/useApi';
import { markStoryAsViewedInCache } from './index';

interface Story {
  id: string;
  image: string;
  music?: string;
  createdAt: string;
  isViewed?: boolean;
}

interface StoryGroup {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  stories: Story[];
  allViewed: boolean;
  isOwnStories?: boolean;
}

const STORY_DURATION = 5000; // 5 seconds for images

function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

// Check if URL is a video
function isVideoUrl(url: string): boolean {
  return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.ogg');
}

export default function StoryPage() {
  const router = useRouter();
  const { userId, viewedMode } = router.query; // viewedMode indicates if user clicked on viewed stories
  const { get, post } = useApi();
  
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [startedViewingViewed, setStartedViewingViewed] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewedStoriesRef = useRef<Set<string>>(new Set());
  const storyGroupsRef = useRef<StoryGroup[]>([]);
  const currentGroupIndexRef = useRef(0);
  const currentStoryIndexRef = useRef(0);
  const isNavigatingRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedViewingViewedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    storyGroupsRef.current = storyGroups;
  }, [storyGroups]);

  useEffect(() => {
    currentGroupIndexRef.current = currentGroupIndex;
  }, [currentGroupIndex]);

  useEffect(() => {
    currentStoryIndexRef.current = currentStoryIndex;
  }, [currentStoryIndex]);

  const handleLikeStory = async (storyId: string) => {
    const result = await post<{ liked: boolean }>(`/api/stories/${storyId}/like`, {});
    if (result) {
      setLikedStories(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(storyId);
        } else {
          newSet.delete(storyId);
        }
        return newSet;
      });
    }
  };

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToNextStory = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    
    clearTimer();
    setVideoDuration(null);
    
    const groups = storyGroupsRef.current;
    const groupIdx = currentGroupIndexRef.current;
    const storyIdx = currentStoryIndexRef.current;
    
    const currentGroup = groups[groupIdx];
    if (!currentGroup) {
      isNavigatingRef.current = false;
      router.push('/');
      return;
    }

    // Own stories: go through all sequentially, then go home
    if (currentGroup.isOwnStories) {
      if (storyIdx < currentGroup.stories.length - 1) {
        setCurrentStoryIndex(storyIdx + 1);
      } else {
        // Finished own stories, go home
        isNavigatingRef.current = false;
        router.push('/');
        return;
      }
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
      return;
    }

    // If we started viewing someone with all viewed stories, stay in "viewed mode"
    const inViewedMode = startedViewingViewedRef.current;

    if (inViewedMode) {
      // In viewed mode: just go through all stories sequentially
      if (storyIdx < currentGroup.stories.length - 1) {
        setCurrentStoryIndex(storyIdx + 1);
      } else {
        // Find next user who also has all stories viewed (excluding own stories)
        const nextViewedGroup = groups.findIndex(
          (g, idx) => idx > groupIdx && g.allViewed && !g.isOwnStories
        );
        
        if (nextViewedGroup !== -1) {
          setCurrentGroupIndex(nextViewedGroup);
          setCurrentStoryIndex(0);
        } else {
          // No more viewed groups, go home
          isNavigatingRef.current = false;
          router.push('/');
          return;
        }
      }
    } else {
      // Not in viewed mode: prioritize unviewed stories
      // Find next unviewed story in current group
      const nextUnviewedInGroup = currentGroup.stories.findIndex(
        (s, idx) => idx > storyIdx && !s.isViewed
      );

      if (nextUnviewedInGroup !== -1) {
        setCurrentStoryIndex(nextUnviewedInGroup);
      } else {
        // No more unviewed in this group, find next user with unviewed stories (excluding own)
        const nextGroupWithUnviewed = groups.findIndex(
          (g, idx) => idx > groupIdx && !g.allViewed && !g.isOwnStories
        );

        if (nextGroupWithUnviewed !== -1) {
          const firstUnviewed = groups[nextGroupWithUnviewed].stories.findIndex(s => !s.isViewed);
          setCurrentGroupIndex(nextGroupWithUnviewed);
          setCurrentStoryIndex(firstUnviewed !== -1 ? firstUnviewed : 0);
        } else {
          // No more unviewed stories, go home
          isNavigatingRef.current = false;
          router.push('/');
          return;
        }
      }
    }
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, [clearTimer, router]);

  const goToPrevStory = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    
    clearTimer();
    setVideoDuration(null);
    
    const groups = storyGroupsRef.current;
    const groupIdx = currentGroupIndexRef.current;
    const storyIdx = currentStoryIndexRef.current;

    if (storyIdx > 0) {
      setCurrentStoryIndex(storyIdx - 1);
    } else if (groupIdx > 0) {
      const prevGroup = groups[groupIdx - 1];
      setCurrentGroupIndex(groupIdx - 1);
      setCurrentStoryIndex(prevGroup.stories.length - 1);
    }
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, [clearTimer]);

  const startProgress = useCallback((duration: number = STORY_DURATION) => {
    clearTimer();
    setProgress(0);
    
    const increment = 100 / (duration / 25); // 25ms intervals
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 100;
        }
        return prev + increment;
      });
    }, 25);
  }, [clearTimer, goToNextStory]);

  const markCurrentStoryAsViewed = useCallback(async () => {
    const groups = storyGroupsRef.current;
    const groupIdx = currentGroupIndexRef.current;
    const storyIdx = currentStoryIndexRef.current;
    
    const currentGroup = groups[groupIdx];
    if (!currentGroup) return;
    
    const currentStory = currentGroup.stories[storyIdx];
    if (!currentStory || viewedStoriesRef.current.has(currentStory.id)) return;
    
    viewedStoriesRef.current.add(currentStory.id);
    
    // Update local state
    setStoryGroups(prev => prev.map((group, gIdx) => {
      if (gIdx === groupIdx) {
        const updatedStories = group.stories.map((s, sIdx) => 
          sIdx === storyIdx ? { ...s, isViewed: true } : s
        );
        const allViewed = updatedStories.every(s => s.isViewed);
        return { ...group, stories: updatedStories, allViewed };
      }
      return group;
    }));
    
    // Update the home page cache
    markStoryAsViewedInCache(currentStory.id, currentGroup.user.id);
    
    // Send to server (don't await, fire and forget)
    post(`/api/stories/${currentStory.id}/view`, {});
  }, [post]);

  const handleVideoLoaded = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const duration = video.duration * 1000; // Convert to milliseconds
    setVideoDuration(duration);
    startProgress(duration);
    video.play();
  }, [startProgress]);

  // Load stories on mount
  useEffect(() => {
    const loadStories = async () => {
      setIsLoading(true);
      const data = await get<StoryGroup[]>('/api/stories');
      if (data && data.length > 0) {
        setStoryGroups(data);
        storyGroupsRef.current = data;
      }
      setIsLoading(false);
    };
    
    loadStories();
    
    return () => {
      clearTimer();
    };
  }, [get, clearTimer]);

  // Find the correct group when userId changes and storyGroups are loaded
  useEffect(() => {
    if (userId && storyGroups.length > 0 && !isLoading) {
      const groupIndex = storyGroups.findIndex(g => g.user.id === userId);
      if (groupIndex !== -1) {
        const group = storyGroups[groupIndex];
        setCurrentGroupIndex(groupIndex);
        
        // Own stories: treat as "viewed mode" - show all from beginning
        if (group.isOwnStories) {
          setStartedViewingViewed(true);
          startedViewingViewedRef.current = true;
          setCurrentStoryIndex(0);
        }
        // Other user's stories that are all viewed
        else if (group.allViewed) {
          setStartedViewingViewed(true);
          startedViewingViewedRef.current = true;
          setCurrentStoryIndex(0);
        }
        // Other user's stories with unviewed content
        else {
          setStartedViewingViewed(false);
          startedViewingViewedRef.current = false;
          // Find first unviewed story
          const firstUnviewedIndex = group.stories.findIndex(s => !s.isViewed);
          setCurrentStoryIndex(firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0);
        }
      }
    }
  }, [userId, storyGroups.length, isLoading]);

  // Start progress timer when story changes
  useEffect(() => {
    if (storyGroups.length > 0 && !isLoading) {
      const currentGroup = storyGroups[currentGroupIndex];
      const currentStory = currentGroup?.stories[currentStoryIndex];
      
      if (currentStory && !isVideoUrl(currentStory.image)) {
        // For images, use fixed 5 second duration
        startProgress(STORY_DURATION);
      }
      // For videos, startProgress will be called when video loads
      
      markCurrentStoryAsViewed();
    }
    
    return () => {
      clearTimer();
    };
  }, [currentGroupIndex, currentStoryIndex, storyGroups.length, isLoading, startProgress, markCurrentStoryAsViewed, clearTimer]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { offsetWidth } = currentTarget;
    if (clientX < offsetWidth / 3) {
      goToPrevStory();
    } else {
      goToNextStory();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (storyGroups.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No stories available</p>
          <button 
            onClick={() => router.push('/')}
            className="text-blue-400"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  if (!currentGroup || !currentStory) {
    router.push('/');
    return null;
  }

  const { user } = currentGroup;
  const time = getTimeAgo(currentStory.createdAt);
  const isVideo = isVideoUrl(currentStory.image);

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      onClick={handleScreenClick}
    >
      {/* Progress Bars - only for current user's stories */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {currentGroup.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ 
                width: `${index === currentStoryIndex ? progress : (index < currentStoryIndex ? 100 : 0)}%`,
                transition: index === currentStoryIndex ? 'none' : 'width 0.2s ease-out'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="relative flex-1 flex items-center justify-center">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentStory.image}
            className="w-full h-full object-contain"
            muted={isMuted}
            playsInline
            onLoadedMetadata={handleVideoLoaded}
          />
        ) : (
          <Image
            src={currentStory.image}
            alt={`Story by ${user.username}`}
            fill
            className="object-contain"
            priority
          />
        )}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/70 to-transparent z-0" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent z-0" />

        {/* Story Header */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-4 py-2 z-10">
          {/* Left side - controls */}
          <div className="flex items-center gap-2">
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
            {isVideo && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }} 
                className="p-1 text-white"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            )}
          </div>
          
          {/* Right side - user info */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-xs">{time}</span>
                <span className="text-white font-semibold text-sm">{user.username}</span>
              </div>
              {currentStory.music && (
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <span>{currentStory.music}</span>
                  <Music className="w-3 h-3" />
                </div>
              )}
            </div>
            <Avatar src={user.avatar || 'https://i.pravatar.cc/150'} alt={user.username} size="sm" />
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
        <button 
          className="text-white"
          onClick={() => currentStory && handleLikeStory(currentStory.id)}
        >
          <Heart className={`w-6 h-6 ${likedStories.has(currentStory?.id || '') ? 'text-red-500 fill-red-500' : ''}`} />
        </button>
        <input
          type="text"
          placeholder={`Reply to ${user.username}...`}
          className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white text-sm placeholder-gray-400 focus:ring-0 outline-none"
        />
      </div>
    </div>
  );
}
