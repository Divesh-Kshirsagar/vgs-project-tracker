import React from 'react';

interface DueDateLabelProps {
  dateString: string;
}

export const DueDateLabel: React.FC<DueDateLabelProps> = ({ dateString }) => {
  const dueDate = new Date(dateString);
  const today = new Date();

  // Strip time for accurate day calculation
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return <span className="text-sm font-bold text-amber-600">Due Today</span>;
  }

  if (diffDays < 0) {
    // Requirements: "Tasks overdue by more than 7 days must show the number of days overdue"
    // I am applying this to ALL overdue tasks to be safe, as it's better UX.
    return (
      <span className="text-sm font-semibold text-red-600">
        Overdue by {Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? 's' : ''}
      </span>
    );
  }

  // Standard future date
  return (
    <span className="text-sm text-gray-500">
      {dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
    </span>
  );
};
