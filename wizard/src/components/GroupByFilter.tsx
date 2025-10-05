/**
 * GroupByFilter component - Toolbar for switching between Category and Popularity grouping
 * Feature: 006-below-the-filter
 * Task: T008
 */

import React, { memo } from 'react';
import { useGroupByFilter } from '../hooks/useGroupByFilter';

export interface GroupByFilterProps {
  className?: string;
}

export const GroupByFilter = memo<GroupByFilterProps>(({ className }) => {
  const { groupByMethod, setGroupByMethod, isCategory, isPopularity } = useGroupByFilter();

  return (
    <div
      role="group"
      aria-label="Group by method"
      className={`flex flex-wrap items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg ${className || ''}`}
    >
      <span className="text-gray-600 dark:text-gray-400 text-[12px] font-medium mr-2">
        Group By:
      </span>

      {/* Category Button */}
      <button
        onClick={() => setGroupByMethod('category')}
        aria-pressed={isCategory}
        className={`
          px-[4px] py-[2px] text-[10px] font-medium rounded transition-all duration-200
          ${isCategory
            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
          }
        `}
      >
        Category
      </button>

      {/* Popularity Button */}
      <button
        onClick={() => setGroupByMethod('popularity')}
        aria-pressed={isPopularity}
        className={`
          px-[4px] py-[2px] text-[10px] font-medium rounded transition-all duration-200
          ${isPopularity
            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
          }
        `}
      >
        Popularity
      </button>
    </div>
  );
});

GroupByFilter.displayName = 'GroupByFilter';
