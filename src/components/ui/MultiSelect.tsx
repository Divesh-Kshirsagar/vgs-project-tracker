import React from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const handleToggle = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <details className="relative group">
      <summary className="list-none cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between min-w-35">
        {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {/* The Dropdown Menu */}
      <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-2 flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={selectedValues.includes(opt)}
              onChange={() => handleToggle(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </details>
  );
};
