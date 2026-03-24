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
import { ASSIGNEE_COLORS } from '../../utils/seed';

const ROW_HEIGHT = 64;
const CONTAINER_HEIGHT = 600;

type SortIndicatorProps = {
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDirection;
};

const SortIndicator: React.FC<SortIndicatorProps> = ({
  column,
  sortKey,
  sortDir,
}) => {
  if (sortKey !== column) return null;
  return (
    <span className="ml-1 text-blue-600">{sortDir === 'asc' ? '↑' : '↓'}</span>
  );
};

type ListViewProps = {
  tasks: Task[];
};

export const ListView: React.FC<ListViewProps> = ({ tasks }) => {
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const activeCollaborators = useTaskStore(
    (state) => state.activeCollaborators,
  );

  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortKey === 'priority') {
        comparison = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      } else if (sortKey === 'dueDate') {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        comparison = dateA - dateB;
      }

      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortKey, sortDir]);

  const { virtualItems, totalHeight, handleScroll } = useVirtualizer({
    itemCount: sortedTasks.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (sortedTasks.length === 0) {
    return <div className="p-8 text-center text-gray-500">No tasks found.</div>;
  }

  const gridTemplate = 'grid-cols-[2fr_1fr_1fr_1fr_1.5fr]';

  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full">
      {/* Header */}
      <div
        className={`grid ${gridTemplate} gap-4 p-4 border-b bg-gray-50 font-semibold text-sm text-gray-700 select-none`}
      >
        <div
          className="cursor-pointer hover:text-black flex items-center"
          onClick={() => handleSort('title')}
        >
          Task Title
          <SortIndicator column="title" sortKey={sortKey} sortDir={sortDir} />
        </div>

        <div>Assignee</div>

        <div
          className="cursor-pointer hover:text-black flex items-center"
          onClick={() => handleSort('priority')}
        >
          Priority
          <SortIndicator
            column="priority"
            sortKey={sortKey}
            sortDir={sortDir}
          />
        </div>

        <div
          className="cursor-pointer hover:text-black flex items-center"
          onClick={() => handleSort('dueDate')}
        >
          Due Date
          <SortIndicator column="dueDate" sortKey={sortKey} sortDir={sortDir} />
        </div>

        <div>Status (Inline Edit)</div>
      </div>

      <div
        className="overflow-y-auto"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
        onScroll={handleScroll}
      >
        <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
          {virtualItems.map(({ index, offsetTop }) => {
            const task = sortedTasks[index];

            const viewers = activeCollaborators[task.id] || [];

            return (
              <div
                key={task.id}
                className={`absolute w-full grid ${gridTemplate} gap-4 px-4 items-center border-b hover:bg-gray-50 transition-colors`}
                style={{
                  height: `${ROW_HEIGHT}px`,
                  top: `${offsetTop}px`,
                }}
              >
                <div className="font-medium text-sm truncate pr-4">
                  {task.title}
                </div>

{viewers.length > 0 && (
  <div className="absolute flex items-center ml-2 border-l pl-2 border-gray-200 min-h-[32px] max-h-[32px] overflow-hidden flex-nowrap"
    style={{
      left: '250px',
      width: '100px',
      zIndex: 10
    }}>
    <div className="flex items-center gap-0 flex-shrink-0">
      {viewers.slice(0, 2).map((viewer, idx) => (
        <Avatar
          key={idx}
          initials={viewer}
          isStacked={idx > 0}
          bgColorClass={ASSIGNEE_COLORS[viewer]}
          className="transition-all opacity-100 translate-x-0"
        />
      ))}
      {viewers.length > 2 && (
        <div className="transition-all opacity-100 translate-x-0 flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold border-2 border-white bg-gray-500 -ml-2 flex-shrink-0">
          +{viewers.length - 2}
        </div>
      )}
    </div>
  </div>
)}

                <div>
                  <Avatar
                    initials={task.assignee}
                    bgColorClass={ASSIGNEE_COLORS[task.assignee]}
                  />
                </div>

                <div>
                  <Badge label={task.priority} />
                </div>

                <div>
                  <DueDateLabel dateString={task.dueDate} />
                </div>

                <div>
                  <Dropdown
                    value={task.status}
                    options={['To Do', 'In Progress', 'In Review', 'Done']}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value as TaskStatus)
                    }
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
