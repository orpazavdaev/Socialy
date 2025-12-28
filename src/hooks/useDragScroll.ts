import { useRef, useState, useCallback, MutableRefObject } from 'react';

interface DragScrollHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

interface UseDragScrollReturn<T extends HTMLElement> {
  ref: MutableRefObject<T | null>;
  handlers: DragScrollHandlers;
  isDragging: boolean;
}

export function useDragScroll<T extends HTMLElement>(): UseDragScrollReturn<T> {
  const ref = useRef<T | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const moved = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current || e.button !== 0) return;
    
    setIsDragging(true);
    moved.current = false;
    startX.current = e.clientX;
    scrollStart.current = ref.current.scrollLeft;
    
    // Prevent text selection
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    
    const deltaX = e.clientX - startX.current;
    
    if (Math.abs(deltaX) > 3) {
      moved.current = true;
    }
    
    ref.current.scrollLeft = scrollStart.current - deltaX;
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    if (moved.current && ref.current) {
      // Block clicks on children for a moment after dragging
      const blocker = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      ref.current.addEventListener('click', blocker, { capture: true, once: true });
      setTimeout(() => {
        ref.current?.removeEventListener('click', blocker, { capture: true });
      }, 50);
    }
    setIsDragging(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    ref,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
    isDragging,
  };
}
