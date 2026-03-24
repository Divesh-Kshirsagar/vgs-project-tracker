import type { Task, TaskStatus, TaskPriority } from '../types/index';

export const STATUSES: TaskStatus[] = [
  'To Do',
  'In Progress',
  'In Review',
  'Done',
];
export const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];
export const ASSIGNEES = ['JD', 'AS', 'MK', 'LR', 'BW', 'TC'];
const TITLES = [
  'Design homepage',
  'Implement authentication',
  'Set up database',
  'Create API endpoints',
  'Write unit tests',
  'Fix bugs in user profile',
  'Optimize performance',
  'Update documentation',
  'Conduct code review',
  'Deploy to production',
];

export const ASSIGNEE_COLORS: Record<string, string> = {
  JD: 'bg-blue-700',
  AS: 'bg-red-700',
  MK: 'bg-green-700',
  LR: 'bg-purple-700',
  BW: 'bg-orange-700',
  TC: 'bg-pink-700',
};

export const generateTasks = (): Task[] => {
  const tasks: Task[] = [];

  for (let i = 0; i < 500; i++) {
    const id = crypto.randomUUID() as string;
    const title = TITLES[Math.floor(Math.random() * TITLES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const assignee = ASSIGNEES[Math.floor(Math.random() * ASSIGNEES.length)];

    const today = new Date();
    const startDate =
      Math.random() < 0.5
        ? new Date(
            today.getTime() -
              Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null;
    const dueDate = new Date(
      today.getTime() + Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000,
    ).toISOString();
    tasks.push({ id, title, status, priority, assignee, startDate, dueDate });
  }

  return tasks;
};
