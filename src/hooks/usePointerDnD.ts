import { useState, useCallback, useEffect } from 'react';
import type { TaskStatus } from '../types';

interface Position {
  x: number;
  y: number;
}

export const usePointerDnD = (
  onDrop: (taskId: string, newStatus: TaskStatus) => void,
) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const [hoveredColumn, setHoveredColumn] = useState<TaskStatus | null>(null);
  const [isSnappingBack, setIsSnappingBack] = useState(false);

  const handlePointerDown = (e: React.PointerEvent, taskId: string) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.preventDefault();
    // e.target.setPointerCapture(e.pointerId);

    setDraggedId(taskId);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
    setIsSnappingBack(false);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggedId) return;

      setCurrentPos({ x: e.clientX, y: e.clientY });

      const draggedEl = document.getElementById(`drag-${draggedId}`);
      if (draggedEl) draggedEl.style.pointerEvents = 'none';

      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const columnEl = elementBelow?.closest('[data-status]');

      if (columnEl) {
        setHoveredColumn(columnEl.getAttribute('data-status') as TaskStatus);
      } else {
        setHoveredColumn(null);
      }

      if (draggedEl) draggedEl.style.pointerEvents = 'auto';
    },
    [draggedId],
  );

  const handlePointerUp = useCallback(() => {
    if (!draggedId) return;

    if (hoveredColumn) {
      onDrop(draggedId, hoveredColumn);
      setDraggedId(null);
      setHoveredColumn(null);
    } else {
      setIsSnappingBack(true);
      setCurrentPos(startPos);
      setTimeout(() => {
        setDraggedId(null);
        setIsSnappingBack(false);
      }, 300);
    }
  }, [draggedId, hoveredColumn, startPos, onDrop]);

  useEffect(() => {
    if (draggedId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [draggedId, handlePointerMove, handlePointerUp]);

  return {
    draggedId,
    startPos,
    currentPos,
    hoveredColumn,
    isSnappingBack,
    handlePointerDown,
  };
};
