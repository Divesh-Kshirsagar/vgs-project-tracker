import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useVirtualizer } from '../../hooks/useVirtualizer';
import type { Task, TaskStatus } from '../../types';
import type { SortKey, SortDirection } from '../../utils/sort';
import { PRIORITY_WEIGHT } from '../../utils/sort';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { DueDateLabel } from '../../components/ui/DueDateLabel';
import { Dropdown } from '../../components/ui/Dropdown';

const ROW_HEIGHT = 64; // Fixed height in pixels for the math to work
const CONTAINER_HEIGHT = 600; // Estimated height of the viewable area

export const ListView: React.FC = () => {
  const { tasks, updateTaskStatus } = useTaskStore();
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // 1. Sort the Data
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortKey === 'priority') {
        comparison = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]; // Highest first
      } else if (sortKey === 'dueDate') {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        comparison = dateA - dateB;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortKey, sortDir]);

  // 2. Feed Data to Virtualizer
  const { virtualItems, totalHeight, handleScroll } = useVirtualizer({
    itemCount: sortedTasks.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5, // Exact requirement from the prompt
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return <span className="ml-1 text-blue-600">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (sortedTasks.length === 0) {
    return <div className="p-8 text-center text-gray-500">No tasks found.</div>;
  }

  // Define our CSS Grid layout for the rows (matches table columns)
  const gridTemplate = "grid-cols-[2fr_1fr_1fr_1fr_1.5fr]";

  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full">
      {/* Header Row */}
      <div className={`grid ${gridTemplate} gap-4 p-4 border-b bg-gray-50 font-semibold text-sm text-gray-700 select-none`}>
        <div className="cursor-pointer hover:text-black flex items-center" onClick={() => handleSort('title')}>
          Task Title <SortIndicator column="title" />
        </div>
        <div>Assignee</div>
        <div className="cursor-pointer hover:text-black flex items-center" onClick={() => handleSort('priority')}>
          Priority <SortIndicator column="priority" />
        </div>
        <div className="cursor-pointer hover:text-black flex items-center" onClick={() => handleSort('dueDate')}>
          Due Date <SortIndicator column="dueDate" />
        </div>
        <div>Status (Inline Edit)</div>
      </div>

      {/* Virtualized Container */}
      <div 
        className="overflow-y-auto"
        style={{ height: `${CONTAINER_HEIGHT}px` }} 
        onScroll={handleScroll}
      >
        {/* The "Ghost" wrapper that holds the total scroll height */}
        <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
          
          {/* Map only the visible items */}
          {virtualItems.map(({ index, offsetTop }) => {
            const task = sortedTasks[index];
            return (
              <div
                key={task.id}
                className={`absolute w-full grid ${gridTemplate} gap-4 px-4 items-center border-b hover:bg-gray-50 transition-colors`}
                style={{ 
                  height: `${ROW_HEIGHT}px`,
                  top: `${offsetTop}px` // This pushes the row down to its exact spot in the scrollable div
                }}
              >
                <div className="font-medium text-sm truncate pr-4">{task.title}</div>
                <div><Avatar initials={task.assignee} /></div>
                <div><Badge label={task.priority} /></div>
                <div><DueDateLabel dateString={task.dueDate} /></div>
                <div>
                  <Dropdown 
                    value={task.status} 
                    options={['To Do', 'In Progress', 'In Review', 'Done']} 
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};