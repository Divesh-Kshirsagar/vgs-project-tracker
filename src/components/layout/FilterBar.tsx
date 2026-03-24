import React from 'react';
import { MultiSelect } from '../ui/MultiSelect';
import { Button } from '../ui/Button';
import type { TaskStatus, TaskPriority } from '../../types';
import { STATUSES, PRIORITIES, ASSIGNEES } from '../../utils/seed';
import type { FilterState } from '../../hooks/useUrlFilters';

const STATUS_OPTIONS: TaskStatus[] = STATUSES;
const PRIORITY_OPTIONS: TaskPriority[] = PRIORITIES;
const ASSIGNEE_OPTIONS = ASSIGNEES;

type FilterBarProps = {
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  clearFilters: () => void;
};

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  updateFilters,
  clearFilters,
}) => {
  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="flex flex-wrap items-center gap-3 w-full bg-gray-50 p-3 rounded-lg border">
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mr-2">
        Filters:
      </span>

      <MultiSelect
        label="Status"
        options={STATUS_OPTIONS}
        selectedValues={filters.status}
        onChange={(val) => updateFilters({ status: val })}
      />

      <MultiSelect
        label="Priority"
        options={PRIORITY_OPTIONS}
        selectedValues={filters.priority}
        onChange={(val) => updateFilters({ priority: val })}
      />

      <MultiSelect
        label="Assignee"
        options={ASSIGNEE_OPTIONS}
        selectedValues={filters.assignee}
        onChange={(val) => updateFilters({ assignee: val })}
      />

      {/* Date Range Inputs */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="date"
          aria-label="Filter from date"
          value={filters.dateFrom}
          onChange={(e) => updateFilters({ dateFrom: e.target.value })}
          className="text-sm border-none focus:ring-0 text-gray-600 bg-transparent p-0"
        />
        <span className="text-gray-400 text-sm">→</span>
        <input
          type="date"
          aria-label="Filter to date"
          value={filters.dateTo}
          onChange={(e) => updateFilters({ dateTo: e.target.value })}
          className="text-sm border-none focus:ring-0 text-gray-600 bg-transparent p-0"
        />
      </div>

      {/* Conditional Clear Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="ml-auto text-xs py-1 px-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};
