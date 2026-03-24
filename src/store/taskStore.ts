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
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      activeCollaborators: {},
      updateCollaborators: (collabs) => set({ activeCollaborators: collabs }),
      setTasks: (tasks) => set({ tasks }),
      updateTaskStatus: (taskId, newStatus) =>
        set((state) => {
          const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state;

          const updatedTask = { ...state.tasks[taskIndex], status: newStatus };

          const newTasks = [...state.tasks];
          newTasks.splice(taskIndex, 1);

          newTasks.push(updatedTask);

          return { tasks: newTasks };
        }),
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

