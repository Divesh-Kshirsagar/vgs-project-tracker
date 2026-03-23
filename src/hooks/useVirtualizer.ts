import { useState, useMemo } from 'react';
import type { UIEvent } from 'react';

interface UseVirtualizerProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualizer = ({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualizerProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const { virtualItems, totalHeight } = useMemo(() => {
    const totalHeight = itemCount * itemHeight;

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan,
    );

    const endIndex = Math.min(
      itemCount - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan,
    );

    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        offsetTop: i * itemHeight,
      });
    }

    return { virtualItems, totalHeight };
  }, [scrollTop, itemCount, itemHeight, containerHeight, overscan]);

  return { virtualItems, totalHeight, handleScroll };
};
