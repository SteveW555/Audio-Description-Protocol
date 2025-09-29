/**
 * Custom hook for managing Group By filter state with localStorage persistence
 * Feature: 006-below-the-filter
 * Task: T006
 */

import { useMemo } from 'react';
import { useGroupByStore } from '../store/groupByStore';

/**
 * Hook for managing Group By filter state
 * @returns Object with groupByMethod, setGroupByMethod, and computed boolean helpers
 */
export function useGroupByFilter() {
  const { groupByMethod, setGroupByMethod, isCategory: isStoreCat, isPopularity: isStorePop } = useGroupByStore();

  // Computed boolean helpers (using useMemo to ensure stable references)
  const isCategory = useMemo(() => isStoreCat(), [groupByMethod]);
  const isPopularity = useMemo(() => isStorePop(), [groupByMethod]);

  return {
    groupByMethod,
    setGroupByMethod,
    isCategory,
    isPopularity
  };
}
