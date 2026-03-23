import type { TaskPriority } from '../types';

export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export type SortKey = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';
