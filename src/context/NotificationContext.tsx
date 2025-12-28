import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  type: 'post_like' | 'reel_like' | 'story_like' | 'new_follower' | 'comment';
  message: string;
  user: {
    username: string;
    avatar: string | null;
  };
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showToast: Notification | null;
  dismissToast: () => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const STORAGE_KEY_SEEN_IDS = 'notification_seen_ids';

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

function getNotificationMessage(type: string, username: string, text?: string): string {
  switch (type) {
    case 'post_like':
      return `${username} liked your post`;
    case 'reel_like':
      return `${username} liked your reel`;
    case 'story_like':
      return `${username} liked your story`;
    case 'new_follower':
      return `${username} started following you`;
    case 'comment':
      return `${username} commented: "${text?.substring(0, 30) || ''}"`;
    default:
      return `New activity from ${username}`;
  }
}

function getStoredSeenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SEEN_IDS);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore parse errors
  }
  return new Set();
}

function saveSeenIds(seenIds: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    const idsArray = Array.from(seenIds).slice(-500);
    localStorage.setItem(STORAGE_KEY_SEEN_IDS, JSON.stringify(idsArray));
  } catch {
    // Ignore storage errors
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showToast, setShowToast] = useState<Notification | null>(null);
  
  // Use refs to avoid dependency issues and stale closures
  const seenIdsRef = useRef<Set<string>>(getStoredSeenIds());
  const sessionStartRef = useRef<number>(Date.now());
  const isFirstFetchRef = useRef(true);
  const isFetchingRef = useRef(false);

  const isAuthenticated = !!user && !!token;

  const fetchNewActivity = useCallback(async () => {
    if (!isAuthenticated || isFetchingRef.current) return;
    
    isFetchingRef.current = true;

    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        isFetchingRef.current = false;
        return;
      }

      const res = await fetch('/api/activity', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!res.ok) {
        isFetchingRef.current = false;
        return;
      }

      const data = await res.json();
      
      if (data && data.length > 0) {
        const newNotifications: Notification[] = [];
        
        data.forEach((activity: { 
          id: string; 
          type: string; 
          createdAt: string; 
          user: { username: string; avatar: string | null };
          content?: { text?: string };
        }) => {
          // Skip if already seen
          if (seenIdsRef.current.has(activity.id)) return;
          
          // For toast: only show activities that happened AFTER session started
          // This prevents showing old notifications on every refresh
          const activityTime = new Date(activity.createdAt).getTime();
          const isAfterSessionStart = activityTime > sessionStartRef.current;
          
          const notification: Notification = {
            id: activity.id,
            type: activity.type as Notification['type'],
            message: getNotificationMessage(activity.type, activity.user.username, activity.content?.text),
            user: activity.user,
            createdAt: activity.createdAt,
          };
          
          // Only add to toast queue if:
          // 1. Not the first fetch (to avoid showing on page load)
          // 2. Activity happened after session started
          if (!isFirstFetchRef.current && isAfterSessionStart) {
            newNotifications.push(notification);
          }
          
          // Mark as seen
          seenIdsRef.current.add(activity.id);
        });

        // Save updated seen IDs
        saveSeenIds(seenIdsRef.current);

        // Show toast for the most recent new notification
        if (newNotifications.length > 0) {
          const mostRecent = newNotifications[0];
          setShowToast(mostRecent);
          
          // Auto-hide toast after 4 seconds
          setTimeout(() => {
            setShowToast(null);
          }, 4000);
          
          // Add to notifications list
          setNotifications(prev => [...newNotifications, ...prev].slice(0, 50));
        }
        
        // Mark first fetch as complete
        if (isFirstFetchRef.current) {
          isFirstFetchRef.current = false;
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [isAuthenticated]);

  // Set up polling - only depends on isAuthenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Reset session start time on mount
    sessionStartRef.current = Date.now();
    isFirstFetchRef.current = true;

    // Initial fetch after short delay
    const initialTimeout = setTimeout(() => {
      fetchNewActivity();
    }, 2000);

    // Poll every 30 seconds
    const interval = setInterval(fetchNewActivity, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isAuthenticated, fetchNewActivity]);

  // Reset on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setShowToast(null);
      isFirstFetchRef.current = true;
    }
  }, [isAuthenticated]);

  const dismissToast = useCallback(() => {
    setShowToast(null);
  }, []);

  const markAllAsRead = useCallback(() => {
    notifications.forEach(n => seenIdsRef.current.add(n.id));
    saveSeenIds(seenIdsRef.current);
    setNotifications([]);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.length,
        showToast,
        dismissToast,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
