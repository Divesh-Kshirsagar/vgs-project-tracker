import React from 'react';
import type { TaskPriority, TaskStatus } from '../../types';

interface BadgeProps {
  label: TaskPriority | TaskStatus;
}

const colorMap: Record<string, string> = {
  // Priorities
  Critical: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
  // Statuses
  'To Do': 'bg-gray-100 text-gray-800 border-gray-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'In Review': 'bg-purple-100 text-purple-800 border-purple-200',
  Done: 'bg-teal-100 text-teal-800 border-teal-200',
};

export const Badge: React.FC<BadgeProps> = ({ label }) => {
  const classes =
    colorMap[label] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}
    >
      {label}
    </span>
  );
};
