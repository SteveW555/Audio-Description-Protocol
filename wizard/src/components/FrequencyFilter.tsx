import React, { memo } from 'react';
import { FrequencyFilterProps } from '../types/filter';
import { FrequencyCategory } from '../types/frequency';
import { useFrequencyFilter } from '../hooks/useFrequencyFilter';

export const FrequencyFilter = memo<FrequencyFilterProps>(({ terms, className }) => {
  const { selectedFrequencies, toggleFrequency, getAvailability } = useFrequencyFilter();
  const availability = getAvailability(terms);

  const categories: FrequencyCategory[] = ['all', 'ubiquitous', 'frequent', 'infrequent', 'rare'];

  return (
    <div
      role="group"
      aria-label="Frequency filter"
      className={`flex flex-wrap items-center gap-1 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg ${className || ''}`}
    >
      <span className="text-gray-600 dark:text-gray-400 text-[12px] font-medium mr-2">
        Filter by Popularity:
      </span>
      {categories.map(category => {
        const info = availability.get(category);
        if (!info) return null;

        const isSelected = selectedFrequencies.includes(category);
        const isDisabled = !info.available;

        return (
          <button
            key={category}
            onClick={() => !isDisabled && toggleFrequency(category)}
            disabled={isDisabled}
            aria-pressed={isSelected}
            className={`
              px-[4px] py-[2px] text-[10px] font-medium rounded transition-all duration-200
              ${isDisabled
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                : isSelected
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
              }
            `}
          >
            {info.label}
            {!isDisabled && info.count > 0 && (
              <span className="ml-1 opacity-75">({info.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
});

FrequencyFilter.displayName = 'FrequencyFilter';
