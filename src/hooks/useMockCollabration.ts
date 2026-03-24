import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

const MOCK_USERS = ['JD', 'AS', 'MK', 'LR'];

export const useMockCollaboration = () => {
  const { tasks, updateCollaborators } = useTaskStore();

  useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      const activeCount = Math.floor(Math.random() * 3) + 2;
      const activeUsers = [...MOCK_USERS]
        .sort(() => 0.5 - Math.random())
        .slice(0, activeCount);

      const newCollaborators: Record<string, string[]> = {};

      activeUsers.forEach((user) => {
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        if (!newCollaborators[randomTask.id]) {
          newCollaborators[randomTask.id] = [];
        }
        newCollaborators[randomTask.id].push(user);
      });

      updateCollaborators(newCollaborators);
    }, 4000);

    return () => clearInterval(interval);
  }, [tasks, updateCollaborators]);
};
