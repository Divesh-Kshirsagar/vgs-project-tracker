import { useState, useMemo } from 'react';
import { useUrlFilters } from './hooks/useUrlFilters';
import { useTaskStore } from './store/taskStore';
import { FilterBar } from './components/layout/FilterBar';
import { ListView } from './features/list/ListView';
import { KanbanBoard } from './features/kanban/KanbanBoard';

type ViewMode = 'kanban' | 'list' | 'timeline';

function App() {
  const [view, setView] = useState<ViewMode>('list');
  const tasks = useTaskStore((state) => state.tasks);
  const { filters, updateFilters, clearFilters } = useUrlFilters();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Array Filters (If array is empty, it means "show all")
      const matchStatus =
        filters.status.length === 0 || filters.status.includes(task.status);
      const matchPriority =
        filters.priority.length === 0 ||
        filters.priority.includes(task.priority);
      const matchAssignee =
        filters.assignee.length === 0 ||
        filters.assignee.includes(task.assignee);

      // 2. Date Range Filters
      let matchDate = true;
      const taskDate = new Date(task.dueDate).getTime();

      if (filters.dateFrom) {
        matchDate =
          matchDate && taskDate >= new Date(filters.dateFrom).getTime();
      }
      if (filters.dateTo) {
        // Add 24 hours to dateTo so the whole day is inclusive
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchDate = matchDate && taskDate <= toDate.getTime();
      }

      return matchStatus && matchPriority && matchAssignee && matchDate;
    });
  }, [tasks, filters]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">Project Tracker</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>0 people viewing this board</span>
        </div>
      </header>

      <div className="px-6 py-4 border-b bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['kanban', 'list', 'timeline'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  view === mode
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <FilterBar
          filters={filters}
          updateFilters={updateFilters}
          clearFilters={clearFilters}
        />
      </div>

      <main className="flex-1 overflow-hidden relative p-6">
        {view === 'list' && <ListView tasks={filteredTasks} />}
        {view === 'kanban' && <KanbanBoard tasks={filteredTasks} />}
        {/* {view === 'timeline' && <TimelineView tasks={filteredTasks} />} */}
      </main>
    </div>
  );
}

export default App;
