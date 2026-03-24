import React from 'react';

interface DueDateLabelProps {
  dateString: string;
}

export const DueDateLabel: React.FC<DueDateLabelProps> = ({ dateString }) => {
  const dueDate = new Date(dateString);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return <span className="text-sm font-bold text-amber-600">Due Today</span>;
  }

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);

    if (overdueDays > 7) {
      return (
        <span className="text-sm font-semibold text-red-600">
          Overdue by {overdueDays} day{overdueDays !== 1 ? 's' : ''}
        </span>
      );
    }

    return <span className="text-sm font-semibold text-red-600">Overdue</span>;
  }

  return (
    <span className="text-sm text-gray-500">
      {dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
    </span>
  );
};
