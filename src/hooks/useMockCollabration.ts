import { useEffect, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';

const MOCK_USERS = ['JD', 'AS', 'MK', 'LR'];

export const useMockCollaboration = () => {
  const { tasks, updateCollaborators } = useTaskStore();
  const userLocationsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (tasks.length === 0) return;

    MOCK_USERS.forEach((user) => {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      userLocationsRef.current[user] = randomTask.id;
    });

    const interval = setInterval(() => {
      MOCK_USERS.forEach((user) => {
        if (Math.random() < 0.4) {
          const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
          userLocationsRef.current[user] = randomTask.id;
        }
      });
      const activeCount = Math.floor(Math.random() * 3) + 2;
      const activeUsers = [...MOCK_USERS]
        .sort(() => 0.5 - Math.random())
        .slice(0, activeCount);

      const newCollaborators: Record<string, string[]> = {};

      activeUsers.forEach((user) => {
        const taskId = userLocationsRef.current[user];
        if (!newCollaborators[taskId]) {
          newCollaborators[taskId] = [];
        }
        newCollaborators[taskId].push(user);
      });

      updateCollaborators(newCollaborators);
    }, 3000);

    return () => clearInterval(interval);
  }, [tasks, updateCollaborators]);
};
