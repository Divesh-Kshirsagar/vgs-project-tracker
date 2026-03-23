import React from 'react';
import type { Task, TaskStatus } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { usePointerDnD } from '../../hooks/usePointerDnD';
import { KanbanCard } from './KanbanCard';

const COLUMNS: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export const KanbanBoard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const { updateTaskStatus } = useTaskStore();
  
  const { 
    draggedId, startPos, currentPos, hoveredColumn, isSnappingBack, handlePointerDown 
  } = usePointerDnD(updateTaskStatus);

  const draggedTask = tasks.find(t => t.id === draggedId);

  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const isHovered = hoveredColumn === status;

        return (
          <div 
            key={status}
            data-status={status} 
            className={`
              flex flex-col min-w-[320px] max-w-[320px] bg-gray-100/50 rounded-xl p-4 border transition-colors
              ${isHovered ? 'bg-blue-50 border-blue-200' : 'border-transparent'}
            `}
          >
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="font-bold text-gray-700">{status}</h2>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[150px]">
              {columnTasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-400">
                  Drop tasks here
                </div>
              )}

              {columnTasks.map((task) => (
                <KanbanCard 
                  key={task.id} 
                  task={task} 
                  isDragging={draggedId === task.id}
                  onPointerDown={handlePointerDown} 
                />
              ))}
            </div>
          </div>
        );
      })}

      {draggedTask && (
        <KanbanCard 
          task={draggedTask} 
          isDragging={true} 
          isFloatingClone={true}
          startPos={startPos}
          currentPos={currentPos}
          isSnappingBack={isSnappingBack}
        />
      )}
    </div>
  );
};