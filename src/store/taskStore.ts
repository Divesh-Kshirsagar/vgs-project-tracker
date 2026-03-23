import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus } from '../types';
import { generateTasks } from '../utils/seed';


export interface CollaboratorState {
  [taskId: string]: string[]; 
}

interface TaskState {
  tasks: Task[];
  activeCollaborators: CollaboratorState;
  updateCollaborators: (collabs: CollaboratorState) => void;
  // Actions
  updateTaskStatus: (id: string, newStatus: TaskStatus) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      activeCollaborators: {},
      updateCollaborators: (collabs) => set({ activeCollaborators: collabs }),
      setTasks: (tasks) => set({ tasks }),
      updateTaskStatus: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task,
          ),
        })),
    }),
    {
      name: 'vgs-project-tracker',
      partialize: (state) => ({
        tasks: state.tasks,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (state.tasks.length === 0) {
          const generated = generateTasks();
          state.setTasks(generated);
        }
      },
    },
  ),
);

