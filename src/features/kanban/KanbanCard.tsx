import React from 'react';
import type { Task } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { DueDateLabel } from '../../components/ui/DueDateLabel';
import { useTaskStore } from '../../store/taskStore';
import { ASSIGNEE_COLORS } from '../../utils/seed';

interface KanbanCardProps {
  task: Task;
  isDragging: boolean;
  isFloatingClone?: boolean;
  onPointerDown?: (e: React.PointerEvent, id: string) => void;
  startPos?: { x: number; y: number };
  currentPos?: { x: number; y: number };
  isSnappingBack?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  isDragging,
  isFloatingClone,
  onPointerDown,
  startPos,
  currentPos,
  isSnappingBack,
}) => {
  const activeCollaborators = useTaskStore(
    (state) => state.activeCollaborators
  );

  const viewers = activeCollaborators[task.id] || [];

  const deltaX =
    isFloatingClone && currentPos && startPos
      ? currentPos.x - startPos.x
      : 0;

  const deltaY =
    isFloatingClone && currentPos && startPos
      ? currentPos.y - startPos.y
      : 0;

  if (isDragging && !isFloatingClone) {
    return (
      <div className="h-32 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg my-2 opacity-50" />
    );
  }

  return (
    <div
      id={isFloatingClone ? `drag-${task.id}` : undefined}
      onPointerDown={(e) => onPointerDown && onPointerDown(e, task.id)}
      className={`
        bg-white p-4 rounded-lg border shadow-sm my-2 cursor-grab touch-none select-none
        hover:border-blue-300 transition-colors
        ${
          isFloatingClone
            ? 'fixed z-50 opacity-90 shadow-xl pointer-events-none w-72'
            : 'relative'
        }
        ${isSnappingBack ? 'transition-transform duration-300 ease-out' : ''}
      `}
      style={
        isFloatingClone
          ? {
              transform: `translate(calc(${deltaX}px), calc(${deltaY}px))`,
              top: startPos?.y ? `${startPos.y - 40}px` : 0,
              left: startPos?.x ? `${startPos.x - 144}px` : 0,
            }
          : undefined
      }
    >
      <div className="flex justify-between items-start mb-2">
        <Badge label={task.priority} />
        <Avatar initials={task.assignee} bgColorClass={ASSIGNEE_COLORS[task.assignee]} />
      </div>

      {viewers.length > 0 && (
        <div className="flex items-center ml-2 border-l pl-2 border-gray-200">
          <span className="text-[10px] text-gray-400 mr-1 uppercase tracking-wider">
            Viewing:
          </span>
          <div className="flex">
            {viewers.map((viewer, idx) => (
              <Avatar
                key={idx}
                initials={viewer}
                isStacked={idx > 0}
                bgColorClass={ASSIGNEE_COLORS[viewer]}
              />
            ))}
          </div>
        </div>
      )}

      <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2">
        {task.title}
      </h3>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <DueDateLabel dateString={task.dueDate} />
      </div>
    </div>
  );
};