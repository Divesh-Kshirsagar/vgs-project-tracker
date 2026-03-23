import React, { useMemo } from 'react';
import type { Task } from '../../types';
import { getCurrentMonthData } from '../../utils/date';
import { Avatar } from '../../components/ui/Avatar';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-400',
  Medium: 'bg-yellow-400',
  Low: 'bg-green-400',
};

interface TimelineViewProps {
  tasks: Task[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => {
  const { year, month, daysInMonth, currentDay, daysArray } = useMemo(() => getCurrentMonthData(), []);

  const visibleTasks = useMemo(() => {
    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month, daysInMonth, 23, 59, 59).getTime();

    return tasks.filter(task => {
      const taskDue = new Date(task.dueDate).getTime();
      const taskStart = task.startDate ? new Date(task.startDate).getTime() : taskDue;
      return taskStart <= monthEnd && taskDue >= monthStart;
    });
  }, [tasks, year, month, daysInMonth]);

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col overflow-hidden relative">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-700">
          {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      <div className="flex-1 overflow-auto relative">
        <div 
          className="min-w-max grid relative pb-8"
          style={{ 
            gridTemplateColumns: `250px repeat(${daysInMonth}, minmax(40px, 1fr))` 
          }}
        >
          <div className="sticky left-0 bg-white z-20 border-b border-r p-3 font-semibold text-sm text-gray-500">
            Task Name
          </div>
          {daysArray.map((day) => (
            <div 
              key={`header-${day}`} 
              className={`border-b border-r text-center py-2 text-sm text-gray-400 ${day === currentDay ? 'font-bold text-red-600 bg-red-50' : ''}`}
            >
              {day}
            </div>
          ))}

          <div 
            className="bg-red-500 w-0.5 absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ 
              gridColumn: currentDay + 1, 
              justifySelf: 'center' 
            }}
          />

          {visibleTasks.map((task) => {
            let startDay = 1;
            let endDay = daysInMonth;

            const dueDateObj = new Date(task.dueDate);
            const dueMonth = dueDateObj.getMonth();
            const dueMonthDay = dueDateObj.getDate();

            if (task.startDate) {
              const startDateObj = new Date(task.startDate);
              const startMonth = startDateObj.getMonth();
              startDay = startMonth < month || startDateObj.getFullYear() < year ? 1 : startDateObj.getDate();
              endDay = dueMonth > month || dueDateObj.getFullYear() > year ? daysInMonth : dueMonthDay;
            } else {
              startDay = dueMonthDay;
              endDay = dueMonthDay;
            }

            startDay = Math.max(1, startDay);
            endDay = Math.min(daysInMonth, endDay);

            const isSingleDay = startDay === endDay;

            return (
              <React.Fragment key={task.id}>
                {/* Task Title (Sticky Left) */}
                <div className="sticky left-0 bg-white z-10 border-b border-r p-3 flex items-center gap-3">
                  <Avatar initials={task.assignee} />
                  <span className="text-sm font-medium text-gray-800 truncate w-40" title={task.title}>
                    {task.title}
                  </span>
                </div>

                <div 
                  className="border-b border-r flex items-center p-2 relative"
                  style={{ gridColumn: `2 / span ${daysInMonth}` }} 
                >
                  <div 
                    className={`absolute h-8 rounded-md shadow-sm border border-black/10 flex items-center px-2 cursor-pointer transition-transform hover:scale-[1.02] ${PRIORITY_COLORS[task.priority]}`}
                    style={{
                      left: `${((startDay - 1) / daysInMonth) * 100}%`,
                      width: `${((endDay - startDay + (isSingleDay ? 0.5 : 1)) / daysInMonth) * 100}%`,
                    }}
                  >
                    {isSingleDay && <span className="w-2 h-2 bg-white rounded-full opacity-75 mr-1" />}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {visibleTasks.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500">
              No tasks active this month.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};